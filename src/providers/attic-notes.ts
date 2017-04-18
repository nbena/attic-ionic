import { Injectable } from '@angular/core';
import { Http, Headers } from '@angular/http';
/* importing auth because I need the token. */
import { Auth } from './auth';
import { Action, Const } from '../public/const';
import { NoteExtraMin/*, NoteSmart, NoteFull*/,NoteMin } from '../models/notes';
import { Utils } from '../public/utils';
import { Db, LogObject } from './db';

import 'rxjs/add/operator/map';

/*
  Generated class for the AtticNotes provider.

  See https://angular.io/docs/ts/latest/guide/dependency-injection.html
  for more info on providers and Angular 2 DI.
*/
@Injectable()
export class AtticNotes {

  constructor(public http: Http, public auth: Auth, private db: Db) {
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

  // loadNotesMin(){
  //   return Utils.getBasic('/api/notes/all/min', this.http, this.auth.token);
  // }

  noteByTitle(title: string):Promise<any>{
    return Utils.getBasic('/api/notes/'+title, this.http, this.auth.token);
  }

  createNote(note: NoteMin):Promise<any>{
    return Utils.putBasic('/api/notes/create', JSON.stringify({note:note}), this.http, this.auth.token);
  }

  // notesByTag(tags: string[]){
  //   // console.log("the req: "+JSON.stringify({tags: tags}));
  //   return Utils.postBasic('/api/notes/by-tag/unpop', JSON.stringify({tags: tags}), this.http, this.auth.token);
  // }
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

  addMainTags(noteId: string, tagIds: string[]){
    return Utils.postBasic('/api/notes/mod/addtags', JSON.stringify({id: noteId, mainTags: tagIds }), this.http, this.auth.token);
  }

  addOtherTags(noteId: string, tagIds: string[]){
    return Utils.postBasic('/api/notes/mod/addtags', JSON.stringify({id: noteId, otherTags: tagIds }), this.http, this.auth.token);
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
