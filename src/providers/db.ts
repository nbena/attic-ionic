import { Injectable } from '@angular/core';
// import { Http } from '@angular/http';
import { SQLite, SQLiteObject } from '@ionic-native/sqlite';
import { Platform } from 'ionic-angular';
import { Query } from '../public/query';
import { Const, DbActionNs,/*SqliteError,*//* IndexTagType, */TagType } from '../public/const';
import { Utils } from '../public/utils';
import { NoteExtraMin, NoteFull, /*NoteSQLite,*/NoteMin, NoteExtraMinWithDate } from '../models/notes';
import { TagExtraMin, TagFull, /*TagMin,*/ TagAlmostMin/*, TagSQLite */} from '../models/tags';
import { UserSummary } from '../models/user_summary';
import { AtticError } from '../public/errors';


export class LogObjMin{

  note: string;
  userid: string;
  tag: string;
  action: DbActionNs.DbAction;
  role: string;
}

export class LobObjFull{
  note: NoteFull;
  userid: string;
  tag: TagExtraMin;
  action: DbActionNs.DbAction;
  role: string;
}

export class LogObjSmart{
  note: any;
  userid: string;
  tag: any;
  action: DbActionNs.DbAction;
  role: string;

  // constructor(){
  //
  // }

}

/*
  Generated class for the Db provider.

  See https://angular.io/docs/ts/latest/guide/dependency-injection.html
  for more info on providers and Angular 2 DI.
*/
@Injectable()
export class Db {

  open : boolean = false; /*to be sure everything is ok.*/
  //private db : SQLite;

  private db: SQLiteObject;

  // private logsCount: number = 0;
  // private notesCount: number = 0;
  // private tagsCount: number = 0;

  // private userid: string = null;
  // private token: any = null;

  private promise: Promise<SQLiteObject>;

  constructor(private platform: Platform, private sqlite:SQLite){
    console.log('Hello DbProvider');

    this.promise = new Promise<SQLiteObject>((resolve, reject)=>{
      let db: SQLiteObject;
      this.platform.ready()
      .then(()=>{
        return this.sqlite.create({
          name:"attic.db",
          location:"default"
        })
      })
      .then(dbObject=>{
        db = dbObject;
        return db.transaction(tx=>{
                        tx.executeSql('pragma foreign_keys = ON;',[]);
                        tx.executeSql(Query.CREATE_AUTH_TABLE,[]// ,(tx:any,res:any)=>{console.log('ok auth');}, (tx:any, error:any)=>{console.log(JSON.stringify(error))}
                        );
                        tx.executeSql(Query.CREATE_NOTES_TABLE,[]// ,(tx:any,res:any)=>{console.log('ok notes');},(tx:any, error:any)=>{console.log(JSON.stringify(error))}
                        )
                        tx.executeSql(Query.CREATE_TAGS_TABLE,[]//   ,(tx:any,res:any)=>{console.log('ok tags');},(tx:any, error:any)=>{console.log(JSON.stringify(error))}
                        );
                        tx.executeSql(Query.CREATE_LOGS_TABLE,[]// ,(tx:any,res:any)=>{console.log('ok logs');},(tx:any, error:any)=>{console.log(JSON.stringify(error))}
                        );
                        tx.executeSql(Query.CREATE_NOTES_HELP_TABLE,[]// ,(tx:any,res:any)=>{console.log('ok notes_help');},(tx:any, error:any)=>{console.log(JSON.stringify(error))}
                        );
                        tx.executeSql(Query.CREATE_TAGS_HELP_TABLE,[]// ,(tx:any,res:any)=>{console.log('ok tags_help');},(tx:any, error:any)=>{console.log(JSON.stringify(error))}
                        );
                        tx.executeSql(Query.CREATE_VIEW_COUNTS, []// ,(tx:any,res:any)=>{console.log('ok view');},(tx:any, error:any)=>{console.log(JSON.stringify(error))}
                        );
                        tx.executeSql(Query.CREATE_TRIGGER_DELETE_NOTE_COMPRESSION, []// ,(tx:any,res:any)=>{console.log('ok trigger1');},(tx:any, error:any)=>{console.log(JSON.stringify(error))}
                        );
                        tx.executeSql(Query.CREATE_TRIGGER_DELETE_TAG_COMPRESSION, []// ,(tx:any,res:any)=>{console.log('ok trigger2');},(tx:any, error:any)=>{console.log(JSON.stringify(error))}
                        );
                        tx.executeSql(Query.CREATE_INDEX_NOTE_1,[]);
                        tx.executeSql(Query.CREATE_INDEX_NOTE_2,[]);
                        tx.executeSql(Query.CREATE_INDEX_LOGS,[]);
        })
      })
      .then(txResult=>{
        this.open=true;
        this.db = db;
        resolve(this.db);
      })
      .catch(error=>{
        this.open = false;
        console.log('db error');console.log(JSON.stringify(error));console.log(JSON.stringify(error.message));
        reject(error);
      })
    })
  }


