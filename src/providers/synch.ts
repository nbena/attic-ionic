import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';
import { Db/*, LogObject */} from './db';
import { Auth } from './auth';
import { AtticTags } from './attic-tags';
import { AtticNotes } from './attic-notes';
import { NoteExtraMin, NoteFull, NoteSQLite, NoteMin } from '../models/notes';
import { TagExtraMin, TagFull, TagSQLite/*, TagMin*/ } from '../models/tags';
//import * as Collections from 'typescript-collections';
import { DbAction } from '../public/const';
import { Network } from '@ionic-native/network';
import { Platform } from 'ionic-angular';
import { Utils } from '../public/utils';

import { NetManager } from './net-manager';

/*
  Generated class for the Synch provider.

  See https://angular.io/docs/ts/latest/guide/dependency-injection.html
  for more info on providers and Angular 2 DI.
*/

/*
defining data types needed.
*/

/*
very important to decide the order!
*/


@Injectable()
export class Synch {

  private isStarted: boolean = false;

  private lockNoteCreate: boolean = false;
  private lockNoteDelete: boolean = false;
  private lockNoteLinks: boolean = false;
  private lockNoteText: boolean = false;
  private lockNoteDone: boolean = false;

  private lockNoteAddTags: boolean = false;
  private lockNoteRemoveTags: boolean = false;

  private lockTagCreate: boolean = false;
  private lockTagDelete: boolean = false;



  constructor(private network: Network, private db: Db,
    private netManager: NetManager,
    // private atticNotes: AtticNotes,
    // private atticTags: AtticTags,
    private auth: Auth,
    public http: Http,
    private platform: Platform
    ) {

    console.log('Hello Synch Provider');

  }

  public isSynching():boolean{
    return this.isStarted;
  }
  public isNoteCreateLocked(){
    return this.lockNoteCreate;
  }
  public isNoteDeleteLocked(){
    return this.lockNoteDelete;
  }
  public isNoteDoneLocked(){
    return this.lockNoteDone;
  }
  public isNoteTextLocked(){
    return this.lockNoteText;
  }
  public isNoteLinksLocked(){
    return this.lockNoteLinks;
  }
  public isNoteAddTagsLocked(){
    return this.lockNoteAddTags;
  }
  public isNoteRemoveTagsLocked(){
    return this.lockNoteRemoveTags;
  }

  public isTagCreateLocked(){
    return this.lockTagCreate;
  }
  public isTagDeleteLocked(){
    return this.lockTagDelete;
  }


  public isNoteBasicLocked(){
    return this.lockNoteDone && this.lockNoteText &&
      this.lockNoteLinks;
  }

  public isNoteFullyLocked(){
    return this.isNoteBasicLocked && this.lockNoteCreate &&
      this.lockNoteDelete && this.lockNoteAddTags &&
      this.lockNoteRemoveTags;
  }

  public isTagLocked(){
    return this.lockTagCreate && this.lockTagDelete &&
      this.lockNoteAddTags && this.lockNoteRemoveTags;
  }

  private makeAllNoteTrue(){
    this.lockNoteDone = true;
    this.lockNoteText = true;
    this.lockNoteLinks = true;
    this.lockNoteCreate = true;
    this.lockNoteDelete = true;
  }

  private makeAllNoteFalse(){
    this.lockNoteDone = false;
    this.lockNoteText = false;
    this.lockNoteLinks = false;
    this.lockNoteCreate = false;
    this.lockNoteDelete = false;
  }

  private makeAllTagTrue(){
    this.lockTagCreate = true;
    this.lockTagDelete = true;
  }

  private makeAllTagFalse(){
    this.lockTagCreate = false;
    this.lockTagDelete = false;
  }

  private makeAllTrue(){
    this.makeAllNoteTrue();
    this.makeAllTagTrue();
  }

  private makeAllFalse(){
    this.makeAllTagTrue();
    this.makeAllTagFalse();
  }


