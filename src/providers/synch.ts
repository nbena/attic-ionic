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



  // private currentCursor : number = -1; /*the _id of the last consumed object.*/
  //
  // private lock: boolean = true; /*default lock is true, so nothing can be done.*/
  // private secondLock: boolean = false; /*default can be enabled.*/

  /*private recordsToDo: Queue<LogObject>;*/

  // private isConnected: boolean = false;
  // private disconnectedSubscription : any;
  // private connectedSubscription : any;

  constructor(private network: Network, private db: Db,
    // private atticNotes: AtticNotes,
    // private atticTags: AtticTags,
    private auth: Auth,
    public http: Http,
    private platform: Platform
    ) {

    console.log('Hello Synch Provider');

  }


  /*TODO: write a method that absorbs the modification also to the title, to put to 'clean up series'.*/

  public sendNotesToSave():Promise<any>{
    return new Promise<any>((resolve, reject)=>{
      this.db.getObjectNotesToSave(this.auth.userid)
      .then(objs=>{
        if(objs == null){
          resolve(true);
        }else{
          return Promise.all(objs.map((obj)=>{
            return Utils.putBasic('/api/notes/create', JSON.stringify({note: obj.note}),this.http, this.auth.token)
          }))
        }
      })
      .then(results=>{
        /*according to MDN, it returns the values of each promise.*/
        console.log('results:');
        console.log(JSON.stringify(results));
        // for(let i=0;i<results.length;i++){
        //   if(results[i] !== 'ok' && results[i] != {ok:true}){
        //     reject(new Error())
        //   }
        // } /*no need, the functions itself does not throw an error
      /*  only if the result is correct*/
      return this.db.deleteNotesToSaveFromLogs(this.auth.userid);
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
      this.db.getObjectTagsToSave(this.auth.userid)
      .then(objs=>{
        if(objs == null){
          resolve(true);
        }else{
          return Promise.all(objs.map((obj)=>{
            return Utils.putBasic('/api/tags/'+obj.tag.title, {}, this.http, this.auth.token);
          }))
        }
      })
      .then(results=>{
        /*according to MDN, it returns the values of each promise.*/
        console.log('results:');
        console.log(JSON.stringify(results));
        // for(let i=0;i<results.length;i++){
        //   if(results[i] !== 'ok' && results[i] != {ok:true}){
        //     reject(new Error())
        //   }
        // } /*no need, the functions itself does not throw an error
      /*  only if the result is correct*/
      return this.db.deleteTagsToSaveFromLogs(this.auth.userid);
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
            return Utils.postBasic('/api/notes/mod/addtags', JSON.stringify({note: reqBody.note}), this.http, this.auth.token);
          }))
        }
      })
      .then(results=>{
        /*according to MDN, it returns the values of each promise.*/
        console.log('results:');
        console.log(JSON.stringify(results));
        // for(let i=0;i<results.length;i++){
        //   if(results[i] !== 'ok' && results[i] != {ok:true}){
        //     reject(new Error())
        //   }
        // } /*no need, the functions itself does not throw an error
      /*  only if the result is correct*/
      return this.db.deleteTagsToAddToNotesFromLogs(this.auth.userid);
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