  // constructor(private platform: Platform, private sqlite: SQLite) {
  //   console.log('Hello Db Provider');
  //
  //   //if(!this.open) {
  //   this.promise = new Promise<SQLiteObject>((resolve, reject)=>{
  //     this.platform.ready().then(ready=>{
  //     //  let tempUserid: string = '';
  //       this.sqlite.create({name: "attic.db", location:"default"})
  //       .then(db=>{
  //       //   this.db=db;
  //       //   return Promise.resolve();
  //       // })
  //       // this.db.openDatabase(""
  //       //   {name: "attic.db", location: "default"})
  //           //.then(db=>{
  //           //.then(()=>{
  //             return /*this.*/db.transaction(tx=>{
  //               tx.executeSql('pragma foreign_keys = ON;',[]);
  //               tx.executeSql(Query.CREATE_AUTH_TABLE,[]
  //                 // ,(tx:any,res:any)=>{console.log('ok auth');},
  //                 // (tx:any, error:any)=>{console.log(JSON.stringify(error))}
  //               );
  //               tx.executeSql(Query.CREATE_NOTES_TABLE,[]
  //                 // ,(tx:any,res:any)=>{console.log('ok notes');},
  //                 // (tx:any, error:any)=>{console.log(JSON.stringify(error))}
  //               )
  //               tx.executeSql(Query.CREATE_TAGS_TABLE,[]
  //               //   ,(tx:any,res:any)=>{console.log('ok tags');},
  //               //   (tx:any, error:any)=>{console.log(JSON.stringify(error))}
  //               );
  //               //tx.executeSql(Query.CREATE_NOTES_TAGS_TABLE,[]);
  //               tx.executeSql(Query.CREATE_LOGS_TABLE,[]
  //                 // ,(tx:any,res:any)=>{console.log('ok logs');},
  //                 // (tx:any, error:any)=>{console.log(JSON.stringify(error))}
  //               );
  //
  //               tx.executeSql(Query.CREATE_NOTES_HELP_TABLE,[]
  //                 // ,(tx:any,res:any)=>{console.log('ok notes_help');},
  //                 // (tx:any, error:any)=>{console.log(JSON.stringify(error))}
  //               );
  //               tx.executeSql(Query.CREATE_TAGS_HELP_TABLE,[]
  //                 // ,(tx:any,res:any)=>{console.log('ok tags_help');},
  //                 // (tx:any, error:any)=>{console.log(JSON.stringify(error))}
  //               );
  //               tx.executeSql(Query.CREATE_VIEW_COUNTS, []
  //                 // ,(tx:any,res:any)=>{console.log('ok view');},
  //                 // (tx:any, error:any)=>{console.log(JSON.stringify(error))}
  //               );
  //               tx.executeSql(Query.CREATE_TRIGGER_DELETE_NOTE_COMPRESSION, []
  //                 // ,(tx:any,res:any)=>{console.log('ok trigger1');},
  //                 // (tx:any, error:any)=>{console.log(JSON.stringify(error))}
  //               );
  //               tx.executeSql(Query.CREATE_TRIGGER_DELETE_TAG_COMPRESSION, []
  //                 // ,(tx:any,res:any)=>{console.log('ok trigger2');},
  //                 // (tx:any, error:any)=>{console.log(JSON.stringify(error))}
  //               );
  //               tx.executeSql(Query.CREATE_INDEX_NOTE_1,[]);
  //               tx.executeSql(Query.CREATE_INDEX_NOTE_2,[]);
  //               tx.executeSql(Query.CREATE_INDEX_LOGS,[]);
  //             });
  //           })
  //           .then(transactionResult=>{
  //             // return this.db.executeSql(Query.GET_TOKEN, []);
  //             this.open=true;
  //             this.db = db;
  //             resolve(this.db);
  //             // return this.db.executeSql(Query.EMPTY_RESULT_SET, ['ciao']);
  //           })
  //
  //           // .then(()=>{
  //           //   console.log('not an error');
  //           //   resolve();
  //           // })
  //
  //           // .then(tokenResult=>{
  //           //   this.open = true;
  //           //   if(tokenResult.rows.length > 0){
  //           //   }else{
  //           //     resolve(this.db);
  //           //   }
  //           // })
  //           // .then(count=>{
  //           //   resolve(this.db);
  //           // })
  //           // .then(token=>{
  //           //   this.open=true;
  //           //   resolve(this.db)
  //           // })
  //           .catch(error=>{
  //             this.open=false;
  //             console.log('error in creating tables.');
  //             console.log(JSON.stringify(error.message));
  //             reject(error);
  //           })
  //     });
  //   })
  //   //});
  // }

// }
// private getLogsCount(userid: string):Promise<any>{
//   return this.db.executeSql(Query.GET_LOGS_COUNT,[userid]);
// }
//
// private getNotesCount(userid: string):Promise<any>{
//   return this.db.executeSql(Query.GET_NOTES_COUNT,[userid]);
// }
//
// private getTagsCount(userid: string):Promise<any>{
//   return this.db.executeSql(Query.GET_TAGS_COUNT,[userid]);
// }

public getNotesCount(userid: string):Promise<number>{
  return new Promise<number>((resolve, reject)=>{
    this.promise.then(db=>{
      return db.executeSql(Query.GET_NOTES_COUNT, [userid])
    })
    .then(result=>{
      if(result.rows.length <= 0){
        reject(new Error('empty result set notes count'));
      }else{
        resolve(result.rows.item(0).count);
      }
    })
    .catch(error=>{
      console.log('error in get notes count');
      console.log(JSON.stringify(error));
      reject(error);
    })
  })
}

public getTagsCount(userid: string):Promise<number>{
  return new Promise<number>((resolve, reject)=>{
    this.promise.then(db=>{
      return db.executeSql(Query.GET_TAGS_COUNT, [userid]);
    })
    .then(result=>{
      if(result.rows.length <= 0){
        reject(new Error('empty result set tags count'));
      }else{
        resolve(result.rows.item(0).count);
      }
    })
    .catch(error=>{
      console.log('error in get tags count');
      console.log(JSON.stringify(error));
      reject(error);
    })
  })
}

public getLogsCount(userid: string):Promise<number>{
  return new Promise<number>((resolve, reject)=>{
    this.promise.then(db=>{
      return this.db.executeSql(Query.GET_LOGS_COUNT, [userid]);
    })
    .then(result=>{
      if(result.rows.length <= 0){
        reject(new Error('empty result set'));
      }else{
        resolve(result.rows.item(0).count);
      }
    })
    .catch(error=>{
      console.log('error in get logs count');
      console.log(JSON.stringify(error));
      reject(error);
    })
  })
}

// private getLogsCountWrapper (userid: string){
//   return new Promise<any>((resolve, reject)=>{
//     this.getLogsCount()
//     .then(result=>{
//       this.logsCount = result.rows.item(0).count;
//       resolve();
//     })
//     .catch(error=>{
//       // console.log(JSON.stringify(error));
//       reject(error);
//     })
//   })
// }

// private getNotesCountWrapper(userid: string){
//   return new Promise<any>((resolve, reject)=>{
//     this.getNotesCount()
//     .then(result=>{
//       this.notesCount = result.rows.item(0).count;
//       resolve();
//     })
//     .catch(error=>{
//       // console.log(JSON.stringify(error));
//       reject(error);
//     })
//   })
// }
//
// private getTagsCountWrapper(userid: string){
//   return new Promise<any>((resolve, reject)=>{
//     this.getTagsCount()
//     .then(result=>{
//       this.tagsCount = result.rows.item(0).count;
//       resolve();
//     })
//     .catch(error=>{
//       // console.log(JSON.stringify(error));
//       reject(error);
//     })
//   })
// }
//
// private getNotesAndTagsCountWrapper(userid: string){
//   return new Promise<any>((resolve, reject)=>{
//     this.getNotesCount()
//     .then(()=>{
//       return this.getTagsCount()
//     })
//     .then(()=>{
//       resolve();
//     })
//     .catch(error=>{
//       reject(error);
//     })
//   })
// }



// private count(){
//   this.getLogsCount()
//   .then(result=>{
//     this.logsCount = result.rows.item(0).count;
//     return this.getNotesCount();
//   })
//   .then(result=>{
//     this.notesCount = result.rows.item(0).count;
//     return this.getTagsCount();
//   })
//   .then(result=>{
//     this.tagsCount = result.rows.item(0).count;
//     console.log(JSON.stringify([this.logsCount, this.notesCount, this.tagsCount]));
//   })
//   .catch(error=>{
//     console.log(JSON.stringify(error));
//   })
// }
// private count(userid: string):Promise<any>{
//   return this.getLogsCountAdvanced(userid)
//     .then(count=>{
//       this.logsCount = count;
//       return this.getNotesCountAdvanced(userid);
//     })
//     .then(count=>{
//       this.notesCount = count;
//       return this.getTagsCountAdvanced(userid);
//     })
//     .then(count=>{
//       this.tagsCount = count;
//       console.log('counts:');
//       console.log(JSON.stringify([this.logsCount, this.notesCount, this.tagsCount]));
//     });
// }

// public getNumberOfNotes(userid: string){
//   // return this.promise.then(db=>{
//   //   return this.notesCount;
//   // });
//   return new Promise<number>((resolve, reject)=>{
//     this.promise.then(db=>{
//       db.executeSql(Query.)
//     })
//   })
// }
//
// public getNumberOfTags(userid: string){
//   return this.promise.then(db=>{
//     return this.tagsCount;
//   });
// }
//
// public getNumberOfLogs(userid: string){
//   return this.promise.then(db=>{
//     return this.logsCount;
//   });
// }

// public setToken(token: any, userid: string):Promise<any>{
//   return this.db.executeSql(Query.INSERT_TOKEN, [token, userid]);
// }

// public getToken():Promise<any>{
//   return new Promise<any>((resolve, reject)=>{
//     this.db.executeSql(Query.GET_TOKEN, [])
//     .then(result=>{
//       console.log('the result is: ');
//       console.log(JSON.stringify(result));
//       if(result.rows.length <= 0){
//         reject(new Error(Const.ERR_TOKEN_NOT_FOUND));
//       }else{
//         resolve(result.rows.item(0));
//       }
//     })
//     .catch(error=>{
//       console.log('error in getting token');
//       console.log(JSON.stringify(error));
//       reject(error);
//     })
//   })
//
// }
/*use this because they are 'promise-safe'*/
/*JUST ONE WILL BE IN THE DB.*/
public getToken():Promise<any>{
  return new Promise<any>((resolve, reject)=>{

      this.promise.then(db=>{
        // if(this.userid !=null && this.token!=null){
        //   resolve({userid: this.userid, token: this.token});
        // }else{
        //   db.executeSql(Query.GET_TOKEN, [])
        //   .then(result=>{
        //     if(result.rows.length <= 0){
        //       resolve(null);
        //     }else{
        //       this.userid = result.rows.item(0).userid;
        //       this.token = result.rows.item(0).token;
        //       resolve({userid: this.userid, token: this.token});
        //     }
        //   })
        // }
        return db.executeSql(Query.GET_TOKEN, []);
      })
      .then(result=>{
        if(result.rows.length<=0){
          resolve(null);
        }else{
          resolve({userid: result.rows.item(0).userid,
                  token: result.rows.item(0).token
          });
        }
      })
      .catch(error=>{
        console.log('fail to get token');
        console.log(JSON.stringify(error));
        reject(error);
      })

  });
}

public setToken(token: string, userid: string):Promise<void>{
  // return new Promise<void>((resolve, reject)=>{
  //   try{
  //     this.promise.then(db=>{
  //       db.executeSql(Query.INSERT_TOKEN,[token, userid])
  //       .then(result=>{
  //         console.log('ok token set');
  //         resolve();
  //       })
  //     })
  //   }catch(e){
  //     if(e.message == AtticError.SQLITE_DUPLICATE_KEY_AUTH){
  //       //user is already there.
  //       this.db.executeSql(Query.INSERT_ONLY_TOKEN, [token, userid])
  //       .then(result=>{
  //         console.log('ok token set');
  //         resolve();
  //       })
  //       .catch(error=>{
  //         reject(error);
  //         /*don't know if it's correct.*/
  //       })
  //     }
  //     reject(e);
  //   }
  // })
  return new Promise<void>((resolve,reject)=>{
    let db2: SQLiteObject;
    this.promise.then(db=>{
      db2 = db;
      return db.executeSql(Query.INSERT_TOKEN, [token, userid])
    })
    .then(()=>{
      console.log('ok token set'); resolve();
    })
    .catch((error)=>{
      console.log('first error is');console.log(JSON.stringify(error));
      if(error.message == AtticError.SQLITE_DUPLICATE_KEY_AUTH || error==AtticError.SQLITE_DUPLICATE_KEY_AUTH){
        console.log('is found');
        db2.executeSql(Query.INSERT_ONLY_TOKEN, [token, userid])
        .then(()=>{console.log('ok token set');resolve();})
        .catch(error=>{reject(error);})
      }else{reject(error);}
    })
  })

}

/*
static readonly INSERT_NOTE = 'insert into notes(title, userid, text, creationdate, remote_lastmodificationdate, isdone, links, json_obj) values(?,?,?,?,?,?,?,?,?)';
title obviously here doesn't change, title either.
static readonly UPDATE_NOTE = 'update notes set text=?, remote_lastmodificationdate=?, isdone=?, links=?, json_obj=? where title=?';

static readonly UPDATE_TAG = 'update tags set title=?, userid=?, json_obj=? where title=?';

static readonly UPDATE_TAG_2 = 'update tags set json_obj=? where title=?';
static readonly UPDATE_NOTES_TAGS = 'update notes_tags set notetitle=?, tagtitle=?, role=?, userid=?, where notetitle=?, tagtitle=?';

static readonly INSERT_NOTES_TAGS = 'insert into notes_tags(notetitle,tagtitle, role, userid) values(?,?,?,?)';
*/

// private prepareQueryTagExistAndAreFull(length:number):string{
//   let result:string = Query.TAGS_EXIST_AND_ARE_FULL;
//   for(let i=0;i<length;i++){
//     result+='title=? or ';
//   }
//   result=result.substr(0, result.lastIndexOf('or '));
//   result+=')';
//   if(length==0){
//     result=Query.EMPTY_RESULT_SET;
//   }
//   console.log('result is '+result);
//   return result;
// }



// private prepareQueryInsertMultiTags(length:number):string{
//   let result:string = Query.INSERT_MULTI_TAGS;
//   for(let i=0;i<length;i++){
//     result+='(?,?,?),';
//   }
//   result = result.substr(0, result.length-1);
//   if(length==0){
//     result=Query.EMPTY_RESULT_SET;
//   }
//   return result;
// }

private static getArrayOfLogsByNoteFromRes(res:any):LogObjSmart[]{
  let logs:LogObjSmart[]=[];
  for(let i=0;i<res.rows.length;i++){
    let note:NoteExtraMinWithDate = NoteExtraMinWithDate.safeNewNoteFromJsonString(res.rows.item(i).json_object);
    let logObj = new LogObjSmart();
    logObj.note = note;
    logObj.action = DbActionNs.asDbActionFromString(res.rows.item(i).action);
    logs.push(logObj);
  }
  return logs;
}


//we can't use cache because it's unsafe.
/**
return all the logs associated with that note. The json of the note is
in each log object too.
*/
private getLogsByNote(title:string, userid:string, tx?:any):Promise<LogObjSmart[]>{
  return new Promise<LogObjSmart[]>((resolve, reject)=>{
    let logs:LogObjSmart[]=[];
    if(tx!=null){
      tx.executeSql(Query.GET_LOGS_BY_NOTE, [userid, title],
        (tx:any, res:any)=>{
          logs = Db.getArrayOfLogsByNoteFromRes(res);
          resolve(logs);
        },(tx:any, error:any)=>{console.log('error in get logs by notes');console.log(JSON.stringify(error));}
      )
    }else{
      this.db.executeSql(Query.GET_LOGS_BY_NOTE, [userid, title])
      .then(res=>{
        logs = Db.getArrayOfLogsByNoteFromRes(res);
        resolve(logs);
      })
      .catch(error=>{
        console.log('error in get logs by notes');console.log(JSON.stringify(error));
        reject(error);
      })
    }
  });
}

private updateJsonObjNoteIfAllowed(noteToUpdate:NoteFull,oldNote:NoteFull, userid:string):Promise<void>{
  return new Promise<void>((resolve, reject)=>{
    let finalNote:NoteFull=noteToUpdate.clone();
    this.getLogsByNote(noteToUpdate.title, userid)
    .then(logs=>{
      logs.forEach(obj=>{
        if(obj.action==DbActionNs.DbAction.change_text){
          finalNote.text=oldNote.text;
        }if(obj.action==DbActionNs.DbAction.set_link){
          finalNote.links=oldNote.links;
        }if(obj.action==DbActionNs.DbAction.set_done){
          finalNote.isdone=oldNote.isdone;
        }
      })
      return this.updateJsonObjNote(finalNote, userid, false) as Promise<void>;
    })
    .then(()=>{console.log('ok updated not if allowed');resolve();})
    .catch(error=>{console.log('error update note if allowed');console.log(JSON.stringify(error));reject(error)})
  })
}


//tag are no longer insterted because they aren't almost min so it's useless.
/**
From the given note it trys to find out if there's need to update (only if allowed,
that means, no pending mdofication on this. If any, only the other part of the note
will be touched.). If not found, a fresh insert will be done.
The tags of the note won't be inserted because they are just 'TagExtraMin' while
we require at least TagAlmostMin.
*/
public insertOrUpdateNote(note:NoteFull, userid:string):Promise<void>{
  return new Promise<void>((resolve, reject)=>{
    // let isPresent:boolean;
    let jsonNote:string = JSON.stringify(note);
    // let tags = note.maintags.concat(note.othertags);
    // let selectedTags:TagExtraMin[]=[];
    // let diffTags:TagExtraMin[]=[];
    // this.db.executeSql(Query.GET_NOTE_FULL_JSON, [note.title, userid])
    // .then(result=>{
    //   let p:Promise<void>;
    //   if(result.rows.length>0){isPresent=true;
    //     p=this.db.executeSql(Query.UPDATE_JSON_OBJ_NOTE_IF_NECESSARY, [jsonNote, jsonNote, note.title, userid]);
    //   }else{
    //     p=this.db.executeSql(Query.INSERT_INTO_NOTES_2, [note.title, jsonNote, note.text, note.lastmodificationdate, userid]);
    //     isPresent=false;}
    //   return p;
    // })
    this.getJsonObjNote(note.title, userid)
    .then(noteFull=>{
      let p:Promise<void>
      // if(noteFull!=null){console.log('is present');
      //   isPresent=true;
      //   p = this.updateJsonObjNoteIfAllowed(note, noteFull, userid);
      // }else{console.log('is not present');
      //   isPresent=false;
      //   p = this.db.executeSql(Query.INSERT_INTO_NOTES_2, [note.title, jsonNote, note.text, note.lastmodificationdate, userid]);
      // }
      if(noteFull==null){console.log('is not present');/*isPresent=false;*/
        p = this.db.executeSql(Query.INSERT_INTO_NOTES_2, [note.title, jsonNote, note.text, note.lastmodificationdate.toISOString(), userid]);
      }else if(noteFull instanceof NoteFull){console.log('is present and it\'s full');/*isPresent=true;*/
        p = this.updateJsonObjNoteIfAllowed(note, noteFull as NoteFull, userid);
      }else{console.log('is present and is min');
        p = this.updateJsonObjNote(note, userid, false) as Promise<void>;
      }
      return p;
    })


    // .then(result=>{
    //   console.log('executed the update of json');
    //   let p:Promise<any>;
    //   if(note.hasTags()){
    //     let query:string = this.prepareQueryTagExistAndAreFull(tags.length);
    //     p = this.db.executeSql(query, [userid].concat(tags.map(obj=>{return obj.title})));
    //   }else{
    //       console.log('the note has no tags');resolve();
    //       p=Promise.resolve();
    //   }
    //   return p;
    // })
    // .then(result=>{
    //   console.log('get the tag full');
    //   let p:Promise<void>;
    //
    //   if(!note.hasTags()){
    //     console.log('this note has no tags');
    //     p = Promise.resolve();
    //   }else{
    //     console.log('this note has tags, wait');
    //     for(let i=0;i<result.rows.length;i++){
    //       // let t:any = JSON.parse(result.rows.item(i).json_object);
    //       selectedTags.push(TagExtraMin.safeNewTagFromJsonString(result.rows.item(i)));
    //       diffTags = Utils.arrayDiff(tags,selectedTags, TagExtraMin.ascendingCompare);
    //       console.log('diff is:');
    //       console.log(JSON.stringify(diffTags));
    //       let query:string = this.prepareQueryInsertMultiTags(diffTags.length);
    //       p=this.db.executeSql(query, this.expandArrayTagsMinWithEverything(diffTags, userid));
    //     }
    //   }
    //   return p;
    // })
    .then(result=>{
      //now here I could update every other notes if necessary...but no.
      console.log('ok note inserted');
      resolve();
      // if(note.hasTags())
      //   resolve();
      /*else promise has been already resolved*/
    })
    .catch(error=>{
      console.log('error in insert note full');
      console.log(JSON.stringify(error.message));
      reject(error);
    })
  });
}

// public insertOrUpdateNote(note: NoteFull, userid: string):Promise<void>{
//   return new Promise<any>((resolve, reject)=>{
//     let isPresent: boolean;
//     this.db.executeSql(Query.NOTE_EXISTS, [note.title, userid])
//     .then(result=>{
//       let p:Promise<any>;
//       console.log('is present?');
//       if(result.rows.length > 0){
//         isPresent = true;
//         console.log('yes');
//         /*static readonly UPDATE_NOTE_2 = 'update notes set text=?, remote_lastmodificationdate=?, creationdate=?, isdone=?, links=?, json_object=? where title=? and json_object <> ? and userid=?';*/
//         p=this.db.executeSql(Query.UPDATE_NOTE_2,[note.text, note.lastmodificationdate, note.creationdate, note.isdone, note.links, JSON.stringify(note), note.title, JSON.stringify(note), userid]);
//       }else{
//         isPresent=false;
//         console.log('no');
//         /*  static readonly INSERT_NOTE = 'insert into notes(title, userid, text, creationdate, remote_lastmodificationdate, isdone, links, json_object) values(?,?,?,?,?,?,?,?)';*/
//         p=this.db.executeSql(Query.INSERT_NOTE, [note.title, userid, note.text, note.creationdate, note.lastmodificationdate, note.isdone, JSON.stringify(note.links), JSON.stringify(note)]);
//       }
//       return p;
//     })
//     .then(postInsert=>{
//       return Promise.all([
//         note.maintags.map((tag)=>{
//           console.log('currently I\'m working on main');
//           console.log(JSON.stringify(tag));
//           return this.db.executeSql(Query.TAG_EXISTS, [tag.title, userid])
//           .then(result=>{
//             if(result.rows.length==0){
//               /*static readonly INSERT_TAG_MIN = 'insert into tags(title, json_object) values (?,?)';*/
//               return this.db.executeSql(Query.INSERT_TAG_MIN, [tag.title, JSON.stringify(tag)]);
//             }
//           })
//           .then(secondResult=>{
//             /*  static readonly INSERT_NOTES_TAGS = 'insert into notes_tags(notetitle,tagtitle, role, userid) values(?,?,?,?);';*/
//             return  this.db.executeSql(Query.INSERT_NOTES_TAGS, [note.title, tag.title, 'mainTags', userid]);
//           })
//         })
//       ]);
//     })
//
//
//
//       .then((results)=>{
//         console.log('done with mnaintags');
//         return Promise.all([
//           note.othertags.map((tag)=>{
//             console.log('currently I\'m working on other');
//             console.log(JSON.stringify(tag));
//             return this.db.executeSql(Query.TAG_EXISTS, [tag.title, userid])
//             .then(result=>{
//               if(result.rows.length==0){
//                 return this.db.executeSql(Query.INSERT_TAG_MIN, [tag.title, JSON.stringify(tag)]);
//               }
//             })
//             .then(secondResult=>{
//               return  this.db.executeSql(Query.INSERT_NOTES_TAGS, [note.title, tag.title, 'otherTags', userid]);
//             })
//           })
//         ])
//       })
//       // .then(results=>{
//       //   return this.getNotesCountAdvanced(userid);
//       // })
//       // .then(notesCount=>{
//       //   this.notesCount = notesCount;
//       //   return this.getTagsCountAdvanced(userid);
//       // })
//       // .then(tagsCount=>{
//       //   this.tagsCount = tagsCount;
//       //   resolve(true);
//       // })
//       .then(results=>{
//         resolve();
//       })
//       .catch(error=>{
//         console.log('error:');
//         console.log(JSON.stringify(error));
//         reject(error);
//       })
//
//     })
// }

// @deprecate
// public createNewNote(note:NoteFull):Promise<any>{
//   return new Promise<any>((resolve, reject)=>{
//     this.db.transaction(tx=>{
//       tx.executeSql(Query.INSERT_NOTE, [note.title, note.userid, note.text, note.creationdate, note.lastmodificationdate, note.isdone, JSON.stringify(note.links), JSON.stringify(note)],
//       (tx:any, res:any)=>{
//         if(res){
//           console.log('res note is');
//           console.log(JSON.stringify(res));
//         }
//       }, (tx:any, err: any)=>{
//         if(err){
//           console.log('error in insert note');
//           console.log(JSON.stringify(err));
//         }
//       });
//
//       //'insert into logs (notetitle, action) values (?,?)';
//       tx.executeSql(Query.INSERT_NOTE_OLDTITLE_INTO_LOGS, [note.title, note.title, 'create'],
//       (tx:any, res:any)=>{
//         if(res){
//           console.log('res logs is');
//           console.log(JSON.stringify(res));
//         }
//       }, (tx:any, err: any)=>{
//         if(err){
//           console.log('error in insert log');
//           console.log(JSON.stringify(err));
//         }
//       });
//
//       note.maintags.map((tag)=>{
// //   = 'insert into notes_tags(notetitle,tagtitle, role) values(?,?,?);';
//         tx.executeSql(Query.INSERT_NOTES_TAGS, [note.title, tag.title, 'mainTags'],
//         (tx:any, res:any)=>{
//           if(res){
//             console.log('res maintags is');
//             console.log(JSON.stringify(res));
//           }
//         }, (tx:any, err: any)=>{
//           if(err){
//             console.log('error in insert maintag');
//             console.log(JSON.stringify(err));
//           }
//         });
//       });
//
//       note.othertags.map((tag)=>{
//         tx.executeSql(Query.INSERT_NOTES_TAGS, [note.title, tag.title, 'otherTags'],
//         (tx:any, res:any)=>{
//           if(res){
//             console.log('res other is');
//             console.log(JSON.stringify(res));
//           }
//         }, (tx:any, err: any)=>{
//                 if(err){
//                   console.log('error in insert othertag');
//                   console.log(JSON.stringify(err));
//                 }
//               });
//       });
//       //resolve(true);
//   })
//   .then(txResult=>{
//     console.log('tx completed, note created');
//     resolve(true);
//   })
//   .catch(error=>{
//     console.log('transaction error:');
//     console.log(JSON.stringify(error));
//     reject(error);
//   })
// })
// }

//tx: the transaction
//extraMin: the note from which the tag have to be removed
//userid: the userid
//tags: the tags to remove the note from.
//usedTags: the tags full found in the cache (it won't be got from the db)
//it:
/*
get the tag from the tag, remove note (if full), decrement noteslength, update them.
IMPORTANT: I assume that tags, if present, ARE ALREADY SORTED.
*/
private removeNoteFromTagsUpdateOnlyTagsCore(extraMin:NoteExtraMin[], userid:string,/*tags:TagExtraMin[], */usedTag:TagFull[], tx?:any){
  //usedTag = Utils.makeArraySafe(usedTag);
  //let tmpTag:TagExtraMin[]=Utils.binaryArrayDiff(tags, usedTag, TagExtraMin.ascendingCompare);

  // let lock = true;
  //let updatedTag:TagFull[]=[];

  // if(usedTag!=null){
  //   updatedTag=usedTag.map(obj=>{
  //     let tag:TagFull =obj;
  //     tag.removeNote(extraMin);
  //     if(tag.noteslength>0){tag.noteslength--;}
  //     return tag;
  //   })
  // }
  // let lock:boolean = true;
  // console.log('the tmp tags');console.log(JSON.stringify(tmpTag));
  // console.log('the basic tags to work on');console.log(JSON.stringify(tags));
  // console.log('the tmp tags');console.log(JSON.stringify(tmpTag));
  //
  // let p:Promise<void>;
  // if(tmpTag.length>0){
  //   let query:string = Query.prepareQueryTagExistAndAreFull(tmpTag.length);
  //   p=new Promise<void>((resolve, reject)=>{
  //     this.db.executeSql(query, [userid].concat(tmpTag.map(obj=>{return obj.title})))
  //     .then((res)=>{
  //       for(let i=0;i<res.rows.length;i++){
  //                 let rawTag:any = JSON.parse(res.rows.item(i).json_object);
  //                 if(rawTag.notes == null || rawTag.notes==undefined){rawTag.notes=[];}
  //                 if(rawTag.noteslength ==  null || rawTag.noteslength==undefined){rawTag.noteslength=0;}
  //                 let tag:TagFull = TagFull.safeNewTagFromJsObject(rawTag);
  //                 //console.log('tag is');console.log(JSON.stringify(tag));
  //                 usedTag.push(tag);
  //       }
  //     })
  //     .catch(error=>{
  //       console.log('error internal');console.log(JSON.stringify(error));console.log(JSON.stringify(error.message));
  //       reject(error);
  //     })
  //   })
  // }else{
  //   p=Promise.resolve();
  // }
  // p.then(()=>{
  //         if(usedTag!=null && usedTag.length>0){
  //           usedTag.forEach(tag=>{
  //             tag.removeNote(extraMin);
  //             this.updateJsonObjTag(tag, userid, tx);
  //           })
  //         }
  // })
  // .catch(error=>{
  //   console.log('error external');console.log(JSON.stringify(error));console.log(JSON.stringify(error.message));
  // })

  // if(tmpTag.length>0){//get full_tag from the db.
  //   let query:string = Query.prepareQueryTagExistAndAreFull(tmpTag.length);
  //   tx.executeSql(query, [userid].concat(tmpTag.map(obj=>{return obj.title}))
  //     ,(tx:any, res:any)=>{
  //       if(usedTag==null){usedTag=[];}
  //       for(let i=0;i<res.rows.length;i++){
  //         let rawTag:any = JSON.parse(res.rows.item(i).json_object);
  //         if(rawTag.notes == null || rawTag.notes==undefined){rawTag.notes=[];}
  //         if(rawTag.noteslength ==  null || rawTag.noteslength==undefined){rawTag.noteslength=0;}
  //         let tag:TagFull = TagFull.safeNewTagFromJsObject(rawTag);
  //         //console.log('tag is');console.log(JSON.stringify(tag));
  //         usedTag.push(tag);
  //
  //         //here I have the tag.
  //         // tag.removeNote(extraMin);
  //         // updatedTag.push(tag);
  //
  //       }
  //
  //       if(usedTag!=null && usedTag.length>0){
  //         usedTag.forEach(tag=>{
  //           tag.removeNote(extraMin);
  //           this.updateJsonObjTag(tag, userid, tx);
  //         })
  //
  //       //}
  //
  //       // for(let tag of updatedTag){
  //       //   this.updateJsonObjTag(tag, userid, tx);
  //       // }
  //       console.log('ok removed the note from tags');
  //       lock=false;
  //
  //     }, (tx:any, error:any)=>{console.log('error in get tag full to update');console.log(JSON.stringify(error));}
  // );


  //}
  // console.log('the true tags to update are:');console.log(JSON.stringify(usedTag));
  // if(usedTag!=null && usedTag.length>0){
  //   //update each object;
  //   usedTag.forEach(obj=>{
  //     let tag:TagFull =  obj;
  //     tag.removeNote(extraMin);
  //     // if(tag.noteslength>0){tag.noteslength--;}
  //     updatedTag.push(tag);
  //   })
  // }
  // if(updatedTag.length>0 && !lock){
  //
  // console.log('the updated tag are: ');console.log(JSON.stringify(updatedTag));
  //   for(let i=0;i<updatedTag.length;i++){
  //     this.updateJsonObjTag(updatedTag[i], userid, tx);
  //   }
  // }
  usedTag.forEach(tag=>{
    for(let i=0;i<extraMin.length;i++){
      tag.removeNote(extraMin[i]); //noteslength is already decreased by this method.
    }
    this.updateJsonObjTag(tag, userid, tx);
  })
}


private addTagsToNoteUpdateOnlyTagsCore(extraMin:NoteExtraMin, userid:string,tags:TagFull[],tx?:any){
  //
  // console.log('the tags to work on: ');console.log(JSON.stringify(tags));
  //
  // //TmpTag contains the list of the tags that need to be got from the db.
  // Utils.makeArraySafe(usedTag);
  // let tmpTag:TagExtraMin[]=Utils.arrayDiff(tags, usedTag, TagExtraMin.ascendingCompare);
  //
  // // let updatedTag:TagFull[]=[];
  // console.log('the usedtag');console.log(JSON.stringify(usedTag));
  //
  // if(tmpTag.length>0){//get full_tag from the db.
  //   let query:string = Query.prepareQueryTagExistAndAreFull(tmpTag.length);
  //   tx.executeSql(query, [userid].concat(tmpTag.map(obj=>{return obj.title}))
  //     ,(tx:any, res:any)=>{
  //       // console.log('the res:');console.log(JSON.stringify(res.rows.length));
  //       if(usedTag==null){usedTag=[];}
  //       for(let i=0;i<res.rows.length;i++){
  //         let rawTag:any = JSON.parse(res.rows.item(i).json_object);
  //         if(rawTag.notes == null){rawTag.notes=[];}
  //         if(rawTag.noteslength ==  null){rawTag.noteslength=0;}
  //         let tag:TagFull = TagFull.safeNewTagFromJsObject(rawTag);
  //         // console.log('item:');console.log(JSON.stringify(tag));
  //         usedTag.push(tag);
  //       }
  //
  //       console.log('the usedTag here');console.log(JSON.stringify(usedTag));
  //
  //
  //       if(usedTag!=null && usedTag.length>0){
  //         //update each object;
  //         usedTag.forEach(tag=>{
  //           // console.log('now I update the object: ');console.log(JSON.stringify(obj));
  //           // let tag:TagFull =  obj;
  //           tag.notes.push(extraMin);
  //           tag.noteslength++;
  //           // updatedTag.push(tag);
  //
  //           console.log('the updated tag is');console.log(JSON.stringify(tag));
  //
  //           this.updateJsonObjTag(tag, userid, tx);
  //         })
  //       }
  //
  //       // console.log('finally, the tag to update:');console.log(JSON.stringify(updatedTag));
  //       // if(updatedTag.length>0){
  //       //   //// let query:string = this.prepareQueryInsertMultiTags(updatedTag.length);
  //       //   //// console.log('and the query: '+query);
  //       //   for(let i=0;i<updatedTag.length;i++){
  //       //     this.updateJsonObjTag(updatedTag[i], userid, tx);
  //       //   }
  //       // }
  //
  //
  //     }, (tx:any, error:any)=>{console.log('error in get tag full to update');console.log(JSON.stringify(error));}
  // );
  // }

  // console.log('used tag:');console.log(JSON.stringify(usedTag));
  // return new Promise<void>((resolve, reject)=>{
  // Utils.makeArraySafe(usedTag);
  // let tmpTag:TagExtraMin[]=Utils.arrayDiff(tags, usedTag, TagExtraMin.ascendingCompare);
  // console.log('the basic tags to work on');console.log(JSON.stringify(tags));
  // console.log('the tmp tags');console.log(JSON.stringify(tmpTag));
  // let p:Promise<void>;
  // if(tmpTag.length>0){
  //   let query:string = Query.prepareQueryTagExistAndAreFull(tmpTag.length);
  //   p=new Promise<void>((resolve, reject)=>{
  //     this.db.executeSql(query, [userid].concat(tmpTag.map(obj=>{return obj.title})))
  //     .then((res)=>{
  //       if(usedTag==null){usedTag=[]}
  //       console.log('the result from the db');console.log(JSON.stringify(res));
  //       for(let i=0;i<res.rows.length;i++){
  //         console.log('the json');console.log(JSON.stringify(res.rows.item(i).json_object));
  //                 let rawTag:any = JSON.parse(res.rows.item(i).json_object);
  //                 if(rawTag.notes == null || rawTag.notes==undefined){rawTag.notes=[];}
  //                 if(rawTag.noteslength ==  null || rawTag.noteslength==undefined){rawTag.noteslength=0;}
  //                 let tag:TagFull = TagFull.safeNewTagFromJsObject(rawTag);
  //                 console.log('tag is');console.log(JSON.stringify(tag));
  //                 usedTag.push(tag);
  //       }
  //       resolve();
  //     })
  //     .catch(error=>{
  //       console.log('error internal');console.log(JSON.stringify(error));console.log(JSON.stringify(error.message));
  //       reject(error);
  //     })
  //   })
  // }else{
  //   p=Promise.resolve();
  // }
  // p.then(()=>{
  //   console.log('the used tag');console.log(JSON.stringify(usedTag));
  //         if(usedTag!=null && usedTag.length>0){
  //           usedTag.forEach(tag=>{
  //             console.log('tag before update is');console.log(JSON.stringify(tag));
  //             tag.noteslength++;
  //             tag.notes.push(extraMin);
  //             console.log('tag post update is');console.log(JSON.stringify(tag));
  //             this.updateJsonObjTag(tag, userid, tx);
  //           })
  //         }
  // })
  // .catch(error=>{
  //   console.log('error external');console.log(JSON.stringify(error));console.log(JSON.stringify(error.message));
  // })
  // resolve();
  //})

  tags.forEach(tag=>{
    tag.notes.push(extraMin);
    tag.noteslength++;
    this.updateJsonObjTag(tag, userid, tx);
  })


}

private getNotesFullByTitle(notes:NoteExtraMin[], usedNotes:NoteFull[], userid:string):Promise<NoteFull[]>{
  return new Promise<NoteFull[]>((resolve, reject)=>{
    let tmpNotes:NoteExtraMin[]=Utils.binaryArrayDiff(notes, usedNotes, NoteExtraMin.ascendingCompare);
    let p:Promise<void>;
    if(tmpNotes.length>0){
      let query:string = Query.prepareQueryNoteExistAndAreFull(tmpNotes.length);
      p=new Promise<void>((resolve, reject)=>{
        this.db.executeSql(query, [userid].concat(tmpNotes.map(obj=>{return obj.title})))
        .then((res)=>{
          if(usedNotes==null){usedNotes=[]}
          //let t = this.getNoteF
          let array:NoteFull[]=Db.getNotesFullFromResArray(res);
          usedNotes=usedNotes.concat(array);
          resolve();
        })
        .catch(error=>{
          console.log('error internal');console.log(JSON.stringify(error));console.log(JSON.stringify(error.message));
          reject(error);
        })
      })
    }else{
      p=Promise.resolve();
    }
    p.then(()=>{resolve(usedNotes)});
    p.catch(error=>{
      console.log('error in get notes by title');console.log(JSON.stringify(error));console.log(JSON.stringify(error.message));
      reject(error);
    })
  })
}

/**
returns an array of tagfull with that name (provided by tags). If the tag is not full,
the behaviour is decided by the last param: if true a new tag full will be created,
if false, it won't be added to the final array.
*/
private getTagsFullByTitle(tags:TagExtraMin[], usedTag:TagFull[], userid:string, addIfNotFull:boolean):Promise<TagFull[]>{
  return new Promise<TagFull[]>((resolve, reject)=>{
    let tmpTag:TagExtraMin[]=Utils.binaryArrayDiff(tags, usedTag, TagExtraMin.ascendingCompare);
    let p:Promise<void>;
    if(tmpTag.length>0){
      let query:string = Query.prepareQueryTagExistAndAreFull(tmpTag.length);
      p=new Promise<void>((resolve, reject)=>{
        this.db.executeSql(query, [userid].concat(tmpTag.map(obj=>{return obj.title})))
        .then((res)=>{
          if(usedTag==null){usedTag=[]}
          // console.log('the result from the db');console.log(JSON.stringify(res));
          for(let i=0;i<res.rows.length;i++){
            // console.log('the json');console.log(JSON.stringify(res.rows.item(i).json_object));
            let tag:TagFull=null;
                    let rawTag:any = JSON.parse(res.rows.item(i).json_object);
                    if(addIfNotFull){
                      if(rawTag.notes == null || rawTag.notes==undefined){rawTag.notes=[];}
                      if(rawTag.noteslength ==  null || rawTag.noteslength==undefined){rawTag.noteslength=0;}
                      tag = TagFull.safeNewTagFromJsObject(rawTag);
                    }else{
                      if(rawTag.notes!=null){
                        tag = TagFull.safeNewTagFromJsObject(rawTag);
                      }
                    }
                    if(tag!= null){
                      usedTag.push(tag);
                    }
                    // console.log('tag is');console.log(JSON.stringify(tag));
          }
          resolve();
        })
        .catch(error=>{
          console.log('error internal');console.log(JSON.stringify(error));console.log(JSON.stringify(error.message));
          reject(error);
        })
      })
    }else{
      p=Promise.resolve();
    }
    p.then(()=>{resolve(usedTag)});
    p.catch(error=>{
      console.log('error in get tag by title');console.log(JSON.stringify(error));console.log(JSON.stringify(error.message));
      reject(error);
    })
  })
}

/**
From the given it gets the list of its tags. UsedTag may be empty and contains
a list of the tag (that belong to the note) already full. It checks wheter there's
need to get other tags full from the db (eg: the list is not complete) and it returns
a promise that contains the complete list of tag full of the notes.
*/
private getTagsFullByNote(note:NoteFull|NoteMin, usedTag:TagFull[], userid:string):Promise<TagFull[]>{
  return new Promise<TagFull[]>((resolve, reject)=>{
    //let usedTag:TagFull[]=[];
    let noteF:NoteFull;
    if(note instanceof NoteMin){
      noteF=note.upgrade();
    }else{
      noteF=note;
    }

    let tags:TagExtraMin[]=noteF.getTagsAsTagsExtraMinArray().sort(TagExtraMin.ascendingCompare);
    let tmpTag:TagExtraMin[]=Utils.binaryArrayDiff(tags, usedTag,TagExtraMin.ascendingCompare);
    let p:Promise<void>;
    if(tmpTag.length>0){
        let query:string = Query.prepareQueryTagExistAndAreFull(tmpTag.length);
        p=new Promise<void>((resolve, reject)=>{
          this.db.executeSql(query, [userid].concat(tmpTag.map(obj=>{return obj.title})))
          .then((res)=>{
            if(usedTag==null){usedTag=[]}
            // console.log('the result from the db');console.log(JSON.stringify(res));
            for(let i=0;i<res.rows.length;i++){
              // console.log('the json');console.log(JSON.stringify(res.rows.item(i).json_object));
                      let rawTag:any = JSON.parse(res.rows.item(i).json_object);
                      if(rawTag.notes == null || rawTag.notes==undefined){rawTag.notes=[];}
                      if(rawTag.noteslength ==  null || rawTag.noteslength==undefined){rawTag.noteslength=0;}
                      let tag:TagFull = TagFull.safeNewTagFromJsObject(rawTag);
                      // console.log('tag is');console.log(JSON.stringify(tag));
                      usedTag.push(tag);
            }
            resolve();
          })
          .catch(error=>{
            console.log('error internal');console.log(JSON.stringify(error));console.log(JSON.stringify(error.message));
            reject(error);
          })
        })
    }else{
      p=Promise.resolve();
    }
    p.then(()=>{
      resolve(usedTag);
    })
    p.catch(error=>{
      console.log('error in get tag for note');console.log(JSON.stringify(error));console.log(JSON.stringify(error.message));
      reject(error);
    })
  })
}

//usedTag contains the tagfull found in the cache, so I just have to update them and not get from the db.
public createNewNote2(note:NoteFull, userid:string, usedTag?:TagFull[]):Promise<void>{
  console.log('received as help');
  console.log(JSON.stringify(usedTag));
  usedTag = Utils.makeArraySafe(usedTag);

  return new Promise<void>((resolve, reject)=>{


    this.getTagsFullByNote(note, usedTag, userid)
    .then(tags=>{
      console.log('the tags to update are');console.log(JSON.stringify(tags));
      return this.db.transaction(tx=>{
        let jsonNote:string = JSON.stringify(note);
        let extraMin:NoteExtraMin=note.forceCastToNoteExtraMin();

        this.addTagsToNoteUpdateOnlyTagsCore(extraMin, userid, tags, tx);

        //skip lastmodificationdate cause it(should be) is done by the db.
        tx.executeSql(Query.INSERT_NOTE_2, [note.title, note.text,jsonNote,note.lastmodificationdate.toISOString(), userid],
          (tx:any, res:any)=>{console.log('inserted new note')},
          (tx:any, error:any)=>{console.log('error in insert new note');console.log(JSON.stringify(error))}
        );

        tx.executeSql(Query.INSERT_NOTE_OLDTITLE_INTO_LOGS, [note.title, note.title, 'create', userid],
          (tx:any, res:any)=>{console.log('ok inserted note into logs');},
          (tx:any, error:any)=>{console.log('error insert note into logs');console.log(JSON.stringify(error));}
          )
      })
    })

    .then(result=>{
      console.log('ok new note created');
      resolve();
    })
    .catch(error=>{
      console.log('error in create new note');
      console.log(JSON.stringify(error.message));
      console.log(JSON.stringify(error));
      reject(error);
    })
  })
}


// public createNewNote2(note:NoteFull, tags:TagAlmostMin[], userid: string):Promise<void>{
//   return new Promise<any>((resolve, reject)=>{
//     this.db.transaction(tx=>{
//       /*p=this.db.executeSql(Query.INSERT_NOTE, [note.title, note.userid, note.text, note.creationdate, note.lastmodificationdate, note.isdone, note.links, JSON.stringify(note)]);*/
//       /* insert into notes(title, userid, text, creationdate, remote_lastmodificationdate, isdone, links, json_object) values(?,?,?,?,?,?,?,?,?)';*/
//       tx.executeSql(Query.INSERT_NOTE, [note.title, userid, note.text, note.creationdate, note.lastmodificationdate, note.isdone, JSON.stringify(note.links), JSON.stringify(note)],
//       (tx:any, res:any)=>{
//         if(res){
//           console.log('res note is');
//           console.log(JSON.stringify(res));
//         }
//       }, (tx:any, err: any)=>{
//           console.log('error in insert note');
//           console.log(JSON.stringify(err));
//       });
//
//       /*'insert into logs (notetitle, action) values (?,?)';*/
//       tx.executeSql(Query.INSERT_NOTE_OLDTITLE_INTO_LOGS, [note.title, note.title, 'create', userid],
//       (tx:any, res:any)=>{
//         if(res){
//           console.log('res logs is');
//           console.log(JSON.stringify(res));
//         }
//       }, (tx:any, err: any)=>{
//           console.log('error in insert log');
//           console.log(JSON.stringify(err));
//       });
//
//       note.maintags.forEach((tag)=>{
// /*   = 'insert into notes_tags(notetitle,tagtitle, role) values(?,?,?);';*/
//         // tx.executeSql(Query.INSERT_NOTES_TAGS, [note.title, tag.title, 'mainTags', userid],
//         // (tx:any, res:any)=>{
//         //   if(res){
//         //     console.log('res maintags is');
//         //     console.log(JSON.stringify(res));
//         //   }
//         // }, (tx:any, err: any)=>{
//         //     console.log('error in insert maintag');
//         //     console.log(JSON.stringify(err));
//         // });
//
//         tx.executeSql(Query.UPDATE_JSON_OBJ_TAG,[JSON.stringify(tag), tag.title, userid],
//         (tx:any, res:any)=>{
//           if(res){
//             console.log('res json maintags is');
//             console.log(JSON.stringify(res));
//           }
//         }, (tx:any, err: any)=>{
//             console.log('error in update json_obj maintag');
//             console.log(JSON.stringify(err));
//         })
//         // this.updateFullTag(tx, tag, userid);
//       });
//
//       note.othertags.forEach((tag)=>{
//         // tx.executeSql(Query.INSERT_NOTES_TAGS, [note.title, tag.title, 'otherTags', userid],
//         // (tx:any, res:any)=>{
//         //   if(res){
//         //     console.log('res other is');
//         //     console.log(JSON.stringify(res));
//         //   }
//         // }, (tx:any, err: any)=>{
//         //       console.log('error in insert othertag');
//         //       console.log(JSON.stringify(err));
//         //     });
//         tx.executeSql(Query.UPDATE_JSON_OBJ_TAG,[JSON.stringify(tag), tag.title, userid],
//         (tx:any, res:any)=>{
//           if(res){
//             console.log('res othertags obj is');
//             console.log(JSON.stringify(res));
//           }
//         }, (tx:any, err: any)=>{
//               console.log('error in update json_obj othertag');
//               console.log(JSON.stringify(err));
//             })
//       });
//       //resolve(true);
//   })
//   // .then(txResult=>{
//   //   /*update the note count.*/
//   //   return this.getNotesCountAdvanced(userid);
//   // })
//   .then(notesCount=>{
//     // this.notesCount = notesCount;
//     console.log('tx completed, note created');
//     resolve();
//   })
//   .catch(error=>{
//     console.log('transaction error:');
//     console.log(JSON.stringify(error));
//     reject(error);
//   })
// })
// }


public isNoteFull(title: string, userid: string):Promise<boolean>{
  return new Promise<boolean>((resolve, reject)=>{
    /*return */this.db.executeSql(Query.NOTE_EXISTS_AND_IS_FULL,[title, userid])
    .then(result=>{
      if(result.rows.item(0).text == null || result.rows.length == 0){
        resolve(false);
      }else{
        resolve(true);
      }
    })
    .catch(error=>{
      reject(error);
    })
  });
}

public isTagFull(title: string, userid: string):Promise<boolean>{
  return new Promise<boolean>((resolve, reject)=>{
    /*return */this.db.executeSql(Query.TAG_EXISTS_AND_IS_FULL,[title, userid])
    .then(result=>{
      if(result.rows.item(0).json_object == null){
        resolve(false);
      }else{
        resolve(true);
      }
    })
    .catch(error=>{
      reject(error);
    })
  });
}

private getJsonObjNote(title:string, userid:string):Promise<NoteExtraMinWithDate>{
  return new Promise<NoteExtraMinWithDate>((resolve, reject)=>{
    let note:any;
    this.db.executeSql(Query.GET_NOTE_FULL_JSON, [title, userid])
    .then(res=>{
      if(res.rows.length<=0){resolve(null);}
      let raw:any = JSON.parse(res.rows.item(0).json_object);
      if(raw.text==null){note = NoteExtraMinWithDate.safeNewNoteFromJsObject(raw);}
      else{note = NoteFull.safeNewNoteFromJsObject(raw);}
      resolve(note);
    })
    .catch(error=>{
      console.log('error in get note json_obj');console.log(JSON.stringify(error));resolve(null);
    })
  })
}


private static getNoteFullFromRes(res:any, index?:number):NoteFull{
  /*try the parsing.*/
  let note:NoteFull=null;
  if(res.rows.length>0){
    let rawResult:any;
    if(index!=null){
      rawResult = JSON.parse(res.rows.item(index).json_object);
    }else{
      rawResult = JSON.parse(res.rows.item(0).json_object);
    }
    if(rawResult.text == null || !rawResult.text || rawResult.text == undefined){
      console.log('throw the error, note is not full!');
    }else{
      /*if here the note is ok.*/
      note = NoteFull.safeNewNoteFromJsObject(rawResult);
    }
  }
  return note;
}

private static getNotesFullFromResArray(res:any):NoteFull[]{
  let ret:NoteFull[]=[];
  for(let i=0;i<res.rows.length;i++){
    let note=this.getNoteFullFromRes(res, i);
    if(note!=null){
      ret.push(note);
    }
  }
  return ret;
}


/*
if not full, I will return null.
*/
public getNoteFull(title: string, userid: string):Promise<NoteFull>{
  return new Promise<NoteFull>((resolve, reject)=>{
    // this.db.executeSql(Query.GET_NOTE_FULL_JSON, [title, userid])
    // .then(result=>{
    //   resolve(Db.getNoteFullFromRes(result));
    // })
    // .catch(error=>{
    //   reject(error);
    // })
    this.getNotesFullByTitle([new NoteExtraMin(title)], [], userid)
    .then(notes=>{
      if(notes.length>0){
        resolve(notes[0]);
      }else{
        resolve(null);
      }
    })
    .catch(error=>{
      reject(error);
    })
  });
}


// private getNoteFullTx(tx:any, title:string, userid:string):NoteFull{
//   let note:NoteFull;
//   tx.executeSql(Query.GET_NOTE_FULL_JSON, [title, userid],
//     (tx:any, res:any)=>{
//       return Db.getNoteFullFromRes(res);
//     },(err:any, res:any)=>{console.log('err in get note full tx');console.log(JSON.stringify(err))}
//   )
// }

private static getTagFullFromRes(result:any):TagFull{
  let tag:TagFull=null;
  if(result.rows.length>0){
    let rawResult:any = JSON.parse(result.rows.item(0).json_object);
    /*check if it's full.*/
    if(rawResult.notes == null || rawResult.notes.length < 0 || rawResult.notes == undefined){
      console.log('throw the error, tag is not full!');
    }else{
      tag = TagFull.safeNewTagFromJsObject(rawResult);
    }
  }
  console.log('the tag that I get is');console.log(JSON.stringify(tag));
  return tag;
}

public getTagFull(title: string, userid: string):Promise<TagFull>{
  return new Promise<TagFull>((resolve, reject)=>{
    // console.log('the title here is');console.log(title);
    // this.db.executeSql(Query.GET_TAG_FULL_JSON, [title, userid])
    // .then(result=>{
    //   resolve(Db.getTagFullFromRes(result));
    // })
    // .catch(error=>{
    //   reject(error);
    // })
    this.getTagsFullByTitle([new TagExtraMin(title)],[],userid, false)
    .then(tags=>{
      if(tags.length>0){
        resolve(tags[0]);
      }else{
        resolve(null);
      }
    })
    .catch(error=>{
      reject(error);
    })
  });
}

// public insertTagMin(tag: TagExtraMin):Promise<any>{
//
// }

/*
static readonly INSERT_NOTE_MIN = 'insert into notes(itle, json_obj) values (?,?)';
*/
// public insertNoteMin(note: NoteExtraMin):Promise<any>{
//   return this.isNoteFull(note.title)
//     .then(result=>{
//       if(result==false){
//         console.log('note isn\'t full');
//         return this.db.executeSql(Query.INSERT_NOTE_MIN, [note.title, JSON.stringify(note)]);
//       }else{
//         /*do nothing*/
//         console.log('note is full');
//       }
//     })
//     // .catch(error=>{
//     //   console.log(JSON.stringify(error));
//     // })
// }

/*
this differ form notesMin because when we download a tag from the server, the title can be same
but the notesLength (and so the json_object) can be changed, so try to update it if it's different.
Notes has not this problem because their json_object is made of the title and nothing more.
*/
// public insertTagMinQuietly(tag: TagAlmostMin, userid: string):Promise<any>{
//   return new Promise<any>((resolve, reject)=>{
//     this.db.executeSql(Query.INSERT_TAG_MIN,[tag.title, JSON.stringify(tag), userid])
//     .then(result=>{
//       /*nothing to do.*/
//       return this.getTagsCountAdvanced(userid);
//     })
//     .then(count=>{
//       this.tagsCount = count;
//       resolve(true);
//     })
//     .catch(error=>{
//       console.log('error in inserting tags: ');
//       console.log(JSON.stringify(error));
//       if(error.message.search(Const.UNIQUE_FAILED)>=0){
//         console.log('already there.');
//         /*ok, constraint violation, the note is already there.*/
//         /*maybe the json_object is changed, trying to update.*/
//         this.db.executeSql(Query.UPDATE_TAG_2, [JSON.stringify(tag), tag.title, JSON.stringify(tag), userid])
//         .then(result=>{
//           console.log('ok');
//           resolve(true);
//         })
//         .catch(error=>{
//           /*don't know if this catch is necessary...*/
//           console.log('error insert min tags');
//           reject(error);
//         })
//
//       }else{
//         reject(error);
//       }
//     })
//   })
// }

// public insertNoteMinQuietly(note: NoteExtraMin, userid: string):Promise<any>{
//   return new Promise<any>((resolve, reject)=>{
//     this.db.executeSql(Query.INSERT_NOTE_MIN,[note.title, JSON.stringify(note), userid])
//     .then(result=>{
//       /*nothing to do.*/
//       return this.getNotesCountAdvanced(userid);
//     })
//     .then(count=>{
//       this.notesCount = count;
//       resolve(true);
//     })
//     .catch(error=>{
//       console.log('error in inserting note min:'),
//       console.log(JSON.stringify(error));
//       if(error.message.search(Const.UNIQUE_FAILED)>=0){
//         /*ok, constraint violation, the note is already there.*/
//         console.log('already there.');
//         resolve(true);
//       }else{
//         console.log('error othe kind');
//         console.log(JSON.stringify(error));
//         reject(error);
//       }
//     })
//   })
// }

/*
private prepareQueryInsertNotesMinQuietly(length:number, userid:string):string{
  let query:string = Query.INSERT_NOTE_MIN_2;
  for(let i=0;i<length;i++){
    query += '(?,?,'+userid+'),';
  }
  query = query.substr(0, query.length-1);
  return query;
}
*/

// private expandArrayNotesMinWithoutUserAndJson(notes:NoteExtraMin[]):string[]{
//   let array:string[]=[];
//   notes.forEach((currentValue)=>{
//     array.push(currentValue.title);
//     array.push(JSON.stringify(currentValue));
//   });
//   return array;
// }

// private expandArrayNotesMinWithoutJsonAndUser(notes:NoteExtraMin[], userid:string):string[]{
//   let array:string[]=[];
//   notes.forEach((currentValue)=>{
//     array.push(currentValue.title);
//     array.push(userid);
//   });
//   return array;
// }

private expandArrayNotesMinWithEverything(notes:NoteExtraMinWithDate[], userid:string):string[]{
  let array:string[]=[];
  for(let i=notes.length-1;i>=0;i--){
    array.push(notes[i].title);
    array.push(JSON.stringify(notes[i]));
    array.push(notes[i].lastmodificationdate.toISOString());
    array.push(userid);
  }
  return array;
}

// private expandArrayNotesMinWithEverything(notes:NoteExtraMinWithDate[], userid:string):string[]{
//   let array:string[]=[];
//   for(let i=notes.length-1;i>=0;i--){
//     array.push(notes[i].title);
//     array.push(JSON.stringify(notes[i]));
//     array.push(JSON.stringify(notes[i].lastmodificationdate));
//     array.push(userid);
//   }
//   return array;
// }

// private expandArrayTagsMinWithEverything(tags:TagExtraMin[], userid:string):string[]{
//   let array:string[]=[];
//   for(let i=tags.length-1;i>=0;i--){
//     array.push(tags[i].title);
//     array.push(JSON.stringify(tags[i]));
//     array.push(userid);
//   }
//   return array;
// }
//
//
// private prepareQueryInsertIntoHelp(baseQuery: string, length:number, userid:string, questionMark:number):string{
//   for(let i=0;i<length;i++){
//     //baseQuery += '(?,?,?,?),';
//
//     let temp:string='?,'.repeat(questionMark);
//     temp=temp.substr(0, temp.length-1);
//     temp = '('+temp+'),';
//     baseQuery+=temp;
//   }
//   baseQuery = baseQuery.substr(0, baseQuery.length-1);
//   return baseQuery;
// }


public insertNotesMinSmartAndCleanify(notes: NoteExtraMinWithDate[], userid: string):Promise<void>{
  // console.log('the input to insert');console.log(JSON.stringify(notes));
  return new Promise<void>((resolve, reject)=>{
    this.db.transaction(tx=>{
      /*first insert into notes_help*/
      let query:string = Query.prepareQueryInsertIntoHelp(Query.INSERT_INTO_NOTES_HELP, notes.length, userid, 4);
      tx.executeSql(query, this.expandArrayNotesMinWithEverything(notes, userid),
        (tx:any, res:any)=>{console.log('ok insert into notes_help');},
        (tx:any, error:any)=>{
          console.log('error in insert notes_help');
          console.log(JSON.stringify(error));
        }
    );
    tx.executeSql(Query.SMART_NOTES_MIN_INSERT, [userid],
      (tx:any, res:any)=>{console.log('ok insert into notes_min');},
      (tx:any, error:any)=>{
        console.log('error in insert notes_min');
        console.log(JSON.stringify(error));
      }
    );
    tx.executeSql(Query.SMART_NOTES_REMOVE_DIRTY, [userid],
      (tx:any, res:any)=>{console.log('ok insert into notes_min');},
      (tx:any, error:any)=>{
        console.log('error in notes remove dirty');
        console.log(JSON.stringify(error));
      }
    );
    tx.executeSql(Query.DELETE_NOTES_HELP, [userid],
      (tx:any, res:any)=>{console.log('ok delete notes_help');},
      (tx:any, error:any)=>{
        console.log('error in delete notes_help');
        console.log(JSON.stringify(error));
      }
    );
    })
    .then(tx=>{
      console.log('insert notes complete');
      resolve();
    })
    .catch(error=>{
      console.log('error full note insert');
      console.log(JSON.stringify(error));
      reject(error);
    })
  })
}

// private getBasicTag(title:string, userid:string):Promise<TagExtraMin>{
//   return new Promise<TagExtraMin>((resolve, reject)=>{
//     this.db.executeSql(Query.GET_TAG_FULL_JSON, [userid])
//     .then(res=>{
//       let ret = null;
//       if(res.rows.length>0){
//         let raw:any = JSON.parse(res.rows.item(0).json_object);
//
//       }
//     })
//   })
// }

private isTagThere(title:string, userid:string):Promise<boolean>{
  return new Promise<boolean>((resolve, reject)=>{
    this.db.executeSql(Query.GET_TAG_FULL_JSON, [title,userid])
    .then(res=>{
      let ret:boolean = ((res.rows.length<=0) ? false : true);
      resolve(ret);
    })
    .catch(error=>{
      console.log('error in is tag there');console.log(JSON.stringify(error));
      resolve(false);
    })
  })
}

public insertOrUpdateTag(tag:TagFull, userid:string):Promise<void>{
  return new Promise<void>((resolve, reject)=>{

    // let json:string=JSON.stringify(tag);
    // //it has to be already there because:
    //   //it can be loaded from  notes full
    //   //it can be loaded from tags min
    // this.db.executeSql(Query.UPDATE_TAG_2, [json, tag.title, json, userid])
    // .then(result=>{
    //   console.log('tag updated');
    //   resolve();
    // })
    // .catch(error=>{
    //   console.log('error update tag');
    //   console.log(JSON.stringify(error));
    //   reject(error);
    // })
    // console.log('the tag I\'m going to insert is');console.log(JSON.stringify(tag));
    // return Promise.resolve();

    this.isTagThere(tag.title, userid)
    .then(bool=>{
      let p:Promise<void>
      if(bool){
        p=this.updateJsonObjTag(tag, userid) as Promise<void>;
      }else{
        p=this.insertTagIntoTagCore(tag, userid) as Promise<void>;
      }
      return p;
    }).then(()=>{console.log('ok update or insert tag');resolve()})
    .catch(error=>{console.log('error in update or insert tag');console.log(JSON.stringify(error));reject(error)});
  })
}

public insertTagsMinSmartAndCleanify(tags: TagAlmostMin[], userid: string):Promise<void>{
  return new Promise<void>((resolve, reject)=>{
    this.db.transaction(tx=>{
      let query:string = Query.prepareQueryInsertIntoHelp(Query.INSERT_INTO_TAGS_HELP, tags.length, userid, 3);
      tx.executeSql(query, Query.expandArrayTagsMinWithEverything(tags, userid),
        (tx:any, res:any)=>{console.log('ok insert into tags_help');},
        (tx:any, error:any)=>{
          console.log('error in insert tags_help');
          console.log(JSON.stringify(error));
        }
    );
    tx.executeSql(Query.SMART_TAGS_MIN_INSERT, [userid],
      (tx:any, res:any)=>{console.log('ok insert into tags_min');},
      (tx:any, error:any)=>{
        console.log('error in insert tags_min');
        console.log(JSON.stringify(error));
      }
    );
    tx.executeSql(Query.SMART_TAGS_REMOVE_DIRTY, [userid],
      (tx:any, res:any)=>{console.log('ok insert into tags_min');},
      (tx:any, error:any)=>{
        console.log('error in tags remove dirty');
        console.log(JSON.stringify(error));
      }
    );
    tx.executeSql(Query.DELETE_TAGS_HELP, [userid],
      (tx:any, res:any)=>{console.log('ok delete tags_help');},
      (tx:any, error:any)=>{
        console.log('error in delete tags_help');
        console.log(JSON.stringify(error));
      }
    );
    })
    .then(tx=>{
      console.log('insert tags complete');
      resolve();
    })
    .catch(error=>{
      console.log('error full tag insert');
      console.log(JSON.stringify(error));
      reject(error);
    })
  })
}

public getNotesMin(userid: string):Promise<NoteExtraMinWithDate[]>{
  return new Promise<NoteExtraMin[]>((resolve, reject)=>{
    this.db.executeSql(Query.SELECT_NOTES_MIN, [userid])
    .then(result=>{
      let array:NoteExtraMinWithDate[] = [];
      // for(let i=0;i<result.rows.length;i++){
      //   //let rawResult:any=result.rows.item(i).json_object;
      //   // let date:any = JSON.parse(rawResult).lastmodificationdate;
      //   //let obj:NoteExtraMinWithDate = JSON.parse(rawResult);
      //   // console.log('object returned notes: ');
      //   // console.log(JSON.stringify(obj));
      //   // if(date!=null){
      //   //   let tObject1
      //   // }
      //   let note:NoteExtraMinWithDate = new NoteExtraMinWithDate();
      //   note.title=result.rows.item(i).title;
      //   // let raw:any = result.rows.item(i).lastmodificationdate;
      //   // let lastmod:Date = new Date(Date.parse(result.rows.item(i).lastmodificationdate));
      //   // note.lastmodificationdate = lastmod;
      //
      //   note.lastmodificationdate = new Date(result.rows.item(i).lastmodificationdate);
      //   array.push(note);
      // }
      // console.log('the array is:');console.log(JSON.stringify(array));
      array = Db.getArrayOfNotexExtraMinWithDateFromRes(result);
      resolve(array);
    })
    .catch(error=>{
      console.log('select notes min:');
      console.log(JSON.stringify(error));
      reject(error);
    })
  });
}


public getTagsMin(userid: string):Promise<TagAlmostMin[]>{
  return new Promise<TagExtraMin[]>((resolve, reject)=>{
    this.db.executeSql(Query.SELECT_TAGS_MIN, [userid])
    .then(result=>{
      let array:TagAlmostMin[] = [];
      for(let i=0;i<result.rows.length;i++){
        let rawResult:any = result.rows.item(i).json_object;
        // let obj:TagAlmostMin = JSON.parse(rawResult);
        // if(obj.noteslength == null){
        //   obj.noteslength=0; //good!
        // }
        let obj:TagAlmostMin = TagAlmostMin.safeNewTagFromJsonString(rawResult);

        // console.log('object returned tags: ');
        // console.log(JSON.stringify(obj));
        //array.push(obj);
        array=Utils.binaryArrayInsert(array, obj, TagAlmostMin.descendingCompare);
      }
      // console.log('the array is:');
      // console.log(JSON.stringify(array));
      resolve(array);
    })
    .catch(error=>{
      reject(error);
    })
  });
}

