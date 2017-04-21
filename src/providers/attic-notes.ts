import { Injectable } from '@angular/core';
import { Http, Headers } from '@angular/http';
/* importing auth because I need the token. */
import { Auth } from './auth';
import { Action, Const } from '../public/const';
import { NoteExtraMin/*, NoteSmart,*/, NoteFull,NoteMin, NoteBarebon } from '../models/notes';
import { Utils } from '../public/utils';
import { Db/*, LogObject*/ } from './db';
import { NetManager } from './net-manager';

import 'rxjs/add/operator/map';

/*
  Generated class for the AtticNotes provider.

  See https://angular.io/docs/ts/latest/guide/dependency-injection.html
  for more info on providers and Angular 2 DI.
*/
@Injectable()
export class AtticNotes {

  constructor(public http: Http, public auth: Auth,
    private db: Db, private netManager: NetManager) {
    console.log('Hello AtticNotes Provider');
  }


  /*
  only one instance for all the pages.
  */


  /**
  *loading all the notes.
  */
  // loadFull(){
  //   return Utils.getBasic('/api/notes/all', this.http, this.auth.token);
  // }


  // loadNoPopulation(){
  //   return Utils.getBasic('/api/notes/all/unpop', this.http, this.auth.token);
  // }

  /*
  force: force the download from the network.
  */
  /*
  can be rewritten: an error will force a call to the network.
  */
  loadNotesMin(force: boolean):Promise<any>{
    return new Promise<any>((resolve, reject)=>{
      let useForce: boolean = force;
      let isNteworkAvailable: boolean = this.netManager.isConnected;
      let areThereNotesInTheDb: boolean = (this.db.notesCount != 0)? true : false;
      let notes:NoteExtraMin[]=[];
      // let useDb = !isNteworkAvailable || areThereNotesInTheDb || !force;
      let useDb: boolean = Utils.shouldUseDb(isNteworkAvailable, areThereNotesInTheDb, force);
      console.log('usedb note: ');
      console.log(JSON.stringify(useDb));
      if(useDb){
        /*network is not available, so MUST use the db, force or not force.*/
        console.log('getting the notes from the db.');
        this.db.getNotesMin()
        .then(result=>{
          notes = result;
          resolve(notes);
        })
        .catch(error=>{
          reject(error);
        })
      }
      else{
        console.log('no notes in the db, need to call the network');
        //nothing to do, download data and send them to the DB.
        Utils.getBasic('/api/notes/all/min', this.http, this.auth.token)
        .then(result=>{
          console.log('inserting notes:');
          notes=<NoteExtraMin[]> result;
          for(let i=0;i<notes.length;i++){
            this.db.insertNoteMinQuietly(notes[i]);
          }
          resolve(notes);
        })
        .catch(error=>{
          reject(error);
        })
      }
      /*==============old version=======*/
      // if(this.db.notesCount==0 || force){
      //   console.log('no notes in the db, need to call the network');
      //   //nothing to do, download data and send them to the DB.
      //   Utils.getBasic('/api/notes/all/min', this.http, this.auth.token)
      //   .then(result=>{
      //     console.log('inserting data');
      //     let notes:NoteExtraMin[]=<NoteExtraMin[]> result;
      //     for(let i=0;i<notes.length;i++){
      //       this.db.insertNoteMinQuietly(notes[i]);
      //     }
      //     resolve(notes);
      //   })
      //   .catch(error=>{
      //     reject(error);
      //   })
      // }else{
      //   console.log('getting the notes from the db.');
      //   let notes:NoteExtraMin[];
      //   this.db.getNotesMin()
      //   .then(result=>{
      //     notes = result;
      //     resolve(notes);
      //   })
      //   .catch(error=>{
      //     reject(error);
      //   })
      // }
    });
    // return Utils.getBasic('/api/notes/all/min', this.http, this.auth.token);
  }

  noteByTitle(title: string, force: boolean):Promise<any>{
    /*first check in the DB.*/
    return new Promise<NoteFull>((resolve, reject)=>{
      let areThereNotesInTheDb: boolean = (this.db.notesCount!=0) ? true : false;
      let useDb:boolean = Utils.shouldUseDb(this.netManager.isConnected, areThereNotesInTheDb, force);
      let callNet: boolean = !useDb;
      if(useDb){
        /*check if the note is full.*/
        this.db.getNoteFull(title)
        .then(result=>{
          /*we are not in the catch only if the note is there and it's full.*/
          resolve(result);
        })
        .catch(error=>{
          /*if any error, call the network.*/
          console.log(JSON.stringify(error));
          /*call-net*/
          Utils.getBasic('/api/notes/'+title, this.http, this.auth.token)
          .then(result=>{
            resolve(result);
          })
          .catch(error=>{
            reject(error);
          })
        })
      }else{
        Utils.getBasic('/api/notes/'+title, this.http, this.auth.token)
        .then(result=>{
          resolve(result);
        })
        .catch(error=>{
          reject(error);
        })
      }
    });


    //return Utils.getBasic('/api/notes/'+title, this.http, this.auth.token);
  }