  public synch(){
    console.log('is started?'); console.log(JSON.stringify(this.isStarted));
    if(!this.isStarted){
      this.isStarted = true;
      this.makeAllTrue();
      /*first thing to do is cleaning up.*/
      console.log('cleaning up');
      this.cleanUp()
      .then(cleanUp=>{
        console.log('starting sending things');
        this.makeAllNoteTrue();
        return this.sendTagsToSave();
      })
      .then(tagsSent=>{
        console.log('tags sent');
        this.makeAllTagTrue();
        return this.sendNotesToSave();
      })
      .then(notesSent=>{
        console.log('notes sent');
        this.lockNoteDone = false;
        this.lockNoteText = false;
        this.lockNoteLinks = false;
        this.lockTagCreate = true;
        this.lockTagDelete = true;
        /*already true.*/
        // this.lockNoteAddTags = true;
        // this.lockNoteRemoveTags = true;
        return this.sendTagsToAddToNotes();
      })
      .then(tagsAddedToNotes=>{
        console.log('tags added');
        /*use the same lock as before*/
        return this.sendTagsToRemoveFromNotes();
      })
      .then(tagsDeleteFromNotes=>{
        console.log('tags added');
        /*the previuos locks are ok.*/
        return this.sendTagsToDelete();
      })
      .then(tagsDeleted=>{
        console.log('tags deleted');
        this.makeAllTrue();
        return this.sendNotesToDelete();
      })
      .then(notesDeleted=>{
        console.log('notes deleted');
        //this.lockNoteDone = true; already done
        this.lockNoteText = false;
        this.lockNoteLinks = false;
        this.makeAllTagFalse();
        return this.sendNotesToChangeDone();
      })
      .then(notesSetDone=>{
        console.log('set done');
        this.lockNoteDone = false;
        this.lockNoteText = true;
        return this.sendNotesToChangeText();
      })
      .then(notesChangedText=>{
        console.log('text changed');
        this.lockNoteText = false;
        this.lockNoteLinks = true;
        return this.sendNotesToChangeLinks();
      })
      .then(notesChangedLinks=>{
        console.log('everything is done');
        this.isStarted = false;
        this.makeAllFalse();
      })
      .catch(error=>{
        console.log('sent error:');
        console.log(JSON.stringify(error));
        this.isStarted = false;
      })
    }
  }


  //basically just a wrapper.
  private cleanUp(){
    return this.db.cleanUpEverything(this.auth.userid);
  }


  /*
  https://stackoverflow.com/questions/42008227/promise-all-find-which-promise-rejected
  to find the correct promise.
  */

  /*TODO: write a method that absorbs the modification also to the title, to put to 'clean up series'.*/

  public sendNotesToSave():Promise<any>{
    let correctResult:string[] = [];
    return new Promise<any>((resolve, reject)=>{
      this.db.getObjectNotesToSave(this.auth.userid)
      .then(objs=>{
        console.log('the objs notes:');
        console.log(JSON.stringify(objs));
        if(objs == null){
          resolve(true);
        }else{
          return Promise.all(objs.map((obj, index)=>{
            console.log('the current obj');
            console.log(JSON.stringify(JSON.stringify(obj.note)));
            return Utils.putBasic('/api/notes/create', JSON.stringify({note: obj.note}),this.http, this.auth.token)
            /*
              .catch(err=>{
                err.index = index;
                throw err;
              })
              */
              //have to see if it works.
              .then(res=>{
                correctResult.push(obj.note.title);
              })
          }))
        }
      })
      .then(results=>{
        /*according to MDN, it returns the values of each promise.*/
        console.log('results:');
        console.log(JSON.stringify(results));

      /*  only if the result is correct*/
      //return this.db.deleteNotesToSaveFromLogs(this.auth.userid);
      return this.db.deleteNoteToCreateFromLogsMultiVersion(correctResult, this.auth.userid);
      })
      .then(dbResult=>{
        resolve(true);
    })
      .catch(error=>{
        console.log('error in processing notes-to-save');
        console.log(JSON.stringify(error));
        reject(error);
      })
    })
  }


  public sendTagsToSave():Promise<any>{
    return new Promise<any>((resolve, reject)=>{
      let correctResult:string[]=[];
      this.db.getObjectTagsToSave(this.auth.userid)
      .then(objs=>{
        console.log('the tags to save:');
        console.log(JSON.stringify(objs));
        if(objs == null){
          resolve(true);
        }else{
          return Promise.all(objs.map((obj)=>{
            return Utils.putBasic('/api/tags/'+obj.tag.title, {}, this.http, this.auth.token)
            .then(res=>{
              correctResult.push(obj.tag.title);
            })
          }))
        }
      })
      .then(results=>{
        /*according to MDN, it returns the values of each promise.*/
        console.log('results:');
        console.log(JSON.stringify(results));
      /*  only if the result is correct*/
      //return this.db.deleteTagsToSaveFromLogs(this.auth.userid);
      return this.db.deleteTagToCreateFromLogsMultiVersion(correctResult, this.auth.userid)
      })
      .then(dbResult=>{
        resolve(true);
    })
      .catch(error=>{
        console.log('error in processing tags-to-save');
        console.log(JSON.stringify(error));
        reject(error);
      })
    })
  }