  private updateNoteChangeDoneCore(note:NoteFull, userid:string, tx?:any):Promise<void>|void{
    if(tx!=null){
      this.updateJsonObjNote(note, userid, true, tx);
    }else{
      return this.updateJsonObjNote(note, userid, true) as Promise<void>;
    }
  }

  private updateNoteChangeDoneCoreAddToLogs(tx:any, note:NoteExtraMin, userid:string/*, tx?:any*/):/*Promise<void>|*/void{
    /*/ if(tx!=null){*/
       tx.executeSql(Query.INSERT_NOTE_OLDTITLE_INTO_LOGS, [note.title, note.title, 'set-done', userid]);
    /* }*/
  }

//
// private setDoneJustLocal(note: NoteFull, userid: string):Promise<any>{
//   return this.db.executeSql(Query.UPDATE_NOTE_SET_DONE, [note.lastmodificationdate, note.isdone, JSON.stringify(note), note.title, userid]);
// }
//
// private setDoneAlsoRemote(note: NoteFull, userid: string):Promise<any>{
//   return new Promise<any>((resolve, reject)=>{
//     this.db.transaction(tx=>{
//       tx.executeSql(Query.UPDATE_NOTE_SET_DONE, [note.lastmodificationdate, note.isdone, JSON.stringify(note), note.title, userid]);
//       tx.executeSql(Query.INSERT_NOTE_OLDTITLE_INTO_LOGS, [note.title, note.title, 'set-done', userid]);
//     })
//     .then(txResult=>{
//       console.log('tx completed');
//       resolve(true);
//     })
//     .catch(error=>{
//       console.log('tx set done error');
//       console.log(JSON.stringify(error));
//       reject(error);
//     })
//   })
// }

/*a full object in order to re-calculate the json_object and insert it directly.
If i use just the title, I'd have to get to json_object, modify and reinsert. */
public setDone(note :NoteFull, userid: string):Promise<any>{
  /*UODATE_NOTE_SET_DONE = 'update note set isdone=?, json_object=? where title=?';*/
  /*'select * from logs where notetitle=? and action=\'create\'';*/
  /*first check if the note must be sent to the server, if so,
  I can only update it.
  If the note is already in the server, I need to write modification to the log.
  */
  return new Promise<any>((resolve, reject)=>{
    // let inTheServer: boolean = false;
    this.db.executeSql(Query.IS_NOTE_NOT_IN_THE_SERVER, [note.title, userid])
    .then(result=>{
      if(result.rows.length > 0){
        // console.log('the note is not in the server');
        // inTheServer = false;
        return this.updateNoteChangeDoneCore(note, userid);
      }else{
        // console.log('the note is already in the server');
        // inTheServer = true;
        return this.db.transaction(tx=>{
          this.updateNoteChangeDoneCore(note, userid, tx);
          this.updateNoteChangeDoneCoreAddToLogs(tx,note, userid);
        })
      }
    })
    .then(upadteResuullt=>{
      console.log('set done ok'),
      resolve(true);
    })
    .catch(error=>{
      console.log('error in set-done');
      console.log(JSON.stringify(error));
      reject(error);
    })
  })
}

private updateNoteChangeTextCoreAddToLogs(tx:any, note:NoteFull, userid:string):void{
  tx.executeSql(Query.INSERT_NOTE_OLDTITLE_INTO_LOGS, [note.title, note.title,'change-text', userid]);
}

private updateNoteChangeTextCore(note:NoteFull, userid:string, tx?:any):Promise<void>|void{
  if(tx!=null){
    tx.executeSql(Query.UPDATE_NOTE_SET_TEXT, [note.lastmodificationdate.toISOString(), note.text, JSON.stringify(note),note.title, userid]);
  }else{
    return this.db.executeSql(Query.UPDATE_NOTE_SET_TEXT, [note.lastmodificationdate.toISOString(), note.text, JSON.stringify(note), note.title, userid]);
  }
}


// private setTextJustLocal(note: NoteFull, userid: string):Promise<void>{
//   // return this.db.executeSql(Query.UPDATE_NOTE_SET_TEXT, [note.lastmodificationdate, note.text, JSON.stringify(note), note.title, userid]);
//   return this.updateNoteChangeTextCore(note, userid) as Promise<void>;
// }

// private setTextAlsoRemote(note: NoteFull, userid: string):Promise<void>{
//   return new Promise<void>((resolve, reject)=>{
//     this.db.transaction(tx=>{
//       /*tx.executeSql(Query.UPDATE_NOTE_SET_TEXT, [note.lastmodificationdate, note.text, JSON.stringify(note), note.title, userid]);*/
//       this.updateNoteChangeTextCore(note, userid, tx);
//       tx.executeSql(Query.INSERT_NOTE_OLDTITLE_INTO_LOGS, [note.title, note.title,'change-text', userid]);
//     })
//     .then(txResult=>{
//       console.log('tx completed');
//       resolve();
//     })
//     .catch(error=>{
//       console.log('tx set text error');
//       console.log(JSON.stringify(error));
//       reject(error);
//     })
//   })
// }

/*a full object in order to re-calculate the json_object and insert it directly.
If i use just the title, I'd have to get to json_object, modify and reinsert. */
public setText(note :NoteFull, userid: string):Promise<void>{
  /*UODATE_NOTE_SET_DONE = 'update note set isdone=?, json_object=? where title=?';*/
  /*'select * from logs where notetitle=? and action=\'create\'';*/
  /*first check if the note must be sent to the server, if so,
  I can only update it.
  If the note is already in the server, I need to write modification to the log.
  */
  console.log('the note here in the db');console.log(JSON.stringify(note));
  return new Promise<void>((resolve, reject)=>{
    //let inTheServer: boolean = false;
    this.db.executeSql(Query.IS_NOTE_NOT_IN_THE_SERVER, [note.title, userid])
    .then(result=>{
      if(result.rows.length > 0){
        // console.log('the note is not in the server');
        // inTheServer = false;
        return this.updateNoteChangeTextCore(note, userid) as Promise<void>;
      }else{
        // console.log('the note is already in the server');
        // inTheServer = true;
        return this.db.transaction(tx=>{
          this.updateNoteChangeTextCore(note, userid, tx);
          this.updateNoteChangeTextCoreAddToLogs(tx, note, userid);
        })
      }
    })
    .then(upadteResuullt=>{
      console.log('set text ok'),
      resolve();
    })
    .catch(error=>{
      console.log('error in set-text');console.log(JSON.stringify(error));
      reject(error);
    })
  })
}

private updateNoteChangeLinksCoreAddToLogs(tx:any,note:NoteFull, userid:string):void{
  tx.executeSql(Query.INSERT_NOTE_OLDTITLE_INTO_LOGS, [note.title, note.title,'set-link', userid]);
}

private updateNoteChangeLinksCore(note:NoteFull, userid:string, tx?:any):Promise<void>|void{
  if(tx!=null){
    this.updateJsonObjNote(note, userid,true, tx);
  }else{
    return this.updateJsonObjNote(note, userid, true) as Promise<void>;
  }
}


// private setLinksJustLocal(note: NoteFull, userid: string):Promise<void>{
//   //return this.db.executeSql(Query.UPDATE_NOTE_SET_LINKS, [note.lastmodificationdate, JSON.stringify(note.links), JSON.stringify(note), note.title, userid]);
//   return this.updateNoteChangeLinksCore(note, userid) as Promise<void>;
// }
//
// private setLinksAlsoRemote(note: NoteFull, userid: string):Promise<void>{
//   return new Promise<void>((resolve, reject)=>{
//     this.db.transaction(tx=>{
//       //tx.executeSql(Query.UPDATE_NOTE_SET_LINKS, [note.lastmodificationdate, JSON.stringify(note.links), JSON.stringify(note), note.title, userid]);
//       this.updateNoteChangeLinksCore(note, userid, tx);
//       tx.executeSql(Query.INSERT_NOTE_OLDTITLE_INTO_LOGS, [note.title, note.title,'set-link', userid]);
//     })
//     .then(txResult=>{
//       console.log('tx completed');
//       resolve();
//     })
//     .catch(error=>{
//       console.log('tx set link error');
//       console.log(JSON.stringify(error));
//       reject(error);
//     })
//   })
// }

/*a full object in order to re-calculate the json_object and insert it directly.
If i use just the title, I'd have to get to json_object, modify and reinsert. */
public setLinks(note :NoteFull, userid: string):Promise<void>{
  /*UODATE_NOTE_SET_DONE = 'update note set isdone=?, json_object=? where title=?';*/
  /*'select * from logs where notetitle=? and action=\'create\'';*/
  /*first check if the note must be sent to the server, if so,
  I can only update it.
  If the note is already in the server, I need to write modification to the log.
  */
  return new Promise<void>((resolve, reject)=>{
    // let inTheServer: boolean = false;
    this.db.executeSql(Query.IS_NOTE_NOT_IN_THE_SERVER, [note.title, userid])
    .then(result=>{
      if(result.rows.length > 0){
        // console.log('the note is not in the server');
        // inTheServer = false;
        return this.updateNoteChangeLinksCore(note, userid) as Promise<void>;
      }else{
        // console.log('the note is already in the server');
        // inTheServer = true;
        // return this.setLinksAlsoRemote(note, userid);
        return this.db.transaction(tx=>{
          this.updateNoteChangeLinksCore(note, userid, tx);
          this.updateNoteChangeLinksCoreAddToLogs(tx, note, userid);
        })
      }
    })
    .then(upadteResuullt=>{
      console.log('set links ok'),
      resolve();
    })
    .catch(error=>{
      console.log('error in set-links');
      console.log(JSON.stringify(error));
      reject(error);
    })
  })
}

//THIS WORK BUT I'M NOT GOING TO ADD SUPPORT FOR CHANGING TITLE LOCALLY NOW.
// private setTitleJustLocal(note: NoteFull, newTitle: string, userid: string):Promise<any>{
//   let oldTitle:string = note.title;
//   note.title = newTitle;
//   return this.db.executeSql(Query.UPDATE_NOTE_SET_TITLE, [newTitle, JSON.stringify(note), oldTitle, userid]);
// }
//
// private setTitleAlsoRemote(note: NoteFull, newTitle: string, userid: string):Promise<any>{
//   return new Promise<any>((resolve, reject)=>{
//     let oldTitle:string = note.title;
//     note.title = newTitle;
//     this.db.transaction(tx=>{
//       tx.executeSql(Query.UPDATE_NOTE_SET_TITLE,[newTitle, JSON.stringify(note), oldTitle, userid]);
//       tx.executeSql(Query.INSERT_NOTE_OLDTITLE_INTO_LOGS, [newTitle, oldTitle,'change-title', userid]);
//     })
//     .then(txResult=>{
//       console.log('tx completed');
//       resolve(true);
//     })
//     .catch(error=>{
//       console.log('tx set title error');
//       console.log(JSON.stringify(error));
//       reject(error);
//     })
//   })
// }
//
// /*a full object in order to re-calculate the json_object and insert it directly.
// If i use just the title, I'd have to get to json_object, modify and reinsert. */
// public setTitle(note :NoteFull, newTitle: string, userid: string):Promise<any>{
//   /*UODATE_NOTE_SET_DONE = 'update note set isdone=?, json_object=? where title=?';*/
//   /*'select * from logs where notetitle=? and action=\'create\'';*/
//   /*first check if the note must be sent to the server, if so,
//   I can only update it.
//   If the note is already in the server, I need to write modification to the log.
//   */
//   return new Promise<any>((resolve, reject)=>{
//     let inTheServer: boolean = false;
//     this.db.executeSql(Query.IS_NOTE_NOT_IN_THE_SERVER, [note.title, userid])
//     .then(result=>{
//       if(result.rows.length > 0){
//         // console.log('the note is not in the server');
//         // inTheServer = false;
//         return this.setTitleJustLocal(note, newTitle, userid);
//       }else{
//         // console.log('the note is already in the server');
//         // inTheServer = true;
//         return this.setTitleAlsoRemote(note, newTitle, userid);
//       }
//     })
//     .then(upadteResuullt=>{
//       console.log('set title ok'),
//       resolve(true);
//     })
//     .catch(error=>{
//       console.log('error in set-title');
//       console.log(JSON.stringify(error));
//       reject(error);
//     })
//   })
// }


/*just execute the query and nothing more.*/
public setNoteTitle(note: NoteFull, newTitle: string, userid: string):Promise<any>{
  let oldTitle:string = note.title;
  let newNote = note.clone();
  newNote.title=newTitle;
  return this.db.executeSql(Query.UPDATE_NOTE_SET_TITLE, [note.lastmodificationdate.toISOString(),newTitle, JSON.stringify(newNote), oldTitle, userid]);
}

/*a changing on tags will make it lose its fullness*/
public setTagTitle(tag: TagFull, newTitle: string, userid: string):Promise<any>{
  let oldTitle:string = tag.title;
  let newTag = tag.clone();
  newTag.title=newTitle;
  // tag.title = newTitle;
  return this.db.executeSql(Query.UPDATE_TAG_SET_TITLE, [newTitle, JSON.stringify(newTag), oldTitle, userid]);
}

// privateQueryNotesByTags(base:string, length:number):string{
//   let result:string = Query.SELECT_NOTE_TITLE_BY_TAGS_NO_ROLE;
//   for(let i=0;i<length;i++){
//     result+='json_object like '
//   }
//   return result;
// }

private static expandTagsRegexOr(tags:TagAlmostMin[]):string{
  let result:string='';
  tags.forEach(obj=>{
    let base:string = '.*\\{"title":"'+obj.title+'"\\}.*|';
    result += base;
  })
  result = result.substr(0, result.length-1);
  return result;
}

private static expandTagsRegexAnd(tags:TagAlmostMin[]):string{
  let result:string ='%';
  tags.forEach(obj=>{
    let t:TagExtraMin = new TagExtraMin(obj.title);
    let json:string=JSON.stringify(t);
    json+='%';
    result+=json;
  })
  result=result.substr(0, result.length-1);
  result+='%';
  console.log('query is:'+result);
  return result;
}



// private expandTagsRegex2(tags:TagAlmostMin[]):string{
//
// }

// private getArrayOfNotexExtraMin(res:any):NoteExtraMin[]{
//   let array:NoteExtraMin[]=[];
//   console.log('res is');
//   console.log(JSON.stringify(res));
//   for(let i=0;i<res.rows.length;i++){
//     array.push(NoteExtraMin.NewNoteExtraMin(res.rows.item(i).title));
//   }
//   console.log('the array');
//   console.log(JSON.stringify(array));
//   return array;
// }

private static getArrayOfNotexExtraMinWithDateFromRes(res:any):NoteExtraMinWithDate[]{
  let array:NoteExtraMinWithDate[]=[];
  for(let i=0;i<res.rows.length;i++){
    array.push(NoteExtraMinWithDate.safeNewNoteFromJsObject({
      title:res.rows.item(i).title,
      lastmodificationdate:res.rows.item(i).lastmodificationdate
    }))
  }
  return array;
}

private static getRegexForTags(tags:TagAlmostMin[],and:boolean):string{
  let res:string = '';
  if(and){
    res = Db.expandTagsRegexAnd(tags);
  }else{
    res = Db.expandTagsRegexOr(tags);
  }
  return res;
}

private static getQueryForRegexTags(and:boolean, full:boolean):string{
  let res:string ='';
  if(and){
    if(full){
      res = Query.SELECT_NOTES_FULL_MIN_WITH_DATE_BY_TAGS_NO_ROLE_AND;
    }else{
      res = Query.SELECT_NOTES_EXTRA_MIN_WITH_DATE_BY_TAGS_NO_ROLE_AND;
    }

  }else{
    if(full){
      res = Query.SELECT_NOTES_FULL_MIN_WITH_DATE_BY_TAGS_NO_ROLE_OR;
    }else{
      res = Query.SELECT_NOTES_EXTRA_MIN_WITH_DATE_BY_TAGS_NO_ROLE_OR;
    }

  }
  return res;
}

private static getArrayOfNotesFullFromRes(res:any):NoteFull[]{
  let array:NoteFull[]=[];
  for(let i=0;i<res.rows.length;i++){
    let raw = Db.getNoteFullFromRes(res,i);
    if(raw!=null){
      array.push(raw);
    }
  }
  return array;
}

//her sister with a transaction is not used so I commented it.
private getNotesExtraMinWithDateByTagsNoRoleCoreNoTx(tags:TagAlmostMin[], userid:string, and:boolean):Promise<NoteExtraMinWithDate[]>{
  let secondParam:string =Db.getRegexForTags(tags, and);
  let query:string = Db.getQueryForRegexTags(and,false);
  return new Promise<NoteExtraMinWithDate[]>((resolve, reject)=>{
    // console.log('2');
    this.db.executeSql(query,[userid, secondParam])
    .then(res=>{
      resolve(Db.getArrayOfNotexExtraMinWithDateFromRes(res));
    })
    .catch(error=>{
      console.log('error in get notes by tags'); console.log(JSON.stringify(error));
      reject(error);
    })
  });
}

private getNotesFullByTagsNoRoleCoreNoTx(tags:TagAlmostMin[], userid:string, and:boolean):Promise<NoteFull[]>{
  let secondParam:string =Db.getRegexForTags(tags, and);
  let query:string = Db.getQueryForRegexTags(and,true);
  return new Promise<NoteFull[]>((resolve, reject)=>{
    // console.log('2');
    this.db.executeSql(query,[userid, secondParam])
    .then(res=>{
      resolve(Db.getArrayOfNotesFullFromRes(res));
    })
    .catch(error=>{
      console.log('error in get notes by tags'); console.log(JSON.stringify(error));
      reject(error);
    })
  });
}

// private getNotesByTagsNoRoleCoreTx(tags:TagAlmostMin[], userid:string, tx:any):NoteExtraMin[]{
//   let secondParam:string =this.expandTagsRegexAnd(tags);
//   let lock:boolean = true;
//     console.log('1');
//     let result:NoteExtraMin[];
//     tx.executeSql(Query.SELECT_NOTES_EXTRA_MIN_WITH_DATE_BY_TAGS_NO_ROLE_OR, [userid, secondParam],
//       (tx:any, res:any)=>{
//         lock = false;
//         result=this.getArrayOfNotexExtraMinWithDate(res);
//       },(tx:any, error:any)=>{console.log('error in get notes by tags'); console.log(JSON.stringify(error));}
//     )
//     return result;
// }

// private getNotesByTagsNoRoleCore(tags:TagAlmostMin[],userid:string, tx?:any):Promise<NoteExtraMin[]>|NoteExtraMin[]{
//   let secondParam:string =this.expandTagsRegex(tags);
//   if(tx!=null){
//     console.log('1');
//     let result:NoteExtraMin[];
//     tx.executeSql(Query.SELECT_NOTE_TITLE_BY_TAGS_NO_ROLE, [userid, secondParam],
//       (tx:any, res:any)=>{
//         result=this.getArrayOfNotexExtraMin(res);
//       },(tx:any, error:any)=>{console.log('error in get notes by tags'); console.log(JSON.stringify(error));}
//     )
//   }else{
//     return new Promise<NoteExtraMin[]>((resolve, reject)=>{
//       console.log('2');
//       this.db.executeSql(Query.SELECT_NOTE_TITLE_BY_TAGS_NO_ROLE,[userid, secondParam])
//       .then(res=>{
//         resolve(this.getArrayOfNotexExtraMin(res));
//       })
//       .catch(error=>{
//         console.log('error in get notes by tags'); console.log(JSON.stringify(error));
//         reject(error);
//       })
//     });
//   }
// }


public getNotesByTags(tags: TagAlmostMin[], userid: string, and:boolean):Promise<NoteExtraMinWithDate[]>{
  return this.getNotesExtraMinWithDateByTagsNoRoleCoreNoTx(tags, userid, and);
}


