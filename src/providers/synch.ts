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

  private noteToDeleteBecauseOfAnError:NoteFull  = null; /*just one because Promise.all is rejected as soon ONE is rejected.*/
  private tagToDeleteBecauseOfAnError: string = null;

  constructor(private network: Network, private db: Db,
    private netManager: NetManager,
    // private atticNotes: AtticNotes,
    // private atticTags: AtticTags,
    private auth: Auth,
    public http: Http,
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
          //console.log('links changed');
          // return this.removeNoteBecauseOfError();
          this.isStarted = false;
          this.makeAllFalse();
          resolve();
        })
        // .then(removedNote=>{
        //   console.log('removed note with error');
        //   return this.removeTagBecauseOfError();
        // })
        // .then(removedTag=>{
        //   console.log('removed tag with error');
        //   console.log('everything is done');
        //   this.makeAllFalse();
        //   resolve(true);
        // })
        .catch(error=>{
          console.log('sent error:');
          console.log(JSON.stringify(error));
          this.isStarted = false;
          reject(error);
        })
      }
    });
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

  public sendNotesToSave():Promise<void>{
    let correctResult:string[] = [];
    let current:NoteFull = null;
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
            promises.push(
              new Promise<any>((resolve, reject)=>{
                Utils.putBasic('/api/notes/create', JSON.stringify({note: obj.note}),this.http, this.auth.token)
                .then(result=>{
                  console.log('done with');
                  console.log(JSON.stringify(obj.note));
                  correctResult.push(obj.note.title);
                  resolve(result);
                })
                .catch(error=>{
                  reject(error);
                })
              })
            );
          });
          // return Promise.all(objs.map((obj, index)=>{
          //   console.log('the current obj');
          //   console.log(JSON.stringify(obj.note));
          //   current = obj.note;
          //   return Utils.putBasic('/api/notes/create', JSON.stringify({note: obj.note}),this.http, this.auth.token)
          return Promise.all(promises)
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
        console.log('notes-to-create deleted from logs');
        resolve();
      })
      .catch(error=>{
        console.log('error in processing notes-to-save');
        console.log(JSON.stringify(error));
        console.log(error);
        if(Utils.isPostgresError(error) || Utils.isPostgresError(error.message)){
          console.log('postgres error!');
          this.noteToDeleteBecauseOfAnError = current;
        }
        console.log('the note error is: ');
        console.log(current);
        reject(error); /*error is correctly rejected.*/
      })
    })
  }


  public sendTagsToSave():Promise<any>{
    return new Promise<void>((resolve, reject)=>{
      let correctResult:string[]=[];
      let current:string;
      this.db.getObjectTagsToSave(this.auth.userid)
      .then(objs=>{
        console.log('the tags to save:');
        console.log(JSON.stringify(objs));
        if(objs == null){
          resolve();
        }else{
          // return Promise.all(objs.map((obj)=>{
          //   current = obj.tag.title;
          //   return Utils.putBasic('/api/tags/'+obj.tag.title, {}, this.http, this.auth.token)
          //   .then(res=>{
          //     correctResult.push(obj.tag.title);
          //   })
          // }))
          let promises:Promise<any>[] = [];
          objs.forEach(obj=>{
            promises.push(
              new Promise<any>((resolve, reject)=>{
                Utils.putBasic('/api/tags/'+obj.tag.title, {}, this.http, this.auth.token)
                .then(result=>{
                  correctResult.push(obj.tag.title);
                  resolve(result);
                })
                .catch(error=>{
                  reject(error);
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
        console.log('tags-to-create deleted from logs');
        resolve();
    })
      .catch(error=>{
        console.log('error in processing tags-to-save');
        console.log(JSON.stringify(error));
        console.log(error);
        if(Utils.isPostgresError(error) || Utils.isPostgresError(error.message)){
          console.log('postgres error!');
          this.tagToDeleteBecauseOfAnError = current;
        }
        console.log('the tag error is: ');
        console.log(current);
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
            reqBody = {
              title: obj.note.title
            }
            if(obj.note.maintags.length>0){
              reqBody.maintags = obj.note.maintags;
            }
            if(obj.note.othertags.length>0){
              reqBody.othertags = obj.note.othertags;
            }
            return Utils.postBasic('/api/notes/mod/add-tags', JSON.stringify({note: reqBody}), this.http, this.auth.token)
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
      if(results!=null){
        return this.db.deleteTagsToAddToSpecificNoteFromLogs(correctResult, this.auth.userid);
      }else{
        resolve(true);
      }
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
            return Utils.postBasic('/api/notes/mod/remove-tags', JSON.stringify({note: reqBody.note}), this.http, this.auth.token)
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
      if(results!=null){
        return this.db.deleteTagsToRemoveFromSpecificNoteFromLogs(correctResult, this.auth.userid);
      }else{
        resolve(true);
      }
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
      if(results!=null){
        return this.db.deleteNotesToDeleteMultiVersion(correctResult, this.auth.userid);
      }else{
        resolve(true);
      }
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
        console.log('objs:');
        console.log(JSON.stringify(objs));
        if(objs == null){
          resolve(true);
        }else{
          return Promise.all(objs.map((obj)=>{
            return Utils.deleteBasic('/api/tags/'+obj.tag.title, this.http, this.auth.token)
            .then(res=>{
              correctResult.push(obj.tag.title);
            })
          }))
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
          //   resolve(true);
          // }
          // })
          // .then(dbResult=>{
          //   resolve(true);
          // })
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
        resolve(true);
      }
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
            return Utils.postBasic('/api/mod/change-text/', JSON.stringify({note:
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
      if(results!=null){
        return this.db.deleteNoteFromLogsChangeTextMultiVersion(correctResult, this.auth.userid);
      }else{
        resolve(true);
      }
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
            return Utils.postBasic('/api/mod/change-links/', JSON.stringify({note:
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
      if(results!=null){
        return this.db.deleteNoteFromLogsSetLinkMultiVersion(correctResult, this.auth.userid);
      }else{
        resolve(true);
      }
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
            return Utils.postBasic('/api/mod/set-done/', JSON.stringify({note:
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
      if(results!=null){
        return this.db.deleteNoteFromLogsSetDoneMultiVersion(correctResult, this.auth.userid);
      }else{
        resolve(true);
      }
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

  private removeTagBecauseOfError():Promise<void>{
    return this.db.deleteForceTag(this.tagToDeleteBecauseOfAnError, this.auth.userid);
  }

  private removeNoteBecauseOfError():Promise<void>{
    return this.db.deleteForceNote(this.noteToDeleteBecauseOfAnError, this.auth.userid);
  }


  public isThereSomethingToSynch(){
    return this.db.isThereSomethingToSynch(this.auth.userid);
  }



}
