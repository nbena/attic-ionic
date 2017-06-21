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
import { Queue } from 'typescript-collections';
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

  // private currentCursor : number = -1; /*the _id of the last consumed object.*/
  //
  // private lock: boolean = true; /*default lock is true, so nothing can be done.*/
  // private secondLock: boolean = false; /*default can be enabled.*/

  /*private recordsToDo: Queue<LogObject>;*/

  // private isConnected: boolean = false;
  // private disconnectedSubscription : any;
  // private connectedSubscription : any;

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


  public synch(){
    if(!this.isStarted){
      this.isStarted = true;
      console.log('starting sending notes');
      this.sendTagsToSave()
      .then(tagsSent=>{
        console.log('tags sent');
        return this.sendNotesToSave();
      })
      .then(notesSent=>{
        console.log('notes sent');
      })
      .catch(error=>{
        console.log('sent error:');
        console.log(JSON.stringify(error));
      })
    }
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
        console.log('the objs');
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
        console.log('error in processing notes');
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
        console.log('error in processing notes');
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
        console.log('error in processing notes');
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
        console.log('error in processing notes');
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
        console.log('error in processing notes');
        console.log(JSON.stringify(error));
        reject(error);
      })
    })
  }




}