  // public getNotesByTags(tags: TagAlmostMin[], userid: string):Promise<NoteExtraMin[]>{
  //   return new Promise<NoteExtraMin[]>((resolve, reject)=>{
  //     let queryString: string = Query.SELECT_NOTES_MIN_BY_TAGS;
  //     if(tags.length!=1){
  //       /*have to prepare it, if not, it is already ready for query.*/
  //       for(let i=1;i<tags.length;i++){
  //         queryString = queryString.concat(' or tagtitle=?');
  //       }
  //     }
  //     // console.log('the query is:');
  //     // console.log(queryString);
  //     this.db.executeSql(queryString, [userid].concat(tags.map((tag)=>{return tag.title})))
  //     .then(result=>{
  //       let notes:NoteExtraMin[] = [];
  //       console.log('db result is:');
  //       console.log(JSON.stringify(result));
  //       if(result.rows.length > 0){
  //         for(let i=0;i<result.rows.length;i++){
  //           // console.log('result.rows.item(i)');
  //           // console.log(JSON.stringify(result.rows.item(i)));
  //           // console.log(JSON.stringify(result.rows));
  //           let noteTitle:string = result.rows.item(i).notetitle;
  //           let note: NoteExtraMin = new NoteExtraMin();
  //           note.title = noteTitle;
  //           notes.push(note);
  //         }
  //       }
  //       resolve(notes);
  //     })
  //     .catch(error=>{
  //       console.log('error in getting notes by tags');
  //       console.log(JSON.stringify(error));
  //       reject(error);
  //     })
  //   })
  // }

  getNotesByText(text: string, userid: string):Promise<NoteExtraMinWithDate[]>{
    return new Promise<NoteExtraMinWithDate[]>((resolve, reject)=>{
      text = '%'+text+'%';
      this.db.executeSql(Query.SELECT_NOTES_EXTRA_MIN_WITH_DATE_BY_TEXT, [text, userid])
      .then(result=>{
        let notes:NoteExtraMinWithDate[]=[];
        // if(result.rows.length <= 0){
        //   resolve(notes);
        // }else{
        //   for(let i=0;i<result.rows.length;i++){
        //     // let note:NoteExtraMin = new NoteExtraMin();
        //     // note.title=result.rows.item(i).title;
        //     notes.push(NoteExtraMinWithDate.safeNewNoteFromJsObject({title: result.rows.item(i).title, lastmodificationdate: result.rows.item(i).lastmodificationdate}));
        //   }
          notes = Db.getArrayOfNotexExtraMinWithDateFromRes(result);
          resolve(notes);
      })
      .catch(error=>{
        console.log('error in notes by text');
        console.log(JSON.stringify(error));
        reject(error);
      })
    });
  }



  getNotesByIsDone(isdone:boolean, userid:string):Promise<NoteExtraMinWithDate[]>{
    return new Promise<NoteExtraMinWithDate[]>((resolve, reject)=>{
      let param:string = '"isdone":'+isdone.valueOf();
      param = '%'+param+'%';
      this.db.executeSql(Query.SELECT_NOTES_EXTRA_MIN_WITH_DATE_BY_ISDONE, [param, userid])
      .then(result=>{
        let notes:NoteExtraMinWithDate[]=[];
        // if(result.rows.length <= 0){
        //   resolve(notes);
        // }else{
        //   for(let i=0;i<result.rows.length;i++){
        //     // let note:NoteExtraMin = new NoteExtraMin();
        //     // note.title=result.rows.item(i).title;
        //     notes.push(NoteExtraMinWithDate.safeNewNoteFromJsObject({title: result.rows.item(i).title, lastmodificationdate: result.rows.item(i).lastmodificationdate}));
        //   }
          notes = Db.getArrayOfNotexExtraMinWithDateFromRes(result);
          resolve(notes);
      })
      .catch(error=>{
        console.log('error in notes by is done');
        console.log(JSON.stringify(error));
        reject(error);
      })
    });
  }


  deleteNote(note: NoteFull, userid: string, usedTag?:TagFull[]):Promise<void>{
    return new Promise<void>((resolve, reject)=>{

      usedTag = Utils.makeArraySafe(usedTag);
      this.getTagsFullByNote(note, usedTag, userid)
      .then(tags=>{
        return this.db.transaction(tx=>{

          this.removeNoteFromTagsUpdateOnlyTagsCore([note.forceCastToNoteExtraMin()], userid, tags,tx);

          console.log('the note in is');console.log(JSON.stringify(note));
          tx.executeSql(Query.INSERT_NOTE_OLDTITLE_INTO_LOGS, [note.title, note.title, 'delete', userid],
          (tx:any, res:any)=>{console.log('ok set note deleted in logs');},
          (tx:any, error:any)=>{console.log('error in set note deleted in logs');console.log(JSON.stringify(error));}
        );
          // let tags:TagExtraMin[]=[];
          //   tags=note.getTagsAsTagsExtraMinArray();
          //
          //   this.removeNoteFromTagsUpdateOnlyTagsCore(tx, note, userid, tags, usedTag);
          //   console.log('post deleting the note is');console.log(JSON.stringify(note));

          tx.executeSql(Query.SET_NOTE_DELETED, [note.title, userid],
            (tx:any, res:any)=>{console.log('ok set note deleted');},
            (tx:any, error:any)=>{console.log('error in set note deleted');console.log(JSON.stringify(error));}
          );
      })


      })
      .then(txResult=>{
        console.log('tx completed, result:');
        resolve();
      })
      .catch(error=>{
        console.log('tx error');
        console.log(JSON.stringify(error));
        reject(error);
      })
    })
  }

  private insertTagIntoTagCore(tag:TagFull, userid:string, tx?:any):Promise<void>|void{
    if(tx!=null){
      tx.executeSql(Query.INSERT_TAG, [tag.title, userid, JSON.stringify(tag)],
      (tx: any, res: any)=>{console.log('ok insert tag')},
      (tx: any, error: any)=>{console.log('error in insert tag');console.log(JSON.stringify(error));}
    );
  }else{
    return this.db.executeSql(Query.INSERT_TAG, [tag.title, userid, JSON.stringify(tag)]);
  }
  }

  createTag(tag: TagFull, userid: string):Promise<any>{
    return new Promise<any>((resolve , reject)=>{
      this.db.transaction(tx=>{
      //   tx.executeSql(Query.INSERT_TAG, [tag.title, userid, JSON.stringify(tag)],
      //   (tx: any, res: any)=>{console.log('ok insert tag')},
      //   (tx: any, error: any)=>{console.log('error in insert tag');console.log(JSON.stringify(error));}
      // );
      this.insertTagIntoTagCore(tag, userid, tx);
      tx.executeSql(Query.INSERT_TAG_OLDTITLE_INTO_LOGS, [tag.title, tag.title, 'create', userid],
        (tx: any, res: any)=>{console.log('ok insert tag into logs')},
        (tx: any, error: any)=>{console.log('error in insert tag in logs');console.log(JSON.stringify(error));}
      )
      })
      .then(txResult=>{
        console.log('tag creation completed');
        resolve(true);
      })
      .catch(error=>{
        console.log('tag creation error'); console.log(JSON.stringify(error));
        reject(error);
      })
    });
  }


  // private removeTagFromNotesCore(tx:any, tag:TagAlmostMin, notesToRemove:NoteExtraMin[], usedNote:NoteFull[], userid:string):void{
  //   usedNote = Utils.makeArraySafe(usedNote);
  //   let tmpNote:NoteExtraMin[]=Utils.binaryArrayDiff(notesToRemove, usedNote,NoteExtraMin.ascendingCompare);
  //
  //   // console.log('the tmpNote');console.log(JSON.stringify(tmpNote));
  //   //
  //   // if(tmpNote.length>0){
  //   //   let queryParam:string = Db.getRegexForTags([tag], false);
  //   //   let query:string = Db.getQueryForRegexTags(false,true);
  //   //   tx.executeSql(query, [userid, queryParam],
  //   //     (tx:any, res:any)=>{
  //   //       if(usedNote==null){usedNote=[];}
  //   //       for(let i=0;i<res.rows.length;i++){
  //   //         let note:NoteFull = NoteFull.safeNewNoteFromJsonString(res.rows.item(i));
  //   //         usedNote.push(note);
  //   //       }
  //   //
  //   //       if(usedNote!=null && usedNote.length>0){
  //   //         usedNote.forEach(note=>{
  //   //           note.removeTag(tag.forceCastToTagExtraMin());
  //   //           this.updateJsonObjNote(note, userid, tx);
  //   //         })
  //   //       }
  //   //       console.log('ok removed the tag from notes');
  //   //     },(tx:any, error:any)=>{console.log('error in get tag full to update');console.log(JSON.stringify(error));}
  //   // );
  //   // }
  //   console.log('the note to work');console.log(JSON.stringify(notesToRemove));
  //   console.log('the tmp');console.log(JSON.stringify(tmpNote));
  //   let p:Promise<void>;
  //   if(tmpNote.length>0){
  //     let query:string = Db.getQueryForRegexTags(false, true);
  //     let queryParam:string = Db.getRegexForTags([tag], false);
  //     p=new Promise<void>((resolve, reject)=>{
  //       this.db.executeSql(query, [userid, queryParam])
  //       .then(res=>{
  //         if(usedNote==null){usedNote=[]}
  //               for(let i=0;i<res.rows.length;i++){
  //                 let note:NoteFull = NoteFull.safeNewNoteFromJsonString(res.rows.item(i));
  //                 usedNote.push(note);
  //               }
  //       })
  //       .catch(error=>{
  //         console.log('error internal');console.log(JSON.stringify(error));console.log(JSON.stringify(error.message));
  //         reject(error);
  //       })
  //     })
  //   }else{
  //     p=Promise.resolve();
  //   }
  //   p.then(()=>{
  //           if(usedNote!=null && usedNote.length>0){
  //             usedNote.forEach(note=>{
  //               console.log('before ');console.log(JSON.stringify(note));
  //               note.removeTag(tag.forceCastToTagExtraMin());
  //               console.log('post');console.log(JSON.stringify(note));
  //               this.updateJsonObjNote(note, userid, false, tx);
  //             })
  //           }
  //   })
  //   .catch(error=>{
  //     console.log('error external');console.log(JSON.stringify(error));console.log(JSON.stringify(error.message));
  //   })
  // }


