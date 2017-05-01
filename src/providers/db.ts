import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import { SQLite } from 'ionic-native';
import { Platform } from 'ionic-angular';
import { Query } from '../public/query';
import { Table, Const, DbAction, WhichField } from '../public/const';
import { Utils } from '../public/utils';
import { NoteExtraMin, NoteFull, NoteSQLite,NoteMin } from '../models/notes';
import { TagExtraMin, TagFull, /*TagMin,*/ TagAlmostMin, TagSQLite } from '../models/tags';
import { Queue } from 'typescript-collections';
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

  private userid: string = null;
  private token: any = null;

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
              });
            })
            .then(transactionResult=>{
              return this.db.executeSql(Query.GET_TOKEN, []);
            })
            .then(tokenResult=>{
              this.open = true;
              if(tokenResult.rows.length > 0){
                this.token = tokenResult.rows.item(0).token;
                this.userid = tokenResult.rows.item(0).userid;
                return this.count(this.userid);
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

private getNotesCountAdvanced(userid: string):Promise<any>{
  return new Promise<number>((resolve, reject)=>{
    this.db.executeSql(Query.GET_NOTES_COUNT, [userid])
    .then(result=>{
      if(result.rows.length <= 0){
        reject(new Error(JSON.stringify(result)));
      }else{
        resolve(result.rows.item(0).count);
      }
    })
  })
}

private getTagsCountAdvanced(userid: string):Promise<any>{
  return new Promise<number>((resolve, reject)=>{
    this.db.executeSql(Query.GET_TAGS_COUNT, [userid])
    .then(result=>{
      if(result.rows.length <= 0){
        reject(new Error(JSON.stringify(result)));
      }else{
        resolve(result.rows.item(0).count);
      }
    })
  })
}

private getLogsCountAdvanced(userid: string):Promise<any>{
  return new Promise<number>((resolve, reject)=>{
    this.db.executeSql(Query.GET_LOGS_COUNT, [userid])
    .then(result=>{
      if(result.rows.length <= 0){
        reject(new Error(JSON.stringify(result)));
      }else{
        resolve(result.rows.item(0).count);
      }
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
private count(userid: string):Promise<any>{
  return this.getLogsCountAdvanced(userid)
    .then(count=>{
      this.logsCount = count;
      return this.getNotesCountAdvanced(userid);
    })
    .then(count=>{
      this.notesCount = count;
      return this.getTagsCountAdvanced(userid);
    })
    .then(count=>{
      this.tagsCount = count;
      console.log('counts:');
      console.log(JSON.stringify([this.logsCount, this.notesCount, this.tagsCount]));
    });
}

public getNumberOfNotes(userid: string){
  return this.promise.then(db=>{
    return this.notesCount;
  });
}

public getNumberOfTags(userid: string){
  return this.promise.then(db=>{
    return this.tagsCount;
  });
}

public getNumberOfLogs(userid: string){
  return this.promise.then(db=>{
    return this.logsCount;
  });
}

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
    try{
      this.promise.then(db=>{
        if(this.userid !=null && this.token!=null){
          resolve({userid: this.userid, token: this.token});
        }else{
          db.executeSql(Query.GET_TOKEN, [])
          .then(result=>{
            if(result.rows.length <= 0){
              resolve(null);
            }else{
              this.userid = result.rows.item(0).userid;
              this.token = result.rows.item(0).token;
              resolve({userid: this.userid, token: this.token});
            }
          })
        }
      })
    }catch(e){
      reject(e);
    }
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
      if(e.message.search(Const.UNIQUE_FAILED) >= 0){
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

public insertOrUpdateNote(note: NoteFull, userid: string):Promise<any>{
  return new Promise<any>((resolve, reject)=>{
    let isPresent: boolean;
    this.db.executeSql(Query.NOTE_EXISTS, [note.title, userid])
    .then(result=>{
      let p:Promise<any>;
      console.log('is present?');
      if(result.rows.length > 0){
        isPresent = true;
        console.log('yes');
        /*  static readonly UPDATE_NOTE_2 = 'update notes set text=?, remote_lastmodificationdate=?, creationdate?, isdone=?, links=?, json_object=? where title=? and json_object <> ?';*/
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
      .then(results=>{
        return this.getNotesCountAdvanced(userid);
      })
      .then(notesCount=>{
        this.notesCount = notesCount;
        return this.getTagsCountAdvanced(userid);
      })
      .then(tagsCount=>{
        this.tagsCount = tagsCount;
        resolve(true);
      })
      .catch(error=>{
        console.log('error:');
        console.log(JSON.stringify(error));
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


public createNewNote2(note:NoteFull, tags:TagAlmostMin[], userid: string):Promise<any>{
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

      note.maintags.map((tag)=>{
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
  .then(txResult=>{
    /*update the note count.*/
    return this.getNotesCountAdvanced(userid);
  })
  .then(notesCount=>{
    this.notesCount = notesCount;
    console.log('tx completed, note created and count updated');
    resolve(true);
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
      if(result.rows.items(0).text == null || result.rows.length == 0){
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
      if(result.rows.item(0).json_obj == null){
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
public insertTagMinQuietly(tag: TagAlmostMin, userid: string):Promise<any>{
  return new Promise<any>((resolve, reject)=>{
    this.db.executeSql(Query.INSERT_TAG_MIN,[tag.title, JSON.stringify(tag), userid])
    .then(result=>{
      /*nothing to do.*/
      return this.getTagsCountAdvanced(userid);
    })
    .then(count=>{
      this.tagsCount = count;
      resolve(true);
    })
    .catch(error=>{
      console.log('error in inserting tags: ');
      console.log(JSON.stringify(error));
      if(error.message.search(Const.UNIQUE_FAILED)>=0){
        console.log('already there.');
        /*ok, constraint violation, the note is already there.*/
        /*maybe the json_object is changed, trying to update.*/
        this.db.executeSql(Query.UPDATE_TAG_2, [JSON.stringify(tag), tag.title, JSON.stringify(tag), userid])
        .then(result=>{
          console.log('ok');
          resolve(true);
        })
        .catch(error=>{
          /*don't know if this catch is necessary...*/
          reject(error);
        })

      }else{
        reject(error);
      }
    })
  })
}

public insertNoteMinQuietly(note: NoteExtraMin, userid: string):Promise<any>{
  return new Promise<any>((resolve, reject)=>{
    this.db.executeSql(Query.INSERT_NOTE_MIN,[note.title, JSON.stringify(note), userid])
    .then(result=>{
      /*nothing to do.*/
      return this.getNotesCountAdvanced(userid);
    })
    .then(count=>{
      this.notesCount = count;
      resolve(true);
    })
    .catch(error=>{
      console.log('error in inserting note min:'),
      console.log(JSON.stringify(error));
      if(error.message.search(Const.UNIQUE_FAILED)>=0){
        /*ok, constraint violation, the note is already there.*/
        console.log('already there.');
        resolve(true);
      }else{
        reject(error);
      }
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
        let obj:NoteExtraMin = JSON.parse(rawResult);
        // console.log('object returned notes: ');
        // console.log(JSON.stringify(obj));
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
        // console.log('object returned tags: ');
        // console.log(JSON.stringify(obj));
        array.push(obj);
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


private setTitleJustLocal(note: NoteFull, newTitle: string, userid: string):Promise<any>{
  let oldTitle:string = note.title;
  note.title = newTitle;
  return this.db.executeSql(Query.UPDATE_NOTE_SET_TITLE, [newTitle, JSON.stringify(note), oldTitle, userid]);
}

private setTitleAlsoRemote(note: NoteFull, newTitle: string, userid: string):Promise<any>{
  return new Promise<any>((resolve, reject)=>{
    let oldTitle:string = note.title;
    note.title = newTitle;
    this.db.transaction(tx=>{
      tx.executeSql(Query.UPDATE_NOTE_SET_TITLE,[newTitle, JSON.stringify(note), oldTitle, userid]);
      tx.executeSql(Query.INSERT_NOTE_OLDTITLE_INTO_LOGS, [newTitle, oldTitle,'change-title', userid]);
    })
    .then(txResult=>{
      console.log('tx completed');
      resolve(true);
    })
    .catch(error=>{
      console.log('tx set title error');
      console.log(JSON.stringify(error));
      reject(error);
    })
  })
}

/*a full object in order to re-calculate the json_object and insert it directly.
If i use just the title, I'd have to get to json_object, modify and reinsert. */
public setTitle(note :NoteFull, newTitle: string, userid: string):Promise<any>{
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
        return this.setTitleJustLocal(note, newTitle, userid);
      }else{
        // console.log('the note is already in the server');
        // inTheServer = true;
        return this.setTitleAlsoRemote(note, newTitle, userid);
      }
    })
    .then(upadteResuullt=>{
      console.log('set title ok'),
      resolve(true);
    })
    .catch(error=>{
      console.log('error in set-title');
      console.log(JSON.stringify(error));
      reject(error);
    })
  })
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
      this.db.executeSql(Query.SELECT_NOTES_MIN_BY_TEXT, [text])
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

  createTag(tag: TagAlmostMin, userid: string):Promise<any>{
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

  deleteTag(tag: TagExtraMin, userid: string):Promise<any>{
    return new Promise<any>((resolve, reject)=>{
      this.db.transaction(tx=>{
        tx.executeSql(Query.INSERT_TAG_OLDTITLE_INTO_LOGS, [tag.title, tag.title, 'delete', userid]);
        /*now update the json_object of eventual full notes.*/
        tx.executeSql(Query.GET_TITLE_AND_JSON_OF_NOTES_TO_UPDATE, [tag.title, userid],
          (tx: any, res: any)=>{ /*result callback*/
            // console.log('select result');
            // console.log(JSON.stringify(res));
            if(res.rows.length <= 0){
              console.log('no note to update');
              return;
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
                if(role == 'mainTags'){
                  json_object.maintags.splice(Utils.myIndexOf(json_object.maintags, tag),1);
                  console.log('removed maintag:');
                }else{
                  json_object.othertags.splice(Utils.myIndexOf(json_object.othertags, tag),1);
                  console.log('removed othertag:');
                }
                console.log(JSON.stringify(json_object));
                tx.executeSql(Query.UPDATE_JSON_OBJ_NOTE, [JSON.stringify(json_object),title,userid]);
              }
            }
          },
          (tx: any, error: any)=>{ /*error callback*/
            console.log('error in select:');
            console.log(JSON.stringify(error));
          }
        );
        tx.executeSql(Query.SET_TAG_DELETED, [tag.title, userid ]);
        tx.executeSql(Query.SET_TAG_DELETED_NOTES_TAGS, [tag.title, userid]);
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
        tx.executeSql(Query.UPDATE_JSON_OBJ_NOTE,[JSON.stringify(note), note.title, userid],
          (tx: any, res: any)=>{/*nothing*/console.log('updated json_obj note');},
          (tx: any, error: any)=>{
            console.log('error in update JSON object.');
            console.log(JSON.stringify(error));
          }
      );
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
                tagFull.noteslength = tag.noteslength+1;
                if(tag.notes!=null && tag.notes != undefined){
                  tagFull.notes=tag.notes;
                }
                let noteExtraMin:NoteExtraMin = new NoteExtraMin();
                noteExtraMin.title = note.title;
                tagFull.notes.push(noteExtraMin);
                tagFull.userid=userid;
                tx.executeSql(Query.UPDATE_JSON_OBJ_TAG, [JSON.stringify(tagFull), tagFull.title, userid],
                  (tx: any, res: any)=>{},
                  (tx: any, error: any)=>{
                    console.log('error in updating the single tag');
                    console.log(JSON.stringify(error));
                  }
              );
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
            if(res.rows.length>0){
                let tag:any = JSON.parse(res.rows.item(0).json_object);
                let tagFull:TagFull = new TagFull();
                tagFull.title  = tag.title;
                tagFull.noteslength = tag.noteslength+1;
                if(tag.notes!=null && tag.notes != undefined){
                  tagFull.notes=tag.notes;
                }
                let noteExtraMin:NoteExtraMin = new NoteExtraMin();
                noteExtraMin.title = note.title;
                tagFull.notes.push(noteExtraMin);
                tagFull.userid=userid;
                tx.executeSql(Query.UPDATE_JSON_OBJ_TAG, [JSON.stringify(tagFull), tagFull.title, userid],
                  (tx: any, res: any)=>{},
                  (tx: any, error: any)=>{
                    console.log('error in updating the single tag');
                    console.log(JSON.stringify(error));
                  }
              );
            }
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




  public cleanUpEverything(userid: string):Promise<any>{
    return new Promise<any>((resolve, reject)=>{
      this.db.transaction(tx=>{
        tx.executeSql(Query.CLEAN_UP_NOTES_CREATE, [userid, userid]);
        tx.executeSql(Query.CLEAN_UP_TAGS_CREATE, [userid, userid]);
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


  public getObjectNotesToSave(userid: string):Promise<LogObjSmart[]>{
    return new Promise<LogObjSmart[]>((resolve, reject)=>{
      this.db.transaction(tx=>{
        tx.executeSql(Query.SELECT_NOTES_TO_SAVE, [userid],
          (tx: any, res: any)=>{ /*result callback*/
            if(res.rows.length<=0){
              resolve(null);
            }else{
              let results:LogObjSmart[]=[];
              for(let i=0;i<res.rows.length;i++){
                let obj: LogObjSmart = new LogObjSmart();
                obj.note = JSON.parse(res.rows.item(i).json_object);
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


/* must be re-written.*/
  // public getObjectTagsToAddToNotes(userid: string):Promise<LogObjSmart[]>{
  //   return new Promise<LogObjSmart[]>((resolve, reject)=>{
  //     this.db.transaction(tx=>{
  //       tx.executeSql(Query.SELECT_TAGS_TO_SAVE, [userid],
  //         (tx: any, res: any)=>{ /*result callback*/
  //           if(res.rows.length<=0){
  //             resolve(null);
  //           }else{
  //             let results:LogObjSmart[]=[];
  //             for(let i=0;i<res.rows.length;i++){
  //               let obj: LogObjSmart = new LogObjSmart();
  //               let tag:TagExtraMin  = new TagExtraMin();
  //               tag.title = res.rows.item(i).tagtitle;
  //               let note:NoteExtraMin = new NoteExtraMin();
  //               note.title = res.rows.item(i).notetitle;
  //               obj.tag = tag;
  //               obj.note = note;
  //               obj. role = res.rows.item(i).role;
  //               // console.log(JSON.stringify(obj.note));
  //               obj.action = DbAction.DbAction.create;
  //               obj.userid = userid;
  //               results.push(obj);
  //             }
  //             resolve(results);
  //           }
  //         },
  //         (tx: any, error: any)=>{ /*error callback*/
  //           console.log('error in getting notes to save.');
  //           console.log(JSON.stringify(error));
  //           reject(error); /*?????*/
  //         }
  //       )
  //     })
  //     .then(txResult=>{
  //       // console.log('txResult');
  //       // console.log(JSON.stringify(txResult));
  //       resolve(null); /*never here (?)*/
  //     })
  //     .catch(txError=>{
  //       console.log('tx error');
  //       console.log(JSON.stringify(txError));
  //       reject(txError);
  //     })
  //   })
  // }
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


}
