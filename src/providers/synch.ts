import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';
import { Db/*, LogObject */} from './db';
import { AtticTags } from './attic-tags';
import { AtticNotes } from './attic-notes';
import { NoteExtraMin, NoteFull, NoteSQLite, NoteMin } from '../models/notes';
import { TagExtraMin, TagFull, TagSQLite, TagMin } from '../models/tags';
//import * as Collections from 'typescript-collections';
import { Queue } from 'typescript-collections';
import { Action } from '../public/const';
import { Network } from '@ionic-native/network';
import { Platform } from 'ionic-angular';

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


  // private notesToSave: Queue<NoteMin>; /*the correct form required by the server.*/
  // private notesToDelete: Queue<string>;
  //
  // private notesToChangeText: Queue<[string, string]>;
  // private notesToChangeTitle: Queue<[string, string]>;
  // private notesToAddTags: Queue<[string, string[]]>;
  // private notesToRemoveTags: Queue<[string, string[]]>

  private currentCursor : number = -1; /*the _id of the last consumed object.*/

  private lock: boolean = true; /*default lock is true, so nothing can be done.*/
  private secondLock: boolean = false; /*default can be enabled.*/

  /*private recordsToDo: Queue<LogObject>;*/

  private isConnected: boolean = false;
  private disconnectedSubscription : any;
  private connectedSubscription : any;

  constructor(private network: Network, private db: Db,
    private atticNotes: AtticNotes,
    private atticTags: AtticTags,
    private platform: Platform
    ) {

    console.log('Hello Synch Provider');
    // this.recordsToDo = new Queue<LogObject>();
    //
    // //platform ready.
    // this.platform.ready().then((ready)=>{
    //   this.disconnectedSubscription = this.network.onDisconnect().subscribe(()=>{
    //     this.lock = true;
    //     console.log('no network');
    //   });
    //
    //   this.connectedSubscription = this.network.onConnect().subscribe(()=>{
    //     this.lock = false;
    //     console.log('ok netowrk, lock disabled, starting consuming');
    //     //this.secondLock = false;
    //     this.consumeLog();
    //   })
    // });
    //
    // console.log(JSON.stringify(network.type));
    //
    // if(network.type!="none" && network.type!="NONE" &&  network.type!="None" ){
    //   console.log('ok starting');
    //   this.consumeLog();
    // }

  }

  // private tagsToPublish(){
  //   let tagQueue = new Queue<TagFull>();
  //   let tags = this.db.getTagsToPublish()
  //   .then(tags=>{
  //     //filter the tags, at first just the tag with not notes.
  //   })
  //   .catch(error=>{
  //     console.log(JSON.stringify(error));
  //   })
  // }

  // public getFunction(act: Action): (LogObject)=>Promise<any>{
  //   let res : any;
  //   switch(act){
  //     case Action.CreateNote:
  //       res = (obj)=>{this.processCreateNote(obj)
  //       .then(result=>{
  //         console.log('done processed note');
  //         // canDo = true;
  //         return;
  //       })
  //     }
  //     case Action.CreateTag:
  //       canDo = false;
  //       this.processCreateTag(obj)
  //         .then(result=>{
  //           console.log('done processed tag');
  //           canDo = true;
  //           return;
  //         })
  //     case Action.ChangeNoteTitle:
  //       canDo = false;
  //     case Action.ChangeText:
  //       canDo = false;
  //     case Action.AddMainTags:
  //       canDo = false;
  //     case Action.AddOtherTags:
  //       canDo = false;
  //     case Action.RemoveMainTags:
  //       canDo = false;
  //     case Action.RemoveOtherTags:
  //       canDo = false;
  //     case Action.ChangeTagTitle:
  //       canDo = false;
  //     case Action.AddLinks:
  //       canDo = false;
  //     case Action.RemoveLinks:
  //       canDo = false;
  //     case Action.SetDone:
  //       canDo = false;
  //     case Action.DeleteNote:
  //       canDo = false;
  //     case Action.DeleteTag:
  //       canDo = false;
  //   }
  // }