  /**
  From the given notesfull, it remove the target tags and then it save the note one by one, Please note
  that for each note, it tries to remove EACH tag (1st param), then, it saves each note. This can be done
  because no error are thrown if we try to remove a tag from a note to which it doesn't belong.
  */
  private removeTagsFromNotesUpdateOnlyNotesCore(tags:TagExtraMin[],notes:NoteFull[], userid:string, tx?:any){
    notes.forEach(note=>{
      for(let i=0;i<tags.length;i++){
        note.removeTag(tags[i]);
      }
      this.updateJsonObjNote(note, userid, false, tx);
    })
  }

  private getNotesFullFromTags(tag:TagFull, usedNote:NoteFull[], userid:string):Promise<NoteFull[]>{
    return new Promise<NoteFull[]>((resolve, reject)=>{
    let notes:NoteExtraMin[]=tag.notes;
    let tmpNotes:NoteExtraMin[]=Utils.binaryArrayDiff(notes, usedNote, NoteExtraMin.ascendingCompare);
    let p:Promise<void>;
    if(tmpNotes.length>0){
      p=new Promise<void>((resolve, reject)=>{
        this.getNotesFullByTagsNoRoleCoreNoTx([tag.forceCastToTagAlmostMin()], userid, false)
        .then(notes=>{
          usedNote=usedNote.concat(notes);
          resolve();
        })
        .catch(error=>{
          console.log('error internal');console.log(JSON.stringify(error));console.log(JSON.stringify(error.message));
          reject(error);
        })
      })
    }else{
      p=Promise.resolve();
    }
    p.then(()=>{
      resolve(usedNote)
    })
    p.catch(error=>{
      console.log('error in get tag for note');console.log(JSON.stringify(error));console.log(JSON.stringify(error.message));
      reject(error);
    })
  })
  }


  deleteTag(tag: TagFull, userid: string, usedNote?:NoteFull[]):Promise<void>{
    return new Promise<void>((resolve, reject)=>{
      usedNote = Utils.makeArraySafe(usedNote)/*.sort(NoteExtraMin.ascendingCompare);*/

      this.getNotesFullFromTags(tag, usedNote, userid)
      .then(notes=>{
        return this.db.transaction(tx=>{

          this.removeTagsFromNotesUpdateOnlyNotesCore([tag.forceCastToTagExtraMin()], notes, userid, tx);

          tx.executeSql(Query.INSERT_TAG_OLDTITLE_INTO_LOGS, [tag.title, tag.title, 'delete', userid]);
          /*now update the json_object of eventual full notes.*/
          tx.executeSql(Query.SET_TAG_DELETED, [tag.title, userid ],
            (tx:any, res:any)=>{console.log('set tag deleted ok');},
            (tx:any, error:any)=>{console.log('error in set tag deleted');console.log(JSON.stringify(error));}
          );

          //this.removeTagFromNotesCore(tx, tag, tag.notes, usedNote, userid);

        })
      })

      .then(txResult=>{
        console.log('ok tag is deleted');
        resolve();
      })
      .catch(error=>{
        console.log('error in delete tag');console.log(JSON.stringify(error.message));
        reject(error);
      })
    })
  }

//TODO rewrite a bit the modificationof the json object.
  // deleteTag(tag: TagExtraMin, userid: string):Promise<any>{
  //   return new Promise<any>((resolve, reject)=>{
  //     this.db.transaction(tx=>{
  //       tx.executeSql(Query.INSERT_TAG_OLDTITLE_INTO_LOGS, [tag.title, tag.title, 'delete', userid]);
  //       /*now update the json_object of eventual full notes.*/
  //       tx.executeSql(Query.GET_TITLE_AND_JSON_OF_NOTES_TO_UPDATE, [tag.title, userid],
  //         (tx: any, res: any)=>{
  //           if(res.rows.length <= 0){
  //             console.log('no note to update');
  //             /*return;*/
  //           }else{
  //             for(let i=0;i<res.rows.length;i++){
  //               console.log('I have to update:');
  //               console.log(JSON.stringify(res.rows.length));
  //               let json_object:any = JSON.parse(res.rows.item(i).json_object);
  //               let role:string = res.rows.item(i).role;
  //               let title: string = res.rows.item(i).title;
  //               let note:NoteFull;
  //               if(!json_object.maintags && !json_object.othertags){
  //                 console.log('tag is not full, nothing to do.');
  //               }else{
  //                 note= json_object as NoteFull;
  //                 if(role=='mainTags'){
  //                   note.removeTag(note.getTagIndex(tag, TagType.MAIN));
  //                 }else{
  //                   note.removeTag(note.getTagIndex(tag, TagType.OTHER));
  //                 }
  //               }
  //               console.log(JSON.stringify(note));
  //               this.updateJsonObjNote(note, userid,tx);
  //             }
  //           }
  //         },
  //         (tx: any, error: any)=>{
  //           console.log('error in select:');
  //           console.log(JSON.stringify(error));
  //         }
  //       )
  //       tx.executeSql(Query.SET_TAG_DELETED, [tag.title, userid ],
  //         (tx:any, res:any)=>{
  //           console.log('set tag deleted ok');
  //         },
  //         (tx:any, error:any)=>{
  //           console.log('error in set tag deleted');
  //           console.log(JSON.stringify(error));
  //         }
  //       );
  //   })
  //     .then(txResult=>{
  //       console.log('tx completed, result:');
  //       console.log(JSON.stringify(txResult));
  //       resolve(true);
  //     })
  //     .catch(error=>{
  //       console.log('tx error');
  //       console.log(JSON.stringify(error));
  //       reject(error);
  //     })
  //   })
  // }

  // private expandInsertNoteTagsIntoLogs(title:string, userid:string, tags:TagExtraMin[]):string[]{
  //   let array:string[]=[];
  //   for(let i=0;i<tags.length;i++){
  //     array.push(title);
  //     array.push(tags[i].title);
  //     array.push(userid);
  //   }
  //   return array;
  // }
  //
  // private expandTagType(tags:TagExtraMin[], type:TagType):TagType[]{
  //   return tags.map(obj=>{
  //     return type;
  //   })
  // }
  //
  // private prepareQueryInsertNotesTagsIntoLogs(tags:TagExtraMin[], roles: TagType[]):string{
  //   if(roles.length != tags.length){
  //     throw new Error('error length must be the same');
  //   }
  //   let result:string = Query.INSERT_NOTE_TAG_INTO_LOGS_2;
  //   for(let i=0;i<tags.length;i++){
  //     if(roles[i]==TagType.MAIN){
  //       result+='(?,?,\'mainTags\',\'add-tag\', ?),';
  //     }else{
  //       result+='(?,?,\'otherTags\',\'add-tag\', ?),';
  //     }
  //   }
  //   result=result.substr(0, result.length-1);
  //   return result;
  // }

  private addTagsToNoteUpdateOnlyNoteCore(note:NoteFull,userid:string, mainTags?:TagExtraMin[], otherTags?:TagExtraMin[], tx?:any):Promise<void>|void{
    if(mainTags!=null){
      mainTags.forEach(tag=>{
        note.maintags.push(tag);
      })
    }
    if(otherTags!=null){
      otherTags.forEach(tag=>{
        note.othertags.push(tag)
      })
    }
    this.updateJsonObjNote(note, userid, true, tx);
  }

  private addTagsToNoteUpdateOnlyLogs(tx:any, title:string,tags:TagExtraMin[], mainTags:TagExtraMin[], otherTags:TagExtraMin[], userid:string):void{
    let roles:TagType[]=[];
    roles = Query.expandTagType(mainTags, TagType.MAIN);
    roles = roles.concat(Query.expandTagType(otherTags, TagType.OTHER));

    let query:string = Query.prepareQueryInsertNotesTagsIntoLogs(tags, roles);

    console.log('query is: '+query);
      tx.executeSql(query, Query.expandInsertNoteTagsIntoLogs(title, userid, tags),
        (tx: any, res: any)=>{/*nothing*/console.log('insert notes-tags into logs ok');},
        (tx: any, error: any)=>{
          console.log('error in inserting notes-tags');
          console.log(JSON.stringify(error));
        }
      );
  }

  public addTags(note: NoteFull,  userid: string, mainTags? :  TagExtraMin[], otherTags?: TagExtraMin[], usedTag?:TagFull[]):Promise<void>{
    // console.log('the note I received as input is:');console.log(JSON.stringify(note));
    return new Promise<void>((resolve, reject)=>{
      let tags:TagExtraMin[]=[];
      if(mainTags==null){mainTags=[];}
      if(otherTags==null){otherTags=[];}
      tags = mainTags.concat(otherTags);

      usedTag = Utils.makeArraySafe(usedTag)

      this.getTagsFullByTitle(tags, usedTag, userid, true)
      .then(tagsToUpdate=>{

        return this.db.transaction(tx=>{

        this.addTagsToNoteUpdateOnlyTagsCore(note.forceCastToNoteExtraMin(), userid, tagsToUpdate,tx);

        //this.updateJsonObjNote(note, userid, true, tx);
        this.addTagsToNoteUpdateOnlyNoteCore(note, userid, mainTags, otherTags, tx);

        // let roles:TagType[]=[];
        // roles = Query.expandTagType(mainTags, TagType.MAIN);
        // roles = roles.concat(Query.expandTagType(otherTags, TagType.OTHER));
        //
        // let query:string = Query.prepareQueryInsertNotesTagsIntoLogs(tags, roles);
        //
        // console.log('query is: '+query);
        //   tx.executeSql(query, Query.expandInsertNoteTagsIntoLogs(note.title, userid, tags),
        //     (tx: any, res: any)=>{/*nothing*/console.log('insert notes-tags into logs ok');},
        //     (tx: any, error: any)=>{
        //       console.log('error in inserting notes-tags');
        //       console.log(JSON.stringify(error));
        //     }
        //   );
        this.addTagsToNoteUpdateOnlyLogs(tx, note.title, tags, mainTags, otherTags, userid);
        })
      })
      .then(txResult=>{
        console.log('add tags ok');
        resolve();
      })
      .catch(error=>{
        console.log('error in adding tags');
        console.log(JSON.stringify(error));
        reject(error);
      })
    });
  }


  // public addTags(note: NoteFull,  userid: string, mainTags? :  TagExtraMin[], otherTags?: TagExtraMin[]):Promise<any>{
  //   return new Promise<any>((resolve, reject)=>{
  //     this.db.transaction(tx=>{
  //     //   /*first update note with a new json_object*/
  //     //   tx.executeSql(Query.UPDATE_JSON_OBJ_NOTE,[JSON.stringify(note), note.title, userid],
  //     //     (tx: any, res: any)=>{/*nothing*/console.log('updated json_obj note');},
  //     //     (tx: any, error: any)=>{
  //     //       console.log('error in update JSON object.');
  //     //       console.log(JSON.stringify(error));
  //     //     }
  //     // );
  //     this.updateJsonObjNote(tx, note, userid);
  //     if(mainTags!=null){
  //       for(let i=0;i<mainTags.length;i++){
  //         tx.executeSql(Query.INSERT_NOTES_TAGS, [note.title, mainTags[i].title, 'mainTags', userid],
  //           (tx: any, res: any)=>{/*nothing*/console.log('update notes_tags main');},
  //           (tx: any, error: any)=>{
  //             console.log('error in inserting main tags in notes_tags');
  //             console.log(JSON.stringify(error));
  //           }
  //       );
  //       tx.executeSql(Query.INSERT_NOTE_TAG_INTO_LOGS, [note.title, note.title, mainTags[i].title, 'mainTags', 'add-tag', userid],
  //         (tx: any, res: any)=>{/*nothing*/console.log('insert into logs ok');},
  //         (tx: any, error: any)=>{
  //           console.log('error in inserting main tags in logs');
  //           console.log(JSON.stringify(error))
  //         }
  //       );
  //       tx.executeSql(Query.GET_TAG_FULL_JSON, [mainTags[i].title, userid],
  //         (tx: any, res: any)=>{
  //           if(res.rows.length>0){
  //               let tag:any = JSON.parse(res.rows.item(0).json_object);
  //               console.log('the tag is:');
  //               console.log(JSON.stringify(tag));
  //
  //               let tagFull:TagFull = new TagFull();
  //               tagFull.title  = tag.title;
  //
  //               if(tag.notes){
  //                 tagFull.notes = tag.notes;
  //               }
  //
  //               tagFull.noteslength = tag.noteslength+1;
  //               // if(tag.notes!=null && tag.notes != undefined){
  //               //   tagFull.notes=tag.notes;
  //               // }
  //               let noteExtraMin:NoteExtraMin = new NoteExtraMin();
  //               noteExtraMin.title = note.title;
  //               tagFull.notes.push(noteExtraMin);
  //               tagFull.userid=userid;
  //             //   tx.executeSql(Query.UPDATE_JSON_OBJ_TAG, [JSON.stringify(tagFull), tagFull.title, userid],
  //             //     (tx: any, res: any)=>{},
  //             //     (tx: any, error: any)=>{
  //             //       console.log('error in updating the single tag');
  //             //       console.log(JSON.stringify(error));
  //             //     }
  //             // );
  //             this.updateJsonObjTag(tx, tagFull,userid);
  //           }
  //         },
  //         (tx: any, error: any)=>{
  //           console.log('error in the select');
  //           console.log(JSON.stringify(error));
  //         }
  //       );
  //       }
  //     }
  //     if(otherTags!=null){
  //       for(let i=0;i<otherTags.length;i++){
  //         // tx.executeSql(Query.INSERT_NOTES_TAGS, [note.title, otherTags[i].title, 'otherTags', userid],
  //         //   (tx: any, res: any)=>{/*nothing*/},
  //         //   (tx: any, error: any)=>{
  //         //     console.log('error in inserting other tags in notes_tags');
  //         //     console.log(JSON.stringify(error));
  //         //   }
  //         // );
  //       tx.executeSql(Query.INSERT_NOTE_TAG_INTO_LOGS, [note.title, note.title, otherTags[i].title, 'otherTags', 'add-tag', userid],
  //         (tx: any, res: any)=>{/*nothing*/},
  //         (tx: any, error: any)=>{
  //           console.log('error in inserting other tags in logs');
  //           console.log(JSON.stringify(error))
  //         }
  //       );
  //       tx.executeSql(Query.GET_TAG_FULL_JSON, [otherTags[i].title, userid],
  //         (tx: any, res: any)=>{
  //           // if(res.rows.length>0){
  //           //     let tag:any = JSON.parse(res.rows.item(0).json_object);
  //           //     let tagFull:TagFull = new TagFull();
  //           //     tagFull.title  = tag.title;
  //           //     tagFull.noteslength = tag.noteslength+1;
  //           //     if(tag.notes!=null && tag.notes != undefined){
  //           //       tagFull.notes=tag.notes;
  //           //     }
  //           //     let noteExtraMin:NoteExtraMin = new NoteExtraMin();
  //           //     noteExtraMin.title = note.title;
  //           //     tagFull.notes.push(noteExtraMin);
  //           //     tagFull.userid=userid;
  //           //     tx.executeSql(Query.UPDATE_JSON_OBJ_TAG, [JSON.stringify(tagFull), tagFull.title, userid],
  //           //       (tx: any, res: any)=>{},
  //           //       (tx: any, error: any)=>{
  //           //         console.log('error in updating the single tag');
  //           //         console.log(JSON.stringify(error));
  //           //       }
  //           //   );
  //           // }
  //           let tag:any = JSON.parse(res.rows.item(0).json_object);
  //           console.log('the tag is:');
  //           console.log(JSON.stringify(tag));
  //
  //           let tagFull:TagFull = new TagFull();
  //           tagFull.title  = tag.title;
  //
  //           if(tag.notes){
  //             tagFull.notes = tag.notes;
  //           }
  //
  //           tagFull.noteslength = tag.noteslength+1;
  //           // if(tag.notes!=null && tag.notes != undefined){
  //           //   tagFull.notes=tag.notes;
  //           // }
  //           let noteExtraMin:NoteExtraMin = new NoteExtraMin();
  //           noteExtraMin.title = note.title;
  //           tagFull.notes.push(noteExtraMin);
  //           tagFull.userid=userid;
  //         //   tx.executeSql(Query.UPDATE_JSON_OBJ_TAG, [JSON.stringify(tagFull), tagFull.title, userid],
  //         //     (tx: any, res: any)=>{},
  //         //     (tx: any, error: any)=>{
  //         //       console.log('error in updating the single tag');
  //         //       console.log(JSON.stringify(error));
  //         //     }
  //         // );
  //         this.updateJsonObjTag(tx, tagFull,userid);
  //         },
  //         (tx: any, error: any)=>{
  //           console.log('error in the select');
  //           console.log(JSON.stringify(error));
  //         }
  //       );
  //       }
  //     }
  //     })
  //     .then(txResult=>{
  //       console.log('add tags ok');
  //       console.log(JSON.stringify(txResult));
  //       resolve(true);
  //     })
  //     .catch(error=>{
  //       console.log('error in adding tags');
  //       console.log(JSON.stringify(error));
  //       reject(error);
  //     })
  //   });
  // }

// private prepareQueryRemoveTagsFromNotesLogs(length:number):string{
//   let result:string = Query.INSERT_NOTE_TAG_INTO_LOGS_2_NO_ROLE;
//   for(let i=0;i<length;i++){
//     result+='(?,?,\'remove-tag\', ?),';
//   }
//   result=result.substr(0, result.length-1);
//   return result;
// }


//joined = joined.substring(0, joined.lastIndexOf('or'));
// private prepareQueryRemoveTagsFromNotes(tags:string[]):string{
//   let query:string = Query.SET_TAG_DELETED_NOTES_TAGS;
//   for(let i=0;i<tags.length;i++){
//     let s:string = 'tagtitle=? or';
//     query = query + s;
//   };
//   query = query.substring(0, query.lastIndexOf('or'));
//   query = query + ');';
//   // console.log('the query is');
//   // console.log(query);
//   return query;
// }

/**
Remove the tags (3rd) from note. UsedTag can be NULL, it should contains the cachced tagfull
with that note inside.
*/

//private removeTags


public removeTagsFromNote(note: NoteFull, userid: string, tags: TagExtraMin[], usedTag?:TagFull[]):Promise<void>{
  return new Promise<void>((resolve, reject)=>{

    usedTag =  Utils.makeArraySafe(usedTag);

    this.getTagsFullByTitle(tags, usedTag, userid, true)
    .then(tagsToUpdate=>{

      return this.db.transaction(tx=>{

        this.removeNoteFromTagsUpdateOnlyTagsCore([note.forceCastToNoteExtraMin()], userid, tagsToUpdate, tx);

        let query:string = Query.prepareQueryRemoveTagsFromNotesLogs(tags.length); /*this one is ok*/
        let param:string[]=Query.expandInsertNoteTagsIntoLogs(note.title, userid, tags);
        tx.executeSql(query, param,
        (tx:any, res:any)=>{console.log('ok updating logs delete notes_tags')},
        (tx:any, error:any)=>{
          console.log('error while updating logs in delete notes_tags');
          console.log(JSON.stringify(error));
        }
      );

      //this.updateJsonObjNote(note, userid, true, tx);
      this.removeTagsFromNotesUpdateOnlyNotesCore(tags, [note], userid, tx);

      })


    })

    .then(txResult=>{
      console.log('ok removed tag from notes');
      resolve();
    })
    .catch(error=>{
      console.log('error in remove tag from note');console.log(JSON.stringify(error));
      reject(error);
    })
  })
}


  public cleanUpEverything(userid: string):Promise<void>{
    return new Promise<void>((resolve, reject)=>{
      this.db.transaction(tx=>{
        /*the first two are now done by two triggers.*/
        // tx.executeSql(Query.CLEAN_UP_NOTES_CREATE, [userid, userid]);
        // tx.executeSql(Query.CLEAN_UP_TAGS_CREATE, [userid, userid]);
        // tx.executeSql(Query.CLEAN_UP_NOTES_SET_DONE, [userid, userid]);
        // tx.executeSql(Query.CLEAN_UP_NOTES_SET_TEXT, [userid, userid]);
        // tx.executeSql(Query.CLEAN_UP_NOTES_SET_LINK, [userid, userid]);
        tx.executeSql(Query.NOTES_TO_CLEAN_UP_SET_TEXT, [userid, userid]);
        tx.executeSql(Query.NOTES_TO_CLEAN_UP_SET_LINK, [userid, userid]);
        tx.executeSql(Query.NOTES_TO_CLEAN_UP_SET_DONE, [userid, userid]);
      })
      .then(txResult=>{
        console.log('cleanup completed');
        console.log(JSON.stringify(txResult));
        resolve();
      })
      .catch(error=>{
        console.log('error in clean up');
        console.log(JSON.stringify(error)),
        reject(error);
      })
    });
  }

  /**
  return an array of LogObjSmart.
  Each object is the result of JSON.parse(db_row.json_object) as NoteExtraMin
  */
  public getObjectNotesToSave(userid: string):Promise<LogObjSmart[]>{
    // console.log('userid: '+userid);
    return new Promise<LogObjSmart[]>((resolve, reject)=>{
      this.db.transaction(tx=>{
        // console.log('query is: '+Query.SELECT_NOTES_TO_SAVE);
        tx.executeSql(Query.SELECT_NOTES_TO_SAVE, [userid],
          (tx: any, res: any)=>{ /*result callback*/
            // console.log('query executed? the rows');
            // console.log(res.rows.length);
            if(res.rows.length<=0){
              resolve(null);
            }else{
              let results:LogObjSmart[]=[];
              for(let i=0;i<res.rows.length;i++){
                let obj: LogObjSmart = new LogObjSmart();
                let tmpNote: any;
                //obj.note = JSON.parse(res.rows.item(i).json_object);
                tmpNote = JSON.parse(res.rows.item(i).json_object);
                // console.log('obj is:');
                // console.log(JSON.stringify(obj.note));
                //modify note.
                let mainTags:string[]=[];
                let otherTags:string[]=[];
                for(let i=0;i<tmpNote.maintags;i++){
                  mainTags.push(tmpNote.maintags[i].title);
                }
                for(let i=0;i<tmpNote.othertags;i++){
                  otherTags.push(tmpNote.othertags[i].title);
                }
                let note:NoteMin = new NoteMin();
                note = tmpNote as NoteMin;
                note.maintags=mainTags;
                note.othertags =otherTags;
                obj.note = note;
                obj.action = DbActionNs.DbAction.create;
                obj.userid = userid;
                results.push(obj);
              }
              resolve(results);
            }
          },
          (tx: any, error: any)=>{ /*error callback*/
            console.log('error in getting notes to save.');
            console.log(JSON.stringify(error));
            //reject(error); /*?????*/
          }
        )
      })
      .then(txResult=>{
        // console.log('txResult');
        // console.log(JSON.stringify(txResult));
        resolve(null); /*never here (?)*/
      })
      .catch(txError=>{
        console.log('tx error');
        console.log(JSON.stringify(txError));
        reject(txError);
      })
    })
  }



  public getObjectNotesToDelete(userid: string):Promise<LogObjSmart[]>{
    return new Promise<LogObjSmart[]>((resolve, reject)=>{
      this.db.transaction(tx=>{
        tx.executeSql(Query.SELECT_NOTES_TO_DELETE, [userid],
          (tx: any, res: any)=>{ /*result callback*/
            if(res.rows.length<=0){
              resolve(null);
            }else{
              let results:LogObjSmart[]=[];
              for(let i=0;i<res.rows.length;i++){
                let obj: LogObjSmart = new LogObjSmart();
                let note:NoteExtraMin = new NoteExtraMin();
                // console.log('the i-object is');
                // console.log(JSON.stringify(res.rows.item(i)));
                note.title = res.rows.item(i).notetitle;
                obj.note = note;
                // console.log('obj is:');
                // console.log(JSON.stringify(obj.note));
                obj.action = DbActionNs.DbAction.create;
                obj.userid = userid;
                results.push(obj);
              }
              resolve(results);
            }
          },
          (tx: any, error: any)=>{ /*error callback*/
            console.log('error in getting notes to delete.');
            console.log(JSON.stringify(error));
            //reject(error); /*?????*/
          }
        )
      })
      .then(txResult=>{
        // console.log('txResult');
        // console.log(JSON.stringify(txResult));
        resolve(null); /*never here (?)*/
      })
      .catch(txError=>{
        console.log('tx error');
        console.log(JSON.stringify(txError));
        reject(txError);
      })
    })
  }


  public getObjectTagsToSave(userid: string):Promise<LogObjSmart[]>{
    return new Promise<LogObjSmart[]>((resolve, reject)=>{
      this.db.transaction(tx=>{
        tx.executeSql(Query.SELECT_TAGS_TO_SAVE, [userid],
          (tx: any, res: any)=>{ /*result callback*/
            if(res.rows.length<=0){
              resolve(null);
            }else{
              let results:LogObjSmart[]=[];
              for(let i=0;i<res.rows.length;i++){
                let obj: LogObjSmart = new LogObjSmart();
                obj.note = null;
                let tag:TagExtraMin = new TagExtraMin();
                tag.title = res.rows.item(i).tagtitle;
                obj.tag = tag;
                // console.log('obj is:');
                // console.log(JSON.stringify(obj.note));
                obj.action = DbActionNs.DbAction.create;
                obj.userid = userid;
                results.push(obj);
              }
              resolve(results);
            }
          },
          (tx: any, error: any)=>{ /*error callback*/
            console.log('error in getting tags to save.');
            console.log(JSON.stringify(error));
            //reject(error); /*?????*/
          }
        )
      })
      .then(txResult=>{
        // console.log('txResult');
        // console.log(JSON.stringify(txResult));
        resolve(null); /*never here (?)*/
      })
      .catch(txError=>{
        console.log('tx error');
        console.log(JSON.stringify(txError));
        reject(txError);
      })
    })
  }



