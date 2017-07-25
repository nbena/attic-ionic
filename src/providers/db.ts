import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import { SQLite } from 'ionic-native';
import { Platform } from 'ionic-angular';
import { Query } from '../public/query';
import { Table, Const, DbAction, WhichField, SqliteError, IndexTagType, TagType } from '../public/const';
import { Utils } from '../public/utils';
import { NoteExtraMin, NoteFull, NoteSQLite,NoteMin } from '../models/notes';
import { TagExtraMin, TagFull, /*TagMin,*/ TagAlmostMin, TagSQLite } from '../models/tags';
import { UserSummary } from '../models/user_summary';
//import * as Promise from 'bluebird';

// import 'rxjs/add/operator/map';

// class SQLiteLogObject{
//   _id: number;
//   action: string;
//   refNotes: string;
//   refTags: string;
//   refNotesToSave: number;
//   refTagsToSave: number;
//   done: boolean;
//   data: string;
// }
//
//
// export class LogObject{
//   _id: number;

//   action: Action;
//   refNotes: string;
//   refTags: string;
//   refNotesToSave: number;
//   refTagsToSave: number;
//   done: boolean;
//   data: any;
//
//   public static LogObjectParse(row: any):LogObject{
//     let obj = new LogObject();
//     obj._id=row._id;
//     obj.action=Action[<string>row.action];
//     obj.refNotes=row.refNote;
//     obj.refTags=row.refTag;
//     obj.refNotesToSave=row.refNoteToSave;
//     obj.refTagsToSave=row.refTagToSave;
//     obj.done=row.done;
//     obj.data = JSON.parse(row.data);
//     return obj;
//   }
//
//   public toSQLiteObject():SQLiteLogObject{
//     let obj = new SQLiteLogObject();
//     obj._id=this._id;
//     obj.action=Action[this.action];
//     obj.refNotes=this.refNotes;
//     obj.refTags=this.refTags;
//     obj.refNotesToSave=this.refNotesToSave;
//     obj.refTagsToSave=this.refTagsToSave;
//     obj.done=this.done;
//     obj.data = JSON.stringify(this.data);
//     return obj;
//   }
//
// }
//
// class DbUtils{
//   query: string;
//   data: any[];
// }

export class LogObjMin{

  note: string;
  userid: string;
  tag: string;
  action: DbAction.DbAction;
  role: string;
}

export class LobObjFull{
  note: NoteFull;
  userid: string;
  tag: TagExtraMin;
  action: DbAction.DbAction;
  role: string;
}

export class LogObjSmart{
  note: any;
  userid: string;
  tag: any;
  action: DbAction.DbAction;
  role: string;
}

/*
  Generated class for the Db provider.

  See https://angular.io/docs/ts/latest/guide/dependency-injection.html
  for more info on providers and Angular 2 DI.
*/
@Injectable()
export class Db {

  open : boolean = false; /*to be sure everything is ok.*/
  private db : SQLite;

  private logsCount: number = 0;
  private notesCount: number = 0;
  private tagsCount: number = 0;

  // private userid: string = null;
  // private token: any = null;

  private promise: Promise<SQLite>;


