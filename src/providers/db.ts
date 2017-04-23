import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import { SQLite } from 'ionic-native';
import { Platform } from 'ionic-angular';
import { Query } from '../public/query';
import { Table, Const, Action, WhichField } from '../public/const';
import { Utils } from '../public/utils';
import { NoteExtraMin, NoteFull, NoteSQLite,NoteMin } from '../models/notes';
import { TagExtraMin, TagFull, TagMin, TagAlmostMin, TagSQLite } from '../models/tags';
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

  private promise: Promise<SQLite>;


  constructor(private platform: Platform) {
    console.log('Hello Db Provider');

    //if(!this.open) {
    this.promise = new Promise<SQLite>((resolve, reject)=>{
      this.platform.ready().then(ready=>{
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
              this.open = true;
              return this.count();
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
//  }

}
private getLogsCount():Promise<any>{
  return this.db.executeSql(Query.GET_LOGS_COUNT,[]);
}

private getNotesCount():Promise<any>{
  return this.db.executeSql(Query.GET_NOTES_COUNT,[]);
}

private getTagsCount():Promise<any>{
  return this.db.executeSql(Query.GET_TAGS_COUNT,[]);
}

private getLogsCountWrapper(){
  return new Promise<any>((resolve, reject)=>{
    this.getLogsCount()
    .then(result=>{
      this.logsCount = result.rows.item(0).count;
      resolve();
    })
    .catch(error=>{
      // console.log(JSON.stringify(error));
      reject(error);
    })
  })
}

private getNotesCountWrapper(){
  return new Promise<any>((resolve, reject)=>{
    this.getNotesCount()
    .then(result=>{
      this.notesCount = result.rows.item(0).count;
      resolve();
    })
    .catch(error=>{
      // console.log(JSON.stringify(error));
      reject(error);
    })
  })
}

private getTagsCountWrapper(){
  return new Promise<any>((resolve, reject)=>{
    this.getTagsCount()
    .then(result=>{
      this.tagsCount = result.rows.item(0).count;
      resolve();
    })
    .catch(error=>{
      // console.log(JSON.stringify(error));
      reject(error);
    })
  })
}

private getNotesAndTagsCountWrapper(){
  return new Promise<any>((resolve, reject)=>{
    this.getNotesCount()
    .then(()=>{
      return this.getTagsCount()
    })
    .then(()=>{
      resolve();
    })
    .catch(error=>{
      reject(error);
    })
  })
}



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
private count():Promise<any>{
  return this.getLogsCount()
    .then(count=>{
      this.logsCount = count.rows.item(0).count;
      return this.getNotesCount();
    })
    .then(count=>{
      this.notesCount = count.rows.item(0).count;
      return this.getTagsCount();
    })
    .then(count=>{
      this.tagsCount = count.rows.item(0).count;
      console.log('counts:');
      console.log(JSON.stringify([this.logsCount, this.notesCount, this.tagsCount]));
    });
}

public getNumberOfNotes(){
  return this.promise.then(db=>{
    return this.notesCount;
  });
}

public getNumberOfTags(){
  return this.promise.then(db=>{
    return this.tagsCount;
  });
}

public getNumberOfLogs(){
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
public getToken():Promise<any>{
  return new Promise<any>((resolve, reject)=>{
    try{
      this.promise.then(db=>{
        db.executeSql(Query.GET_TOKEN, [])
        .then(result=>{
          resolve(result);
        })
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

public insertOrUpdateNote(note: NoteFull):Promise<any>{
  return new Promise<any>((resolve, reject)=>{
    let isPresent: boolean;
    this.db.executeSql(Query.NOTE_EXISTS, [note.title])
    .then(result=>{
      let p:Promise<any>;
      console.log('is present?');
      if(result.rows.length > 0){
        isPresent = true;
        console.log('yes');
        /*  static readonly UPDATE_NOTE_2 = 'update notes set text=?, remote_lastmodificationdate=?, creationdate?, isdone=?, links=?, json_object=? where title=? and json_object <> ?';*/
        p=this.db.executeSql(Query.UPDATE_NOTE_2,[note.text, note.lastmodificationdate, note.creationdate, note.isdone, note.links, JSON.stringify(note), note.title, JSON.stringify(note)]);
      }else{
        isPresent=false;
        console.log('no');
        /*  static readonly INSERT_NOTE = 'insert into notes(title, userid, text, creationdate, remote_lastmodificationdate, isdone, links, json_object) values(?,?,?,?,?,?,?,?)';*/
        p=this.db.executeSql(Query.INSERT_NOTE, [note.title, note.userid, note.text, note.creationdate, note.lastmodificationdate, note.isdone, JSON.stringify(note.links), JSON.stringify(note)]);
      }
      return p;
    })
    .then(postInsert=>{
      return Promise.all([
        note.maintags.map((tag)=>{
          console.log('currently I\'m working on main');
          console.log(JSON.stringify(tag));
          return this.db.executeSql(Query.TAG_EXISTS, [tag.title])
          .then(result=>{
            if(result.rows.length==0){
              /*static readonly INSERT_TAG_MIN = 'insert into tags(title, json_object) values (?,?)';*/
              return this.db.executeSql(Query.INSERT_TAG_MIN, [tag.title, JSON.stringify(tag)]);
            }
          })
          .then(secondResult=>{
            /*  static readonly INSERT_NOTES_TAGS = 'insert into notes_tags(notetitle,tagtitle, role, userid) values(?,?,?,?);';*/
            return  this.db.executeSql(Query.INSERT_NOTES_TAGS, [note.title, tag.title, 'mainTags', note.userid]);
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
            return this.db.executeSql(Query.TAG_EXISTS, [tag.title])
            .then(result=>{
              if(result.rows.length==0){
                return this.db.executeSql(Query.INSERT_TAG_MIN, [tag.title, JSON.stringify(tag)]);
              }
            })
            .then(secondResult=>{
              return  this.db.executeSql(Query.INSERT_NOTES_TAGS, [note.title, tag.title, 'otherTags', note.userid]);
            })
          })
        ])
      })
      .then(results=>{
        console.log('done with other tags');
        resolve(true);
      })
      .catch(error=>{
        console.log('error:');
        console.log(JSON.stringify(error));
      })

          //   for(let i=0;i<note.maintags.length;i++){
          //     this.db.executeSql(Query.TAG_EXISTS, [note.maintags[i].title])
          //     .then(resultSet=>{
          //       if(resultSet.rows==0){
          //         /*try-update*/
          //         this.db.executeSql(Query.INSERT_TAG_MIN, [JSON.stringify(note.maintags[i]), note.maintags[i].title]);
          //         this.db.executeSql(Query.INSERT_NOTES_TAGS, [note.title, note.maintags[i].title, 'mainTags', note.userid]);
          //       }
          //     })
          //   }
          //   for(let i=0;i<note.othertags.length;i++){
          //     this.db.executeSql(Query.INSERT_TAG_MIN, [note.othertags[i].title, JSON.stringify(note.othertags[i])])
          //     .then(resultSet=>{
          //       if(resultSet.rows==0){
          //         /*try-update*/
          //         this.db.executeSql(Query.INSERT_TAG_MIN, [JSON.stringify(note.othertags[i]), note.othertags[i].title]);
          //         this.db.executeSql(Query.INSERT_NOTES_TAGS, [note.title, note.othertags[i].title, 'otherTags', note.userid]);
          //       }
          //     })
          //  }
    })
}


public createNewNote(note:NoteFull):Promise<any>{
  return new Promise<any>((resolve, reject)=>{
    this.db.transaction(tx=>{
      /*p=this.db.executeSql(Query.INSERT_NOTE, [note.title, note.userid, note.text, note.creationdate, note.lastmodificationdate, note.isdone, note.links, JSON.stringify(note)]);*/
      /* insert into notes(title, userid, text, creationdate, remote_lastmodificationdate, isdone, links, json_object) values(?,?,?,?,?,?,?,?,?)';*/
      tx.executeSql(Query.INSERT_NOTE, [note.title, note.userid, note.text, note.creationdate, note.lastmodificationdate, note.isdone, JSON.stringify(note.links), JSON.stringify(note)],
      (tx:any, res:any)=>{
        if(res){
          console.log('res note is');
          console.log(JSON.stringify(res));
        }
      }, (tx:any, err: any)=>{
        if(err){
          console.log('error in insert note');
          console.log(JSON.stringify(err));
        }
      });

      /*'insert into logs (notetitle, action) values (?,?)';*/
      tx.executeSql(Query.INSERT_NOTE_OLDTITLE_INTO_LOGS, [note.title, note.title, 'create'],
      (tx:any, res:any)=>{
        if(res){
          console.log('res logs is');
          console.log(JSON.stringify(res));
        }
      }, (tx:any, err: any)=>{
        if(err){
          console.log('error in insert log');
          console.log(JSON.stringify(err));
        }
      });

      note.maintags.map((tag)=>{
/*   = 'insert into notes_tags(notetitle,tagtitle, role) values(?,?,?);';*/
        tx.executeSql(Query.INSERT_NOTES_TAGS, [note.title, tag.title, 'mainTags'],
        (tx:any, res:any)=>{
          if(res){
            console.log('res maintags is');
            console.log(JSON.stringify(res));
          }
        }, (tx:any, err: any)=>{
          if(err){
            console.log('error in insert maintag');
            console.log(JSON.stringify(err));
          }
        });
      });

      note.othertags.map((tag)=>{
        tx.executeSql(Query.INSERT_NOTES_TAGS, [note.title, tag.title, 'otherTags'],
        (tx:any, res:any)=>{
          if(res){
            console.log('res other is');
            console.log(JSON.stringify(res));
          }
        }, (tx:any, err: any)=>{
                if(err){
                  console.log('error in insert othertag');
                  console.log(JSON.stringify(err));
                }
              });
      });
      //resolve(true);
  })
  .then(txResult=>{
    console.log('tx completed, note created');
    resolve(true);
  })
  .catch(error=>{
    console.log('transaction error:');
    console.log(JSON.stringify(error));
    reject(error);
  })
})
}


public createNewNote2(note:NoteFull, tags:TagAlmostMin[]):Promise<any>{
  return new Promise<any>((resolve, reject)=>{
    this.db.transaction(tx=>{
      /*p=this.db.executeSql(Query.INSERT_NOTE, [note.title, note.userid, note.text, note.creationdate, note.lastmodificationdate, note.isdone, note.links, JSON.stringify(note)]);*/
      /* insert into notes(title, userid, text, creationdate, remote_lastmodificationdate, isdone, links, json_object) values(?,?,?,?,?,?,?,?,?)';*/
      tx.executeSql(Query.INSERT_NOTE, [note.title, note.userid, note.text, note.creationdate, note.lastmodificationdate, note.isdone, JSON.stringify(note.links), JSON.stringify(note)],
      (tx:any, res:any)=>{
        if(res){
          console.log('res note is');
          console.log(JSON.stringify(res));
        }
      }, (tx:any, err: any)=>{
        if(err){
          console.log('error in insert note');
          console.log(JSON.stringify(err));
        }
      });

      /*'insert into logs (notetitle, action) values (?,?)';*/
      tx.executeSql(Query.INSERT_NOTE_OLDTITLE_INTO_LOGS, [note.title, note.title, 'create'],
      (tx:any, res:any)=>{
        if(res){
          console.log('res logs is');
          console.log(JSON.stringify(res));
        }
      }, (tx:any, err: any)=>{
        if(err){
          console.log('error in insert log');
          console.log(JSON.stringify(err));
        }
      });

      note.maintags.map((tag)=>{
/*   = 'insert into notes_tags(notetitle,tagtitle, role) values(?,?,?);';*/
        tx.executeSql(Query.INSERT_NOTES_TAGS, [note.title, tag.title, 'mainTags'],
        (tx:any, res:any)=>{
          if(res){
            console.log('res maintags is');
            console.log(JSON.stringify(res));
          }
        }, (tx:any, err: any)=>{
          if(err){
            console.log('error in insert maintag');
            console.log(JSON.stringify(err));
          }
        });

        tx.executeSql(Query.UPDATE_JSON_OBJ_TAG,[JSON.stringify(tag), tag.title],
        (tx:any, res:any)=>{
          if(res){
            console.log('res json maintags is');
            console.log(JSON.stringify(res));
          }
        }, (tx:any, err: any)=>{
          if(err){
            console.log('error in update json_obj maintag');
            console.log(JSON.stringify(err));
          }
        })
      });

      note.othertags.map((tag)=>{
        tx.executeSql(Query.INSERT_NOTES_TAGS, [note.title, tag.title, 'otherTags'],
        (tx:any, res:any)=>{
          if(res){
            console.log('res other is');
            console.log(JSON.stringify(res));
          }
        }, (tx:any, err: any)=>{
                if(err){
                  console.log('error in insert othertag');
                  console.log(JSON.stringify(err));
                }
              });
        tx.executeSql(Query.UPDATE_JSON_OBJ_TAG,[JSON.stringify(tag), tag.title],
        (tx:any, res:any)=>{
          if(res){
            console.log('res othertags obj is');
            console.log(JSON.stringify(res));
          }
        }, (tx:any, err: any)=>{
                if(err){
                  console.log('error in update json_obj othertag');
                  console.log(JSON.stringify(err));
                }
              })
      });
      //resolve(true);
  })
  .then(txResult=>{
    console.log('tx completed, note created');
    resolve(true);
  })
  .catch(error=>{
    console.log('transaction error:');
    console.log(JSON.stringify(error));
    reject(error);
  })
})
}

// public insertOrUpdateNote(note:NoteFull):Promise<any>{
//   /*check if it's up-to-date, the query will return somethins only if exists and it's up-to-date*/
//   return new Promise<any>((resolve, reject)=>{
//     let isPresent:boolean;
//     this.db.executeSql(Query.NOTE_EXISTS, [])
//     .then(result=>{
//       let p:Promise<any>;
//
//       if(result.rows.length > 0){
//         isPresent=true;
//         /*using the 'try-update.'*/
//         /*  static readonly UPDATE_NOTE_2 = 'update notes set text=?, remote_lastmodificationdate=?, creationdate?, isdone=?, links=?, json_object=? where title=? and json_object <> ?';
//         */
//         p=this.db.executeSql(Query.UPDATE_NOTE_2,[note.text, note.lastmodificationdate, note.creationdate, note.isdone, note.links, JSON.stringify(note), note.title, JSON.stringify(note)]);
//       }else{
//         isPresent=false;
//         p=this.db.executeSql(Query.INSERT_NOTE, [note.title, note.userid, note.text, note.creationdate, note.lastmodificationdate, note.isdone, note.links, JSON.stringify(note)]);
//       }
//       return p;
//     })
//     .then(insertOrUpdateResult=>{
//       /*using the try-or for tags.*/
//       for(let i=0;i<note.maintags.length;i++){
//         this.db.executeSql(Query.TAG_EXISTS, [note.maintags[i].title])
//         .then(resultSet=>{
//           if(resultSet.rows==0){
//             /*try-update*/
//             this.db.executeSql(Query.INSERT_TAG_MIN, [JSON.stringify(note.maintags[i]), note.maintags[i].title]);
//             this.db.executeSql(Query.INSERT_NOTES_TAGS, [note.title, note.maintags[i].title, 'mainTags', note.userid]);
//           }
//         })
//       }
//       for(let i=0;i<note.othertags.length;i++){
//         this.db.executeSql(Query.INSERT_TAG_MIN, [note.othertags[i].title, JSON.stringify(note.othertags[i])])
//         .then(resultSet=>{
//           if(resultSet.rows==0){
//             /*try-update*/
//             this.db.executeSql(Query.INSERT_TAG_MIN, [JSON.stringify(note.othertags[i]), note.othertags[i].title]);
//             this.db.executeSql(Query.INSERT_NOTES_TAGS, [note.title, note.othertags[i].title, 'otherTags', note.userid]);
//           }
//         })
//       }
//       //resolve(true);
//     })
//     .catch(error=>{
//       reject(error);
//     })
//   });
// }
/*
static readonly UPDATE_NOTE_2 = 'update notes set text=?, remote_lastmodificationdate=?, creationdate=?, isdone=?, links=?, json_object=? where title=? and json_object <> ?';
*/
/*
here a different approach, test if present, then insert or update. I will check wich approach has the performance.
*/
// public insertOrUpdateNote(note:NoteFull, updateTags: boolean){
//   return new Promise<any>((resolve, reject)=>{
//     console.log('checking for note: ');
//     console.log(JSON.stringify(note));
//     this.db.executeSql(Query.NOTE_EXISTS, [note.title])
//     .then(result=>{
//
//         /*note is note present, inserting it.*/
//         this.db.transaction(
//           (tx)=>{
//
//           }
//         )
//     })
//     .catch(error=>{
//       reject(error);
//     })

    // this.db.transaction(t=>{
    //   t.executeSql(Query.NOTE_EXISTS, [note.title])
    //   .then(result=>{
    //     if(result.rows.length<=0){
    //       console.log('note not exists');
    //       t.executeSql(Query.INSERT_NOTE, [note.title, note.userid, note.text, note.creationdate, note.lastmodificationdate, note.isdone, note.links, JSON.stringify(note)]);
    //     }else{
    //       console.log('note exists, update it.');
    //       t.executeSql(Query.UPDATE_NOTE_2, [note.text, note.lastmodificationdate, note.creationdate, note.isdone, note.links, JSON.stringify(note), note.title, JSON.stringify(note)]);
    //     }
    //     if(updateTags){
    //       for(let i=0;i<note.maintags.length;i++){
    //         console.log('checking things for ');
    //         console.log(JSON.stringify(note.maintags[i]));
    //         t.executeSql(Query.TAG_EXISTS, [note.maintags[i].title])
    //         .then(result=>{
    //           if(result.rows.length<=0){
    //             console.log('tag doesn\t exists, insert it.');
    //             t.executeSql(Query.INSERT_TAG, [note.maintags[i].title, note.userid, JSON.stringify(note.maintags[i])]);
    //             /*if new we can push it also to notes_tags*/
    //             console.log('inserting also in notes_tags');
    //             t.executeSql(Query.INSERT_NOTES_TAGS, [note.title, note.maintags[i].title, 'mainTags', note.userid]);
    //           }else{
    //             /*just update, the on update cascade will update into notes_tags*/
    //             //no, because what I get from the DBis just the title of the note, so there's no chanche to update it properly.
    //             // t.executeSql(Query.UPDATE_TAG_2, [JSON.stringify(note.maintags[i]), note.maintags[i].title, JSON.stringify(note.maintags[i])]);
    //           }
    //         })
    //       } /*end of maintags*/
    //       for(let i=0;i<note.othertags.length;i++){
    //         console.log('checking things for ');
    //         console.log(JSON.stringify(note.othertags[i]));
    //         t.executeSql(Query.TAG_EXISTS, [note.othertags[i].title])
    //         .then(result=>{
    //           if(result.rows.length<=0){
    //             console.log('tag doesn\t exists, insert it.');
    //             t.executeSql(Query.INSERT_TAG, [note.othertags[i].title, note.userid, JSON.stringify(note.maintags[i])]);
    //             /*if new we can push it also to notes_tags*/
    //             console.log('inserting also in notes_tags');
    //             t.executeSql(Query.INSERT_NOTES_TAGS, [note.title, note.othertags[i].title, 'otherTags', note.userid]);
    //           }else{
    //             /*just update, the on update cascade will update into notes_tags*/
    //             //no, because what I get from the DBis just the title of the note, so there's no chanche to update it properly.
    //             // t.executeSql(Query.UPDATE_TAG_2, [JSON.stringify(note.othertags[i]), note.othertags[i].title, JSON.stringify(note.othertags[i])]);
    //           }
    //         })
    //       }
    //     }
    //     t.executeSql(Query.GET_NOTES_COUNT, [])
    //     .then(rawResult=>{
    //       this.notesCount = rawResult.rows.item(0).count;
    //     })
    //     .catch(error=>{
    //       console.log('get notes number error');
    //       console.log(JSON.stringify(error));
    //     });
    //     t.executeSql(Query.GET_TAGS_COUNT,[])
    //     .then(rawResult=>{
    //       this.tagsCount = rawResult.rows.item(0).count;
    //     })
    //     .catch(error=>{
    //       console.log('get tags number error');
    //       console.log(JSON.stringify(error));
    //     });
    //   })
    //   resolve(true);
    // })
    // .then(txResult=>{
    //   return this.getNotesAndTagsCountWrapper();
    // })
    // .then(()=>{
    //   resolve(true);
    // })
    // .catch(error=>{
    //   reject(error);
    // });
  //})
//}


public isNoteFull(title: string):Promise<boolean>{
  return new Promise<boolean>((resolve, reject)=>{
    /*return */this.db.executeSql(Query.NOTE_EXISTS_AND_IS_FULL,[title])
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

public isTagFull(title: string):Promise<boolean>{
  return new Promise<boolean>((resolve, reject)=>{
    /*return */this.db.executeSql(Query.TAG_EXISTS_AND_IS_FULL,[title])
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
public getNoteFull(title: string):Promise<NoteFull>{
  return new Promise<NoteFull>((resolve, reject)=>{
    this.db.executeSql(Query.GET_NOTE_FULL_JSON, [title])
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
public insertTagMinQuietly(tag: TagAlmostMin):Promise<any>{
  return new Promise<any>((resolve, reject)=>{
    this.db.executeSql(Query.INSERT_TAG_MIN,[tag.title, JSON.stringify(tag)])
    .then(result=>{
      /*nothing to do.*/
      return this.getTagsCount();
    })
    .then(()=>{
      resolve(true);
    })
    .catch(error=>{
      console.log('error in inserting tags: ');
      console.log(JSON.stringify(error));
      console.log(JSON.stringify(error.stack));
      if(error.code===19){
        console.log('already there.');
        /*ok, constraint violation, the note is already there.*/
        /*maybe the json_object is changed, trying to update.*/
        this.db.executeSql(Query.UPDATE_TAG_2, [JSON.stringify(tag), tag.title, JSON.stringify(tag)])
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

public insertNoteMinQuietly(note: NoteExtraMin):Promise<any>{
  return new Promise<any>((resolve, reject)=>{
    this.db.executeSql(Query.INSERT_NOTE_MIN,[note.title, JSON.stringify(note)])
    .then(result=>{
      /*nothing to do.*/
      return this.getNotesCount();
    })
    .then(()=>{
      resolve(true);
    })
    .catch(error=>{
      // console.log('error in inserting note min:'),
      // console.log(JSON.stringify(error));
      // console.log(JSON.stringify(error.stack));
      if(error.code===19){
        /*ok, constraint violation, the note is already there.*/
        console.log('already there.');
      }else{
        reject(error);
      }
    })
  })
}

public getNotesMin():Promise<NoteExtraMin[]>{
  return new Promise<NoteExtraMin[]>((resolve, reject)=>{
    this.db.executeSql(Query.SELECT_NOTES_MIN, [])
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


public getTagsMin():Promise<TagAlmostMin[]>{
  return new Promise<TagExtraMin[]>((resolve, reject)=>{
    this.db.executeSql(Query.SELECT_TAGS_MIN, [])
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

private setDoneJustLocal(note: NoteFull):Promise<any>{
  return this.db.executeSql(Query.UPDATE_NOTE_SET_DONE, [note.isdone, JSON.stringify(note), note.title]);
}

private setDoneAlsoRemote(note: NoteFull):Promise<any>{
  return new Promise<any>((resolve, reject)=>{
    this.db.transaction(tx=>{
      tx.executeSql(Query.UPDATE_NOTE_SET_DONE, [note.isdone, JSON.stringify(note), note.title]);
      tx.executeSql(Query.INSERT_NOTE_OLDTITLE_INTO_LOGS, [note.title, note.title, 'set-done']);
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
public setDone(note :NoteFull):Promise<any>{
  /*UODATE_NOTE_SET_DONE = 'update note set isdone=?, json_object=? where title=?';*/
  /*'select * from logs where notetitle=? and action=\'create\'';*/
  /*first check if the note must be sent to the server, if so,
  I can only update it.
  If the note is already in the server, I need to write modification to the log.
  */
  return new Promise<any>((resolve, reject)=>{
    let inTheServer: boolean = false;
    this.db.executeSql(Query.IS_NOTE_NOT_IN_THE_SERVER, [note.title])
    .then(result=>{
      if(result.rows.length > 0){
        // console.log('the note is not in the server');
        // inTheServer = false;
        return this.setDoneJustLocal(note);
      }else{
        // console.log('the note is already in the server');
        // inTheServer = true;
        return this.setDoneAlsoRemote(note);
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


private setTextJustLocal(note: NoteFull):Promise<any>{
  return this.db.executeSql(Query.UPDATE_NOTE_SET_TEXT, [note.text, JSON.stringify(note), note.title]);
}

private setTextAlsoRemote(note: NoteFull):Promise<any>{
  return new Promise<any>((resolve, reject)=>{
    this.db.transaction(tx=>{
      tx.executeSql(Query.UPDATE_NOTE_SET_TEXT, [note.text, JSON.stringify(note), note.title]);
      tx.executeSql(Query.INSERT_NOTE_OLDTITLE_INTO_LOGS, [note.title, note.title,'change-text']);
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
public setText(note :NoteFull):Promise<any>{
  /*UODATE_NOTE_SET_DONE = 'update note set isdone=?, json_object=? where title=?';*/
  /*'select * from logs where notetitle=? and action=\'create\'';*/
  /*first check if the note must be sent to the server, if so,
  I can only update it.
  If the note is already in the server, I need to write modification to the log.
  */
  return new Promise<any>((resolve, reject)=>{
    let inTheServer: boolean = false;
    this.db.executeSql(Query.IS_NOTE_NOT_IN_THE_SERVER, [note.title])
    .then(result=>{
      if(result.rows.length > 0){
        // console.log('the note is not in the server');
        // inTheServer = false;
        return this.setTextJustLocal(note);
      }else{
        // console.log('the note is already in the server');
        // inTheServer = true;
        return this.setTextAlsoRemote(note);
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


private setLinksJustLocal(note: NoteFull):Promise<any>{
  return this.db.executeSql(Query.UPDATE_NOTE_SET_LINKS, [JSON.stringify(note.links), JSON.stringify(note), note.title]);
}

private setLinksAlsoRemote(note: NoteFull):Promise<any>{
  return new Promise<any>((resolve, reject)=>{
    this.db.transaction(tx=>{
      tx.executeSql(Query.UPDATE_NOTE_SET_LINKS, [JSON.stringify(note.links), JSON.stringify(note), note.title]);
      tx.executeSql(Query.INSERT_NOTE_OLDTITLE_INTO_LOGS, [note.title, note.title,'set-link']);
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
public setLinks(note :NoteFull):Promise<any>{
  /*UODATE_NOTE_SET_DONE = 'update note set isdone=?, json_object=? where title=?';*/
  /*'select * from logs where notetitle=? and action=\'create\'';*/
  /*first check if the note must be sent to the server, if so,
  I can only update it.
  If the note is already in the server, I need to write modification to the log.
  */
  return new Promise<any>((resolve, reject)=>{
    let inTheServer: boolean = false;
    this.db.executeSql(Query.IS_NOTE_NOT_IN_THE_SERVER, [note.title])
    .then(result=>{
      if(result.rows.length > 0){
        // console.log('the note is not in the server');
        // inTheServer = false;
        return this.setLinksJustLocal(note);
      }else{
        // console.log('the note is already in the server');
        // inTheServer = true;
        return this.setLinksAlsoRemote(note);
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


private setTitleJustLocal(note: NoteFull, newTitle: string):Promise<any>{
  let oldTitle:string = note.title;
  note.title = newTitle;
  return this.db.executeSql(Query.UPDATE_NOTE_SET_TITLE, [newTitle, JSON.stringify(note), oldTitle]);
}

private setTitleAlsoRemote(note: NoteFull, newTitle: string):Promise<any>{
  return new Promise<any>((resolve, reject)=>{
    let oldTitle:string = note.title;
    note.title = newTitle;
    this.db.transaction(tx=>{
      tx.executeSql(Query.UPDATE_NOTE_SET_TITLE,[newTitle, JSON.stringify(note), oldTitle]);
      tx.executeSql(Query.INSERT_NOTE_OLDTITLE_INTO_LOGS, [newTitle, oldTitle,'change-title']);
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
public setTitle(note :NoteFull, newTitle: string):Promise<any>{
  /*UODATE_NOTE_SET_DONE = 'update note set isdone=?, json_object=? where title=?';*/
  /*'select * from logs where notetitle=? and action=\'create\'';*/
  /*first check if the note must be sent to the server, if so,
  I can only update it.
  If the note is already in the server, I need to write modification to the log.
  */
  return new Promise<any>((resolve, reject)=>{
    let inTheServer: boolean = false;
    this.db.executeSql(Query.IS_NOTE_NOT_IN_THE_SERVER, [note.title])
    .then(result=>{
      if(result.rows.length > 0){
        // console.log('the note is not in the server');
        // inTheServer = false;
        return this.setTitleJustLocal(note, newTitle);
      }else{
        // console.log('the note is already in the server');
        // inTheServer = true;
        return this.setTitleAlsoRemote(note, newTitle);
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
}