  public getObjectTagsToDelete(userid: string):Promise<LogObjSmart[]>{
    return new Promise<LogObjSmart[]>((resolve, reject)=>{
      this.db.transaction(tx=>{
        tx.executeSql(Query.SELECT_TAGS_TO_DELETE, [userid],
          (tx: any, res: any)=>{ /*result callback*/
            if(res.rows.length<=0){
              resolve(null);
            }else{
              let results:LogObjSmart[]=[];
              for(let i=0;i<res.rows.length;i++){
                let obj: LogObjSmart = new LogObjSmart();
                obj.note = null;
                let tag:TagExtraMin = new TagExtraMin();
                tag.title = res.rows.item(i).tagtitle;
                obj.tag = tag;
                // console.log('obj is:');
                // console.log(JSON.stringify(obj.note));
                obj.action = DbActionNs.DbAction.delete;
                obj.userid = userid;
                results.push(obj);
              }
              resolve(results);
            }
          },
          (tx: any, error: any)=>{ /*error callback*/
            console.log('error in getting tags to delete.');
            console.log(JSON.stringify(error));
            //reject(error); /*?????*/
          }
        )
      })
      .then(txResult=>{
        // console.log('txResult');
        // console.log(JSON.stringify(txResult));
        resolve(null); /*never here (?)*/
      })
      .catch(txError=>{
        console.log('tx error');
        console.log(JSON.stringify(txError));
        reject(txError);
      })
    })
  }


  /**
  * Return an array of LogObjSmart:
  * note is a note min object, with added tag in its 'mainTags'
  * and 'otherTags'.
  * This is very smart, because I can sent to the server all
  * the tags that must be added to that note IN ONE MESSAGE.
  */
  public getObjectTagsToAddToNotes(userid: string):Promise<LogObjSmart[]>{
    return new Promise<LogObjSmart[]>((resolve, reject)=>{
      this.db.transaction(tx=>{
        tx.executeSql(Query.SELECT_TAGS_TO_ADD_TO_NOTES_2, [userid],
          (tx: any, res: any)=>{
            if(res.rows.length<=0){
              resolve(null);
            }else{
              let result:LogObjSmart[]=[];
              for(let i=0;i<res.rows.length;i++){

                if(result.length > 0 && (result[result.length-1].note.title == res.rows.item(i).notetitle)){
                  if(res.rows.item(i).role=='mainTags'){
                    result[result.length-1].note.maintags.push(res.rows.item(i).tagtitle);
                  }else{
                    result[result.length-1].note.othertags.push(res.rows.item(i).tagtitle);
                  }
                  result[result.length-1].action = DbActionNs.DbAction.add_tag;
                  result[result.length-1].userid = userid;
                }else{
                  /*create new note.*/
                  let obj:LogObjSmart = new LogObjSmart();
                  let note:NoteMin = new NoteMin();
                  note.title=res.rows.item(i).notetitle;
                  if(res.rows.item(i).role=='mainTags'){
                    note.maintags.push(res.rows.item(i).tagtitle);
                  }else{
                    note.othertags.push(res.rows.item(i).tagtitle);
                  }
                  obj.userid=userid;
                  obj.action = DbActionNs.DbAction.add_tag;
                  obj.note = note;
                  result.push(obj)
                }
              }
              console.log('the full result is:');
              for(let i=0;i<result.length;i++){
                console.log(JSON.stringify(result[i]));
              }
              resolve(result);
            }
          },
          (tx: any, error: any)=>{
            console.log('error in tx');
            console.log(JSON.stringify(error));
            //reject(error); /*?no....*/
          }
        )
      })
      .then(txResult=>{
        console.log('tx completed');
        console.log(JSON.stringify(txResult));
        resolve(txResult);
      })
      .catch(error=>{
        console.log('tx error'),
        console.log(JSON.stringify(error));
        reject(error);
      })
    })
  }


  /**
  * Return an array of LogObjSmart:
  * note is a note min object. In 'maintags' are pushed ALL the tags to delete.
  * This is very smart, because I can sent to the server all
  * the tags that must be added to that note IN ONE MESSAGE.
  */
  public getObjectTagsToRemoveFromNotes(userid: string):Promise<LogObjSmart[]>{
    return new Promise<LogObjSmart[]>((resolve, reject)=>{
      this.db.transaction(tx=>{
        tx.executeSql(Query.SELECT_TAGS_TO_REMOVE_FROM_NOTES_2, [userid],
          (tx: any, res: any)=>{
            if(res.rows.length<=0){
              resolve(null);
            }else{
              let result:LogObjSmart[]=[];
              for(let i=0;i<res.rows.length;i++){

                if(result.length > 0 && (result[result.length-1].note.title == res.rows.item(i).notetitle)){
                  result[result.length-1].note.maintags.push(res.rows.item(i).tagtitle);
                  result[result.length-1].action = DbActionNs.DbAction.remove_tag;
                  result[result.length-1].userid = userid;
                }else{
                  /*create new note.*/
                  let obj:LogObjSmart = new LogObjSmart();
                  let note:NoteMin = new NoteMin();
                  note.title=res.rows.item(i).notetitle;
                  note.maintags.push(res.rows.item(i).tagtitle);
                  obj.userid=userid;
                  obj.action = DbActionNs.DbAction.remove_tag;
                  obj.note = note;
                  result.push(obj)
                }
              }
              resolve(result);
            }
          },
          (tx: any, error: any)=>{
            console.log('error in tx getting tags to delete');
            console.log(JSON.stringify(error));
            //reject(error); /*?no....*/
          }
        )
      })
      .then(txResult=>{
        console.log('tx completed');
        console.log(JSON.stringify(txResult));
        resolve(txResult);
      })
      .catch(error=>{
        console.log('tx error'),
        console.log(JSON.stringify(error));
        reject(error);
      })
    })
  }


  public getObjectNotesToChangeText(userid: string):Promise<LogObjSmart[]>{
    return new Promise<LogObjSmart[]>((resolve, reject)=>{
      this.db.transaction(tx=>{
        tx.executeSql(Query.SELECT_NOTES_TO_CHANGE_TEXT, [userid],
          (tx: any, res: any)=>{ /*result callback*/
            if(res.rows.length<=0){
              resolve(null);
            }else{
              let results:LogObjSmart[]=[];
              for(let i=0;i<res.rows.length;i++){
                let obj: LogObjSmart = new LogObjSmart();
                obj.tag = null;
                let note:NoteFull = new NoteFull();
                note.title = res.rows.item(i).notetitle;
                note.text = res.rows.item(i).text;
                obj.note = note;
                obj.action = DbActionNs.DbAction.change_text;
                obj.userid = userid;
                // console.log('the current obj');console.log(JSON.stringify(obj));
                results.push(obj);
              }
              // console.log('so the results are: ');console.log(JSON.stringify(results));
              resolve(results);
            }
          },
          (tx: any, error: any)=>{ /*error callback*/
            console.log('error in getting notes to change text.');
            console.log(JSON.stringify(error));
            //reject(error); /*?????*/
          }
        )
      })
      .then(txResult=>{
        // console.log('txResult');
        // console.log(JSON.stringify(txResult));
        resolve(null); /*never here (?)*/
      })
      .catch(txError=>{
        console.log('tx error');
        console.log(JSON.stringify(txError));
        reject(txError);
      })
    })
  }


  public getObjectNotesToChangeLinks(userid: string):Promise<LogObjSmart[]>{
    return new Promise<LogObjSmart[]>((resolve, reject)=>{
      this.db.transaction(tx=>{
        tx.executeSql(Query.SELECT_NOTES_TO_CHANGE_LINKS, [userid],
          (tx: any, res: any)=>{ /*result callback*/
            if(res.rows.length<=0){
              resolve(null);
            }else{
              let results:LogObjSmart[]=[];
              for(let i=0;i<res.rows.length;i++){
                let obj: LogObjSmart = new LogObjSmart();
                obj.tag = null;
                let note:NoteFull = new NoteFull();
                note.title = res.rows.item(i).notetitle;
                // note.links = JSON.parse(res.rows.item(i).links);

                let raw:NoteFull = JSON.parse(res.rows.item(i).json_object);
                note.links = raw.links;

                obj.note = note;
                obj.action = DbActionNs.DbAction.set_link;
                obj.userid = userid;
                results.push(obj);
              }
              resolve(results);
            }
          },
          (tx: any, error: any)=>{ /*error callback*/
            console.log('error in getting notes to change link.');
            console.log(JSON.stringify(error));
            //reject(error); /*?????*/
          }
        )
      })
      .then(txResult=>{
        // console.log('txResult');
        // console.log(JSON.stringify(txResult));
        resolve(null); /*never here (?)*/
      })
      .catch(txError=>{
        console.log('tx error');
        console.log(JSON.stringify(txError));
        reject(txError);
      })
    })
  }


  public getObjectNotesToSetDone(userid: string):Promise<LogObjSmart[]>{
    return new Promise<LogObjSmart[]>((resolve, reject)=>{
      this.db.transaction(tx=>{
        tx.executeSql(Query.SELECT_NOTES_TO_SET_DONE, [userid],
          (tx: any, res: any)=>{ /*result callback*/
            if(res.rows.length<=0){
              resolve(null);
            }else{
              let results:LogObjSmart[]=[];
              for(let i=0;i<res.rows.length;i++){
                let obj: LogObjSmart = new LogObjSmart();
                obj.tag = null;
                let note:NoteFull = new NoteFull();
                note.title = res.rows.item(i).notetitle;
                // note.isdone = res.rows.item(i).isdone;

                let raw:NoteFull = JSON.parse(res.rows.item(i).json_object);
                note.isdone = raw.isdone;

                obj.note = note;
                obj.action = DbActionNs.DbAction.set_done;
                obj.userid = userid;
                results.push(obj);
              }
              resolve(results);
            }
          },
          (tx: any, error: any)=>{ /*error callback*/
            console.log('error in getting notes to set done.');
            console.log(JSON.stringify(error));
            //reject(error); /*?????*/
          }
        )
      })
      .then(txResult=>{
        // console.log('txResult');
        // console.log(JSON.stringify(txResult));
        resolve(null); /*never here (?)*/
      })
      .catch(txError=>{
        console.log('tx error');
        console.log(JSON.stringify(txError));
        reject(txError);
      })
    })
  }


  /**
  * Delete from logs_sequence note;userid;create
  */
  // deleteNotesToSaveFromLogs(userid: string):Promise<any>{
  //   return new Promise<any>((resolve, reject)=>{
  //     this.db.transaction(tx=>{
  //       tx.executeSql(Query.DELETE_NOTES_TO_SAVE_LOGS, [userid],
  //         (tx: any, res: any)=>{console.log('delete ok');},
  //         (tx: any, error: any)=>{
  //           //if(error!=null){
  //             console.log('error in deleting');
  //             console.log(JSON.stringify(error));
  //         //}
  //       }
  //       )
  //     })
  //     .then(txResult=>{
  //       console.log('tx completed');
  //       resolve(true);
  //     })
  //     .catch(txError=>{
  //       console.log('tx error');
  //       console.log(JSON.stringify(txError));
  //       reject(txError);
  //     })
  //   })
  // }

  /**
  * Delete from logs_sequence tag;userid;create
  */
  // deleteTagsToSaveFromLogs(userid: string):Promise<any>{
  //   return new Promise<any>((resolve, reject)=>{
  //     this.db.transaction(tx=>{
  //       tx.executeSql(Query.DELETE_TAGS_TO_SAVE_LOGS, [userid],
  //         (tx: any, res: any)=>{console.log('delete ok');},
  //         (tx: any, error: any)=>{
  //           //if(error!=null){
  //             console.log('error in deleting');
  //             console.log(JSON.stringify(error));
  //         //}
  //       }
  //       )
  //     })
  //     .then(txResult=>{
  //       console.log('tx completed');
  //       resolve(true);
  //     })
  //     .catch(txError=>{
  //       console.log('tx error');
  //       console.log(JSON.stringify(txError));
  //       reject(txError);
  //     })
  //   })
  // }





  /**
  * Delete from logs_sequence all the entry with note-tag-add-tag
  * To do when all the tags that should be added has been sent to
  * to the server.
  *
  */
  // deleteTagsToAddToNotesFromLogs(userid: string):Promise<any>{
  //   return new Promise<any>((resolve, reject)=>{
  //     this.db.transaction(tx=>{
  //       tx.executeSql(Query.DELETE_TAGS_TO_ADD_TO_NOTES, [userid],
  //         (tx: any, res: any)=>{console.log('delete ok');},
  //         (tx: any, error: any)=>{
  //           //if(error!=null){
  //             console.log('error in deleting');
  //             console.log(JSON.stringify(error));
  //         //}
  //       }
  //       )
  //     })
  //     .then(txResult=>{
  //       console.log('tx completed');
  //       resolve(true);
  //     })
  //     .catch(txError=>{
  //       console.log('tx error');
  //       console.log(JSON.stringify(txError));
  //       reject(txError);
  //     })
  //   })
  // }


  //===============================================SINGLE DELETE FROM LOGS_SEQUENCE=========
  //there are not really 'single', and they work for a set as well.




  //tested in console.
  //HERE!!!
  // private prepareNotesMultiVersion(noteTitles: string[], queryString: string, fromLogs:boolean):string{
  //   //let res: string = Query.DELETE_FROM_LOGS_NOTE_CREATED_WHERE_NOTE;
  //   let res: string = queryString;
  //   res = res.replace(')', '');
  //   for(let i=1;i<noteTitles.length;i++){
  //     if(fromLogs){
  //       res+=' or notetitle=?';
  //     }else{
  //       res+=' or title=?'
  //     }
  //
  //   }
  //   res+=res.concat(')');
  //   return res;
  // }





  // //tested in console.
  // private prepareTagsMultiVersion(tagTitles: string[], queryString: string):string{
  //   //let res: string = Query.DELETE_FROM_LOGS_TAG_CREATED_WHERE_TAG;
  //   let res: string = queryString;
  //   res = res.replace(')', '');
  //   for(let i=1;i<tagTitles.length;i++){
  //     res = res.concat(' or tagtitle=?');
  //   }
  //   res = res.concat(')');
  //   return res;
  // }

  /*
  delete the tags from logs where the action is 'delete' and the tagtitle is one of the provided ones.
  */
  deleteNotesToDeleteMultiVersion(noteTitles: string[], userid: string):Promise<void>{
    return new Promise<void>((resolve, reject)=>{
      this.db.transaction(tx=>{
        let query1: string = Query.prepareNotesMultiVersion(noteTitles.length, Query.DELETE_FROM_LOGS_NOTES_TO_DELETE_WHERE_NOTE, true);
        let query2: string = Query.prepareNotesMultiVersion(noteTitles.length, Query.DELETE_FROM_NOTES_NOTES_TO_DELETE_WHERE_NOTE, false); //this one is the problem
        // console.log('query1: '+query1);
        // console.log('query2: '+query2);
        tx.executeSql(query1, [userid].concat(noteTitles),
          (tx:any, res:any)=>{console.log('delete notes-to-delete-logs ok.')},
          (tx: any, err:any)=>{console.log('error in deleting notes-to-delete-logs.');console.log(JSON.stringify(err));
          }
        )
        tx.executeSql(query2, [userid].concat(noteTitles),
          (tx:any, res: any)=>{console.log('delete notes-to-delete-tags ok')},
          (tx:any, err: any)=>{console.log('error in deleting tags-to-delete-notes.');console.log(JSON.stringify(err));
          })
      })
      .then(txResult=>{
        console.log('tx completed');
        resolve();
      })
      .catch(txError=>{
        console.log('txError');
        console.log(JSON.stringify(txError));
        reject(txError);
      })
    })
  }

  /*
  delete the tags from logs where the action is 'delete' and the tagtitle is one of the provided ones.
  */
  deleteTagsToDeleteMultiVersion(tagTitles: string[], userid: string):Promise<any>{
    return new Promise<any>((resolve, reject)=>{
      this.db.transaction(tx=>{
        console.log('tags');
        console.log(JSON.stringify(tagTitles));
        let query1: string = Query.prepareTagsMultiVersion(tagTitles.length, Query.DELETE_FROM_LOGS_TAGS_TO_DELETE_WHERE_TAG, true);
        console.log('query 1');console.log(query1);
        let query2: string = Query.prepareTagsMultiVersion(tagTitles.length, Query.DELETE_FROM_TAGS_TAGS_TO_DELETE_WHERE_TAG, false);
        console.log('query 2');console.log(query2);
        tx.executeSql(query1, [userid].concat(tagTitles),
          (tx:any, res:any)=>{console.log('delete tags-to-delete-logs ok.')},
          (tx: any, err:any)=>{
            console.log('error in deleting tags-to-delete-logs.');console.log(JSON.stringify(err));
          }
        )
        tx.executeSql(query2, [userid].concat(tagTitles),
          (tx:any, res: any)=>{console.log('delete tags-to-delete-tags ok')},
          (tx:any, err: any)=>{
            console.log('error in deleting tags-to-delete-tags ok.');console.log(JSON.stringify(err));
          })
      })
      .then(txResult=>{
        console.log('tx completed');
        resolve(true);
      })
      .catch(txError=>{
        console.log('txError');
        console.log(JSON.stringify(txError));
        reject(txError);
      })
    })
  }


  /**
  Delete from logs_sequence all of the entries like:
  notetitle-by-param; tag; add-tag; mainTags | otherTags
  */
  deleteTagsToAddToSpecificNoteFromLogs(noteTitles: string[], userid: string):Promise<any>{
    return new Promise<any>((resolve, reject)=>{
      this.db.transaction(tx=>{
        let query: string = Query.prepareNotesMultiVersion(noteTitles.length, Query.DELETE_FROM_LOGS_TAGS_TO_ADD_TO_NOTE_WHERE_NOTE, true);
        tx.executeSql(query, [userid].concat(noteTitles),
          (tx:any, res:any)=>{console.log('delete tags-to-add from single note ok.')},
          (tx: any, err:any)=>{
            console.log('error in deleting tags-to-add from single note.');
            console.log(JSON.stringify(err));
          }
        )
      })
      .then(txResult=>{
        console.log('tx completed');
        resolve(true);
      })
      .catch(txError=>{
        console.log('txError');
        console.log(JSON.stringify(txError));
        reject(txError);
      })
    })
  }


  /**
  Delete from logs_sequence all of the entries like:
  notetitle-by-param; tag; remove-tag; mainTags | otherTags
  */
  deleteTagsToRemoveFromSpecificNoteFromLogs(noteTitles: string[], userid: string):Promise<any>{
    return new Promise<any>((resolve, reject)=>{
      this.db.transaction(tx=>{
        let query: string = Query.prepareNotesMultiVersion(noteTitles.length, Query.DELETE_FROM_LOGS_TAGS_TO_DELETE_FROM_NOTE_WHERE_NOTE, true);
        tx.executeSql(query, [userid].concat(noteTitles),
          (tx:any, res:any)=>{console.log('delete tags-to-remove from single note ok.')},
          (tx: any, err:any)=>{
            console.log('error in deleting tags-to-remove from single note.');
            console.log(JSON.stringify(err));
          }
        )
      })
      .then(txResult=>{
        console.log('tx completed');
        resolve(true);
      })
      .catch(txError=>{
        console.log('txError');
        console.log(JSON.stringify(txError));
        reject(txError);
      })
    })
  }


  /**
  Delete from logs_sequence all of the entries like:
  notetitle-by-param; tag; add-tag; mainTags | otherTags
  optimized version that accepts an array of tags title.
  */
  deleteTagToCreateFromLogsMultiVersion(tagTitles: string[], userid: string):Promise<any>{
    // return new Promise<any>((resolve, reject)=>{
    //   this.db.transaction(tx=>{
    //     let query = this.prepareTagsMultiVersion(tagTitles,Query.DELETE_FROM_LOGS_TAG_CREATED_WHERE_TAG, true);
    //     tx.executeSql(query, [userid, tagTitles],
    //       (tx:any, res:any)=>{console.log('delete tags-to-create.')},
    //       (tx: any, err:any)=>{
    //         console.log('error in deleting tags-to-create.');
    //         console.log(JSON.stringify(err));
    //       }
    //     )
    //   })
    //   .then(txResult=>{
    //     console.log('tx completed');
    //     resolve(true);
    //   })
    //   .catch(txError=>{
    //     console.log('txError');
    //     console.log(JSON.stringify(txError));
    //     reject(txError);
    //   })
    // })
    return new Promise<void>((resolve, reject)=>{
      this.db.transaction(tx=>{
        this.deleteTagsToCreateFromLogsMultiVersionCore(tx, tagTitles, userid);
      })
      .then(()=>{resolve();})
      .catch(error=>{console.log('tx error');console.log(JSON.stringify(error.message))})
    })
  }


  private deleteTagsFromTagsBasicCore(tx:any, tagTitles:string[], userid:string):Promise<void>{
    return new Promise<void>((resolve, reject)=>{
      let query = Query.prepareTagsMultiVersion(tagTitles.length, Query.FORCE_DELETE_TAG_MULTI, false);
        tx.executeSql(query, [userid].concat(tagTitles),
          (tx:any, res:any)=>{console.log('delete tags from tags ok.');},
          (tx: any, err:any)=>{console.log('error in deleting tags from tags.');console.log(JSON.stringify(err));}
        )
    })
  }

  private deleteNotesFromNotesBasciCore(tx:any, noteTitles:string[], userid: string):Promise<void>{
    return new Promise<void>((resolve, reject)=>{
      let query = Query.prepareNotesMultiVersion(noteTitles.length, Query.FORCE_DELETE_NOTE_MULTI, false);
        tx.executeSql(query, [userid].concat(noteTitles),
          (tx:any, res:any)=>{console.log('delete notes from notes ok.');},
          (tx: any, err:any)=>{console.log('error in deleting notes from notes.');console.log(JSON.stringify(err));}
        )
    })
  }

  private deleteNotesToCreateFromLogsMultiVersionCore(tx:any, noteTitles:string[], userid:string):Promise<void>{
    return new Promise<void>((resolve, reject)=>{
      let query = Query.prepareNotesMultiVersion(noteTitles.length, Query.DELETE_FROM_LOGS_NOTE_CREATED_WHERE_NOTE, true);
        tx.executeSql(query, [userid].concat(noteTitles),
          (tx:any, res:any)=>{console.log('delete notes-to-create ok.');},
          (tx: any, err:any)=>{console.log('error in deleting notes-to-create.');console.log(JSON.stringify(err));}
        )
    })
  }



  private deleteTagsToCreateFromLogsMultiVersionCore(tx:any, tagTitles:string[], userid:string):Promise<void>{
    return new Promise<void>((resolve, reject)=>{
      let query = Query.prepareTagsMultiVersion(tagTitles.length, Query.DELETE_FROM_LOGS_TAG_CREATED_WHERE_TAG, true);
        tx.executeSql(query, [userid].concat(tagTitles),
          (tx:any, res:any)=>{console.log('delete tags-to-create ok.');},
          (tx: any, err:any)=>{console.log('error in deleting tags-to-create.');console.log(JSON.stringify(err));}
        )
    })
  }


  /**
  Delete from logs_sequence all of the entries like:
  notetitle-by-param; tag; remove-tag; mainTags | otherTags
  Optimized  version that accepts an array of notes title.
  */
  deleteNoteToCreateFromLogsMultiVersion(noteTitles: string[], userid: string):Promise<void>{
    //return new Promise<any>((resolve, reject)=>{
    //   this.db.transaction(tx=>{
    //     let query = this.prepareNotesMultiVersion(noteTitles.length, Query.DELETE_FROM_LOGS_NOTE_CREATED_WHERE_NOTE, true);
    //     tx.executeSql(query, [userid, noteTitles],
    //       (tx:any, res:any)=>{console.log('delete notes-to-create ok.')},
    //       (tx: any, err:any)=>{
    //         console.log('error in deleting notes-to-create.');
    //         console.log(JSON.stringify(err));
    //       }
    //     )
    //   })
    //   .then(txResult=>{
    //     console.log('tx completed');
    //     resolve(true);
    //   })
    //   .catch(txError=>{
    //     console.log('txError');
    //     console.log(JSON.stringify(txError));
    //     reject(txError);
    //   })
    return new Promise<void>((resolve, reject)=>{
      this.db.transaction(tx=>{
        this.deleteNotesToCreateFromLogsMultiVersionCore(tx, noteTitles, userid);
      })
      .then(()=>{resolve();})
      .catch(error=>{console.log('tx error');console.log(JSON.stringify(error.message))})
    })
     //})
  }

  deleteNoteFromLogsSetLinkMultiVersion(noteTitles: string[], userid: string):Promise<any>{
    return new Promise<any>((resolve, reject)=>{
      this.db.transaction(tx=>{
        // let query = this.prepareNotesMultiVersion(noteTitles, Query.DELETE_FROM_LOGS_NOTE_SET_LINK_WHERE_NOTE);
        // tx.executeSql(query, [userid, noteTitles],
        //   (tx:any, res:any)=>{console.log('delete notes-set-link ok.')},
        //   (tx: any, err:any)=>{
        //     console.log('error in deleting notes-set-link.');
        //     console.log(JSON.stringify(err));
        //   }
        // )
        this.deleteSetLinksFromLogsSequenceCore(tx, noteTitles, userid);
      })
      .then(txResult=>{
        console.log('tx completed');
        resolve(true);
      })
      .catch(txError=>{
        console.log('txError');
        console.log(JSON.stringify(txError));
        reject(txError);
      })
    })
  }

