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
      let areThereNotesInTheDb: boolean;
      let notes:NoteExtraMin[]=[];
      let useDb: boolean;
      this.db.getNumberOfNotes()
      .then(number=>{
        areThereNotesInTheDb = (number > 0) ? true : false;
        console.log('the numberof notes is');
        console.log(number);
        // let useDb = !isNteworkAvailable || areThereNotesInTheDb || !force;
        useDb = Utils.shouldUseDb(isNteworkAvailable, areThereNotesInTheDb, force);
        console.log('usedb note: ');
        console.log(JSON.stringify(useDb));
        if(useDb){
          return this.db.getNotesMin();
        }else{
          console.log('no notes, using the network');
          return Utils.getBasic('/api/notes/all/min', this.http, this.auth.token);
        }
      })
      .then(fetchingResult=>{
        if(useDb){
          /*fetchingResult = NoteMin[] from the DB.*/
          resolve(fetchingResult);
        }else{
          /*fetchingResult = NoteMin[] from the network, need to insert.*/
          notes = fetchingResult as NoteExtraMin[];
          for(let i=0;i<notes.length;i++){
            this.db.insertNoteMinQuietly(notes[i]);
          }
          resolve(notes);
        }
      })
      .catch(error=>{
        console.log('error notes:');
        console.log(JSON.stringify(error));
      })

      // if(useDb){
      //   //network is not available, so MUST use the db, force or not force.
      //   console.log('getting the notes from the db.');
      //   this.db.getNotesMin()
      //   .then(result=>{
      //     notes = result;
      //     resolve(notes);
      //   })
      //   .catch(error=>{
      //     reject(error);
      //   })
      // }
      // else{
      //   console.log('no notes in the db, need to call the network');
      //   //nothing to do, download data and send them to the DB.
      //   Utils.getBasic('/api/notes/all/min', this.http, this.auth.token)
      //   .then(result=>{
      //     console.log('inserting notes:');
      //     notes=<NoteExtraMin[]> result;
      //     for(let i=0;i<notes.length;i++){
      //       this.db.insertNoteMinQuietly(notes[i]);
      //     }
      //     resolve(notes);
      //   })
      //   .catch(error=>{
      //     reject(error);
      //   })
      // }
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

  // private noteByTitle_loadFromNetworkAndInsert(title: string):Promise<any>{
  //   return new Promise<any>((resolve, reject)=>{
  //     let note:NoteFull;
  //     Utils.getBasic('/api/notes/'+title, this.http, this.auth.token)
  //     .then(result=>{
  //       console.log('the resul from network is: ');
  //       console.log(JSON.stringify(result.note));
  //       note = result.note as NoteFull;
  //       /*inserting in the DB.*/
  //       return this.db.insertOrUpdateNote(note, true);
  //     })
  //     .then(insertResult=>{
  //       resolve(note);
  //     })
  //     .catch(error=>{
  //       console.log('errror while fetching and inserting.');
  //       console.log(JSON.stringify(error));
  //       reject(error);
  //     })
  //   })
  // }
  //new-v
  private noteByTitle_loadFromNetworkAndInsert(title: string):Promise<any>{
    return new Promise<any>((resolve, reject)=>{
      let note:NoteFull;
      Utils.getBasic('/api/notes/'+title, this.http, this.auth.token)
      .then(result=>{
        console.log('the resul from network is: ');
        console.log(JSON.stringify(result.note));
        note = result.note as NoteFull;
        /*inserting in the DB.*/
        this.db.insertOrUpdateNote(note); /*this will be done asynchronously?*/
        resolve(note);
      // .catch(error=>{
      //   console.log('errror while fetching and inserting.');
      //   console.log(JSON.stringify(error));
      //   reject(error);
      // })
    })
    .catch(error=>{
      reject(error);
    })

  })
}

  /*
  get a full note object:
  -if request, it will search the note on the server,
    then it will download it, insert in the DB,
    then return via promise.
  -if not requested, it will initially search in the DB, if
    not present it will download it, then insert in the DB,
    then return via promise.
  */
  noteByTitle(title: string, force: boolean):Promise<NoteFull>{
    /*first check in the DB.*/
    return new Promise<NoteFull>((resolve, reject)=>{
      let areThereNotesInTheDb: boolean;
      let useDb: boolean;
      let callNet: boolean;
      this.db.getNumberOfNotes()
      .then(number=>{
        areThereNotesInTheDb = (number > 0) ? true : false;
        useDb = Utils.shouldUseDb(this.netManager.isConnected, areThereNotesInTheDb, force);
        callNet = !useDb;
        if(useDb){
          return this.db.getNoteFull(title)
        }else{
          return this.noteByTitle_loadFromNetworkAndInsert(title);
        }
      })
      .then(noteFull=>{
        if(useDb){
          /*we have the note and nothing more should have done.*/
          if(noteFull==null){
            return this.noteByTitle_loadFromNetworkAndInsert(title);
          }else{
            resolve(noteFull);
          }
        }else{
          /*we have the note and it has been inserted into the DB*/
          resolve(noteFull);
        }
      })
      .then(fromNet=>{
        /*if here the note is not in the DB.*/
        resolve(fromNet);
      })
      .catch(error=>{
        console.log('error in getting full note');
        console.log(JSON.stringify(error));
        reject(error);
      })
    })
    //   if(useDb){
    //     /*check if the note is full.
    //     this.db.getNoteFull(title)
    //     .then(result=>{
    //       /*we are not in the catch only if the note is there and it's full.
    //       console.log('the note is full');
    //       resolve(result);
    //     })
    //     .catch(error=>{
    //       /*if any error, call the network.
    //       console.log('error from getNoteFull');
    //       console.log(JSON.stringify(error));
    //       console.log('loading from the network and saving');
    //       this.noteByTitle_loadFromNetworkAndInsert(title)
    //       .then(result=>{
    //         resolve(result);
    //       })
    //       .catch(error=>{
    //         reject(error);
    //       })
    //     })
    //   }else{
    //     console.log('loading from the network and saving, no db use.');
    //     this.noteByTitle_loadFromNetworkAndInsert(title)
    //     .then(result=>{
    //       resolve(result);
    //     })
    //     .catch(error=>{
    //       reject(error);
    //     })
    //   }
    // });
    //
    //
    // //return Utils.getBasic('/api/notes/'+title, this.http, this.auth.token);
  }

  /*
  force can't be used because we need to respect the log order, so the note is put into the db,
  then the log will be consumed.
  THE CONTROL ON THE NOTE WITH ANOTHER SAME TITLE MUST BE ALREADY DONE.
  */
  createNote(note: NoteFull):Promise<any>{
    return new Promise<any>((resolve, reject)=>{
      this.db.createNewNote(note);
      resolve(true);
    });
    //return Utils.putBasic('/api/notes/create', JSON.stringify({note:note}), this.http, this.auth.token);
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
  changeLinks(/*noteTitle: string, links:string[]*/note:NoteFull){
    // return Utils.postBasic('/api/notes/mod/links', JSON.stringify({note:
    //   {title: noteTitle, links:links}}), this.http, this.auth.token);
    return this.db.setLinks(note);
  }

  changeText(/*noteTitle: string, text:string*/note:NoteFull){
    // return Utils.postBasic('/api/notes/mod/text', JSON.stringify({note:
    //   {title:noteTitle, text:text}}), this.http, this.auth.token);
    return this.db.setText(note);
  }

  changeDone(/*noteTitle: string, done: boolean*/note: NoteFull){
    // return Utils.postBasic('/api/notes/mod/setdone', JSON.stringify({note:
    //   {title:noteTitle, isDone:done}}), this.http, this.auth.token);
    return this.db.setDone(note);
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