  public sendTagsToAddToNotes():Promise<any>{
    let correctResult:string[]=[];
    return new Promise<any>((resolve, reject)=>{
      this.db.getObjectTagsToAddToNotes(this.auth.userid)
      .then(objs=>{
        if(objs == null){
          resolve(true);
        }else{
          return Promise.all(objs.map((obj)=>{
            let reqBody: any ;
            reqBody.note.title=obj.note.title;
            if(obj.note.maintags.length>0){
              reqBody.note.maintags = obj.note.maintags;
            }
            if(obj.note.othertags.length>0){
              reqBody.note.othertags = obj.note.othertags;
            }
            return Utils.postBasic('/api/notes/mod/addtags', JSON.stringify({note: reqBody.note}), this.http, this.auth.token)
            .then(res=>{
              correctResult.push(obj.note.title);
            })
          }))
        }
      })
      .then(results=>{
        /*according to MDN, it returns the values of each promise.*/
        console.log('results:');
        console.log(JSON.stringify(results));
      /*  only if the result is correct*/
      // return this.db.deleteTagsToAddToNotesFromLogs(this.auth.userid);
      return this.db.deleteTagsToAddToSpecificNoteFromLogs(correctResult, this.auth.userid);
      })
      .then(dbResult=>{
        resolve(true);
    })
      .catch(error=>{
        console.log('error in processing notes (tags-to-add-to)');
        console.log(JSON.stringify(error));
        reject(error);
      })
    })
  }


  public sendTagsToRemoveFromNotes():Promise<any>{
    let correctResult:string[]=[];
    return new Promise<any>((resolve, reject)=>{
      this.db.getObjectTagsToRemoveFromNotes(this.auth.userid)
      .then(objs=>{
        if(objs == null){
          resolve(true);
        }else{
          return Promise.all(objs.map((obj)=>{
            let reqBody: any ;
            reqBody.note.title=obj.note.title;
            reqBody.note.tags = obj.note.mainTags;
            return Utils.postBasic('/api/notes/mod/removetags', JSON.stringify({note: reqBody.note}), this.http, this.auth.token)
            .then(res=>{
              correctResult.push(obj.note.title);
            })
          }))
        }
      })
      .then(results=>{
        /*according to MDN, it returns the values of each promise.*/
        console.log('results:');
        console.log(JSON.stringify(results));
      /*  only if the result is correct*/
      // return this.db.deleteTagsToAddToNotesFromLogs(this.auth.userid);
      return this.db.deleteTagsToRemoveFromSpecificNoteFromLogs(correctResult, this.auth.userid);
      })
      .then(dbResult=>{
        resolve(true);
    })
      .catch(error=>{
        console.log('error in processing notes (tags-to-remove-from)');
        console.log(JSON.stringify(error));
        reject(error);
      })
    })
  }



  public sendNotesToDelete():Promise<any>{
    let correctResult:string[]=[];
    return new Promise<any>((resolve, reject)=>{
      this.db.getObjectNotesToDelete(this.auth.userid)
      .then(objs=>{
        if(objs == null){
          resolve(true);
        }else{
          return Promise.all(objs.map((obj)=>{
            return Utils.deleteBasic('/api/notes/'+obj.note.title, this.http, this.auth.token)
            .then(res=>{
              correctResult.push(obj.note.title);
            })
          }))
        }
      })
      .then(results=>{
        /*according to MDN, it returns the values of each promise.*/
        console.log('results:');
        console.log(JSON.stringify(results));
      /*  only if the result is correct*/
      // return this.db.deleteTagsToAddToNotesFromLogs(this.auth.userid);
      return this.db.deleteNotesToDeleteMultiVersion(correctResult, this.auth.userid);
      })
      .then(dbResult=>{
        resolve(true);
    })
      .catch(error=>{
        console.log('error in processing notes-to-delete');
        console.log(JSON.stringify(error));
        reject(error);
      })
    })
  }