//this were the ones I was working on.

  // public consumeLog(){
  //   if(this.secondLock==false){  /*so no problem on two that are doing the same things.*/
  //     this.secondLock = true;
  //     this.db.getThinsToDo().then(result=>{
  //       this.recordsToDo = result;
  //       let canDo: boolean = true;
  //       while(!this.recordsToDo.isEmpty && canDo && !this.lock){
  //         let obj = this.recordsToDo.peek();
  //         switch(obj.action){
  //           case Action.CreateNote:
  //             canDo = false;
  //             this.processCreateNote(obj)
  //             .then(result=>{
  //               console.log('done processed note');
  //               canDo = true;
  //               this.recordsToDo.dequeue();
  //               return;
  //             })
  //           case Action.CreateTag:
  //             canDo = false;
  //             this.processCreateTag(obj)
  //               .then(result=>{
  //                 console.log('done processed tag');
  //                 canDo = true;
  //                 this.recordsToDo.dequeue();
  //                 return;
  //               })
  //           case Action.ChangeNoteTitle:
  //             canDo = false;
  //           case Action.ChangeText:
  //             canDo = false;
  //           case Action.AddMainTags:
  //             canDo = false;
  //           case Action.AddOtherTags:
  //             canDo = false;
  //           case Action.RemoveMainTags:
  //             canDo = false;
  //           case Action.RemoveOtherTags:
  //             canDo = false;
  //           case Action.ChangeTagTitle:
  //             canDo = false;
  //           case Action.AddLinks:
  //             canDo = false;
  //           case Action.RemoveLinks:
  //             canDo = false;
  //           case Action.SetDone:
  //             canDo = false;
  //           case Action.DeleteNote:
  //             canDo = false;
  //           case Action.DeleteTag:
  //             canDo = false;
  //         }
  //       }
  //     })
  //     .catch(error=>{
  //       console.log('error while getting data to consume: ');
  //       console.log(JSON.stringify(error));
  //     })
  //   }
  // }
  //
  // private processCreateNote(obj: LogObject):Promise<any>{
  //   /*casted as NoteMin*/
  //   let note = <NoteMin>JSON.parse(obj.data);
  //   console.log('the note is');
  //   console.log(JSON.stringify(note));
  //   return this.atticNotes.createNote(note)
  //     .then(result=>{
  //       let noteMongoId = result._id;
  //       note._id = noteMongoId;
  //       return this.db.transactionProcessNote(obj.refNotesToSave, obj._id, note);
  //     })
  //     .then(transactionResult=>{
  //       console.log('ok, transaction:');
  //       console.log(JSON.stringify(transactionResult));
  //     })
  //     /*if an error happens also in the connection is ok, no transaction will start.*/
  //     .catch(error=>{
  //       console.log(JSON.stringify(error));
  //     })
  // }
  //
  //
  // private processCreateTag(obj: LogObject):Promise<any>{
  //   /*casted as NoteMin*/
  //   let tag = <TagMin>JSON.parse(obj.data);
  //   console.log('the tag is');
  //   console.log(JSON.stringify(tag));
  //   return this.atticTags.createTag(tag.title)
  //     .then(result=>{
  //       let noteMongoId = result._id;
  //       tag._id = noteMongoId;
  //       return this.db.transactionProcessTag(obj.refTagsToSave, obj._id, tag);
  //     })
  //     .then(transactionResult=>{
  //       console.log('ok, transaction:');
  //       console.log(JSON.stringify(transactionResult));
  //     })
  //     .catch(error=>{
  //       console.log(JSON.stringify(error));
  //     })
  // }
  //
  // public stop(){
  //
  // }

  /**
  how synch works:
  the server maintains, for notes and tags, a field called 'previous_title'
  the client push all the notes-title with the timestamp.
  Note:
  if local_timestamp and remote_timestamp are the same



  OR:
  push all the logs to the server, once is done,
  re-download everything.
  ----we  can optimize this part---- (of what we re-download)
  If an error occurs when pushing logs,
  the db is flushed and everything is re-downloaded from the server.
  */



}