  constructor(private platform: Platform) {
    console.log('Hello Db Provider');

    //if(!this.open) {
    this.promise = new Promise<SQLite>((resolve, reject)=>{
      this.platform.ready().then(ready=>{
      //  let tempUserid: string = '';
        this.db = new SQLite();
        this.db.openDatabase(
          {name: "attic.db", location: "default"})
            .then(db=>{
              return this.db.transaction(tx=>{
                tx.executeSql('pragma foreign_keys = ON;',[]);
                tx.executeSql(Query.CREATE_NOTES_TABLE,[]);
                tx.executeSql(Query.CREATE_TAGS_TABLE,[]);
                tx.executeSql(Query.CREATE_NOTES_TAGS_TABLE,[]);
                tx.executeSql(Query.CREATE_LOGS_TABLE,[]);
                tx.executeSql(Query.CREATE_AUTH_TABLE,[]);
                tx.executeSql(Query.CREATE_NOTES_HELP_TABLE,[]);
                tx.executeSql(Query.CREATE_TAGS_HELP_TABLE,[]);
                tx.executeSql(Query.CREATE_VIEW_COUNTS, []);
                tx.executeSql(Query.CREATE_TRIGGER_DELETE_NOTE_COMPRESSION, []);
                tx.executeSql(Query.CREATE_TRIGGER_DELETE_TAG_COMPRESSION, []);
              });
            })
            .then(transactionResult=>{
              return this.db.executeSql(Query.GET_TOKEN, []);
            })
            .then(tokenResult=>{
              this.open = true;
              if(tokenResult.rows.length > 0){
                // this.token = tokenResult.rows.item(0).token;
                // this.userid = tokenResult.rows.item(0).userid;
                /*return this.count(this.userid);*/
              }else{
                resolve(this.db);
              }
            })
            .then(count=>{
              resolve(this.db);
            })
            .catch(error=>{
              this.open=false;
              console.log('error in creating tables.');
              console.log(JSON.stringify(error));
              reject(error);
            })
      });
    })
    //});
  }

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
/*JUST ONE TOKEN WILL BE IN THE DB.*/
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

public setToken(token: any, userid: string):Promise<any>{
  return new Promise<any>((resolve, reject)=>{
    try{
      this.promise.then(db=>{
        db.executeSql(Query.INSERT_TOKEN,[token, userid])
        .then(result=>{
          resolve(true);
        })
      })
    }catch(e){
      if(e.message == SqliteError.DUPLICATE_KEY_AUTH){
        //user is already there.
        this.db.executeSql(Query.INSERT_ONLY_TOKEN, [token, userid])
        .then(result=>{
          resolve(true);
        })
        .catch(error=>{
          reject(error);
          /*don't know if it's correct.*/
        })
      }
      reject(e);
    }
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

public insertOrUpdateNote(note: NoteFull, userid: string):Promise<void>{
  return new Promise<any>((resolve, reject)=>{
    let isPresent: boolean;
    this.db.executeSql(Query.NOTE_EXISTS, [note.title, userid])
    .then(result=>{
      let p:Promise<any>;
      console.log('is present?');
      if(result.rows.length > 0){
        isPresent = true;
        console.log('yes');
        /*static readonly UPDATE_NOTE_2 = 'update notes set text=?, remote_lastmodificationdate=?, creationdate=?, isdone=?, links=?, json_object=? where title=? and json_object <> ? and userid=?';*/
        p=this.db.executeSql(Query.UPDATE_NOTE_2,[note.text, note.lastmodificationdate, note.creationdate, note.isdone, note.links, JSON.stringify(note), note.title, JSON.stringify(note), userid]);
      }else{
        isPresent=false;
        console.log('no');
        /*  static readonly INSERT_NOTE = 'insert into notes(title, userid, text, creationdate, remote_lastmodificationdate, isdone, links, json_object) values(?,?,?,?,?,?,?,?)';*/
        p=this.db.executeSql(Query.INSERT_NOTE, [note.title, userid, note.text, note.creationdate, note.lastmodificationdate, note.isdone, JSON.stringify(note.links), JSON.stringify(note)]);
      }
      return p;
    })
    .then(postInsert=>{
      return Promise.all([
        note.maintags.map((tag)=>{
          console.log('currently I\'m working on main');
          console.log(JSON.stringify(tag));
          return this.db.executeSql(Query.TAG_EXISTS, [tag.title, userid])
          .then(result=>{
            if(result.rows.length==0){
              /*static readonly INSERT_TAG_MIN = 'insert into tags(title, json_object) values (?,?)';*/
              return this.db.executeSql(Query.INSERT_TAG_MIN, [tag.title, JSON.stringify(tag)]);
            }
          })
          .then(secondResult=>{
            /*  static readonly INSERT_NOTES_TAGS = 'insert into notes_tags(notetitle,tagtitle, role, userid) values(?,?,?,?);';*/
            return  this.db.executeSql(Query.INSERT_NOTES_TAGS, [note.title, tag.title, 'mainTags', userid]);
          })
        })
      ]);
    })



      .then((results)=>{
        console.log('done with mnaintags');
        return Promise.all([
          note.othertags.map((tag)=>{
            console.log('currently I\'m working on other');
            console.log(JSON.stringify(tag));
            return this.db.executeSql(Query.TAG_EXISTS, [tag.title, userid])
            .then(result=>{
              if(result.rows.length==0){
                return this.db.executeSql(Query.INSERT_TAG_MIN, [tag.title, JSON.stringify(tag)]);
              }
            })
            .then(secondResult=>{
              return  this.db.executeSql(Query.INSERT_NOTES_TAGS, [note.title, tag.title, 'otherTags', userid]);
            })
          })
        ])
      })
      // .then(results=>{
      //   return this.getNotesCountAdvanced(userid);
      // })
      // .then(notesCount=>{
      //   this.notesCount = notesCount;
      //   return this.getTagsCountAdvanced(userid);
      // })
      // .then(tagsCount=>{
      //   this.tagsCount = tagsCount;
      //   resolve(true);
      // })
      .then(results=>{
        resolve();
      })
      .catch(error=>{
        console.log('error:');
        console.log(JSON.stringify(error));
        reject(error);
      })

    })
}

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


public createNewNote2(note:NoteFull, tags:TagAlmostMin[], userid: string):Promise<void>{
  return new Promise<any>((resolve, reject)=>{
    this.db.transaction(tx=>{
      /*p=this.db.executeSql(Query.INSERT_NOTE, [note.title, note.userid, note.text, note.creationdate, note.lastmodificationdate, note.isdone, note.links, JSON.stringify(note)]);*/
      /* insert into notes(title, userid, text, creationdate, remote_lastmodificationdate, isdone, links, json_object) values(?,?,?,?,?,?,?,?,?)';*/
      tx.executeSql(Query.INSERT_NOTE, [note.title, userid, note.text, note.creationdate, note.lastmodificationdate, note.isdone, JSON.stringify(note.links), JSON.stringify(note)],
      (tx:any, res:any)=>{
        if(res){
          console.log('res note is');
          console.log(JSON.stringify(res));
        }
      }, (tx:any, err: any)=>{
          console.log('error in insert note');
          console.log(JSON.stringify(err));
      });

      /*'insert into logs (notetitle, action) values (?,?)';*/
      tx.executeSql(Query.INSERT_NOTE_OLDTITLE_INTO_LOGS, [note.title, note.title, 'create', userid],
      (tx:any, res:any)=>{
        if(res){
          console.log('res logs is');
          console.log(JSON.stringify(res));
        }
      }, (tx:any, err: any)=>{
          console.log('error in insert log');
          console.log(JSON.stringify(err));
      });

      note.maintags.forEach((tag)=>{
/*   = 'insert into notes_tags(notetitle,tagtitle, role) values(?,?,?);';*/
        tx.executeSql(Query.INSERT_NOTES_TAGS, [note.title, tag.title, 'mainTags', userid],
        (tx:any, res:any)=>{
          if(res){
            console.log('res maintags is');
            console.log(JSON.stringify(res));
          }
        }, (tx:any, err: any)=>{
            console.log('error in insert maintag');
            console.log(JSON.stringify(err));
        });

        tx.executeSql(Query.UPDATE_JSON_OBJ_TAG,[JSON.stringify(tag), tag.title, userid],
        (tx:any, res:any)=>{
          if(res){
            console.log('res json maintags is');
            console.log(JSON.stringify(res));
          }
        }, (tx:any, err: any)=>{
            console.log('error in update json_obj maintag');
            console.log(JSON.stringify(err));
        })
        // this.updateFullTag(tx, tag, userid);
      });

      note.othertags.map((tag)=>{
        tx.executeSql(Query.INSERT_NOTES_TAGS, [note.title, tag.title, 'otherTags', userid],
        (tx:any, res:any)=>{
          if(res){
            console.log('res other is');
            console.log(JSON.stringify(res));
          }
        }, (tx:any, err: any)=>{
              console.log('error in insert othertag');
              console.log(JSON.stringify(err));
            });
        tx.executeSql(Query.UPDATE_JSON_OBJ_TAG,[JSON.stringify(tag), tag.title, userid],
        (tx:any, res:any)=>{
          if(res){
            console.log('res othertags obj is');
            console.log(JSON.stringify(res));
          }
        }, (tx:any, err: any)=>{
              console.log('error in update json_obj othertag');
              console.log(JSON.stringify(err));
            })
      });
      //resolve(true);
  })
  // .then(txResult=>{
  //   /*update the note count.*/
  //   return this.getNotesCountAdvanced(userid);
  // })
  .then(notesCount=>{
    // this.notesCount = notesCount;
    console.log('tx completed, note created');
    resolve();
  })
  .catch(error=>{
    console.log('transaction error:');
    console.log(JSON.stringify(error));
    reject(error);
  })
})
}


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

/*
if not full, I will return null.
*/
public getNoteFull(title: string, userid: string):Promise<NoteFull>{
  return new Promise<NoteFull>((resolve, reject)=>{
    this.db.executeSql(Query.GET_NOTE_FULL_JSON, [title, userid])
    .then(result=>{
      let note:NoteFull;
      if(result.rows.length<=0){
        resolve(null);
      }else{
        /*try the parsing.*/
        let rawResult:any = result.rows.item(0);
        note = JSON.parse(rawResult.json_object) as NoteFull;
        console.log('the note is');
        console.log(JSON.stringify(note));
        /*now a couple of checks to see if it's full.*/
        if(note.text == null || !note.text || note.text == undefined){
          console.log('throw the error, note is not full!');
          /*can't do the check on maintags because THEY CAN BE NULL, same for other tags.*/
          // reject(new Error(Const.ERR_NOTE_NOT_FULL));
          resolve(null);
        }else{
          /*if here the note is ok.*/
          resolve(note);
        }
      }
    })
    .catch(error=>{
      reject(error);
    })
  });
}

public getTagFull(title: string, userid: string):Promise<TagFull>{
  return new Promise<TagFull>((resolve, reject)=>{
    this.db.executeSql(Query.GET_TAG_FULL_JSON, [title, userid])
    .then(result=>{
      let tag:TagFull;
      if(result.rows.length<=0){
        resolve(null);
      }else{
        /*try the parsing.*/
        let rawResult:any = result.rows.item(0);
        tag = JSON.parse(rawResult.json_object) as TagFull;
        console.log('the tag is');
        console.log(JSON.stringify(tag));
        /*check if it's full.*/
        if(tag.notes == null || tag.notes.length < 0 || tag.notes == undefined){
          console.log('throw the error, tag is not full!');

          resolve(null);
        }else{
          /*if here the note is ok.*/
          resolve(tag);
        }
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

private prepareQueryInsertNotesMinQuietly(length:number, userid:string):string{
  let query:string = Query.INSERT_NOTE_MIN_2;
  for(let i=0;i<length;i++){
    query += '(?,?,'+userid+'),';
  }
  query = query.substr(0, query.length-1);
  return query;
}

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

private expandArrayNotesMinWithEverything(notes:NoteExtraMin[], userid:string):string[]{
  let array:string[]=[];
  for(let i=notes.length-1;i>=0;i--){
    array.push(notes[i].title);
    array.push(JSON.stringify(notes[i]));
    array.push(userid);
  }
  return array;
}

private expandArrayTagsMinWithEverything(tags:TagAlmostMin[], userid:string):string[]{
  let array:string[]=[];
  for(let i=tags.length-1;i>=0;i--){
    array.push(tags[i].title);
    array.push(JSON.stringify(tags[i]));
    array.push(userid);
  }
  return array;
}


private prepareQueryInsertIntoHelp(baseQuery: string, length:number, userid:string):string{
  for(let i=0;i<length;i++){
    baseQuery += '(?,?,?),';
  }
  baseQuery = baseQuery.substr(0, baseQuery.length-1);
  return baseQuery;
}


public insertNotesMinSmartAndCleanify(notes: NoteExtraMin[], userid: string):Promise<void>{
  return new Promise<void>((resolve, reject)=>{
    this.db.transaction(tx=>{
      /*first insert into notes_help*/
      let query:string = this.prepareQueryInsertIntoHelp(Query.INSERT_INTO_NOTES_HELP, notes.length, userid);
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

public insertTag(tag:TagAlmostMin, userid:string):Promise<void>{
  return new Promise<void>((resolve, reject)=>{
    let json:string=JSON.stringify(tag);
    this.db.executeSql(Query.UPDATE_TAG_2, [json, tag.title, json, userid])
    .then(result=>{
      console.log('tag updated');
      resolve();
    })
    .catch(error=>{
      console.log('error update tag');
      console.log(JSON.stringify(error));
      reject(error);
    })
  })
}

public insertTagsMinSmartAndCleanify(tags: TagAlmostMin[], userid: string):Promise<void>{
  return new Promise<void>((resolve, reject)=>{
    this.db.transaction(tx=>{
      let query:string = this.prepareQueryInsertIntoHelp(Query.INSERT_INTO_TAGS_HELP, tags.length, userid);
      tx.executeSql(query, this.expandArrayTagsMinWithEverything(tags, userid),
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

public getNotesMin(userid: string):Promise<NoteExtraMin[]>{
  return new Promise<NoteExtraMin[]>((resolve, reject)=>{
    this.db.executeSql(Query.SELECT_NOTES_MIN, [userid])
    .then(result=>{
      let array:NoteExtraMin[] = [];
      for(let i=0;i<result.rows.length;i++){
        let rawResult:any=result.rows.item(i).json_object;
        // let date:any = JSON.parse(rawResult).lastmodificationdate;
        let obj:NoteExtraMin = JSON.parse(rawResult);
        // console.log('object returned notes: ');
        // console.log(JSON.stringify(obj));
        // if(date!=null){
        //   let tObject1
        // }
        array.push(obj);
      }
      // console.log('the array is:');
      // console.log(JSON.stringify(array));
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
        let obj:TagAlmostMin = JSON.parse(rawResult);
        if(obj.noteslength == null){
          obj.noteslength=0;
        }

        console.log('object returned tags: ');
        console.log(JSON.stringify(obj));
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

private setDoneJustLocal(note: NoteFull, userid: string):Promise<any>{
  return this.db.executeSql(Query.UPDATE_NOTE_SET_DONE, [note.isdone, JSON.stringify(note), note.title, userid]);
}

private setDoneAlsoRemote(note: NoteFull, userid: string):Promise<any>{
  return new Promise<any>((resolve, reject)=>{
    this.db.transaction(tx=>{
      tx.executeSql(Query.UPDATE_NOTE_SET_DONE, [note.isdone, JSON.stringify(note), note.title, userid]);
      tx.executeSql(Query.INSERT_NOTE_OLDTITLE_INTO_LOGS, [note.title, note.title, 'set-done', userid]);
    })
    .then(txResult=>{
      console.log('tx completed');
      resolve(true);
    })
    .catch(error=>{
      console.log('tx set done error');
      console.log(JSON.stringify(error));
      reject(error);
    })
  })
}

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
    let inTheServer: boolean = false;
    this.db.executeSql(Query.IS_NOTE_NOT_IN_THE_SERVER, [note.title, userid])
    .then(result=>{
      if(result.rows.length > 0){
        // console.log('the note is not in the server');
        // inTheServer = false;
        return this.setDoneJustLocal(note, userid);
      }else{
        // console.log('the note is already in the server');
        // inTheServer = true;
        return this.setDoneAlsoRemote(note, userid);
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


private setTextJustLocal(note: NoteFull, userid: string):Promise<any>{
  return this.db.executeSql(Query.UPDATE_NOTE_SET_TEXT, [note.text, JSON.stringify(note), note.title, userid]);
}

private setTextAlsoRemote(note: NoteFull, userid: string):Promise<any>{
  return new Promise<any>((resolve, reject)=>{
    this.db.transaction(tx=>{
      tx.executeSql(Query.UPDATE_NOTE_SET_TEXT, [note.text, JSON.stringify(note), note.title, userid]);
      tx.executeSql(Query.INSERT_NOTE_OLDTITLE_INTO_LOGS, [note.title, note.title,'change-text', userid]);
    })
    .then(txResult=>{
      console.log('tx completed');
      resolve(true);
    })
    .catch(error=>{
      console.log('tx set text error');
      console.log(JSON.stringify(error));
      reject(error);
    })
  })
}

/*a full object in order to re-calculate the json_object and insert it directly.
If i use just the title, I'd have to get to json_object, modify and reinsert. */
public setText(note :NoteFull, userid: string):Promise<any>{
  /*UODATE_NOTE_SET_DONE = 'update note set isdone=?, json_object=? where title=?';*/
  /*'select * from logs where notetitle=? and action=\'create\'';*/
  /*first check if the note must be sent to the server, if so,
  I can only update it.
  If the note is already in the server, I need to write modification to the log.
  */
  return new Promise<any>((resolve, reject)=>{
    let inTheServer: boolean = false;
    this.db.executeSql(Query.IS_NOTE_NOT_IN_THE_SERVER, [note.title, userid])
    .then(result=>{
      if(result.rows.length > 0){
        // console.log('the note is not in the server');
        // inTheServer = false;
        return this.setTextJustLocal(note, userid);
      }else{
        // console.log('the note is already in the server');
        // inTheServer = true;
        return this.setTextAlsoRemote(note, userid);
      }
    })
    .then(upadteResuullt=>{
      console.log('set text ok'),
      resolve(true);
    })
    .catch(error=>{
      console.log('error in set-text');
      console.log(JSON.stringify(error));
      reject(error);
    })
  })
}


private setLinksJustLocal(note: NoteFull, userid: string):Promise<any>{
  return this.db.executeSql(Query.UPDATE_NOTE_SET_LINKS, [JSON.stringify(note.links), JSON.stringify(note), note.title, userid]);
}

private setLinksAlsoRemote(note: NoteFull, userid: string):Promise<any>{
  return new Promise<any>((resolve, reject)=>{
    this.db.transaction(tx=>{
      tx.executeSql(Query.UPDATE_NOTE_SET_LINKS, [JSON.stringify(note.links), JSON.stringify(note), note.title, userid]);
      tx.executeSql(Query.INSERT_NOTE_OLDTITLE_INTO_LOGS, [note.title, note.title,'set-link', userid]);
    })
    .then(txResult=>{
      console.log('tx completed');
      resolve(true);
    })
    .catch(error=>{
      console.log('tx set link error');
      console.log(JSON.stringify(error));
      reject(error);
    })
  })
}

/*a full object in order to re-calculate the json_object and insert it directly.
If i use just the title, I'd have to get to json_object, modify and reinsert. */
public setLinks(note :NoteFull, userid: string):Promise<any>{
  /*UODATE_NOTE_SET_DONE = 'update note set isdone=?, json_object=? where title=?';*/
  /*'select * from logs where notetitle=? and action=\'create\'';*/
  /*first check if the note must be sent to the server, if so,
  I can only update it.
  If the note is already in the server, I need to write modification to the log.
  */
  return new Promise<any>((resolve, reject)=>{
    let inTheServer: boolean = false;
    this.db.executeSql(Query.IS_NOTE_NOT_IN_THE_SERVER, [note.title, userid])
    .then(result=>{
      if(result.rows.length > 0){
        // console.log('the note is not in the server');
        // inTheServer = false;
        return this.setLinksJustLocal(note, userid);
      }else{
        // console.log('the note is already in the server');
        // inTheServer = true;
        return this.setLinksAlsoRemote(note, userid);
      }
    })
    .then(upadteResuullt=>{
      console.log('set links ok'),
      resolve(true);
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
  note.title = newTitle;
  return this.db.executeSql(Query.UPDATE_NOTE_SET_TITLE, [newTitle, JSON.stringify(note), oldTitle, userid]);
}

/*a changing on tags will make it lose its fullness*/
public setTagTitle(tag: TagExtraMin, newTitle: string, userid: string):Promise<any>{
  let oldTitle:string = tag.title;
  tag.title = newTitle;
  return this.db.executeSql(Query.UPDATE_TAG_SET_TITLE, [newTitle, JSON.stringify(tag), oldTitle, userid]);
}



  public getNotesByTags(tags: TagAlmostMin[], userid: string):Promise<NoteExtraMin[]>{
    return new Promise<NoteExtraMin[]>((resolve, reject)=>{
      let queryString: string = Query.SELECT_NOTES_MIN_BY_TAGS;
      if(tags.length!=1){
        /*have to prepare it, if not, it is already ready for query.*/
        for(let i=1;i<tags.length;i++){
          queryString = queryString.concat(' or tagtitle=?');
        }
      }
      // console.log('the query is:');
      // console.log(queryString);
      this.db.executeSql(queryString, [userid].concat(tags.map((tag)=>{return tag.title})))
      .then(result=>{
        let notes:NoteExtraMin[] = [];
        console.log('db result is:');
        console.log(JSON.stringify(result));
        if(result.rows.length > 0){
          for(let i=0;i<result.rows.length;i++){
            // console.log('result.rows.item(i)');
            // console.log(JSON.stringify(result.rows.item(i)));
            // console.log(JSON.stringify(result.rows));
            let noteTitle:string = result.rows.item(i).notetitle;
            let note: NoteExtraMin = new NoteExtraMin();
            note.title = noteTitle;
            notes.push(note);
          }
        }
        resolve(notes);
      })
      .catch(error=>{
        console.log('error in getting notes by tags');
        console.log(JSON.stringify(error));
        reject(error);
      })
    })
  }

  getNotesByText(text: string, userid: string):Promise<NoteExtraMin[]>{
    return new Promise<NoteExtraMin[]>((resolve, reject)=>{
      text = '%'+text+'%';
      this.db.executeSql(Query.SELECT_NOTES_MIN_BY_TEXT, [text, userid])
      .then(result=>{
        let notes:NoteExtraMin[]=[];
        if(result.rows.length <= 0){
          resolve(notes);
        }else{
          for(let i=0;i<result.rows.length;i++){
            let note:NoteExtraMin = new NoteExtraMin();
            note.title=result.rows.item(i).title;
            notes.push(note);
          }
          resolve(notes);
        }
      })
      .catch(error=>{
        console.log('error in notes by text');
        console.log(JSON.stringify(error));
        reject(error);
      })
    });
  }


  deleteNote(note: NoteExtraMin, userid: string):Promise<any>{
    return new Promise<any>((resolve, reject)=>{
      this.db.transaction(tx=>{
        tx.executeSql(Query.INSERT_NOTE_OLDTITLE_INTO_LOGS, [note.title, note.title, 'delete', userid]);
        tx.executeSql(Query.SET_NOTE_DELETED, [note.title, userid]);
        tx.executeSql(Query.SET_NOTE_DELETED_NOTES_TAGS, [note.title, userid]);
      })
      .then(txResult=>{
        console.log('tx completed, result:');
        console.log(JSON.stringify(txResult));
        resolve(true);
      })
      .catch(error=>{
        console.log('tx error');
        console.log(JSON.stringify(error));
        reject(error);
      })
    })
  }

  createTag(tag: TagFull, userid: string):Promise<any>{
    return new Promise<any>((resolve , reject)=>{
      this.db.transaction(tx=>{
        tx.executeSql(Query.INSERT_TAG, [tag.title, userid, JSON.stringify(tag)],
        (tx: any, res: any)=>{/*nothing*/},
        (tx: any, error: any)=>{
          console.log('error in insert tag');
          console.log(JSON.stringify(error));
        }
      );
      tx.executeSql(Query.INSERT_TAG_OLDTITLE_INTO_LOGS, [tag.title, tag.title, 'create', userid],
      (tx: any, res: any)=>{/*nothing*/},
      (tx: any, error: any)=>{
        console.log('error in insert tag in logs');
        console.log(JSON.stringify(error));
      }
    )
      })
      .then(txResult=>{
        console.log('tag creation completed');
        resolve(true);
      })
      .catch(error=>{
        console.log('tag creation error');
        console.log(JSON.stringify(error));
        reject(error);
      })
    });
  }

//TODO rewrite a bit the modificationof the json object.
  deleteTag(tag: TagExtraMin, userid: string):Promise<any>{
    return new Promise<any>((resolve, reject)=>{
      this.db.transaction(tx=>{
        tx.executeSql(Query.INSERT_TAG_OLDTITLE_INTO_LOGS, [tag.title, tag.title, 'delete', userid]);
        //,
          // (tx:any, res:any)=>{},
          // (tx:any, error:any)=>{
          //   console.log('first insert error');
          //   console.log(JSON.stringify(error));
          // });
        /*now update the json_object of eventual full notes.*/
        tx.executeSql(Query.GET_TITLE_AND_JSON_OF_NOTES_TO_UPDATE, [tag.title, userid],
          (tx: any, res: any)=>{ /*result callback*/
            // console.log('select result');
            // console.log(JSON.stringify(res));
            if(res.rows.length <= 0){
              console.log('no note to update');
              /*return;*/
            }else{
              for(let i=0;i<res.rows.length;i++){
                console.log('I have to update:');
                console.log(JSON.stringify(res.rows.length));
                let json_object:any = JSON.parse(res.rows.item(i).json_object);
                // console.log('item(i):');
                // console.log(JSON.stringify(res.rows.item(i)));
                // console.log('parsed is:');
                // console.log(JSON.stringify(json_object));
                let role:string = res.rows.item(i).role;
                let title: string = res.rows.item(i).title;
                // if(role == 'mainTags'){
                //   json_object.maintags.splice(Utils.myIndexOf(json_object.maintags, tag),1);
                //   console.log('removed maintag:');
                // }else{
                //   json_object.othertags.splice(Utils.myIndexOf(json_object.othertags, tag),1);
                //   console.log('removed othertag:');
                // }
                let note:NoteFull;
                if(!json_object.maintags && !json_object.othertags){
                  console.log('tag is not full, nothing to do.');
                }else{
                  note= json_object as NoteFull;
                  if(role=='mainTags'){
                    note.removeTag(note.getTagIndex(tag, TagType.MAIN));
                  }else{
                    note.removeTag(note.getTagIndex(tag, TagType.OTHER));
                  }
                }
                console.log(JSON.stringify(note));
                //tx.executeSql(Query.UPDATE_JSON_OBJ_NOTE, [JSON.stringify(json_object),title,userid]);
                this.updateJsonObjNote(tx, note, userid);
              }
            }
          },
          (tx: any, error: any)=>{ /*error callback*/
            console.log('error in select:');
            console.log(JSON.stringify(error));
          }
        )
        tx.executeSql(Query.SET_TAG_DELETED, [tag.title, userid ],
          (tx:any, res:any)=>{
            console.log('set tag deleted ok');
          },
          (tx:any, error:any)=>{
            console.log('error in set tag deleted');
            console.log(JSON.stringify(error));
          }
        );
        tx.executeSql(Query.SET_TAG_DELETED_IN_ALL_NOTES_TAGS, [tag.title, userid],
          (tx:any, res:any)=>{
            console.log('set tag deleted notes tags ok');
          },
          (tx:any, error:any)=>{
            console.log('error in set tag deleted notes tags');
            console.log(JSON.stringify(error));
          }
        )
    })
      .then(txResult=>{
        console.log('tx completed, result:');
        console.log(JSON.stringify(txResult));
        resolve(true);
      })
      .catch(error=>{
        console.log('tx error');
        console.log(JSON.stringify(error));
        reject(error);
      })
    })
  }


  public addTags(note: NoteFull,  userid: string, mainTags? :  TagExtraMin[], otherTags?: TagExtraMin[]):Promise<any>{
    return new Promise<any>((resolve, reject)=>{
      this.db.transaction(tx=>{
        /*first update note with a new json_object*/
      //   tx.executeSql(Query.UPDATE_JSON_OBJ_NOTE,[JSON.stringify(note), note.title, userid],
      //     (tx: any, res: any)=>{/*nothing*/console.log('updated json_obj note');},
      //     (tx: any, error: any)=>{
      //       console.log('error in update JSON object.');
      //       console.log(JSON.stringify(error));
      //     }
      // );
      this.updateJsonObjNote(tx, note, userid);
      if(mainTags!=null){
        for(let i=0;i<mainTags.length;i++){
          tx.executeSql(Query.INSERT_NOTES_TAGS, [note.title, mainTags[i].title, 'mainTags', userid],
            (tx: any, res: any)=>{/*nothing*/console.log('update notes_tags main');},
            (tx: any, error: any)=>{
              console.log('error in inserting main tags in notes_tags');
              console.log(JSON.stringify(error));
            }
        );
        tx.executeSql(Query.INSERT_NOTE_TAG_INTO_LOGS, [note.title, note.title, mainTags[i].title, 'mainTags', 'add-tag', userid],
          (tx: any, res: any)=>{/*nothing*/console.log('insert into logs ok');},
          (tx: any, error: any)=>{
            console.log('error in inserting main tags in logs');
            console.log(JSON.stringify(error))
          }
        );
        tx.executeSql(Query.GET_TAG_FULL_JSON, [mainTags[i].title, userid],
          (tx: any, res: any)=>{
            if(res.rows.length>0){
                let tag:any = JSON.parse(res.rows.item(0).json_object);
                console.log('the tag is:');
                console.log(JSON.stringify(tag));

                let tagFull:TagFull = new TagFull();
                tagFull.title  = tag.title;

                if(tag.notes){
                  tagFull.notes = tag.notes;
                }

                tagFull.noteslength = tag.noteslength+1;
                // if(tag.notes!=null && tag.notes != undefined){
                //   tagFull.notes=tag.notes;
                // }
                let noteExtraMin:NoteExtraMin = new NoteExtraMin();
                noteExtraMin.title = note.title;
                tagFull.notes.push(noteExtraMin);
                tagFull.userid=userid;
              //   tx.executeSql(Query.UPDATE_JSON_OBJ_TAG, [JSON.stringify(tagFull), tagFull.title, userid],
              //     (tx: any, res: any)=>{},
              //     (tx: any, error: any)=>{
              //       console.log('error in updating the single tag');
              //       console.log(JSON.stringify(error));
              //     }
              // );
              this.updateJsonObjTag(tx, tagFull,userid);
            }
          },
          (tx: any, error: any)=>{
            console.log('error in the select');
            console.log(JSON.stringify(error));
          }
        );
        }
      }
      if(otherTags!=null){
        for(let i=0;i<otherTags.length;i++){
          tx.executeSql(Query.INSERT_NOTES_TAGS, [note.title, otherTags[i].title, 'otherTags', userid],
            (tx: any, res: any)=>{/*nothing*/},
            (tx: any, error: any)=>{
              console.log('error in inserting other tags in notes_tags');
              console.log(JSON.stringify(error));
            }
        );
        tx.executeSql(Query.INSERT_NOTE_TAG_INTO_LOGS, [note.title, note.title, otherTags[i].title, 'otherTags', 'add-tag', userid],
          (tx: any, res: any)=>{/*nothing*/},
          (tx: any, error: any)=>{
            console.log('error in inserting other tags in logs');
            console.log(JSON.stringify(error))
          }
        );
        tx.executeSql(Query.GET_TAG_FULL_JSON, [otherTags[i].title, userid],
          (tx: any, res: any)=>{
            // if(res.rows.length>0){
            //     let tag:any = JSON.parse(res.rows.item(0).json_object);
            //     let tagFull:TagFull = new TagFull();
            //     tagFull.title  = tag.title;
            //     tagFull.noteslength = tag.noteslength+1;
            //     if(tag.notes!=null && tag.notes != undefined){
            //       tagFull.notes=tag.notes;
            //     }
            //     let noteExtraMin:NoteExtraMin = new NoteExtraMin();
            //     noteExtraMin.title = note.title;
            //     tagFull.notes.push(noteExtraMin);
            //     tagFull.userid=userid;
            //     tx.executeSql(Query.UPDATE_JSON_OBJ_TAG, [JSON.stringify(tagFull), tagFull.title, userid],
            //       (tx: any, res: any)=>{},
            //       (tx: any, error: any)=>{
            //         console.log('error in updating the single tag');
            //         console.log(JSON.stringify(error));
            //       }
            //   );
            // }
            let tag:any = JSON.parse(res.rows.item(0).json_object);
            console.log('the tag is:');
            console.log(JSON.stringify(tag));

            let tagFull:TagFull = new TagFull();
            tagFull.title  = tag.title;

            if(tag.notes){
              tagFull.notes = tag.notes;
            }

            tagFull.noteslength = tag.noteslength+1;
            // if(tag.notes!=null && tag.notes != undefined){
            //   tagFull.notes=tag.notes;
            // }
            let noteExtraMin:NoteExtraMin = new NoteExtraMin();
            noteExtraMin.title = note.title;
            tagFull.notes.push(noteExtraMin);
            tagFull.userid=userid;
          //   tx.executeSql(Query.UPDATE_JSON_OBJ_TAG, [JSON.stringify(tagFull), tagFull.title, userid],
          //     (tx: any, res: any)=>{},
          //     (tx: any, error: any)=>{
          //       console.log('error in updating the single tag');
          //       console.log(JSON.stringify(error));
          //     }
          // );
          this.updateJsonObjTag(tx, tagFull,userid);
          },
          (tx: any, error: any)=>{
            console.log('error in the select');
            console.log(JSON.stringify(error));
          }
        );
        }
      }
      })
      .then(txResult=>{
        console.log('add tags ok');
        console.log(JSON.stringify(txResult));
        resolve(true);
      })
      .catch(error=>{
        console.log('error in adding tags');
        console.log(JSON.stringify(error));
        reject(error);
      })
    });
  }

/*I'm sorry.*/
private prepareQueryRemoveTagsFromNotesLogs(noteTitle: string, userid: string, tags:string[]):string{
  let query:string = 'insert into logs_sequence(notetitle, oldtitle, tagtitle, action, userid) values';
  for(let i=0;i<tags.length;i++){
    let s:string = ' (\''+noteTitle+'\',\''+noteTitle+'\',\''+tags[i]+'\',\'remove-tag\', \''+userid+'\'), ';
    query = query + s;
  };
  console.log('the query is');
  console.log(query);
  return query;
}

//joined = joined.substring(0, joined.lastIndexOf('or'));
private prepareQueryRemoveTagsFromNotes(tags:string[]):string{
  let query:string = Query.SET_TAG_DELETED_NOTES_TAGS;
  for(let i=0;i<tags.length;i++){
    let s:string = 'tagtitle=? or';
    query = query + s;
  };
  query = query.substring(0, query.lastIndexOf('or'));
  query = query + ');';
  console.log('the query is');
  console.log(query);
  return query;
}

public removeTagsFromNote(note: NoteFull, userid: string, tags: string[]):Promise<any>{
  return new Promise<any>((resolve, reject)=>{
    this.db.transaction(tx=>{
      tx.executeSql(this.prepareQueryRemoveTagsFromNotesLogs(note.title, userid, tags),[],
      (tx:any, error:any)=>{
        console.log('error while updating logs in delete notes_tags');
        console.log(JSON.stringify(error));
      }
    );
      tx.executeSql(this.prepareQueryRemoveTagsFromNotes(tags), [note.title, userid, tags],
      (tx:any, error:any)=>{
        console.log('error while updating notes_tags in delete notes_tags');
        console.log(JSON.stringify(error));
      }
    );
    //   tx.executeSql(Query.UPDATE_JSON_OBJ_NOTE, [JSON.stringify(note), note.title, userid],
    //   (tx:any, error:any)=>{
    //     console.log('error while updating json_object in delete notes_tags');
    //     console.log(JSON.stringify(error));
    //   }
    // )
    this.updateJsonObjNote(tx, note, userid);
    })
    .then(txResult=>{
      console.log('tx completed');
      resolve(true);
    })
    .catch(error=>{
      console.log('error in delete notes_tags');
      console.log(JSON.stringify(error));
      reject(error);
    })
  })
}


  public cleanUpEverything(userid: string):Promise<any>{
    return new Promise<any>((resolve, reject)=>{
      this.db.transaction(tx=>{
        /*the first two are now done by two triggers.*/
        // tx.executeSql(Query.CLEAN_UP_NOTES_CREATE, [userid, userid]);
        // tx.executeSql(Query.CLEAN_UP_TAGS_CREATE, [userid, userid]);
        tx.executeSql(Query.CLEAN_UP_NOTES_SET_DONE, [userid, userid]);
        tx.executeSql(Query.CLEAN_UP_NOTES_SET_TEXT, [userid, userid]);
        tx.executeSql(Query.CLEAN_UP_NOTES_SET_LINK, [userid, userid]);
      })
      .then(txResult=>{
        console.log('cleanup completed');
        console.log(JSON.stringify(txResult));
        resolve(true);
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
  Each object is the result of JSON.parse(db_row.json_object)
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
                obj.note = JSON.parse(res.rows.item(i).json_object);
                // console.log('obj is:');
                // console.log(JSON.stringify(obj.note));
                //modify note.
                let mainTags:string[]=[];
                let otherTags:string[]=[];
                for(let i=0;i<obj.note.maintags;i++){
                  mainTags.push(obj.note.maintags[i].title);
                }
                for(let i=0;i<obj.note.othertags;i++){
                  mainTags.push(obj.note.othertags[i].title);
                }
                obj.note.maintags=mainTags;
                obj.note.othertags =otherTags;
                obj.action = DbAction.DbAction.create;
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
                obj.action = DbAction.DbAction.create;
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
                obj.action = DbAction.DbAction.create;
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
                obj.action = DbAction.DbAction.delete;
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
                  result[result.length-1].action = DbAction.DbAction.add_tag;
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
                  obj.action = DbAction.DbAction.add_tag;
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
                  result[result.length-1].action = DbAction.DbAction.remove_tag;
                  result[result.length-1].userid = userid;
                }else{
                  /*create new note.*/
                  let obj:LogObjSmart = new LogObjSmart();
                  let note:NoteMin = new NoteMin();
                  note.title=res.rows.item(i).notetitle;
                  note.maintags.push(res.rows.item(i).tagtitle);
                  obj.userid=userid;
                  obj.action = DbAction.DbAction.remove_tag;
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
                obj.action = DbAction.DbAction.change_text;
                obj.userid = userid;
                results.push(obj);
              }
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
                note.links = JSON.parse(res.rows.item(i).links);
                obj.note = note;
                obj.action = DbAction.DbAction.set_link;
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
                note.isdone = res.rows.item(i).isdone;
                obj.note = note;
                obj.action = DbAction.DbAction.set_done;
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
  deleteNotesToSaveFromLogs(userid: string):Promise<any>{
    return new Promise<any>((resolve, reject)=>{
      this.db.transaction(tx=>{
        tx.executeSql(Query.DELETE_NOTES_TO_SAVE_LOGS, [userid],
          (tx: any, res: any)=>{console.log('delete ok');},
          (tx: any, error: any)=>{
            //if(error!=null){
              console.log('error in deleting');
              console.log(JSON.stringify(error));
          //}
        }
        )
      })
      .then(txResult=>{
        console.log('tx completed');
        resolve(true);
      })
      .catch(txError=>{
        console.log('tx error');
        console.log(JSON.stringify(txError));
        reject(txError);
      })
    })
  }

  /**
  * Delete from logs_sequence tag;userid;create
  */
  deleteTagsToSaveFromLogs(userid: string):Promise<any>{
    return new Promise<any>((resolve, reject)=>{
      this.db.transaction(tx=>{
        tx.executeSql(Query.DELETE_TAGS_TO_SAVE_LOGS, [userid],
          (tx: any, res: any)=>{console.log('delete ok');},
          (tx: any, error: any)=>{
            //if(error!=null){
              console.log('error in deleting');
              console.log(JSON.stringify(error));
          //}
        }
        )
      })
      .then(txResult=>{
        console.log('tx completed');
        resolve(true);
      })
      .catch(txError=>{
        console.log('tx error');
        console.log(JSON.stringify(txError));
        reject(txError);
      })
    })
  }





  /**
  * Delete from logs_sequence all the entry with note-tag-add-tag
  * To do when all the tags that should be added has been sent to
  * to the server.
  *
  */
  deleteTagsToAddToNotesFromLogs(userid: string):Promise<any>{
    return new Promise<any>((resolve, reject)=>{
      this.db.transaction(tx=>{
        tx.executeSql(Query.DELETE_TAGS_TO_ADD_TO_NOTES, [userid],
          (tx: any, res: any)=>{console.log('delete ok');},
          (tx: any, error: any)=>{
            //if(error!=null){
              console.log('error in deleting');
              console.log(JSON.stringify(error));
          //}
        }
        )
      })
      .then(txResult=>{
        console.log('tx completed');
        resolve(true);
      })
      .catch(txError=>{
        console.log('tx error');
        console.log(JSON.stringify(txError));
        reject(txError);
      })
    })
  }


  //===============================================SINGLE DELETE FROM LOGS_SEQUENCE=========
  //there are not really 'single', and they work for a set as well.


  //tested in console.
  private prepareTagsMultiVersion(tagTitles: string[], queryString: string):string{
    //let res: string = Query.DELETE_FROM_LOGS_TAG_CREATED_WHERE_TAG;
    let res: string = queryString;
    res = res.replace(')', '');
    for(let i=1;i<tagTitles.length;i++){
      res = res.concat(' or tagtitle=?');
    }
    res = res.concat(')');
    return res;
  }

  //tested in console.
  private prepareNotesMultiVersion(noteTitles: string[], queryString: string):string{
    //let res: string = Query.DELETE_FROM_LOGS_NOTE_CREATED_WHERE_NOTE;
    let res: string = queryString;
    res = res.replace(')', '');
    for(let i=1;i<noteTitles.length;i++){
      res = res.concat(' or notetitle=?');
    }
    res = res.concat(')');
    return res;
  }


  /*
  delete the tags from logs where the action is 'delete' and the tagtitle is one of the provided ones.
  */
  deleteNotesToDeleteMultiVersion(noteTitles: string[], userid: string):Promise<any>{
    return new Promise<any>((resolve, reject)=>{
      this.db.transaction(tx=>{
        let query1: string = this.prepareNotesMultiVersion(noteTitles, Query.DELETE_FROM_LOGS_NOTES_TO_DELETE_WHERE_NOTE);
        let query2: string = this.prepareNotesMultiVersion(noteTitles, Query.DELETE_FROM_NOTES_NOTES_TO_DELETE_WHERE_NOTE);
        tx.executeSql(query1, [userid, noteTitles],
          (tx:any, res:any)=>{console.log('delete notes-to-delete-logs ok.')},
          (tx: any, err:any)=>{
            console.log('error in deleting notes-to-delete-logs.');
            console.log(JSON.stringify(err));
          }
        )
        tx.executeSql(query2, [userid, noteTitles],
          (tx:any, res: any)=>{console.log('delete notes-to-delete-tags ok')},
          (tx:any, err: any)=>{
            console.log('error in deleting tags-to-delete-notes ok.')
            console.log(JSON.stringify(err));
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

  /*
  delete the tags from logs where the action is 'delete' and the tagtitle is one of the provided ones.
  */
  deleteTagsToDeleteMultiVersion(tagTitles: string[], userid: string):Promise<any>{
    return new Promise<any>((resolve, reject)=>{
      this.db.transaction(tx=>{
        console.log('tags');
        console.log(JSON.stringify(tagTitles));
        let query1: string = this.prepareTagsMultiVersion(tagTitles, Query.DELETE_FROM_LOGS_TAGS_TO_DELETE_WHERE_TAG);
        console.log('query 1');
        console.log(query1);
        let query2: string = this.prepareTagsMultiVersion(tagTitles, Query.DELETE_FROM_TAGS_TAGS_TO_DELETE_WHERE_TAG);
        console.log('query 2');
        console.log(query2);
        tx.executeSql(query1, [userid, tagTitles],
          (tx:any, res:any)=>{console.log('delete tags-to-delete-logs ok.')},
          (tx: any, err:any)=>{
            console.log('error in deleting tags-to-delete-logs.');
            console.log(JSON.stringify(err));
          }
        )
        tx.executeSql(query2, [userid, tagTitles],
          (tx:any, res: any)=>{console.log('delete tags-to-delete-tags ok')},
          (tx:any, err: any)=>{
            console.log('error in deleting tags-to-delete-tags ok.')
            console.log(JSON.stringify(err));
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
        let query: string = this.prepareNotesMultiVersion(noteTitles, Query.DELETE_FROM_LOGS_TAGS_TO_ADD_TO_NOTE_WHERE_NOTE);
        tx.executeSql(query, [userid, noteTitles],
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
        let query: string = this.prepareNotesMultiVersion(noteTitles, Query.DELETE_FROM_LOGS_TAGS_TO_DELETE_FROM_NOTE_WHERE_NOTE);
        tx.executeSql(query, [userid, noteTitles],
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
    return new Promise<any>((resolve, reject)=>{
      this.db.transaction(tx=>{
        let query = this.prepareTagsMultiVersion(tagTitles,Query.DELETE_FROM_LOGS_TAG_CREATED_WHERE_TAG);
        tx.executeSql(query, [userid, tagTitles],
          (tx:any, res:any)=>{console.log('delete tags-to-create.')},
          (tx: any, err:any)=>{
            console.log('error in deleting tags-to-create.');
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
  Optimized  version that accepts an array of notes title.
  */
  deleteNoteToCreateFromLogsMultiVersion(noteTitles: string[], userid: string):Promise<any>{
    return new Promise<any>((resolve, reject)=>{
      this.db.transaction(tx=>{
        let query = this.prepareNotesMultiVersion(noteTitles, Query.DELETE_FROM_LOGS_NOTE_CREATED_WHERE_NOTE);
        tx.executeSql(query, [userid, noteTitles],
          (tx:any, res:any)=>{console.log('delete notes-to-create ok.')},
          (tx: any, err:any)=>{
            console.log('error in deleting notes-to-create.');
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
        this.deleteSetLinksFromLogsSequence(tx, noteTitles, userid);
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
        this.deleteSetDoneFromLogsSequence(tx, noteTitles, userid);
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
        this.deleteChangeTextFromLogsSequence(tx, noteTitles, userid);
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

private mkAvailable(summary: UserSummary):UserSummary{
  if(summary.data.isfree){
    summary.data.availablenotes = Const.NOTES_LIMIT-summary.data.notescount;
    summary.data.availabletags = Const.TAGS_LIMIT-summary.data.tagscount;
  }else{
    summary.data.availablenotes = Number.POSITIVE_INFINITY;
    summary.data.availabletags = Number.POSITIVE_INFINITY;
  }
  return summary;
}

private getCounts(rows:any, summary:UserSummary):UserSummary{
  for(let i=0;i<rows.length;i++){
    if(rows.item(i).type=='logs'){
      summary.data.logscount = rows.item(i).count;
    }
    else if(rows.item(i).type=='notes'){
      summary.data.notescount = rows.item(i).count;
    }else if(rows.item(i).type=='tags'){
      summary.data.tagscount = rows.item(i).count;
    }else{
      summary.data.isfree = rows.item(i).count;
    }
  }
  summary.data.notescount = ((summary.data.notescount)==null) ? 0 : summary.data.notescount;
  summary.data.tagscount = ((summary.data.tagscount)==null) ? 0 : summary.data.tagscount;
  summary.data.logscount = ((summary.data.logscount)==null) ? 0 : summary.data.logscount;

  summary = this.mkAvailable(summary);

  console.log('the summary here'),
  console.log(JSON.stringify(summary));
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
        summary = this.getCounts(result.rows, summary);
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
private prepareQueryInsertNotesMinQuietly(length:number, userid:string):string{
  let query:string = Query.INSERT_NOTE_MIN_2;
  for(let i=0;i<length;i++){
    query += '(?,?,'+userid+'),';
  }
  query = query.substr(0, query.length-1);
  return query;
}

*/

private prepareQueryDeleteForceNote(query:string, length:number):string{
  let result:string = query;
  if(length>0){
    result+=' and (';
    for(let i=0;i<length;i++){
      result+=' title = ? or'
    }
    result = result.substr(0, result.length-3);
    result += ')'
  }
  return result;
}


//force now I decide to not touch tags, user will do a refresh...
//but if it is without net it won't work......
deleteForceNote(note:NoteFull, userid:string):Promise<void>{
  return new Promise<void>((resolve,reject)=>{
    this.db.transaction(tx=>{
      let minNote:NoteExtraMin = new NoteExtraMin();
      minNote.title = note.title;
      let jsonNote:string = JSON.stringify(minNote); /*need to do this because 'as NoteExtraMin'
       when jsoning keeps the child object*/
       let tagsString:string[]=note.getTagsAsStringArray();
       let querySmart:string = this.prepareQueryDeleteForceNote(Query.REMOVE_NOTES_FROM_TAGS_SMART_REPLACE, tagsString.length);
       let argsSmart:string[] = [jsonNote, jsonNote, userid].concat(tagsString);
      tx.executeSql(querySmart, argsSmart,
        (tx:any, res:any)=>{console.log('remove notes smart replace ok');},
        (tx:any, error:any)=>{console.log('error in smart replace');
          console.log(JSON.stringify(error));}
      );
      let queryCleanup1:string = this.prepareQueryDeleteForceNote(Query.REMOVE_NOTES_FROM_TAGS_CLEANUP_ONE, tagsString.length);
      let argsCleanup1:string[] = [userid].concat(tagsString);
      tx.executeSql(queryCleanup1, argsCleanup1,
        (tx:any, res:any)=>{console.log('remove notes tags cleanup one ok');},
        (tx:any, error:any)=>{console.log('error remove notes tags cleanup one');
          console.log(JSON.stringify(error));}
      );
      let queryCleanup2:string = this.prepareQueryDeleteForceNote(Query.REMOVE_NOTES_FROM_TAGS_CLEANUP_TWO, tagsString.length);
      let argsCleanup2:string[] = [userid].concat(tagsString);
      tx.executeSql(queryCleanup2, argsCleanup2,
        (tx:any, res:any)=>{console.log('remove notes tags cleanup two ok');},
        (tx:any, error:any)=>{console.log('error remove notes tags cleanup two');
          console.log(JSON.stringify(error));}
      );
      let queryCleanup3:string = this.prepareQueryDeleteForceNote(Query.REMOVE_NOTES_FROM_TAGS_CLEANUP_THREE, tagsString.length);
      let argsCleanup3:string[] = [userid].concat(tagsString);
      tx.executeSql(queryCleanup3, argsCleanup3,
        (tx:any, res:any)=>{console.log('remove notes tags cleanup three ok');},
        (tx:any, error:any)=>{console.log('error remove notes tags cleanup three');
          console.log(JSON.stringify(error));}
      );
      let tags:TagExtraMin[]=note.maintags.concat(note.othertags);
      for(let i=0;i<note.maintags.length+note.othertags.length;i++){
        tx.executeSql(Query.REDUCE_NOTES_LENGTH, [tags[i].title, userid],
          (tx:any, res:any)=>{console.log('remove notes reduce notes length ok');},
          (tx:any, error:any)=>{console.log('error remove notes reduce notes length');
            console.log('error in tag:');
            console.log(JSON.stringify(tags[i]));
            console.log(JSON.stringify(error));}
        );
      }
      // tx.executeSql(Query.REDUCE_NOTES_LENGTH, [userid],
      //   (tx:any, res:any)=>{console.log('remove notes reduce notes length ok');},
      //   (tx:any, error:any)=>{console.log('error remove notes reduce notes length ok');
      //     console.log(JSON.stringify(error));}
      // );
    })
    .then(txResult=>{
      console.log('note force deleted');
      resolve();
    })
    .catch(error=>{
      console.log('error in delete force note');
      console.log(JSON.stringify(error));
      reject(error);
    })
  })
}


//even if it's a just a cancellation of a created-right-now tag it might be that is
//already added to other objects.
deleteForceTag(tag:string, userid:string):Promise<void>{
  return new Promise<void>((resolve,reject)=>{
    this.db.transaction(tx=>{
      let minTag:TagExtraMin = new TagExtraMin();
      minTag.title=tag;
      let jsonTag: string = JSON.stringify(minTag);
      tx.executeSql(Query.REMOVE_TAGS_FROM_NOTES_SMART_REPLACE, [jsonTag, jsonTag, userid],
        (tx:any, res:any)=>{console.log('remove tags smart replace ok');},
        (tx:any, error:any)=>{console.log('error in smart replace');
          console.log(JSON.stringify(error));}
      );
      tx.executeSql(Query.REMOVE_TAGS_FROM_NOTES_CLEANUP_ONE, [userid],
        (tx:any, res:any)=>{console.log('remove tags tags cleanup one ok');},
        (tx:any, error:any)=>{console.log('error remove tags tags cleanup one');
          console.log(JSON.stringify(error));}
      );
      tx.executeSql(Query.REMOVE_TAGS_FROM_NOTES_CLEANUP_TWO, [userid],
        (tx:any, res:any)=>{console.log('remove tags tags cleanup two ok');},
        (tx:any, error:any)=>{console.log('error remove tags tags cleanup two');
          console.log(JSON.stringify(error));}
      );
      tx.executeSql(Query.REMOVE_TAGS_FROM_NOTES_CLEANUP_THREE, [userid],
        (tx:any, res:any)=>{console.log('remove tags tags cleanup three ok');},
        (tx:any, error:any)=>{console.log('error remove tags tags cleanup three ');
          console.log(JSON.stringify(error));}
      );
      //TODO check if it is removed from logs too.
      tx.executeSql(Query.FORCE_DELETE_TAG, [tag, userid],
        (tx:any, res:any)=>{console.log('final remove tags ok');},
        (tx:any, error:any)=>{console.log('error final remove tags');
          console.log(JSON.stringify(error));}
      );
    })
    .then(txResult=>{
      console.log('tag force deleted');
      resolve();
    })
    .catch(error=>{
      console.log('error in delete force tag');
      console.log(JSON.stringify(error));
      reject(error);
    })
  })
}





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

private updateJsonObjNote(tx:any, fullNote:NoteFull, userid:string):void{
  let json:string = JSON.stringify(fullNote);
  tx.executeSql(Query.UPDATE_JSON_OBJ_NOTE, [json, fullNote.title, userid],
    (tx:any, res:any)=>{
      console.log('updated json obj note');
    },
    (tx:any, error:any)=>{console.log('error in update json obj note');
                        console.log(JSON.stringify(error));}
    )
}

private updateJsonObjTag(tx:any, fullTag:TagFull, userid:string):void{
  let json:string =JSON.stringify(fullTag);
  tx.executeSql(Query.UPDATE_JSON_OBJ_TAG, [json, fullTag.title, userid],
    (tx:any, res:any)=>{
      console.log('updated json obj tag');
    },
    (tx:any, error:any)=>{console.log('error in update json obj tag');
                        console.log(JSON.stringify(error));}
    )
}


/*maybe in the future I'll pass full objects.*/
private rollbackAddTag(note:NoteMin, userid:string, noteFull?:NoteFull, tagFull?:TagFull):Promise<void>{
  return new Promise<void>((resolve, reject)=>{
    this.db.transaction(tx=>{
      //don't use the function 'smart replace' because here I'd have to update NOTES AND TAGS,
      //, more or less 8 query, it's more convenient to do a query.
      //this is where it changes.
      let fullNote:NoteFull = new NoteFull();
      let fullTag:TagFull = new TagFull();
      let index:IndexTagType;
      let isTagFull: boolean = false;
      let isNoteFull:boolean = false;

      let tags:TagExtraMin[] = note.getTagsAsTagsExtraMinArray();

      tx.executeSql(Query.GET_NOTE_FULL_JSON, [note.title, userid],
        (tx:any, res:any)=>{
          if(res.rows.length<0){
            console.log('fatal, no note');
            reject(new Error('no note'));
          }
            let parsedNote= JSON.parse(res.rows.item(0).json_object);
            if(!parsedNote.maintags && !parsedNote.othertags){
              console.log('note is not full');
            }else{
              fullNote = parsedNote;
              console.log('the note before the mod');
              console.log(JSON.stringify(fullNote));
              for(let i=0;i<tags.length;i++){
                index = fullNote.getTagIndex(tags[i]);
                if(index.index==-1){
                  reject(new Error('tag not found'));
                }
                isNoteFull=true;
                fullNote.removeTag(index);
              }
              console.log('the note after the mod');
              console.log(JSON.stringify(fullNote));
            }
      },
      (tx:any, error:any)=>{
        console.log('error in get note json');
        console.log(JSON.stringify(error));
      }
    );
    for(let i=0;i<tags.length;i++){
      tx.executeSql(Query.GET_TAG_FULL_JSON, [tags[i].title, userid],
        (tx:any, res:any)=>{
          if(res.rows.length<0){
            console.log('fatal, no tag');
            reject(new Error('no tag'));
          }
          let parsedTag = JSON.parse(res.rows.item(0).json_object);
          //remove tag
          if(parsedTag.notes){
            fullTag = parsedTag;
            isTagFull = true;
            console.log('the tag before the mod');
            console.log(JSON.stringify(fullTag));
            fullTag.removeNote(fullNote as NoteExtraMin);
            console.log('the tag after the mod');
            console.log(JSON.stringify(fullTag));
          }else{
            console.log('tag is not full');
          }
        }
        )
        if(isTagFull){
          this.updateJsonObjTag(tx, fullTag, userid);
        }
        tx.executeSql(Query.DELETE_FROM_LOGS_TAGS_TO_ADD_TO_NOTE_WHERE_NOTE_AND_TAG, [note.title, tags[i].title, userid],
          (tx:any, res:any)=>{console.log('remove tags tags to add to notes from logs ok');},
          (tx:any, error:any)=>{console.log('error remove tags tags to add to notes from logs');
            console.log(JSON.stringify(error));}
        )
    }
      if(isNoteFull){
        this.updateJsonObjNote(tx, fullNote, userid);
      }
    })
    .then(txResult=>{
      console.log('tag force deleted');
      resolve();
    })
    .catch(error=>{
      console.log('error in delete force tag');
      console.log(JSON.stringify(error));
      reject(error);
    })
  })
}


private rollbackDeleteTag(note: NoteMin, userid:string):Promise<void>{
  return new Promise<void>((resolve, reject)=>{
    this.db.transaction(tx=>{
      let tags:TagExtraMin[]=note.maintags.map(obj=>{return TagExtraMin.NewTag(obj)});
      for(let i=0;i<tags.length;i++){
        let jsonTag: string = JSON.stringify(tags[i]);
        tx.executeSql(Query.REMOVE_TAGS_FROM_NOTES_SMART_REPLACE, [jsonTag, jsonTag, userid],
          (tx:any, res:any)=>{console.log('remove tags smart replace ok');},
          (tx:any, error:any)=>{console.log('error in smart replace');
            console.log(JSON.stringify(error));}
        );
        //originally it was at the end of everything.
        tx.executeSql(Query.DELETE_FROM_LOGS_TAGS_TO_ADD_TO_NOTE_WHERE_NOTE_AND_TAG, [note.title, tags[i].title, userid],
          (tx:any, res:any)=>{console.log('remove tags tags to add to notes from logs ok');},
          (tx:any, error:any)=>{console.log('error remove tags tags to add to notes from logs');
            console.log(JSON.stringify(error));}
        );
      }
      tx.executeSql(Query.REMOVE_TAGS_FROM_NOTES_CLEANUP_ONE, [userid],
        (tx:any, res:any)=>{console.log('remove tags tags cleanup one ok');},
        (tx:any, error:any)=>{console.log('error remove tags tags cleanup one');
          console.log(JSON.stringify(error));}
      );
      tx.executeSql(Query.REMOVE_TAGS_FROM_NOTES_CLEANUP_TWO, [userid],
        (tx:any, res:any)=>{console.log('remove tags tags cleanup two ok');},
        (tx:any, error:any)=>{console.log('error remove tags tags cleanup two');
          console.log(JSON.stringify(error));}
      );
      tx.executeSql(Query.REMOVE_TAGS_FROM_NOTES_CLEANUP_THREE, [userid],
        (tx:any, res:any)=>{console.log('remove tags tags cleanup three ok');},
        (tx:any, error:any)=>{console.log('error remove tags tags cleanup three');
          console.log(JSON.stringify(error));}
      );
      //this is where it changes.
    })
    .then(txResult=>{
      console.log('tag force deleted');
      resolve();
    })
    .catch(error=>{
      console.log('error in delete force tag');
      console.log(JSON.stringify(error));
      reject(error);
    })
  })
}

private deleteChangeTextFromLogsSequence(tx:any, noteTitles:string[], userid:string):void{
  let query:string = this.prepareNotesMultiVersion(noteTitles, Query.DELETE_FROM_LOGS_NOTE_CHANGE_TEXT_WHERE_NOTE);
  tx.executeSql(query, [userid].concat(noteTitles),
    (tx:any, res:any)=>{
      console.log('delete notes-to-change-text')
    },
    (tx:any, error:any)=>{
      console.log('error delete notes-to-change-text');
      console.log(JSON.stringify(error));
    }
  )
}

private deleteSetDoneFromLogsSequence(tx:any, noteTitles:string[], userid:string):void{
  let query:string = this.prepareNotesMultiVersion(noteTitles, Query.DELETE_FROM_LOGS_NOTE_SET_DONE_WHERE_NOTE);
  tx.executeSql(query, [userid].concat(noteTitles),
    (tx:any, res:any)=>{
      console.log('delete notes-to-set-done')
    },
    (tx:any, error:any)=>{
      console.log('error delete notes-to-set-done');
      console.log(JSON.stringify(error));
    }
  )
}

private deleteSetLinksFromLogsSequence(tx:any, noteTitles:string[], userid:string):void{
  let query:string = this.prepareNotesMultiVersion(noteTitles, Query.DELETE_FROM_LOGS_NOTE_SET_LINK_WHERE_NOTE);
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

private rollbackChangeText(note:NoteExtraMin, userid:string):Promise<void>{
  return new Promise<void>((resolve, reject)=>{
    this.db.transaction(tx=>{
      this.deleteChangeTextFromLogsSequence(tx, [note.title], userid);
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
      this.deleteSetDoneFromLogsSequence(tx, [note.title], userid);
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
      this.deleteSetLinksFromLogsSequence(tx, [note.title], userid);
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
public rollbackModification(logObj: LogObjSmart, userid:string):Promise<void>{
  return new Promise<void>((resolve, reject)=>{
    let p:Promise<void>;
    switch(logObj.action){
      case DbAction.DbAction.remove_tag:
        /*the note to delete are in the maintags of the note.*/
        p=this.rollbackDeleteTag(logObj.note, userid);
        break;
      case DbAction.DbAction.add_tag:
        p=this.rollbackAddTag(logObj.note, userid);
        break;
      case DbAction.DbAction.change_text:
        p=this.rollbackChangeText(logObj.note, userid);
        break;
      case DbAction.DbAction.set_done:
        p=this.rollbackSetDone(logObj.note,userid);
        break;
      case DbAction.DbAction.set_link:
        p=this.rollbackSetLink(logObj.note,userid);
        break;
      case DbAction.DbAction.create:
        if(logObj.note!=null){
          p=this.deleteForceNote(logObj.note as NoteFull, userid);
        }else{
          p=this.deleteForceTag(logObj.tag.title, userid);
        }
        break;
      default:
        console.log('nothing to rollback');
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



/*think about remove notes_tags.*/


}
