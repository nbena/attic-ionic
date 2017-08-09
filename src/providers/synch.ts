import { Injectable } from '@angular/core';
// import { Http } from '@angular/http';
import 'rxjs/add/operator/map';
import { Db/*, LogObject */, LogObjSmart} from './db';
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
import { HttpProvider} from './http';
import { AtticError } from '../public/errors';

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

  // private noteToDeleteBecauseOfAnError:NoteFull  = null; /*just one because Promise.all is rejected as soon ONE is rejected.*/
  // private tagToDeleteBecauseOfAnError: string = null;

  private objRemoveTagFromNoteToDeleteBecaseOfAnError:LogObjSmart = null;
  private objAddTagToNoteToDeleteBecaseOfAnError:LogObjSmart = null;
  private objChangeTextToDeleteBecaseOfAnError:LogObjSmart = null;
  private objSetDoneToDeleteBecaseOfAnError:LogObjSmart = null;
  private objSetLinkToDeleteBecaseOfAnError:LogObjSmart = null;
  private objCreateNoteToDeleteBecaseOfAnError:LogObjSmart = null;
  private objCreateTagToDeleteBecaseOfAnError:LogObjSmart = null;

  private someSynchError:boolean = false;

  constructor(private network: Network, private db: Db,
    private netManager: NetManager,
    // private atticNotes: AtticNotes,
    // private atticTags: AtticTags,
    private auth: Auth,
    public http: HttpProvider,
    private platform: Platform
    ) {

    console.log('Hello Synch Provider');
    setInterval(900000,this.synch);

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



  public synch():Promise<void>{
    console.log('is started?'); console.log(JSON.stringify(this.isStarted));
    return new Promise<void>((resolve, reject)=>{

      if(!this.netManager.isConnected){
        reject(AtticError.getNewNetworkError());
      }else{

        this.db.isThereSomethingToSynch(this.auth.userid)
        .then(something=>{
          //unfortunately need to be done ehere.
          //if not it continues also in the else branch.
          if(something && !this.isStarted){
            this.synchCore().then(()=>{resolve()})
              .catch(error=>{reject(error)})
          }else{
            resolve();
          }
          })



          // if(!this.isStarted){
          //   this.isStarted = true;
          //   this.makeAllTrue();
          //   /*first thing to do is cleaning up.*/
          //   console.log('cleaning up');
          //   this.cleanUp()
          //   .then(()=>{
          //     console.log('starting sending things');
          //     this.makeAllNoteTrue();
          //     return this.sendTagsToSave();
          //   })
          //   .then(()=>{
          //     console.log('tags sent');
          //     this.makeAllTagTrue();
          //     return this.sendNotesToSave();
          //   })
          //   .then(()=>{
          //     console.log('notes sent');
          //     this.lockNoteDone = false;
          //     this.lockNoteText = false;
          //     this.lockNoteLinks = false;
          //     this.lockTagCreate = true;
          //     this.lockTagDelete = true;
          //     /*already true.*/
          //     // this.lockNoteAddTags = true;
          //     // this.lockNoteRemoveTags = true;
          //     return this.sendTagsToAddToNotes();
          //   })
          //   .then(()=>{
          //     console.log('tags added');
          //     /*use the same lock as before*/
          //     return this.sendTagsToRemoveFromNotes();
          //   })
          //   .then(()=>{
          //     console.log('tags added');
          //     /*the previuos locks are ok.*/
          //     return this.sendTagsToDelete();
          //   })
          //   .then(()=>{
          //     console.log('tags deleted');
          //     this.makeAllTrue();
          //     return this.sendNotesToDelete();
          //   })
          //   .then(()=>{
          //     console.log('notes deleted');
          //     //this.lockNoteDone = true; already done
          //     this.lockNoteText = false;
          //     this.lockNoteLinks = false;
          //     this.makeAllTagFalse();
          //     return this.sendNotesToChangeDone();
          //   })
          //   .then(()=>{
          //     console.log('set done');
          //     this.lockNoteDone = false;
          //     this.lockNoteText = true;
          //     return this.sendNotesToChangeText();
          //   })
          //   .then(()=>{
          //     console.log('text changed');
          //     this.lockNoteText = false;
          //     this.lockNoteLinks = true;
          //     return this.sendNotesToChangeLinks();
          //   })
          //   .then(()=>{
          //   console.log('links changed');
          //   console.log('everything is done');
          //   resolve();
          // })
          //   .catch(error=>{
          //     console.log('sent error:');
          //     console.log(JSON.stringify(error));
          //     if(this.someSynchError){
          //       return this.removeBadThings();
          //     }else{
          //       this.isStarted = false;
          //       reject(AtticError.getError(error));
          //     }
          //   })
          //   .then(()=>{
          //     console.log('bad things removed');
          //     resolve();
          //   })
          //   .catch(error=>{
          //     console.log('error in removing bad things');
          //     console.log(JSON.stringify(error));
          //     reject(error);
          //   })
          // }

      }
    });
  }


  private synchCore():Promise<void>{
    return new Promise<void>((resolve, reject)=>{
      this.isStarted = true;
      this.makeAllTrue();
      /*first thing to do is cleaning up.*/
      console.log('cleaning up');
      this.cleanUp()
      .then(()=>{
        console.log('starting sending things');
        this.makeAllNoteTrue();
        return this.sendTagsToSave();
      })
      .then(()=>{
        console.log('tags sent');
        this.makeAllTagTrue();
        return this.sendNotesToSave();
      })
      .then(()=>{
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
      .then(()=>{
        console.log('tags added');
        /*use the same lock as before*/
        return this.sendTagsToRemoveFromNotes();
      })
      .then(()=>{
        console.log('tags added');
        /*the previuos locks are ok.*/
        return this.sendTagsToDelete();
      })
      .then(()=>{
        console.log('tags deleted');
        this.makeAllTrue();
        return this.sendNotesToDelete();
      })
      .then(()=>{
        console.log('notes deleted');
        //this.lockNoteDone = true; already done
        this.lockNoteText = false;
        this.lockNoteLinks = false;
        this.makeAllTagFalse();
        return this.sendNotesToChangeDone();
      })
      .then(()=>{
        console.log('set done');
        this.lockNoteDone = false;
        this.lockNoteText = true;
        return this.sendNotesToChangeText();
      })
      .then(()=>{
        console.log('text changed');
        this.lockNoteText = false;
        this.lockNoteLinks = true;
        return this.sendNotesToChangeLinks();
      })
      .then(()=>{
      console.log('links changed');
      console.log('everything is done');
      resolve();
    })
    .catch(error=>{
      console.log('sent error:');
      console.log(JSON.stringify(error));
      if(this.someSynchError){
        return this.removeBadThings();
      }else{
        this.isStarted = false;
        reject(/*AtticError.getError(error)*/error);
      }
    })
    .then(()=>{
      console.log('bad things removed');
      this.isStarted = false;
      resolve();
    })
    .catch(error=>{
      console.log('error in removing bad things');
      console.log(JSON.stringify(error));
      reject(error);
    })
    })
  }

  // private mkPromise():Promise<void>[]{
  //   let promises:Promise<void>[]=[];
  //
  //     // new Promise<void>((resolve, reject)=>{
  //     //   this.makeAllTrue();
  //     //   console.log('start cleanup');
  //     //   this.cleanUp().then(()=>{console.log('cleanup ok');})
  //     //     .catch(error=>{reject(error);})
  //     // })
  //
  //   promises = [this.cleanUp(), this.sendTagsToSave(), this.sendNotesToSave(),
  //     this.sendTagsToAddToNotes(), this.sendTagsToRemoveFromNotes(), this.sendTagsToDelete(),
  //     this.sendNotesToChangeDone(), this.sendNotesToChangeText(), this.sendNotesToChangeLinks()
  //   ]
  //   return promises;
  // }

  // public synch():Promise<void>{
  //   return new Promise<void>((resolve, reject)=>{
  //     if(!this.isStarted){
  //       this.makeAllTrue();
  //       this.isStarted = true;
  //       Promise.all(this.mkPromise())
  //       .then(()=>{
  //         console.log('everything is done');
  //         resolve();
  //       })
  //       .catch(error=>{
  //         console.log('sent error');
  //         console.log(JSON.stringify(error));
  //         reject(error);
  //       })
  //     }else{
  //       console.log('already in progess');
  //       resolve();
  //     }
  //   })
  // }


  //basically just a wrapper.
  private cleanUp(){
    return this.db.cleanUpEverything(this.auth.userid);
  }


  /*
  https://stackoverflow.com/questions/42008227/promise-all-find-which-promise-rejected
  to find the correct promise.
  */

  /*TODO: write a method that absorbs the modification also to the title, to put to 'clean up series'.*/

  //note is NOTEEXTRAMIN!
  public sendNotesToSave():Promise<void>{
    let correctResult:string[] = [];
    let current:NoteFull = null;
    let currentLog:LogObjSmart;
    // this.makeAllTagTrue();
    // console.log('start sending notes-to-create');
    return new Promise<void>((resolve, reject)=>{
      this.db.getObjectNotesToSave(this.auth.userid)
      .then(objs=>{
        console.log('the objs notes:');
        console.log(JSON.stringify(objs));
        if(objs == null){
          resolve();
        }else{
          let promises:Promise<any>[] = [];
          objs.forEach(obj=>{
            currentLog = obj;
            promises.push(
              new Promise<any>((resolve, reject)=>{
                //Utils.putBasic('/api/notes/create', JSON.stringify({note: obj.note}),this.http, this.auth.token)
                this.http.put('/api/notes/create', JSON.stringify({note: obj.note}))
                .then(result=>{
                  console.log('done with');
                  console.log(JSON.stringify(obj.note));
                  correctResult.push(obj.note.title);
                  resolve(result);
                })
                .catch(error=>{
                  reject(/*AtticError.getError(error)*/error);
                })
              })
            );
          });
          // return Promise.all(objs.map((obj, index)=>{
          //   console.log('the current obj');
          //   console.log(JSON.stringify(obj.note));
          //   current = obj.note;
          //   return Utils.putBasic('/api/notes/create', JSON.stringify({note: obj.note}),this.http, this.auth.token)
          return Promise.all(promises);
            /*
              .catch(err=>{
                err.index = index;
                throw err;
              })
              */
              //have to see if it works.
              // .then(res=>{
              //   correctResult.push(obj.note.title);
              // })
        }
      })
      .then(results=>{
        /*according to MDN, it returns the values of each promise.*/
        console.log('results:');
        console.log(JSON.stringify(results));

        console.log('the correctResult');
        console.log(JSON.stringify(correctResult));
        /*it's an array of the created notes.*/
      /*  only if the result is correct*/
      if(correctResult.length>0){
        return this.db.deleteNoteToCreateFromLogsMultiVersion(correctResult, this.auth.userid);
      }else{
        resolve();
      }
    //   if(results!=null){
    //     //return this.db.deleteNoteToCreateFromLogsMultiVersion(correctResult, this.auth.userid);
    //   }else{
    //     resolve();
    //   }
    //   })
    //   .then(dbResult=>{
    //     resolve();
    // })
    /*resolve();*/
      })
      .then(dbResult=>{
        // console.log('ok notes-to-create deleted from logs');
        // console.log('ok notes-to-create');
        resolve();
      })
      .catch(error=>{
        console.log('error in processing notes-to-save');
        console.log(JSON.stringify(error));
        if(AtticError.isPostgresError(error) || AtticError.isPostgresError(error.message)){
          console.log('postgres error!');
          //this.noteToDeleteBecauseOfAnError = current;
          this.objCreateNoteToDeleteBecaseOfAnError = currentLog;
          this.someSynchError = true;
        }
        console.log('the current error object is: ');
        console.log(JSON.stringify(currentLog));
        reject(/*AtticError.getError(error)*/error); /*error is correctly rejected.*/
      })
    })
  }


  public sendTagsToSave():Promise<void>{
    return new Promise<void>((resolve, reject)=>{
      // this.makeAllNoteTrue();
      // console.log('sending tags to save');
      let correctResult:string[]=[];
      // let current:string;
      let currentLog:LogObjSmart;
      this.db.getObjectTagsToSave(this.auth.userid)
      .then(objs=>{
        console.log('the tags to save:');
        console.log(JSON.stringify(objs));
        if(objs == null){
          resolve();
        }else{
          let promises:Promise<any>[] = [];
          objs.forEach(obj=>{
            currentLog = obj;
            promises.push(
              new Promise<any>((resolve, reject)=>{
                this.http.put('/api/tags/'+obj.tag.title)
                .then(result=>{
                  correctResult.push(obj.tag.title);
                  resolve(result);
                })
                .catch(error=>{
                  reject(/*AtticError.getError(error)*/error);
                })
              })
            );
          });
          return Promise.all(promises);
        }
      })
      .then(results=>{
        /*according to MDN, it returns the values of each promise.*/
        console.log('results:');
        console.log(JSON.stringify(results));
      /*  only if the result is correct*/
      if(correctResult.length>0){
        return this.db.deleteTagToCreateFromLogsMultiVersion(correctResult, this.auth.userid);
      }else{
        resolve();
      }
      })
      .then(dbResult=>{
        // console.log('tags-to-create deleted from logs');
        // console.log('ok tags-to-create');
        resolve();
    })
      .catch(error=>{
        console.log('error in processing tags-to-save');
        console.log(JSON.stringify(error));
        if(AtticError.isPostgresError(error) || AtticError.isPostgresError(error.message)){
          console.log('postgres error!');
          //this.tagToDeleteBecauseOfAnError = current;
          this.objCreateTagToDeleteBecaseOfAnError = currentLog;
          this.someSynchError = true;
        }
        console.log('the current error object is: ');
        console.log(JSON.stringify(currentLog));
        reject(/*AtticError.getError(error)*/error);
      })
    })
  }


  /*
  NOTE IS NOTE MIN
  obj.note.title
  obj.note.maintags AS STRING[]
  obj.note.othertags AS STRING[]
  */
  public sendTagsToAddToNotes():Promise<void>{
    let correctResult:string[]=[];
    let currentLog:LogObjSmart;
    // this.lockNoteDone = false;
    // this.lockNoteText = false;
    // this.lockNoteLinks = false;
    // this.lockTagCreate = true;
    // this.lockTagDelete = true;
    // console.log('sending tags-to-add-to');
    return new Promise<void>((resolve, reject)=>{
      this.db.getObjectTagsToAddToNotes(this.auth.userid)
      .then(objs=>{
        if(objs == null){
          resolve();
        }else{
          // return Promise.all(objs.map((obj)=>{
          //   let reqBody: any ;
          //   reqBody = {
          //     title: obj.note.title
          //   }
          //   if(obj.note.maintags.length>0){
          //     reqBody.maintags = obj.note.maintags;
          //   }
          //   if(obj.note.othertags.length>0){
          //     reqBody.othertags = obj.note.othertags;
          //   }
          //   return Utils.postBasic('/api/notes/mod/add-tags', JSON.stringify({note: reqBody}), this.http, this.auth.token)
          //   .then(res=>{
          //     correctResult.push(obj.note.title);
          //   })
          // }))
          let promises:Promise<any>[]=[];
          objs.forEach(obj=>{
            currentLog = obj;
            promises.push(
              new Promise<any>((resolve, reject)=>{
                let reqBody:any;
                reqBody = {
                  title: obj.note.title
                }
                if(obj.note.maintags.length>0){
                  reqBody.maintags = obj.note.maintags;
                }
                if(obj.note.othertags.length>0){
                  reqBody.othertags = obj.note.othertags;
                }
                //Utils.postBasic('/api/notes/mod/add-tags', JSON.stringify({note:reqBody}), this.http, this.auth.userid)
                this.http.post('/api/notes/mod/add-tags', JSON.stringify({note:reqBody}))
                .then(result=>{
                  correctResult.push(obj.note.title);
                  // console.log('ok tags-to-add-to');
                  resolve(result);
                })
                .catch(error=>{
                  // console.log('error in send tags-to-add-to');
                  // console.log(JSON.stringify(error));
                  reject(/*AtticError.getError(error)*/error);
                })
              })
            )
          })
          return Promise.all(promises);
        }
      })
      .then(results=>{
        /*according to MDN, it returns the values of each promise.*/
        console.log('results:');
        console.log(JSON.stringify(results));
      /*  only if the result is correct*/
      if(results!=null){
        return this.db.deleteTagsToAddToSpecificNoteFromLogs(correctResult, this.auth.userid);
      }else{
        // console.log('ok tags-to-add-to');
        resolve();
      }
      })
      .then(dbResult=>{
        // console.log('ok tags-to-add-to');
        resolve();
    })
      .catch(error=>{
        console.log('error in processing notes (tags-to-add-to)');
        console.log(JSON.stringify(error));
        if(AtticError.isPostgresError(error) || AtticError.isPostgresError(error.message)){
          console.log('postgres error!');
          //this.noteToDeleteBecauseOfAnError = current;
          this.objAddTagToNoteToDeleteBecaseOfAnError = currentLog;
          this.someSynchError = true;
        }
        console.log('the current error object is: ');
        console.log(JSON.stringify(currentLog));
        reject(/*AtticError.getError(error)*/error);
      })
    })
  }


  public sendTagsToRemoveFromNotes():Promise<void>{
    let correctResult:string[]=[];
    let currentLog:LogObjSmart;
    return new Promise<void>((resolve, reject)=>{
      this.db.getObjectTagsToRemoveFromNotes(this.auth.userid)
      .then(objs=>{
        if(objs == null){
          resolve();
        }else{
          // return Promise.all(objs.map((obj)=>{
          //   let reqBody: any ;
          //   reqBody.note.title=obj.note.title;
          //   reqBody.note.tags = obj.note.maintags;
          //   return Utils.postBasic('/api/notes/mod/remove-tags', JSON.stringify({note: reqBody.note}), this.http, this.auth.token)
          //   .then(res=>{
          //     correctResult.push(obj.note.title);
          //   })
          // }))
          let promises:Promise<any>[]=[];
          objs.forEach(obj=>{
            currentLog = obj;
            promises.push(
              new Promise<any>((resolve, reject)=>{
                let note:any={
                  title:obj.note.title,
                  tags:obj.note.maintags
                }
                //Utils.postBasic('/api/notes/mod/remove-tags', JSON.stringify({note:note}), this.http, this.auth.userid)
                this.http.post('/api/notes/mod/remove-tags', JSON.stringify({note:note}))
                .then(result=>{
                  correctResult.push(obj.note.title);
                  // console.log('ok in send tags-to-remove-from');
                  resolve(result);
                })
                .catch(error=>{
                  // console.log('error in send tags-to-remove-from');
                  // console.log(JSON.stringify(error));
                  reject(/*AtticError.getError(error)*/error);
                })
              })
            )
          })
          return Promise.all(promises);
        }
      })
      .then(results=>{
        /*according to MDN, it returns the values of each promise.*/
        console.log('results:');
        console.log(JSON.stringify(results));
      /*  only if the result is correct*/
      if(results!=null){
        return this.db.deleteTagsToRemoveFromSpecificNoteFromLogs(correctResult, this.auth.userid);
      }else{
        resolve();
      }
      })
      .then(dbResult=>{
        resolve();
    })
      .catch(error=>{
        console.log('error in processing notes (tags-to-remove-from)');
        console.log(JSON.stringify(error));
        if(AtticError.isPostgresError(error) || AtticError.isPostgresError(error.message)){
          console.log('postgres error!');
          //this.noteToDeleteBecauseOfAnError = current;
          this.objRemoveTagFromNoteToDeleteBecaseOfAnError = currentLog;
          this.someSynchError = true;
        }
        console.log('the current error object is: ');
        console.log(JSON.stringify(currentLog));
        reject(/*AtticError.getError(error)*/error);
      })
    })
  }



  public sendNotesToDelete():Promise<void>{
    let correctResult:string[]=[];
    let currentLog:LogObjSmart;
    return new Promise<void>((resolve, reject)=>{
      this.db.getObjectNotesToDelete(this.auth.userid)
      .then(objs=>{
        if(objs == null){
          resolve();
        }else{
          // return Promise.all(objs.map((obj)=>{
          //   return Utils.deleteBasic('/api/notes/'+obj.note.title, this.http, this.auth.token)
          //   .then(res=>{
          //     correctResult.push(obj.note.title);
          //   })
          // }))
          let promises:Promise<any>[]=[];
          objs.forEach(obj=>{
            currentLog = obj;
            promises.push(
              new Promise<any>((resolve, reject)=>{
                //Utils.deleteBasic('/api/notes/'+obj.note.title, this.http, this.auth.token)
                this.http.delete('/api/notes/'+obj.note.title)
                .then(result=>{
                  correctResult.push(obj.note.title);
                  // console.log('ok send note to delete');
                  resolve(result);
                })
                .catch(error=>{
                  // console.log('error in send to note to delete');
                  // console.log(JSON.stringify(error));
                  reject(/*AtticError.getError(error)*/error);
                })
              })
            )
          })
          return Promise.all(promises);
        }
      })
      .then(results=>{
        /*according to MDN, it returns the values of each promise.*/
        console.log('results:');
        console.log(JSON.stringify(results));
      /*  only if the result is correct*/
      if(results!=null){
        return this.db.deleteNotesToDeleteMultiVersion(correctResult, this.auth.userid);
      }else{
        resolve();
      }
      })
      .then(dbResult=>{
        resolve();
    })
      .catch(error=>{
        console.log('error in processing notes-to-delete');
        console.log(JSON.stringify(error));
        if(AtticError.isPostgresError(error) || AtticError.isPostgresError(error.message)){
          console.log('postgres error!');
          //this.noteToDeleteBecauseOfAnError = current;
          //this.objNoteTo = currentLog;
          //this.someSynchError = true;
          //unnecessary, delete is always ok unless there is
          //a big server error.
        }
        console.log('the current error object is: ');
        console.log(JSON.stringify(currentLog));
        reject(/*AtticError.getError(error)*/error);
      })
    })
  }



  public sendTagsToDelete():Promise<void>{
    let correctResult:string[]=[];
    let currentLog:LogObjSmart;
    return new Promise<void>((resolve, reject)=>{
      this.db.getObjectTagsToDelete(this.auth.userid)
      .then(objs=>{
        console.log('objs:');
        console.log(JSON.stringify(objs));
        if(objs == null){
          resolve();
        }else{
          // return Promise.all(objs.map((obj)=>{
          //   return Utils.deleteBasic('/api/tags/'+obj.tag.title, this.http, this.auth.token)
          //   .then(res=>{
          //     correctResult.push(obj.tag.title);
          //   })
          // }))
          //THIS IS POSSIBLE AND IT'S GOOD BECAUSE THERE'S NO NEED FOR THE IF BUT
          //I DO NOT WANT TO NEST PROMISE!
          // .then(results=>{
          //   /*according to MDN, it returns the values of each promise.*/
          //   console.log('results:');
          //   console.log(JSON.stringify(results));
          // if(results != null){
          //   /*must go here because promise is not correctly resolved.*/
          //   return this.db.deleteTagsToDeleteMultiVersion(correctResult, this.auth.userid);
          // }else{
          //   resolve();
          // }
          // })
          // .then(dbResult=>{
          //   resolve();
          // })
          let promises:Promise<any>[]=[];
          objs.forEach(obj=>{
            currentLog = obj;
            promises.push(
              new Promise<any>((resolve, reject)=>{
                //Utils.deleteBasic('/api/tags/'+obj.tag.title, this.http, this.auth.token)
                this.http.delete('/api/tags/'+obj.tag.title)
                .then(result=>{
                  correctResult.push(obj.tag.title);
                  // console.log('ok send tags-to-delete');
                  resolve(result);
                })
                .catch(error=>{
                  // console.log('error in send tags-to-delete');
                  // console.log(JSON.stringify(error));
                  reject(/*AtticError.getError(error)*/error);
                })
              })
            )
          })
          return Promise.all(promises);
        }
      })
      .then(results=>{
        /*according to MDN, it returns the values of each promise.*/
        console.log('results:');
        console.log(JSON.stringify(results));
      if(results != null){
        /*must go here because promise is not correctly resolved.*/
        return this.db.deleteTagsToDeleteMultiVersion(correctResult, this.auth.userid);
      }else{
        resolve();
      }
      })
      .then(dbResult=>{
        resolve();
    })
      .catch(error=>{
        console.log('error in processing tags-to-delete');
        console.log(JSON.stringify(error));
        if(AtticError.isPostgresError(error) || AtticError.isPostgresError(error.message)){
          console.log('postgres error!');
          //this.noteToDeleteBecauseOfAnError = current;
          //this.objRemov = currentLog;
          //this.someSynchError = true;
          //unnecessary: delete is always ok unless there is a
          //server error.
        }
        console.log('the current error object is: ');
        console.log(JSON.stringify(currentLog));
        reject(/*AtticError.getError(error)*/error);
      })
    })
  }



  public sendNotesToChangeText():Promise<void>{
    let correctResult:string[]=[];
    let currentLog:LogObjSmart;
    return new Promise<void>((resolve, reject)=>{
      this.db.getObjectNotesToChangeText(this.auth.userid)
      .then(objs=>{
        if(objs == null){
          resolve();
        }else{
          // return Promise.all(objs.map((obj)=>{
          //   return Utils.postBasic('/api/mod/change-text/', JSON.stringify({note:
          //     {title:obj.note.tile,
          //       text:obj.note.text
          //     }}), this.http, this.auth.token)
          //   .then(res=>{
          //     correctResult.push(obj.note.title);
          //   })
          // }))
          let promises:Promise<any>[]=[];
          objs.forEach(obj=>{
            currentLog = obj;
            promises.push(
              new Promise<any>((resolve, reject)=>{
                // Utils.postBasic('/api/mod/change-text/', JSON.stringify({note:
                //   {title:obj.note.tile,
                //     text:obj.note.text
                //   }}), this.http, this.auth.token)
                this.http.post('/api/mod/change-text/', JSON.stringify({note:
                  {title:obj.note.tile,
                    text:obj.note.text
                  }}))
                .then(result=>{
                  correctResult.push(obj.note.title);
                  // console.log();
                  resolve(result);
                })
                .catch(error=>{
                  // console.log('error in');
                  // console.log(JSON.stringify(error));
                  reject(/*AtticError.getError(error)*/error);
                })
              })
            )
          })
          return Promise.all(promises);
        }
      })
      .then(results=>{
        /*according to MDN, it returns the values of each promise.*/
        console.log('results:');
        console.log(JSON.stringify(results));
      /*  only if the result is correct*/
      if(results!=null){
        return this.db.deleteNoteFromLogsChangeTextMultiVersion(correctResult, this.auth.userid);
      }else{
        resolve();
      }
      })
      .then(dbResult=>{
        resolve();
    })
      .catch(error=>{
        console.log('error in processing notes-to-change-text.');
        console.log(JSON.stringify(error));
        if(AtticError.isPostgresError(error) || AtticError.isPostgresError(error.message)){
          console.log('postgres error!');
          //this.noteToDeleteBecauseOfAnError = current;
          this.objChangeTextToDeleteBecaseOfAnError = currentLog;
          this.someSynchError = true;
        }
        console.log('the current error object is: ');
        console.log(JSON.stringify(currentLog));
        reject(/*AtticError.getError(error)*/error);
      })
    })
  }


  public sendNotesToChangeLinks():Promise<void>{
    let correctResult:string[]=[];
    let currentLog:LogObjSmart;
    return new Promise<void>((resolve, reject)=>{
      this.db.getObjectNotesToChangeLinks(this.auth.userid)
      .then(objs=>{
        if(objs == null){
          resolve();
        }else{
          // return Promise.all(objs.map((obj)=>{
            // return Utils.postBasic('/api/mod/change-links/', JSON.stringify({note:
            //   {title:obj.note.tile,
            //   links: obj.note.links
            //   }}), this.http, this.auth.token)
          //   .then(res=>{
          //     correctResult.push(obj.note.title);
          //   })
          // }))
          let promises:Promise<any>[]=[];
          objs.forEach(obj=>{
            currentLog = obj;
            promises.push(
              new Promise<any>((resolve, reject)=>{
                // Utils.postBasic('/api/mod/change-links/', JSON.stringify({note:
                //   {title:obj.note.tile,
                //   links: obj.note.links
                //   }}), this.http, this.auth.token)
                this.http.post('/api/mod/change-links/', JSON.stringify({note:
                  {title:obj.note.tile,
                  links: obj.note.links
                  }}))
                .then(result=>{
                  correctResult.push(obj.note.title);
                  // console.log('ok in send notes-to-change-links');
                  resolve(result);
                })
                .catch(error=>{
                  // console.log('error in send notes-to-change-links');
                  // console.log(JSON.stringify(error));
                  reject(/*AtticError.getError(error)*/error);
                })
              })
            )
          })
          return Promise.all(promises);
        }
      })
      .then(results=>{
        /*according to MDN, it returns the values of each promise.*/
        console.log('results:');
        console.log(JSON.stringify(results));
      /*  only if the result is correct*/
      if(results!=null){
        return this.db.deleteNoteFromLogsSetLinkMultiVersion(correctResult, this.auth.userid);
      }else{
        resolve();
      }
      })
      .then(dbResult=>{
        resolve();
    })
      .catch(error=>{
        console.log('error in processing notes-to-change-links.');
        console.log(JSON.stringify(error));
        if(AtticError.isPostgresError(error) || AtticError.isPostgresError(error.message)){
          console.log('postgres error!');
          //this.noteToDeleteBecauseOfAnError = current;
          this.objSetLinkToDeleteBecaseOfAnError = currentLog;
          this.someSynchError = true;
        }
        console.log('the current error object is: ');
        console.log(JSON.stringify(currentLog));
        reject(/*AtticError.getError(error)*/error);
      })
    })
  }


  public sendNotesToChangeDone():Promise<void>{
    let correctResult:string[]=[];
    let currentLog:LogObjSmart;
    return new Promise<void>((resolve, reject)=>{
      this.db.getObjectNotesToSetDone(this.auth.userid)
      .then(objs=>{
        if(objs == null){
          resolve();
        }else{
          // return Promise.all(objs.map((obj)=>{
          //   return Utils.postBasic('/api/mod/set-done/', JSON.stringify({note:
          //     {title:obj.note.tile,
          //       isdone: obj.note.isdone
          //     }}), this.http, this.auth.token)
          //   .then(res=>{
          //     correctResult.push(obj.note.title);
          //   })
          // }))
          let promises:Promise<any>[]=[];
          objs.forEach(obj=>{
            currentLog = obj;
            promises.push(
              new Promise<any>((resolve, reject)=>{
                  // Utils.postBasic('/api/mod/set-done/', JSON.stringify({note:
                  //   {title:obj.note.tile,
                  //     isdone: obj.note.isdone
                  //   }}), this.http, this.auth.token)
                  this.http.post('/api/mod/set-done/', JSON.stringify({note:
                    {title:obj.note.tile,
                      isdone: obj.note.isdone
                    }}))
                .then(result=>{
                  correctResult.push(obj.note.title);
                  // console.log('ok send notes-to-set-done');
                  resolve(result);
                })
                .catch(error=>{
                  // console.log('error in send notes-to-set-done');
                  // console.log(JSON.stringify(error));
                  reject(/*AtticError.getError(error)*/error);
                })
              })
            )
          })
          return Promise.all(promises);
        }
      })
      .then(results=>{
        /*according to MDN, it returns the values of each promise.*/
        console.log('results:');
        console.log(JSON.stringify(results));
      /*  only if the result is correct*/
      if(results!=null){
        return this.db.deleteNoteFromLogsSetDoneMultiVersion(correctResult, this.auth.userid);
      }else{
        resolve();
      }
      })
      .then(dbResult=>{
        resolve();
    })
      .catch(error=>{
        console.log('error in processing notes-to-set-done.');
        console.log(JSON.stringify(error));
        if(AtticError.isPostgresError(error) || AtticError.isPostgresError(error.message)){
          console.log('postgres error!');
          //this.noteToDeleteBecauseOfAnError = current;
          this.objSetDoneToDeleteBecaseOfAnError = currentLog;
          this.someSynchError = true;
        }
        console.log('the current error object is: ');
        console.log(JSON.stringify(currentLog));
        reject(/*AtticError.getError(error)*/error);
      })
    })
  }

  // private removeTagBecauseOfError():Promise<void>{
  //   return this.db.deleteForceTag(this.tagToDeleteBecauseOfAnError, this.auth.userid);
  // }
  //
  // private removeNoteBecauseOfError():Promise<void>{
  //   return this.db.deleteForceNote(this.noteToDeleteBecauseOfAnError, this.auth.userid);
  // }
  private removeBadNotesToSetDone():Promise<void>{
    return new Promise<void>((resolve, reject)=>{
      if(this.objSetDoneToDeleteBecaseOfAnError!=null){
        console.log('the bad notes-to-set-done to remove');
        console.log(JSON.stringify(this.objSetDoneToDeleteBecaseOfAnError));
        this.db.rollbackModification(this.objSetDoneToDeleteBecaseOfAnError, this.auth.userid)
        .then(()=>{
          console.log('ok removed bad notes-to-set-done');
          resolve();
        })
        .catch(error=>{
          console.log('error remove bad notes-to-set-done');
          console.log(JSON.stringify(error));
          reject(error);
        })
      }else{
        console.log('no bad notes-to-set-done to remove');
        resolve();
        }
    })
  }

  private removeBadNotesToSetLink():Promise<void>{
    return new Promise<void>((resolve, reject)=>{
      if(this.objSetLinkToDeleteBecaseOfAnError!=null){
        console.log('the bad notes-to-set-link to remove');
        console.log(JSON.stringify(this.objSetLinkToDeleteBecaseOfAnError));
        this.db.rollbackModification(this.objSetLinkToDeleteBecaseOfAnError, this.auth.userid)
        .then(()=>{
          console.log('ok removed bad notes-to-set-link');
          resolve();
        })
        .catch(error=>{
          console.log('error remove bad notes-to-set-link');
          console.log(JSON.stringify(error));
          reject(/*AtticError.getError(error)*/error);
        })
      }else{
        console.log('no bad notes-to-set-link to remove');
        resolve();
        }
    })
  }

  private removeBadNotesToSetChangeText():Promise<void>{
    return new Promise<void>((resolve, reject)=>{
      if(this.objChangeTextToDeleteBecaseOfAnError!=null){
        console.log('the bad notes-to-change-texto remove');
        console.log(JSON.stringify(this.objChangeTextToDeleteBecaseOfAnError));
        this.db.rollbackModification(this.objChangeTextToDeleteBecaseOfAnError, this.auth.userid)
        .then(()=>{
          console.log('ok removed bad notes-to-change-text');
          resolve();
        })
        .catch(error=>{
          console.log('error remove bad notes-to-change-text');
          console.log(JSON.stringify(error));
          reject(/*AtticError.getError(error)*/error);
        })
      }else{
        console.log('no bad notes-to-change-text to remove');
        resolve();
        }
    })
  }

  private removeBadNotesToCreate():Promise<void>{
    return new Promise<void>((resolve, reject)=>{
      if(this.objCreateNoteToDeleteBecaseOfAnError!=null){
        console.log('the bad notes-to-create to remove');
        console.log(JSON.stringify(this.objCreateNoteToDeleteBecaseOfAnError));
        this.db.rollbackModification(this.objCreateNoteToDeleteBecaseOfAnError, this.auth.userid)
        .then(()=>{
          console.log('ok removed bad notes-to-create');
          resolve();
        })
        .catch(error=>{
          console.log('error remove bad notes-to-create');
          console.log(JSON.stringify(error.message));
          reject(/*AtticError.getError(error)*/error);
        })
      }else{
        console.log('no bad notes-to-create to remove');
        resolve();
        }
    })
  }

  private removeBadTagsToAddToNotes():Promise<void>{
    return new Promise<void>((resolve, reject)=>{
      if(this.objAddTagToNoteToDeleteBecaseOfAnError!=null){
        console.log('the bad tags-to-add-to to remove');
        console.log(JSON.stringify(this.objAddTagToNoteToDeleteBecaseOfAnError));
        this.db.rollbackModification(this.objAddTagToNoteToDeleteBecaseOfAnError, this.auth.userid)
        .then(()=>{
          console.log('ok removed bad tags-to-add-to');
          resolve();
        })
        .catch(error=>{
          console.log('error remove bad tags-to-add-to');
          console.log(JSON.stringify(error));
          reject(/*AtticError.getError(error)*/error);
        })
      }else{
        console.log('no bad tags-to-add-to to remove');
        resolve();
        }
    })
  }

  private removeBadTagsToRemoveFromNotes():Promise<void>{
    return new Promise<void>((resolve, reject)=>{
      if(this.objRemoveTagFromNoteToDeleteBecaseOfAnError!=null){
        console.log('the bad tags-to-remove-from to remove');
        console.log(JSON.stringify(this.objRemoveTagFromNoteToDeleteBecaseOfAnError));
        this.db.rollbackModification(this.objRemoveTagFromNoteToDeleteBecaseOfAnError, this.auth.userid)
        .then(()=>{
          console.log('ok removed bad tags-to-remove-from');
          resolve();
        })
        .catch(error=>{
          console.log('error remove bad tags-to-remove-from');
          console.log(JSON.stringify(error));
          reject(/*AtticError.getError(error)*/error);
        })
      }else{
        console.log('no bad tags-to-remove-from to remove');
        resolve();
        }
    })
  }


  private removeBadTagsToCreate():Promise<void>{
    return new Promise<void>((resolve, reject)=>{
      if(this.objCreateTagToDeleteBecaseOfAnError!=null){
        console.log('the bad tags-to-create to remove');
        console.log(JSON.stringify(this.objCreateTagToDeleteBecaseOfAnError));
        this.db.rollbackModification(this.objCreateTagToDeleteBecaseOfAnError, this.auth.userid)
        .then(()=>{
          console.log('ok removed bad tags-to-create');
          resolve();
        })
        .catch(error=>{
          console.log('error remove bad tags-to-create');
          console.log(JSON.stringify(error));
          reject(/*AtticError.getError(error)*/error);
        })
      }else{
        console.log('no bad tags-to-create to remove');
        resolve();
        }
    })
  }

  private removeBadThings():Promise<void>{
    return new Promise<void>((resolve, reject)=>{
      console.log('start removing bad things');
      this.removeBadTagsToCreate()
      .then(()=>{
        console.log('done removed bad tags to created');
        return this.removeBadNotesToCreate()
      })
      .then(()=>{
        console.log('done removed bad notes to create');
        return this.removeBadNotesToSetDone();
      })
      .then(()=>{
        console.log('done removed bad notes to set done');
        return this.removeBadNotesToSetLink();
      })
      .then(()=>{
        console.log('done removed bad notes to set link');
        return this.removeBadTagsToAddToNotes();
      })
      .then(()=>{
        console.log('done removed bad tags to add to notes');
        return this.removeBadNotesToSetChangeText();
      })
      .then(()=>{
        console.log('done removed notes to change text');
        return this.removeBadTagsToRemoveFromNotes();
      })
      .then(()=>{
        console.log('done removed bad tags to remove to notes');
        console.log('every bad things removed');
        resolve();
      })
      .catch(error=>{
        console.log('error in removing bad things');
        console.log(JSON.stringify(error));
        reject(error);
      })
    })
  }


  public isThereSomethingToSynch(){
    return this.db.isThereSomethingToSynch(this.auth.userid);
  }



}