  createNote(note: NoteMin):Promise<any>{
    return Utils.putBasic('/api/notes/create', JSON.stringify({note:note}), this.http, this.auth.token);
  }

  notesByTag(tags: string[]){
    // return new Promise<NoteBarebon[]>((resolve, reject)=>{
    //   Utils.postBasic('/api/notes/by-tags-no-role', JSON.stringify({tags: tags}), this.http, this.auth.token)
    //   .then(result=>{
    //
    //   })
    //  });
    return Utils.postBasic('/api/notes/by-tags-no-role', JSON.stringify({tags: tags}), this.http, this.auth.token);
  }
  //
  // notesByMainTag(tags: string[]){
  //   return Utils.postBasic('/api/notes/by-tag/unpop', JSON.stringify({mainTags: tags}), this.http, this.auth.token);
  // }
  //
  // notesByOtherTag(tags: string[]){
  //   return Utils.postBasic('/api/notes/by-tag/unpop', JSON.stringify({otherTags: tags}), this.http, this.auth.token);
  // }
/*
return this.items.filter((item) => {
    return item.title.toLowerCase().indexOf(searchTerm.toLowerCase()) > -1;
});
*/
  filterNotesByTitle(notes: NoteExtraMin[], term: string):NoteExtraMin[]{
    return notes.filter((note)=>{
      return note.title.indexOf(term.toLowerCase())>-1;
    });
  }

  // filterNotesByTags(notes: NoteExtraMin[], tags: TagExtraMin):NoteExtraMin[]{
  //   return notes.filter((note)=>{
  //
  //   })
  // }

  // notesByTitle(title: string){
  //   return Utils.postBasic('/api/notes/by-title/reg/unpop', JSON.stringify({title: title}), this.http, this.auth.token);
  // }

  notesByText(text: string){
    return Utils.postBasic('/api/notes/by-text', JSON.stringify({note:
      {text: text}}), this.http, this.auth.token);
  }


  changeTitle(noteTitle: string, newTitle: string){
    return Utils.postBasic('/api/notes/mod/title', JSON.stringify({note:
      {title: noteTitle, newTitle: newTitle}}), this.http, this.auth.token);
  }


  addTags(noteTitle: string, mainTags: string[], otherTags: string[]){
    return Utils.postBasic('/api/mod/notes/addtags', JSON.stringify({note:
      {title: noteTitle, maintags: mainTags, othertags: otherTags}}), this.http, this.auth.token);
  }

  addMainTags(noteTitle: string, tagIds: string[]){
    return Utils.postBasic('/api/notes/mod/addtags', JSON.stringify({note:
      {title: noteTitle, mainTags: tagIds }}), this.http, this.auth.token);
  }

  addOtherTags(noteTitle: string, tagIds: string[]){
    return Utils.postBasic('/api/notes/mod/addtags', JSON.stringify({note:
      {title: noteTitle, othertags: tagIds }}), this.http, this.auth.token);
  }

  // removeMainTags(noteId: string, tagIds: string[]){
  //   return Utils.postBasic('/api/notes/mod/removetags', JSON.stringify({id: noteId, mainTags: tagIds }), this.http, this.auth.token);
  // }
  //
  // removeOtherTags(noteId: string, tagIds: string[]){
  //   return Utils.postBasic('/api/notes/mod/removetags', JSON.stringify({id: noteId, otherTags: tagIds }), this.http, this.auth.token);
  // }
  removeTags(noteTitle: string, tags: string[]){
    return Utils.postBasic('/api/notes/mod/removetags',JSON.stringify({note:
      {title:noteTitle, tags:tags}}), this.http, this.auth.token );
  }

  // addLinks(noteId: string, links: string[]){
  //   // console.log('going to: ');
  //   // console.log(JSON.stringify({id:noteId, links: links}));
  //   return Utils.postBasic('/api/notes/mod/addlinks', JSON.stringify({id: noteId, links: links }), this.http, this.auth.token);
  // }
  //
  // removeLinks(noteId: string, links: string[]){
  //   return Utils.postBasic('/api/notes/mod/removelinks', JSON.stringify({id: noteId, links: links }), this.http, this.auth.token);
  // }
  changeLinks(noteTitle: string, links:string[]){
    return Utils.postBasic('/api/notes/mod/links', JSON.stringify({note:
      {title: noteTitle, links:links}}), this.http, this.auth.token);
  }

  changeText(noteTitle: string, text:string){
    return Utils.postBasic('/api/notes/mod/text', JSON.stringify({note:
      {title:noteTitle, text:text}}), this.http, this.auth.token);
  }

  changeDone(noteTitle: string, done: boolean){
    return Utils.postBasic('/api/notes/mod/setdone', JSON.stringify({note:
      {title:noteTitle, isDone:done}}), this.http, this.auth.token);
  }

  deleteNote(_id: any):Promise<any>{
    // if(_id instanceof Number){
    //   // let obj = new LogObject();
    //   // obj.action = Action.DeleteNote;
    //   // obj.refNotesToSave = <number>_id;
    //   return this.db.transactionDeleteNoteFromNotesToSave(<number>_id);
    // }else{
    //   return this.db.transactionDeleteNoteFromNotes(<string>_id);
    // }
    return null;
  }

}