  deleteNoteFromLogsSetDoneMultiVersion(noteTitles: string[], userid: string):Promise<any>{
    return new Promise<any>((resolve, reject)=>{
      this.db.transaction(tx=>{
        // let query = this.prepareNotesMultiVersion(noteTitles, Query.DELETE_FROM_LOGS_NOTE_SET_DONE_WHERE_NOTE);
        // tx.executeSql(query, [userid, noteTitles],
        //   (tx:any, res:any)=>{console.log('delete notes-set-done ok.')},
        //   (tx: any, err:any)=>{
        //     console.log('error in deleting notes-set-done.');
        //     console.log(JSON.stringify(err));
        //   }
        // )
        this.deleteSetDoneFromLogsSequenceCore(tx, noteTitles, userid);
      })
      .then(txResult=>{
        console.log('tx completed');
        resolve(true);
      })
      .catch(txError=>{
        console.log('txError');
        console.log(JSON.stringify(txError));
        reject(txError);
      })
    })
  }

  deleteNoteFromLogsChangeTextMultiVersion(noteTitles: string[], userid: string):Promise<any>{
    return new Promise<any>((resolve, reject)=>{
      this.db.transaction(tx=>{
        // let query = this.prepareNotesMultiVersion(noteTitles, Query.DELETE_FROM_LOGS_NOTE_CHANGE_TEXT_WHERE_NOTE);
        // tx.executeSql(query, [userid, noteTitles],
        //   (tx:any, res:any)=>{console.log('delete notes-change-text ok.')},
        //   (tx: any, err:any)=>{
        //     console.log('error in deleting notes-to-create.');
        //     console.log(JSON.stringify(err));
        //   }
        // )
        this.deleteChangeTextFromLogsSequenceCore(tx, noteTitles, userid);
      })
      .then(txResult=>{
        console.log('tx completed');
        resolve(true);
      })
      .catch(txError=>{
        console.log('txError');
        console.log(JSON.stringify(txError));
        reject(txError);
      })
    })
  }


  /*check count if it can be embedded into it.*/
  isThereSomethingToSynch(userid: string):Promise<boolean>{
    return new Promise<boolean>((resolve, reject)=>{
      this.getLogsCount(userid)
      .then(count=>{
        if(count>0){resolve(true);}
        else{resolve(false);}
      })
      .catch(error=>{
        console.log('error in get things to synch');
        console.log(JSON.stringify(error));
        reject(error);
      })
    })
  }





// insertIntoNotesHelp(notes:NoteExtraMin[], userid: string):Promise<any>{
//   return new Promise<any>((resolve, reject)=>{
//     let query: string = this.prepareQueryInsertIntoHelp(Query.INSERT_INTO_NOTES_HELP, notes.length, userid);
//     this.db.executeSql(query, notes.map((currentValue)=>{return currentValue.title}))
//     .then(result=>{
//       resolve(true);
//     })
//     .catch(error=>{
//       console.log('error in notes help insert'),
//       console.log(JSON.stringify(error));
//       reject(error);
//     })
//   })
// }
//
//
// insertIntoTagsHelp(tags:TagAlmostMin[], userid: string):Promise<void>{
//   return new Promise<void>((resolve, reject)=>{
//     let query: string = this.prepareQueryInsertIntoHelp(Query.INSERT_INTO_TAGS_HELP, tags.length, userid);
//     this.db.executeSql(query, tags.map((currentValue)=>{return currentValue.title}))
//     .then(result=>{
//       resolve();
//     })
//     .catch(error=>{
//       console.log('error in tags help insert'),
//       console.log(JSON.stringify(error));
//       reject(error);
//     })
//   })
// }
//
//
// deleteDirtyNotes(userid: string):Promise<void>{
//   return new Promise<void>((resolve, reject)=>{
//     this.db.transaction(tx=>{
//       tx.executeSql(Query.DELETE_DIRTY_NOTES, [userid],
//         (tx:any, res:any)=>{console.log('delete dirty notes ok');},
//         (tx:any, error:any)=>{
//           console.log('error dirty notes');
//           console.log(JSON.stringify(error));
//         }
//       );
//       tx.executeSql(Query.DELETE_NOTES_HELP, [userid],
//         (tx:any, res:any)=>{console.log('delete help notes ok');},
//         (tx:any, error:any)=>{
//           console.log('error help notes');
//           console.log(JSON.stringify(error));
//         }
//       )
//     })
//     .then(txResult=>{
//       console.log('completed the dirty notes');
//       resolve();
//     })
//     .catch(error=>{
//       console.log('error in dirty notes');
//       console.log(JSON.stringify(error));
//       reject(error);
//     })
//   })
// }
//
//
//
// deleteDirtyTags(userid: string):Promise<void>{
//   return new Promise<void>((resolve, reject)=>{
//     this.db.transaction(tx=>{
//       tx.executeSql(Query.DELETE_DIRTY_TAGS, [userid],
//         (tx:any, res:any)=>{console.log('delete dirty tags ok');},
//         (tx:any, error:any)=>{
//           console.log('error tags notes');
//           console.log(JSON.stringify(error));
//         }
//       );
//       tx.executeSql(Query.DELETE_TAGS_HELP, [userid],
//         (tx:any, res:any)=>{console.log('delete help tags ok');},
//         (tx:any, error:any)=>{
//           console.log('error help tags');
//           console.log(JSON.stringify(error));
//         }
//       )
//     })
//     .then(txResult=>{
//       console.log('completed the dirty tags');
//       resolve();
//     })
//     .catch(error=>{
//       console.log('error in dirty tags');
//       console.log(JSON.stringify(error));
//       reject(error);
//     })
//   })
// }


/*
private prepareQueryInsertNotesMinQuietly(length:number, userid:string):string{
  let query:string = Query.INSERT_NOTE_MIN_2;
  for(let i=0;i<length;i++){
    query += '(?,?,'+userid+'),';
  }
  query = query.substr(0, query.length-1);
  return query;
}

*/

// private prepareQueryDeleteForceNote(query:string, length:number):string{
//   let result:string = query;
//   if(length>0){
//     result+=' and (';
//     for(let i=0;i<length;i++){
//       result+=' title = ? or'
//     }
//     result = result.substr(0, result.length-3);
//     result += ')'
//   }
//   return result;
// }

// private getUglyNoteMinFromObject(obj:any):NoteMin{
//   let note:NoteMin = new NoteMin();
//   note.title=obj.title;
//   note.text=obj.text;
//   note.creationdate=obj.creationdate;
//   note.lastmodificationdate=obj.lastmodificationdate;
//   note.isdone=obj.isdone;
//   note.maintags=obj.maintags;
//   note.othertags=obj.othertags;
//   return note;
// }
//force now I decide to not touch tags, user will do a refresh...
//but if it is without net it won't work......
// deleteForceNote(noteObj:NoteMin, userid:string):Promise<void>{
//   return new Promise<void>((resolve,reject)=>{
//     this.db.transaction(tx=>{
//       console.log('the note im going to delete is');
//       console.log(JSON.stringify(noteObj));
//       let note:NoteMin = NoteMin.safeNewNoteFromJsObject(noteObj);
//       // console.log(note instanceof NoteMin);
//       // console.log(typeof note);
//       let minNote:NoteExtraMin = note.getNoteExtraMin();
//       //delete from here
//       //let jsonNote:string = JSON.stringify(minNote);
//       /*need to do this because 'as NoteExtraMin'
//        when jsoning keeps the child object*/
//       //  let tagsString:string[]=note.getTagsAsStringArray();
//       //  let querySmart:string = this.prepareQueryDeleteForceNote(Query.REMOVE_NOTES_FROM_TAGS_SMART_REPLACE, tagsString.length);
//       //  let argsSmart:string[] = [jsonNote, jsonNote, userid].concat(tagsString);
//       // tx.executeSql(querySmart, argsSmart,
//       //   (tx:any, res:any)=>{console.log('remove notes smart replace ok');},
//       //   (tx:any, error:any)=>{console.log('error in smart replace');
//       //     console.log(JSON.stringify(error));}
//       // );
//       // let queryCleanup1:string = this.prepareQueryDeleteForceNote(Query.REMOVE_NOTES_FROM_TAGS_CLEANUP_ONE, tagsString.length);
//       // let argsCleanup1:string[] = [userid].concat(tagsString);
//       // tx.executeSql(queryCleanup1, argsCleanup1,
//       //   (tx:any, res:any)=>{console.log('remove notes tags cleanup one ok');},
//       //   (tx:any, error:any)=>{console.log('error remove notes tags cleanup one');
//       //     console.log(JSON.stringify(error));}
//       // );
//       // let queryCleanup2:string = this.prepareQueryDeleteForceNote(Query.REMOVE_NOTES_FROM_TAGS_CLEANUP_TWO, tagsString.length);
//       // let argsCleanup2:string[] = [userid].concat(tagsString);
//       // tx.executeSql(queryCleanup2, argsCleanup2,
//       //   (tx:any, res:any)=>{console.log('remove notes tags cleanup two ok');},
//       //   (tx:any, error:any)=>{console.log('error remove notes tags cleanup two');
//       //     console.log(JSON.stringify(error));}
//       // );
//       // let queryCleanup3:string = this.prepareQueryDeleteForceNote(Query.REMOVE_NOTES_FROM_TAGS_CLEANUP_THREE, tagsString.length);
//       // let argsCleanup3:string[] = [userid].concat(tagsString);
//       // tx.executeSql(queryCleanup3, argsCleanup3,
//       //   (tx:any, res:any)=>{console.log('remove notes tags cleanup three ok');},
//       //   (tx:any, error:any)=>{console.log('error remove notes tags cleanup three');
//       //     console.log(JSON.stringify(error));}
//       // );
//       // let tags:TagExtraMin[]=note.getTagsAsTagsExtraMinArray();
//       // for(let i=0;i<note.maintags.length+note.othertags.length;i++){
//       //   tx.executeSql(Query.REDUCE_NOTES_LENGTH, [tags[i].title, userid],
//       //     (tx:any, res:any)=>{console.log('remove notes reduce notes length ok');},
//       //     (tx:any, error:any)=>{console.log('error remove notes reduce notes length');
//       //       console.log('error in tag:');
//       //       console.log(JSON.stringify(tags[i]));
//       //       console.log(JSON.stringify(error));}
//       //   );
//       // }
//       // tx.executeSql(Query.REDUCE_NOTES_LENGTH, [userid],
//       //   (tx:any, res:any)=>{console.log('remove notes reduce notes length ok');},
//       //   (tx:any, error:any)=>{console.log('error remove notes reduce notes length ok');
//       //     console.log(JSON.stringify(error));}
//       // );
//
//
//     //leave from here
//     tx.executeSql(Query.FORCE_DELETE_NOTE, [note.title, userid],
//       (tx:any, res:any)=>{console.log('remove note from notes ok');},
//       (tx:any, error:any)=>{console.log('error in remove note from notes');
//       console.log(JSON.stringify(error));}
//       /*this should delete note from logs too, let's see. No unfortunately, don't know why.*/
//     );
//     tx.executeSql(Query.DELETE_FROM_LOGS_NOTE_CREATED_WHERE_NOTE, [userid, note.title],
//       (tx:any, res:any)=>{console.log('ok remove notes from logs');},
//       (tx:any, error:any)=>{console.log('error in remove notes from logs');
//         console.log(JSON.stringify(error));}
//       );
//     })
//     .then(txResult=>{
//       console.log('note force deleted');
//       resolve();
//     })
//     .catch(error=>{
//       console.log('error in delete force note');
//       console.log(JSON.stringify(error.message));
//       reject(error);
//     })
//   })
// }




//even if it's a just a cancellation of a created-right-now tag it might be that is
//already added to other objects.
// deleteForceTag(tag:string, userid:string):Promise<void>{
//   return new Promise<void>((resolve,reject)=>{
//     this.db.transaction(tx=>{
//       let minTag:TagExtraMin = new TagExtraMin();
//       minTag.title=tag;
//       let jsonTag: string = JSON.stringify(minTag);
//       tx.executeSql(Query.REMOVE_TAGS_FROM_NOTES_SMART_REPLACE, [jsonTag, jsonTag, userid],
//         (tx:any, res:any)=>{console.log('remove tags smart replace ok');},
//         (tx:any, error:any)=>{console.log('error in smart replace');
//           console.log(JSON.stringify(error));}
//       );
//       tx.executeSql(Query.REMOVE_TAGS_FROM_NOTES_CLEANUP_ONE, [userid],
//         (tx:any, res:any)=>{console.log('remove tags tags cleanup one ok');},
//         (tx:any, error:any)=>{console.log('error remove tags tags cleanup one');
//           console.log(JSON.stringify(error));}
//       );
//       tx.executeSql(Query.REMOVE_TAGS_FROM_NOTES_CLEANUP_TWO, [userid],
//         (tx:any, res:any)=>{console.log('remove tags tags cleanup two ok');},
//         (tx:any, error:any)=>{console.log('error remove tags tags cleanup two');
//           console.log(JSON.stringify(error));}
//       );
//       tx.executeSql(Query.REMOVE_TAGS_FROM_NOTES_CLEANUP_THREE, [userid],
//         (tx:any, res:any)=>{console.log('remove tags tags cleanup three ok');},
//         (tx:any, error:any)=>{console.log('error remove tags tags cleanup three ');
//           console.log(JSON.stringify(error));}
//       );
//       //TODO check if it is removed from logs too.
//       //no it isn't!!!
//       tx.executeSql(Query.FORCE_DELETE_TAG, [tag, userid],
//         (tx:any, res:any)=>{console.log('final remove tags ok');},
//         (tx:any, error:any)=>{console.log('error final remove tags');
//           console.log(JSON.stringify(error));}
//       );
//       tx.executeSql(Query.DELETE_FROM_LOGS_TAG_CREATED_WHERE_TAG, [userid, tag],
//         (tx:any, res:any)=>{console.log('ok emove tags from logs ok');},
//         (tx:any, error:any)=>{console.log('error remove tags from logs');
//           console.log(JSON.stringify(error));}
//       );
//     })
//     .then(txResult=>{
//       console.log('tag force deleted');
//       resolve();
//     })
//     .catch(error=>{
//       console.log('error in delete force tag');
//       console.log(JSON.stringify(error));
//       reject(error);
//     })
//   })
// }





// private getTagIndex(fullNote:NoteFull, tag:TagExtraMin):IndexTagType{
//   let result:IndexTagType = new IndexTagType();
//   let index:number=-1;
//   for(let i=0;i<fullNote.maintags.length;i++){
//     if(fullNote.maintags[i].title==tag.title){
//       index=i;
//       i=fullNote.maintags.length;
//       result.type=TagType.MAIN;
//     }
//   }
//   if(index==-1){
//     for(let i=0;i<fullNote.othertags.length;i++){
//       if(fullNote.othertags[i].title==tag.title){
//         index=i;
//         i=fullNote.othertags.length;
//         result.type=TagType.OTEHR;
//       }
//     }
//   }
//   result.index = index;
//   return result;
// }

// private removeTagFromNoteObject(note:NoteFull, ind:IndexTagType):NoteFull{
//   let result:NoteFull = note;
//   if(ind.type==TagType.MAIN){
//     result.maintags=result.maintags.splice(ind.index, 1);
//   }else{
//     result.othertags=result.othertags.splice(ind.index, 1);
//   }
//   return result;
// }

//TODO use this everytime is necessary.

/**
update the json obj of the note, if requested, it updates the lastmodificationdate too.
Please note that the lastmodificationdate must be already present in the note.
*/
private updateJsonObjNote(fullNote:NoteFull, userid:string, updateLastModificationDateToo:boolean,tx?:any):void|Promise<void>{
  //console.log('the note im going to update in updatejsonobjnote is');console.log(JSON.stringify(fullNote));
  let json:string = JSON.stringify(fullNote);
  if(tx!=null){
    if(updateLastModificationDateToo){
      tx.executeSql(Query.UPDATE_JSON_OBJ_NOTE_IF_NEEDED_LAST_MOD_2, [json, fullNote.text, fullNote.lastmodificationdate.toISOString(), fullNote.title, json, userid],
        (tx:any, res:any)=>{
          console.log('updated json obj note');
        },
        (tx:any, error:any)=>{console.log('error in update json obj note');
                            console.log(JSON.stringify(error));}
        )
    }else{
      tx.executeSql(Query.UPDATE_JSON_OBJ_NOTE_IF_NEEDED_2, [json, fullNote.text, fullNote.title, json, userid],
        (tx:any, res:any)=>{
          console.log('updated json obj note');
        },
        (tx:any, error:any)=>{console.log('error in update json obj note');
                            console.log(JSON.stringify(error));}
        )
    }
  }else{
    let p:Promise<void>;
    if(updateLastModificationDateToo){
      p = this.db.executeSql(Query.UPDATE_JSON_OBJ_NOTE_IF_NEEDED_LAST_MOD_2, [json, fullNote.text, fullNote.lastmodificationdate.toISOString(), fullNote.title, json, userid]);
    }else{
      p = this.db.executeSql(Query.UPDATE_JSON_OBJ_NOTE_IF_NEEDED_2, [json, fullNote.text, fullNote.title, json, userid]);
    }
    return p;
  }
}

/**
Update the provided tag. It does ONLY an update of the json.
*/
private updateJsonObjTag(fullTag:TagFull, userid:string, tx?:any):void|Promise<void>{
  let json:string =JSON.stringify(fullTag);
  if(tx!=null){
    tx.executeSql(Query.UPDATE_JSON_OBJ_TAG_IF_NEEDED, [json, fullTag.title, json, userid],
      (tx:any, res:any)=>{
        console.log('updated json obj tag');
      },
      (tx:any, error:any)=>{console.log('error in update json obj tag');
                          console.log(JSON.stringify(error));}
      )
  }else{
    return this.db.executeSql(Query.UPDATE_JSON_OBJ_TAG_IF_NEEDED, [json, fullTag.title, json, userid]);
  }
}

/*
private rollbackDeleteTagFromNote(note:NoteMin, error:boolean[],userid:string, noteFull?:NoteFull, tagFull?:TagFull):Promise<void>{
  return new Promise<void>((resolve, reject)=>{
  //   this.db.transaction(tx=>{
  //     //don't use the function 'smart replace' because here I'd have to update NOTES AND TAGS,
  //     //, more or less 8 query, it's more convenient to do a query.
  //     //this is where it changes.
  //     let fullNote:NoteFull = new NoteFull();
  //     let fullTag:TagFull = new TagFull();
  //     let index:IndexTagType;
  //     let isTagFull: boolean = false;
  //     let isNoteFull:boolean = false;
  //
  //     let tags:TagExtraMin[] = note.getTagsAsTagsExtraMinArray();
  //
  //     tx.executeSql(Query.GET_NOTE_FULL_JSON, [note.title, userid],
  //       (tx:any, res:any)=>{
  //         if(res.rows.length<0){
  //           console.log('fatal, no note');
  //           reject(new Error('no note'));
  //         }
  //           let parsedNote= JSON.parse(res.rows.item(0).json_object);
  //           if(!parsedNote.maintags && !parsedNote.othertags){
  //             console.log('note is not full');
  //           }else{
  //             fullNote = parsedNote;
  //             console.log('the note before the mod');
  //             console.log(JSON.stringify(fullNote));
  //             for(let i=0;i<tags.length;i++){
  //               index = fullNote.getTagIndex(tags[i]);
  //               if(index.index==-1){
  //                 reject(new Error('tag not found'));
  //               }
  //               isNoteFull=true;
  //               fullNote.removeTag(index);
  //             }
  //             console.log('the note after the mod');
  //             console.log(JSON.stringify(fullNote));
  //           }
  //     },
  //     (tx:any, error:any)=>{
  //       console.log('error in get note json');
  //       console.log(JSON.stringify(error));
  //     }
  //   );
  //   for(let i=0;i<tags.length;i++){
  //     tx.executeSql(Query.GET_TAG_FULL_JSON, [tags[i].title, userid],
  //       (tx:any, res:any)=>{
  //         if(res.rows.length<0){
  //           console.log('fatal, no tag');
  //           reject(new Error('no tag'));
  //         }
  //         let parsedTag = JSON.parse(res.rows.item(0).json_object);
  //         //remove tag
  //         if(parsedTag.notes){
  //           fullTag = parsedTag;
  //           isTagFull = true;
  //           console.log('the tag before the mod');
  //           console.log(JSON.stringify(fullTag));
  //           fullTag.removeNote(fullNote as NoteExtraMin);
  //           console.log('the tag after the mod');
  //           console.log(JSON.stringify(fullTag));
  //         }else{
  //           console.log('tag is not full');
  //         }
  //       }
  //       )
  //       if(isTagFull){
  //         this.updateJsonObjTag(fullTag, userid, tx);
  //       }
  //       tx.executeSql(Query.DELETE_FROM_LOGS_TAGS_TO_ADD_TO_NOTE_WHERE_NOTE_AND_TAG, [note.title, tags[i].title, userid],
  //         (tx:any, res:any)=>{console.log('remove tags tags to add to notes from logs ok');},
  //         (tx:any, error:any)=>{console.log('error remove tags tags to add to notes from logs');
  //           console.log(JSON.stringify(error));}
  //       )
  //   }
  //     if(isNoteFull){
  //       this.updateJsonObjNote(fullNote, userid, tx);
  //     }
  //   })
  //   .then(txResult=>{
  //     console.log('tag force deleted');
  //     resolve();
  //   })
  //   .catch(error=>{
  //     console.log('error in delete force tag');
  //     console.log(JSON.stringify(error));
  //     reject(error);
  //   })
  // })
}
*/


// private addTagsToNoteUpdateOnlyNote(tx:any, note:NoteFull,  userid:string, updateLastModificationDateToo: boolean, mainTags?:TagExtraMin[], otherTags?:TagExtraMin[]):void{
//   if(mainTags!=null){
//     mainTags = Utils.makeArraySafe(mainTags);
//     note.maintags=note.maintags.concat(mainTags);
//   }
//   if(otherTags!=null){
//     otherTags = Utils.makeArraySafe(otherTags);
//     note.othertags=note.othertags.concat(otherTags);
//   }
//   this.updateJsonObjNote(note, userid, updateLastModificationDateToo, tx);
// }


/*maybe in the future I'll pass full objects.*/
/*
private addTagsToNoteUpdateBoth(tx:any, note:NoteFull|NoteExtraMin, userid:string, updateLastModificationDateToo:boolean,mainTags?: TagExtraMin[], otherTags?:TagExtraMin[]):void{

  let fullNote:NoteFull;
  if(mainTags!=null && otherTags!=null){
    this.addTagsToNoteUpdateOnlyTags(tx, note, userid, mainTags.concat(otherTags));
  }else if(mainTags!=null){
    this.addTagsToNoteUpdateOnlyTags(tx, note, userid, mainTags);
  }else{
    this.addTagsToNoteUpdateOnlyTags(tx, note, userid, otherTags);
  }
  if(note instanceof NoteFull){
    fullNote=note;
  }else{
    this.getNoteFull(note.title, userid)
    .then(note=>{
      if(note!=null){fullNote=note;
        this.addTagsToNoteUpdateOnlyNote(tx, note, userid, updateLastModificationDateToo,mainTags, otherTags);
      }
    })
  }
}
*/


// private removeTagFromNotesFullJsonUpdatingCore(tx:any, note:NoteMin,tags: TagExtraMin[], userid:string):void{
//   let fullTags:TagFull[]=[];
//   Promise.all(tags.map(obj=>{return this.getTagFull(obj.title, userid)}))
//   .then(tags=>{
//     if(tags!=null){fullTags=tags;}
//     fullTags.forEach(tag=>{
//       if(tag!=null){
//         tag.removeNote(note);
//         this.updateJsonObjTag(tag, userid, tx);
//       }
//     })
//   })
//   this.removeTagFromNoteJsonUpdatingOnlyNoteCore(tx, note, fullTags, userid);
//
// }
//
// private removeTagFromNoteJsonUpdatingOnlyNoteCore(tx:any, note:NoteMin, tags:TagExtraMin[], userid:string):void{
//
//       for(let i=0;i<tags.length;i++){
//         let jsonTag: string = JSON.stringify(tags[i]);
//         tx.executeSql(Query.REMOVE_TAGS_FROM_NOTES_SMART_REPLACE, [jsonTag, jsonTag, userid],
//           (tx:any, res:any)=>{console.log('remove tags smart replace ok');},
//           (tx:any, error:any)=>{console.log('error in smart replace');console.log(JSON.stringify(error));}
//         );
//       }
//       tx.executeSql(Query.REMOVE_TAGS_FROM_NOTES_CLEANUP_ONE, [userid],
//         (tx:any, res:any)=>{console.log('remove tags tags cleanup one ok');},
//         (tx:any, error:any)=>{console.log('error remove tags tags cleanup one');console.log(JSON.stringify(error));}
//       );
//       tx.executeSql(Query.REMOVE_TAGS_FROM_NOTES_CLEANUP_TWO, [userid],
//         (tx:any, res:any)=>{console.log('remove tags tags cleanup two ok');},
//         (tx:any, error:any)=>{console.log('error remove tags tags cleanup two');console.log(JSON.stringify(error));}
//       );
//       tx.executeSql(Query.REMOVE_TAGS_FROM_NOTES_CLEANUP_THREE, [userid],
//         (tx:any, res:any)=>{console.log('remove tags tags cleanup three ok');},
//         (tx:any, error:any)=>{console.log('error remove tags tags cleanup three');console.log(JSON.stringify(error));}
//       );
//       //this is where it changes.
// }

//this one is its substitute.

// private undoAddTagToNoteJsonOpCore(tx:any, note:NoteMin, tags:TagExtraMin[], userid:string):void{
//   //don't use the function 'smart replace' because here I'd have to update NOTES AND TAGS,
//   //, more or less 8 query, it's more convenient to do a query.
//   //this is where it changes.
//   let fullNote:NoteFull = null;
//   let fullTags:TagFull[];
//   let index:IndexTagType;
//   let isTagFull: boolean = false;
//   let isNoteFull:boolean = false;
//
//   this.getNoteFull(note.title, userid)
//   .then(note=>{
//     if(note!=null){
//       fullNote = note;
//       tags.forEach(obj=>{note.removeTag(obj)});
//       return Promise.all(tags.map(obj=>{
//         if(obj!=null){return this.getTagFull(obj.title, userid)}
//       }));
//     }
//     return Promise.resolve(null);
//   })
//   .then(fullObj=>{
//     if(fullObj!=null){
//       fullTags = fullObj as TagFull[];
//       fullTags.forEach(obj=>{
//         if(obj!=null){obj.removeNote(fullNote as NoteExtraMin)}
//       });
//     }
//
//       if(fullTags!=null){
//         fullTags.forEach(obj=>{this.updateJsonObjTag(obj, userid, tx)});
//       }
//       if(fullNote!=null){
//         this.updateJsonObjNote(fullNote, userid, tx);
//       }
//   })