  public sendTagsToDelete():Promise<any>{
    let correctResult:string[]=[];
    return new Promise<any>((resolve, reject)=>{
      this.db.getObjectTagsToDelete(this.auth.userid)
      .then(objs=>{
        if(objs == null){
          resolve(true);
        }else{
          return Promise.all(objs.map((obj)=>{
            return Utils.deleteBasic('/api/tags/'+obj.tag.title, this.http, this.auth.token)
            .then(res=>{
              correctResult.push(obj.tag.title);
            })
          }))
        }
      })
      .then(results=>{
        /*according to MDN, it returns the values of each promise.*/
        console.log('results:');
        console.log(JSON.stringify(results));
      /*  only if the result is correct*/
      // return this.db.deleteTagsToAddToNotesFromLogs(this.auth.userid);
      return this.db.deleteTagsToDeleteMultiVersion(correctResult, this.auth.userid);
      })
      .then(dbResult=>{
        resolve(true);
    })
      .catch(error=>{
        console.log('error in processing tags-to-delete');
        console.log(JSON.stringify(error));
        reject(error);
      })
    })
  }



  public sendNotesToChangeText():Promise<any>{
    let correctResult:string[]=[];
    return new Promise<any>((resolve, reject)=>{
      this.db.getObjectNotesToChangeText(this.auth.userid)
      .then(objs=>{
        if(objs == null){
          resolve(true);
        }else{
          return Promise.all(objs.map((obj)=>{
            return Utils.postBasic('/api/change-text/', JSON.stringify({note:
              {title:obj.note.tile,
                text:obj.note.text
              }}), this.http, this.auth.token)
            .then(res=>{
              correctResult.push(obj.note.title);
            })
          }))
        }
      })
      .then(results=>{
        /*according to MDN, it returns the values of each promise.*/
        console.log('results:');
        console.log(JSON.stringify(results));
      /*  only if the result is correct*/
      // return this.db.deleteTagsToAddToNotesFromLogs(this.auth.userid);
      return this.db.deleteNoteFromLogsChangeTextMultiVersion(correctResult, this.auth.userid);
      })
      .then(dbResult=>{
        resolve(true);
    })
      .catch(error=>{
        console.log('error in processing notes-to-change-text.');
        console.log(JSON.stringify(error));
        reject(error);
      })
    })
  }


  public sendNotesToChangeLinks():Promise<any>{
    let correctResult:string[]=[];
    return new Promise<any>((resolve, reject)=>{
      this.db.getObjectNotesToChangeLinks(this.auth.userid)
      .then(objs=>{
        if(objs == null){
          resolve(true);
        }else{
          return Promise.all(objs.map((obj)=>{
            return Utils.postBasic('/api/change-links/', JSON.stringify({note:
              {title:obj.note.tile,
              links: obj.note.links
              }}), this.http, this.auth.token)
            .then(res=>{
              correctResult.push(obj.note.title);
            })
          }))
        }
      })
      .then(results=>{
        /*according to MDN, it returns the values of each promise.*/
        console.log('results:');
        console.log(JSON.stringify(results));
      /*  only if the result is correct*/
      // return this.db.deleteTagsToAddToNotesFromLogs(this.auth.userid);
      return this.db.deleteNoteFromLogsSetLinkMultiVersion(correctResult, this.auth.userid);
      })
      .then(dbResult=>{
        resolve(true);
    })
      .catch(error=>{
        console.log('error in processing notes-to-change-links.');
        console.log(JSON.stringify(error));
        reject(error);
      })
    })
  }


  public sendNotesToChangeDone():Promise<any>{
    let correctResult:string[]=[];
    return new Promise<any>((resolve, reject)=>{
      this.db.getObjectNotesToSetDone(this.auth.userid)
      .then(objs=>{
        if(objs == null){
          resolve(true);
        }else{
          return Promise.all(objs.map((obj)=>{
            return Utils.postBasic('/api/set-done/', JSON.stringify({note:
              {title:obj.note.tile,
                isdone: obj.note.isdone
              }}), this.http, this.auth.token)
            .then(res=>{
              correctResult.push(obj.note.title);
            })
          }))
        }
      })
      .then(results=>{
        /*according to MDN, it returns the values of each promise.*/
        console.log('results:');
        console.log(JSON.stringify(results));
      /*  only if the result is correct*/
      // return this.db.deleteTagsToAddToNotesFromLogs(this.auth.userid);
      return this.db.deleteNoteFromLogsSetDoneMultiVersion(correctResult, this.auth.userid);
      })
      .then(dbResult=>{
        resolve(true);
    })
      .catch(error=>{
        console.log('error in processing notes-to-set-done.');
        console.log(JSON.stringify(error));
        reject(error);
      })
    })
  }




}