  // let tags:TagExtraMin[] = note.getTagsAsTagsExtraMinArray();

//   tx.executeSql(Query.GET_NOTE_FULL_JSON, [note.title, userid],
//     (tx:any, res:any)=>{
//       if(res.rows.length<0){
//         console.log('fatal, no note');
//         // reject(new Error('no note'));
//       }
//         let parsedNote= JSON.parse(res.rows.item(0).json_object);
//         if(!parsedNote.maintags && !parsedNote.othertags){
//           console.log('note is not full');
//         }else{
//           fullNote = parsedNote;
//           console.log('the note before the mod');
//           console.log(JSON.stringify(fullNote));
//           for(let i=0;i<tags.length;i++){
//             index = fullNote.getTagIndex(tags[i]);
//             if(index.index==-1){
//               // reject(new Error('tag not found'));
//             }
//             isNoteFull=true;
//             fullNote.removeTag(index);
//           }
//           console.log('the note after the mod');
//           console.log(JSON.stringify(fullNote));
//         }
//   },
//   (tx:any, error:any)=>{
//     console.log('error in get note json');
//     console.log(JSON.stringify(error));
//   }
// );
// for(let i=0;i<tags.length;i++){
//   tx.executeSql(Query.GET_TAG_FULL_JSON, [tags[i].title, userid],
//     (tx:any, res:any)=>{
//       if(res.rows.length<0){
//         console.log('fatal, no tag');
//         // reject(new Error('no tag'));
//       }
//       let parsedTag = JSON.parse(res.rows.item(0).json_object);
//       //remove tag
//       if(parsedTag.notes){
//         fullTag = parsedTag;
//         isTagFull = true;
//         console.log('the tag before the mod');
//         console.log(JSON.stringify(fullTag));
//         fullTag.removeNote(fullNote as NoteExtraMin);
//         console.log('the tag after the mod');
//         console.log(JSON.stringify(fullTag));
//       }else{
//         console.log('tag is not full');
//       }
//     }
//     )
//     if(isTagFull){
//       this.updateJsonObjTag(fullTag, userid, tx);
//     }
//     tx.executeSql(Query.DELETE_FROM_LOGS_TAGS_TO_ADD_TO_NOTE_WHERE_NOTE_AND_TAG, [note.title, tags[i].title, userid],
//       (tx:any, res:any)=>{console.log('remove tags tags to add to notes from logs ok');},
//       (tx:any, error:any)=>{console.log('error remove tags tags to add to notes from logs');
//         console.log(JSON.stringify(error));}
//     )
// }
//   if(isNoteFull){
//     this.updateJsonObjNote(fullNote, userid, tx);
//   }
// }

/*
private rollbackAddTagToNote(note: NoteMin, error:boolean[],userid:string):Promise<void>{
  return new Promise<void>((resolve, reject)=>{
    // this.db.transaction(tx=>{
    //   let tags:TagExtraMin[]=note.maintags.map(obj=>{return TagExtraMin.NewTag(obj)});
    //   for(let i=0;i<tags.length;i++){
    //     let jsonTag: string = JSON.stringify(tags[i]);
    //     tx.executeSql(Query.REMOVE_TAGS_FROM_NOTES_SMART_REPLACE, [jsonTag, jsonTag, userid],
    //       (tx:any, res:any)=>{console.log('remove tags smart replace ok');},
    //       (tx:any, error:any)=>{console.log('error in smart replace');
    //         console.log(JSON.stringify(error));}
    //     );
    //     //originally it was at the end of everything.
    //     tx.executeSql(Query.DELETE_FROM_LOGS_TAGS_TO_ADD_TO_NOTE_WHERE_NOTE_AND_TAG, [note.title, tags[i].title, userid],
    //       (tx:any, res:any)=>{console.log('remove tags tags to add to notes from logs ok');},
    //       (tx:any, error:any)=>{console.log('error remove tags tags to add to notes from logs');
    //         console.log(JSON.stringify(error));}
    //     );
    //   }
    //   tx.executeSql(Query.REMOVE_TAGS_FROM_NOTES_CLEANUP_ONE, [userid],
    //     (tx:any, res:any)=>{console.log('remove tags tags cleanup one ok');},
    //     (tx:any, error:any)=>{console.log('error remove tags tags cleanup one');
    //       console.log(JSON.stringify(error));}
    //   );
    //   tx.executeSql(Query.REMOVE_TAGS_FROM_NOTES_CLEANUP_TWO, [userid],
    //     (tx:any, res:any)=>{console.log('remove tags tags cleanup two ok');},
    //     (tx:any, error:any)=>{console.log('error remove tags tags cleanup two');
    //       console.log(JSON.stringify(error));}
    //   );
    //   tx.executeSql(Query.REMOVE_TAGS_FROM_NOTES_CLEANUP_THREE, [userid],
    //     (tx:any, res:any)=>{console.log('remove tags tags cleanup three ok');},
    //     (tx:any, error:any)=>{console.log('error remove tags tags cleanup three');
    //       console.log(JSON.stringify(error));}
    //   );
    //   //this is where it changes.
    // })
    // .then(txResult=>{
    //   console.log('tag force deleted');
    //   resolve();
    // })
    // .catch(error=>{
    //   console.log('error in delete force tag');
    //   console.log(JSON.stringify(error));
    //   reject(error);
    // })
    })
}
*/




private deleteChangeTextFromLogsSequenceCore(tx:any, noteTitles:string[], userid:string):void{
  let query:string = Query.prepareNotesMultiVersion(noteTitles.length, Query.DELETE_FROM_LOGS_NOTE_CHANGE_TEXT_WHERE_NOTE, true);
  tx.executeSql(query, [userid].concat(noteTitles),
    (tx:any, res:any)=>{
      console.log('delete notes-to-change-text')
    },
    (tx:any, error:any)=>{
      console.log('error delete notes-to-change-text');console.log(JSON.stringify(error));
    }
  )
}

private deleteSetDoneFromLogsSequenceCore(tx:any, noteTitles:string[], userid:string):void{
  let query:string = Query.prepareNotesMultiVersion(noteTitles.length, Query.DELETE_FROM_LOGS_NOTE_SET_DONE_WHERE_NOTE, true);
  tx.executeSql(query, [userid].concat(noteTitles),
    (tx:any, res:any)=>{
      console.log('delete notes-to-set-done')
    },
    (tx:any, error:any)=>{
      console.log('error delete notes-to-set-done');console.log(JSON.stringify(error));
    }
  )
}

private deleteSetLinksFromLogsSequenceCore(tx:any, noteTitles:string[], userid:string):void{
  let query:string = Query.prepareNotesMultiVersion(noteTitles.length, Query.DELETE_FROM_LOGS_NOTE_SET_LINK_WHERE_NOTE, true);
  tx.executeSql(query, [userid].concat(noteTitles),
    (tx:any, res:any)=>{
      console.log('delete notes-to-set-link')
    },
    (tx:any, error:any)=>{
      console.log('error delete notes-to-set-link');
      console.log(JSON.stringify(error));
    }
  )
}


//the 'canonical' one is different.
private removeAddTagToNoteFromLogsCore(noteTitle:string, tags:string[], userid:string, tx?:any):Promise<void>|void{
  console.log('the tags the cause problem');console.log(JSON.stringify(tags));
  let query:string = Query.prepareTagsMultiVersion(tags.length, Query.DELETE_FROM_LOGS_TAGS_TO_ADD_TO_NOTE_WHERE_NOTE_AND_TAG_MULTI, true);
  console.log('the query is: '+query);
  if(tx!=null){
    tx.executeSql(query, [noteTitle, userid].concat(tags),
    (tx:any, res:any)=>{console.log('ok removed tags-to-add-to-notes')},
    (tx:any, error:any)=>{console.log('error removing tags-to-add-to-notes');console.log(JSON.stringify(error));}
  )
  }else{
    return new Promise<void>((resolve, reject)=>{
      this.db.executeSql(query, [noteTitle, userid].concat(tags))
      .then(()=>{
        console.log('ok removed tags-to-add-to-notes');resolve();
      }).catch(error=>{
        console.log('error removing tags-to-add-to-notes');console.log(JSON.stringify(error));reject(error);
      })
    })
  }
}

/*
//ok is's here but for not needed so far.
private removeDeleteTagFromNoteFromLogsCore(noteTitle:string, tags:string[], userid:string, tx?:any):Promise<void>|void{
  let query:string = this.prepareTagsMultiVersion(tags.length, Query.DELETE_FROM_LOGS_TAGS_TO_DELETE_FROM_NOTE_WHERE_NOTE_AND_TAG_MULTI, true);
  if(tx!=null){
    tx.executeSql(query, [noteTitle, userid].concat(tags),
    (tx:any, res:any)=>{console.log('ok removed tags-to-delete-from-notes')},
    (tx:any, error:any)=>{console.log('error removing tags-to-delete-from-notes');console.log(JSON.stringify(error));}
  )
  }else{
    return new Promise<void>((resolve, reject)=>{
      this.db.executeSql(query, [noteTitle, userid].concat(tags))
      .then(()=>{
        console.log('ok removed tags-to-delete-from-notes');resolve();
      }).catch(error=>{
        console.log('error removing tags-to-delete-from-notes');console.log(JSON.stringify(error));reject(error);
      })
    })
  }
}
*/


/**
Considering that the tags to remove are placed into note.maintags (according to gettagstoaddtonotes),
this method will remove all of those tags from the given note, then it removes the note from those tags.
Finally, it removes that action from the logs.
*/
private rollbackAddTagToNote(note: NoteMin, error:boolean[],userid:string):Promise<void>{
  return new Promise<void>((resolve, reject)=>{
    //this.db.transaction(tx=>{
    //   //if(AtticError.isNotFoundErrorFromArray(error)){
    //   if(AtticError.isDuplicateErrorFromArray(error))
    //     this.removeTagFromNotesFullJsonUpdatingCore(tx, note, note.getTagsAsTagsExtraMinArray(),userid);
    //   //}
    //   this.removeAddTagToNoteFromLogsCore(note.title, note.maintags, userid, tx);
    // }).then(()=>{console.log('ok rollback add-tags');resolve();})
    // .catch(error=>{console.log('error rollback add-tags');console.log(JSON.stringify(error));reject(error)})
    //  })
    this.getTagsFullByNote(note, [], userid)
    .then(tags=>{

      return this.db.transaction(tx=>{
        this.removeNoteFromTagsUpdateOnlyTagsCore([note.forceCastToNoteExtraMin()], userid, tags, tx);
        this.removeTagsFromNotesUpdateOnlyNotesCore(tags, [note.upgrade()], userid, tx);
        this.removeAddTagToNoteFromLogsCore(note.title, note.maintags, userid, tx);
      })
      .then(()=>{
        console.log('ok rollback add-tags');resolve();
      })
      .catch(error=>{
        console.log('error rollback add-tags');console.log(JSON.stringify(error));reject(error)
      })
    })
  })
}

// //big problem: how to know where the tag was? just remove.
// private rollbackDeleteTagFromNote(note:NoteMin, error:boolean[],userid:string, noteFull?:NoteFull, tagFull?:TagFull):Promise<void>{
//   return new Promise<void>((resolve, reject)=>{
//   this.db.transaction(tx=>{
//     if(AtticError.isNotesTagsLimitErrorFromArray(error) || AtticError.isNotFoundErrorFromArray(error)){
//       this.addTagsToNoteUpdateBoth(tx, note, note.getTagsAsTagsExtraMinArray(),userid);
//     }
//     this.removeDeleteTagFromNoteFromLogsCore(note.title, note.maintags, userid, tx);
//   }).then(()=>{console.log('ok rollback delete-tags');resolve();})
//   .catch(error=>{console.log('error rollback delete-tags');console.log(JSON.stringify(error));reject(error)})
//   })
// }

private rollbackChangeText(note:NoteExtraMin, userid:string):Promise<void>{
  return new Promise<void>((resolve, reject)=>{
    this.db.transaction(tx=>{
      this.deleteChangeTextFromLogsSequenceCore(tx, [note.title], userid);
    })
    .then(txResult=>{
      console.log('tx ok: delete notes-to-change-text');
      resolve();
    })
    .catch(error=>{
      console.log('error in tx: delete notes-to-change-text');
      console.log(JSON.stringify(error));
      reject(error);
    })
  })
}


private rollbackSetDone(note:NoteExtraMin, userid:string):Promise<void>{
  return new Promise<void>((resolve, reject)=>{
    this.db.transaction(tx=>{
      this.deleteSetDoneFromLogsSequenceCore(tx, [note.title], userid);
    })
    .then(txResult=>{
      console.log('tx ok: delete notes-to-set-done');
      resolve();
    })
    .catch(error=>{
      console.log('error in tx: delete notes-to-set-done');
      console.log(JSON.stringify(error));
      reject(error);
    })
  })
}

private rollbackSetLink(note:NoteExtraMin, userid:string):Promise<void>{
  return new Promise<void>((resolve, reject)=>{
    this.db.transaction(tx=>{
      this.deleteSetLinksFromLogsSequenceCore(tx, [note.title], userid);
    })
    .then(txResult=>{
      console.log('tx ok: delete notes-to-set-link');
      resolve();
    })
    .catch(error=>{
      console.log('error in tx: delete notes-to-set-link');
      console.log(JSON.stringify(error));
      reject(error);
    })
  })
}


  //choose what to do...just logs or notes too?
  //by seeing it in action I think it's better the first.
  /**
  This method delete the given note from notes and from logs too, considering two erros:
  postgres duplicate error and postgres is user reached max error. If user reached max error,
  the note is deleted from tags too.
  */
  private rollbackCreateNote(note:NoteFull|NoteMin, error:boolean[], userid:string):Promise<void>{
    return new Promise<void>((resolve, reject)=>{
      let p:Promise<any>;
      let isUserR:boolean = AtticError.isUserReachedMaxErrorFromArray(error);
      if(isUserR){
        p=this.getTagsFullByNote(note, [], userid);
      }else{
        p=Promise.resolve('nothing');
      }
      p.then(tags=>{

        return this.db.transaction(tx=>{

          if(tags!='nothing' && isUserR){
            this.removeNoteFromTagsUpdateOnlyTagsCore([note.forceCastToNoteExtraMin()], userid, tags, tx);
          }

          if(isUserR || AtticError.isUserReachedMaxErrorFromArray(error)){
            this.deleteNotesFromNotesBasciCore(tx, [note.title], userid);
          }
          this.deleteNotesToCreateFromLogsMultiVersionCore(tx, [note.title], userid);
        })
        .then(()=>{
          console.log('ok rollback create note');resolve();
        }).catch(error=>{console.log('error in rollback create note');console.log(JSON.stringify(error.message));reject(error);})


      })
      // this.db.transaction(tx=>{
      //   if(AtticError.isDuplicateErrorFromArray(error) || AtticError.isUserReachedMaxErrorFromArray(error))
      //     this.deleteNotesFromNotesBasciCore(tx, [note.title], userid);
      //   this.deleteNotesToCreateFromLogsMultiVersionCore(tx, [note.title], userid);
      // })
      // .then(()=>{console.log('ok rollback create note');resolve()})
      // .catch(error=>{console.log('error in rollback create note');console.log(JSON.stringify(error.message));reject(error);})
    })
  }

  /**
  This method delete the given tag tags and from logs too, considering two erros:
  postgres duplicate error and postgres is user reached max error.
  */
  private rollbackCreateTag(tag:TagExtraMin, error:boolean[],userid:string):Promise<void>{
    return new Promise<void>((resolve, reject)=>{
      // this.db.transaction(tx=>{
      //   if(AtticError.isDuplicateErrorFromArray(error) || AtticError.isUserReachedMaxErrorFromArray(error))
      //     this.deleteTagsFromTagsBasicCore(tx, [tag.title], userid);
      //   this.deleteTagsToCreateFromLogsMultiVersionCore(tx, [tag.title], userid);
      // })
      // .then(()=>{console.log('ok rollback create tag');resolve()})
      // .catch(error=>{console.log('error in rollback create tag');console.log(JSON.stringify(error.message));reject(error);})
      let p:Promise<any>;
      let isUserR:boolean = AtticError.isUserReachedMaxErrorFromArray(error);
      if(isUserR){
        p=this.getNotesByTags([new TagAlmostMin(tag.title)], userid, false);
      }else{
        p=Promise.resolve('nothing');
      }
      p.then(notes=>{

        return this.db.transaction(tx=>{
          if(notes!='nothing' && isUserR){
            this.removeTagsFromNotesUpdateOnlyNotesCore([tag], notes,userid, tx);
          }

          if(AtticError.isDuplicateErrorFromArray(error) || isUserR){
            this.deleteTagsFromTagsBasicCore(tx, [tag.title], userid);
          }
          this.deleteTagsToCreateFromLogsMultiVersionCore(tx, [tag.title], userid);

        })
        .then(()=>{console.log('ok rollback create tag');resolve()})
        .catch(error=>{console.log('error in rollback create tag');console.log(JSON.stringify(error.message));reject(error);})
      })
    })
  }

/*
how rollback works:
problems are only when:
- add/remove tag
  addtag:
    the json object of the involved note and tag are updated by
    removing that tag.
    the log object is removed from the logs_sequence.
  removetag
    I use the cleanup with json.
    the log object is removed from the logs_sequence.
for the other I just remove the log object from the logs_sequence.
*/
public rollbackModification(logObj: LogObjSmart,userid:string, errorArray?:boolean[]):Promise<void>{
  return new Promise<void>((resolve, reject)=>{
    let p:Promise<void>;
    switch(logObj.action){
      // case DbActionNs.DbAction.remove_tag:
      //   /*the note to delete are in the maintags of the note.*/
      //   p=this.rollbackDeleteTagFromNote(logObj.note, errorArray, userid);
      //   break;
      case DbActionNs.DbAction.add_tag:
        p=this.rollbackAddTagToNote(logObj.note,errorArray, userid);
        break;
      case DbActionNs.DbAction.change_text:
        p=this.rollbackChangeText(logObj.note, userid);
        break;
      case DbActionNs.DbAction.set_done:
        p=this.rollbackSetDone(logObj.note,userid);
        break;
      case DbActionNs.DbAction.set_link:
        p=this.rollbackSetLink(logObj.note,userid);
        break;
      case DbActionNs.DbAction.create:
        if(logObj.note!=null){
          p=this.rollbackCreateNote(logObj.note as NoteMin,errorArray, userid);
        }else{
          p=this.rollbackCreateTag(logObj.tag.title,errorArray, userid);
        }
        break;
      default:
        console.log('nothing to rollback');
        p=Promise.resolve();
        break;
    }
    p.then(result=>{
      console.log('rollback done');
      resolve();
    })
    p.catch(error=>{
      console.log('rollback error');
      console.log(JSON.stringify(error));
      reject(error);
    })
  });
}


  public empty(userid:string):Promise<void>{
    return new Promise<void>((resolve, reject)=>{
      this.db.transaction(tx=>{
        tx.executeSql(Query.DELETE_EVERYTHING_FROM_NOTES, [userid],
          (tx:any, res:any)=>{console.log('ok delete everything from notes')},
          (tx:any, error:any)=>{console.log('error delete everything from notes');console.log(JSON.stringify(error));}
        );
        tx.executeSql(Query.DELETE_EVERYTHING_FROM_TAGS, [userid],
          (tx:any, res:any)=>{console.log('ok delete everything from tags')},
          (tx:any, error:any)=>{console.log('error delete everything from tags');console.log(JSON.stringify(error));}
        );
        tx.executeSql(Query.DELETE_EVERYTHING_FROM_LOGS, [userid],
          (tx:any, res:any)=>{console.log('ok delete everything from logs')},
          (tx:any, error:any)=>{console.log('error delete everything from logs');console.log(JSON.stringify(error));}
        );
      })
      .then(txResult=>{
        console.log('ok delete everything');
        resolve();
      })
      .catch(error=>{
        console.log('error delete everything');
        console.log(JSON.stringify(error.message));
        reject(error);
      })
    })
  }


  /**
  select title from notes where the title matches
  exactly with one title in the db. If none, null is returned.
  */
  selectTitleFromNotes(title:string, userid:string):Promise<string>{
    return new Promise<string>((resolve, reject)=>{
      this.db.executeSql(Query.SELECT_TITLE_FROM_NOTES, [title, userid])
      .then(result=>{
        if(result.rows.length <= 0){
          resolve(null);
        }else{
          resolve(result.rows.item(0).title as string);
        }
      })
      .catch(error=>{
        console.log('error in title from notes');
        console.log(JSON.stringify(error.message));
        reject(error);
      })
    })
  }

  /**
  select title from tags where the title matches
  exactly with one title in the db. If none, null is returned.
  */
  selectTitleFromTags(title:string, userid:string):Promise<string>{
    return new Promise<string>((resolve, reject)=>{
      this.db.executeSql(Query.SELECT_TITLE_FROM_TAGS, [title, userid])
      .then(result=>{
        if(result.rows.length <= 0){
          resolve(null);
        }else{
          resolve(result.rows.item(0).title as string);
        }
      })
      .catch(error=>{
        console.log('error in title from tags');
        console.log(JSON.stringify(error.message));
        reject(error);
      })
    })
  }



/*think about remove notes_tags.*/

private static mkSummaryAvailable(summary: UserSummary):UserSummary{
  if(summary.data.isfree){
    summary.data.availablenotes = Const.NOTES_LIMIT-summary.data.notescount;
    summary.data.availabletags = Const.TAGS_LIMIT-summary.data.tagscount;
  }else{
    summary.data.availablenotes = Number.POSITIVE_INFINITY;
    summary.data.availabletags = Number.POSITIVE_INFINITY;
  }
  return summary;
}

private static getUserSummaryFromRes(res:any, summary:UserSummary):UserSummary{
  for(let i=0;i<res.rows.length;i++){
    if(res.rows.item(i).type=='logs'){
      summary.data.logscount = res.rows.item(i).count;
    }
    else if(res.rows.item(i).type=='notes'){
      summary.data.notescount = res.rows.item(i).count;
    }else if(res.rows.item(i).type=='tags'){
      summary.data.tagscount = res.rows.item(i).count;
    }else{
      summary.data.isfree = res.rows.item(i).free;
    }
  }
  summary.data.notescount = ((summary.data.notescount)==null) ? 0 : summary.data.notescount;
  summary.data.tagscount = ((summary.data.tagscount)==null) ? 0 : summary.data.tagscount;
  summary.data.logscount = ((summary.data.logscount)==null) ? 0 : summary.data.logscount;

  summary = Db.mkSummaryAvailable(summary);

  // console.log('the summary here'),
  // console.log(JSON.stringify(summary));
  return summary;
}


getUserSummary(userid: string):Promise<UserSummary>{
  return new Promise<UserSummary>((resolve, reject)=>{
    this.db.executeSql(Query.GET_SMART_SUMMARY, [userid, userid])
    .then(result=>{
      let summary:UserSummary = new UserSummary();
      summary.userid=userid;
      if(result.rows.length>4){
        console.log('error in summary');
        reject(new Error('view is not as long as expected'));
      }else{
        summary = Db.getUserSummaryFromRes(result, summary);
        resolve(summary);
      }
    })
    .catch(error=>{
      console.log('error in get summary'),
      console.log(JSON.stringify(error));
      reject(error);
    })
  })
}

insertSetFree(free:boolean, userid:string):Promise<void>{
  return new Promise<void>((resolve, reject)=>{
    this.db.executeSql(Query.INSERT_SET_FREE, [free, free, userid])
    .then(result=>{
      console.log('ok insert set free');
      resolve();
    })
    .catch(error=>{
      console.log('error in set free');
      console.log(JSON.stringify(error));
      reject(error);
    })
  })
}

/*
@
*/

logout(userid:string):Promise<void>{
  return new Promise<void>((resolve, reject)=>{
    this.db.executeSql(Query.DELETE_TOKEN, [userid])
    .then(()=>{
      console.log('ok delete token');
      resolve();
    }).catch(error=>{
      console.log('delete token error');console.log(JSON.stringify(error.message));
      reject(error);
    })
  })
}


}
