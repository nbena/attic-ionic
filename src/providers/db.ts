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
      tx.executeSql(Query.INSERT_NOTE_INTO_LOGS, [note.title, 'create'],
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
      resolve(true);
  })
  .catch(error=>{
    console.log('transaction error:');
    console.log(JSON.stringify(error));
    reject(error);
  })
})

/*out of-transaction*/
/*
tx.executeSql(Query.INSERT_NOTE, [note.title, note.userid, note.text, note.creationdate, note.lastmodificationdate, note.isdone, note.links, JSON.stringify(note)])
.then(postInsert=>{
return Promise.all([
note.maintags.map((tag)=>{
  console.log('currently I\'m working on main');
  console.log(JSON.stringify(tag));
  this.db.executeSql(Query.INSERT_TAG_MIN, [tag.title, JSON.stringify(tag)])
  .then(secondResult=>{
    return  this.db.executeSql(Query.INSERT_NOTES_TAGS, [note.title, tag.title, 'mainTags', note.userid]);
  })
})
]);
})
.then((postMainTags)=>{
return Promise.all([
note.othertags.map((tag)=>{
  console.log('currently I\'m working on other');
  console.log(JSON.stringify(tag));
  this.db.executeSql(Query.INSERT_TAG_MIN, [tag.title, JSON.stringify(tag)])
  .then(secondResult=>{
    return  this.db.executeSql(Query.INSERT_NOTES_TAGS, [note.title, tag.title, 'otherTags', note.userid]);
  })
})
]);
})
.then(postOtherTags=>{
console.log('done with other tags');
resolve(true);
})
.catch(error=>{
console.log('error:');
console.log(JSON.stringify(error));
})
*/
/**/


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
  //  })
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
if not full, an error will be thrown.
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
public insertTagMinQuietly(tag: TagExtraMin):Promise<any>{
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


public getTagsMin():Promise<TagExtraMin[]>{
  return new Promise<TagExtraMin[]>((resolve, reject)=>{
    this.db.executeSql(Query.SELECT_TAGS_MIN, [])
    .then(result=>{
      let array:TagExtraMin[] = [];
      for(let i=0;i<result.rows.length;i++){
        let rawResult:any = result.rows.item(i).json_object;
        let obj:TagExtraMin = JSON.parse(rawResult);
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


//
// private static noteMinParse(row: any):NoteExtraMin{
//   let note = new NoteExtraMin();
//   note._id = row.id;
//   note.title = row.title;
//   return note;
// }
//
// private static noteFullParse(row: any):NoteFull{
//     let note = new NoteFull();
//     note._id = row._id;
//     note.title = row.title;
//     note.text = row.text;
//     note.mainTags = JSON.parse(row.mainTags);
//     note.otherTags = JSON.parse(row.otherTags);
//     note.links = JSON.parse(row.links);
//     note.isDone = JSON.parse(row.isDone);
//     note.creationDate = row.creationDate;
//     note.lastModificationDate = JSON.parse(row.lastModificationDate);
//     return note;
// }
//
// private static noteSQLiteParse(row: any):NoteSQLite{
//   let note = Db.noteFullParse(row);
//   let noteRes = <NoteSQLite>note; //need to cast.
//   noteRes.mainTagsToAdd = JSON.parse(row.mainTagsToAdd);
//   noteRes.mainTagsToRemove = JSON.parse(row.mainTagsToRemove);
//   noteRes.otherTagsToAdd = JSON.parse(row.otherTagsToAdd);
//   noteRes.otherTagsToRemove = JSON.parse(row.otherTagsToRemove);
//   return noteRes;
// }
//
// //during the startup we'll decide which type of tags we will require.
// private static TagAlmostMinParse(row: any):TagAlmostMin{
//   let tag = new TagAlmostMin();
//   tag._id = row._id;
//   tag.title = row.title;
//   tag.notes_length = row.notes_length;
//   return tag;
// }
//
// private static tagFullParse(row: any):TagFull{
//   let tag = new TagFull();
//   tag._id = row._id;
//   tag.title = row.title;
//   tag.notes_length = row.notes_length;
//   tag.notes = JSON.parse(row.notes);
//   return tag;
// }
//
// private static tagSQLiteParse(row: any):TagSQLite{
//   let tag = Db.tagFullParse(row);
//   let tagRes = <TagSQLite>tag;
//   tagRes.addedNotes = JSON.parse(row.addedNotes);
//   tagRes.removedNotes = JSON.parse(row.removedNotes);
//   return tagRes;
// }
//
// //examples
//
// /*
// Count how many rows there are in the provided table.
// */
// public count(table: Table){
//   let sql = Query.getQueryTable(table, Query.COUNT);
//   return this.db.executeSql(sql, {})
//     .then((result)=>{
//       let res = 0;
//       if(result.rows.length > 0){
//         res = result.rows.item(0).count;
//       }
//       return res;
//     })
// }
//
// /*
// I known that nested for-s aare ugly but we can assume that
// the loops will be done on small amount of data.
// */
//
// /*
// incomplete.
// */
// // public getAllFullNotes():Promise<any>{
// //   let sql = Query.getQueryTable(Table.Notes, Query.SELECT_ALL);
// //   return this.db.executeSql(sql, {})
// //     .then((result)=>{
// //       let notes: NoteFull[] = [];
// //       if(result.rows.length > 0){
// //         for(let i=0;i<result.rows.length;i++){
// //           let note = Db.noteFullParse(result.rows[i]);
// //         }
// //       }
// //       return notes;
// //     })
// // }
//
// /*
// Get all the notes in the NoteExtraMin format
// (_id, title).
// */
// public getAllExtraMinNotes():Promise<any>{
//   return this.db.executeSql(Query.SELECT_NOTES_EXTRA_MIN, {})
//     .then(result=>{
//       let notes: NoteExtraMin[] = [];
//       if(result.rows.length > 0){
//         for(let i=0;i<result.rows.length;i++){
//           let note = Db.noteMinParse(result.rows[i]);
//           notes.push(note);
//         }
//       }
//     })
// }
//
// /*
// Get all the tags in the TagExtraMin object.
// (_id, title, notes_length)
// */
// public getAlmostMinTags():Promise<any>{
//   return this.db.executeSql(Query.SELECT_TAG_ALMOST_MIN, {})
//     .then(result=>{
//       let tags: TagExtraMin[] = [];
//       if(result.rows.length > 0){
//         for(let i=0;i<result.rows.length;i++){
//           let tag = Db.TagAlmostMinParse(result.rows[i]);
//         }
//       }
//       return tags;
//     })
// }
// /*
// public getFullTag(_id: string):Promise<any>{
//   return this.db.executeSql(Query.SELECT_TAG_ALMOST_MIN, [_id])
//     .then(result=>{
//       if(result.rows.length > 0){
//         let tag = Db.TagFullParse(result.rows[_id]);
//         if(tag.notes_length>0){
//           return this.db.executeSql(Db.prepareString(tag), {})
//             .then(secondResult=>{
//               if(secondResult.rows.length != tag.notes_length){
//                 throw new Error(Const.ERR_MISMATCH);
//               }
//               tag = Db.finishFullTag(secondResult.rows, tag);
//               return tag;
//             })
//         }
//       }else{
//         throw new Error(Const.ERR_TAG_NOT_FOUND);
//       }
//     })
// }
// */
//
// /*
// to improve performance on prepareString methods we can
// check if the title is already set or no.
// */
// /*
// Prepare the SQL query in order to get the all the tags (_id, title)
// that are in this note's mainTags/otherTags.
// How this is done:
// effective tag = note.mainTags + note.otherTags + note.mainTagsToAdd +
// note.otherTagsToAdd - (note.mainTagsToRemove, +note.otherTagsToRemove).
// The table used here to search is <code>tags</code>.
// */
// private static prepareStringAddTagsToNoteFromTags(note: NoteSQLite):string{
//   let init = 'select _id, title from tags where _id = ';
//
//   // let array = note.mainTags.concat(note.otherTags, note.mainTagsToAdd, note.otherTagsToAdd);
//   // array = Utils.arrayDiff(array, note.mainTagsToRemove.concat(note.otherTagsToRemove));
//   let array = Utils.getEffectiveTagsFromNotes(note);
//
//   for(let i=0;i<array.length;i++){
//     if(i!=array.length-1 && array[i].title==null){
//       init = init.concat('\''+array[i]._id+'\' or _id = ');
//     }
//     else if(array[i].title==null){
//       init = init.concat('\''+array[i][i]._id+'\'');
//     }
//   }
//   return init;
// }
//
// /*
// Prepare the SQL query in order to get the all the tags (_id, title)
// that are in this note's mainTags/otherTags.
// How this is done:
// effective tag = note.mainTags + note.otherTags + note.mainTagsToAdd +
// note.otherTagsToAdd - (note.mainTagsToRemove, +note.otherTagsToRemove).
// The table used here to search is <code>tags_to_save</code>.
// */
// private static prepareStringAddTagsToNoteFromTagsToSave(note: NoteFull):string{
//   let init = 'select _id, title from tags_to_save where _id = ';
//   // let array = note.mainTags.concat(note.otherTags);
//   let array = Utils.getEffectiveTagsFromNotes(note);
//   for(let i=0;i<array.length;i++){
//     if(i!=array.length-1 && array[i].title==null){
//       init = init.concat('\''+array[i]._id+'\' or _id = ');
//     }
//     else if(array[i].title==null){
//       init = init.concat('\''+array[i][i]._id+'\'');
//     }
//   }
//   return init;
// }
//
// /*
// Add to a note the mainTags and the otherTags.
// Indeed, the note is saved just with the _id of tha tags,
// here we add the tag title too.
// */
// private static finishFullNote(rows: any[], note: NoteFull){
//   for(let i=0;i<rows.length;i++){
//     for(let j=0;j<note.mainTags.length;j++){
//       if(rows[i]._id==note.mainTags[j]._id){
//         note.mainTags[j].title=rows[i].title;
//       }
//     }
//     for(let j=0;j<note.otherTags.length;j++){
//       if(rows[i]._id==note.otherTags[j]._id){
//         note.otherTags[j].title=rows[i].title;
//       }
//     }
//   }
//   return note;
// }
//
// /*
// SELECT * FROM NOTES WHERE ID = ?; IF RESULT IS NULL SELECT * FROM NOTES_TO_SAVE.
// */
// private getBasicNoteFullById(_id: string):Promise<any>{
//   // return this.db.executeSql(Query.SELECT_NOTE_BY_ID, [_id])
//   // .then(result=>{
//   //   if(result.rows.length == 0){
//   //     return this.db.executeSql(Query.SELECT_NOTE_BY_ID_FROM_TO_SAVE, [_id])
//   //   }else{
//   //     /*parsed as SQLite if comes from notes*/
//   //     return Db.noteSQLiteParse(result.rows[0]);
//   //   }
//   // })
//   // .then(secondResult=>{
//   //   if(secondResult.rows.length == 0){
//   //     throw new Error(Const.ERR_NOTE_NOT_FOUND);
//   //   }else{
//   //     return Db.noteFullParse(secondResult.rows[0])
//   //   }
//   // })
//   return this.db.executeSql(Query.SELECT_TAG_BY_ID_V2, [_id,_id])
//   .then(result=>{
//     if(result.rows.length>0){
//       if(result.rows.mainTagsToAdd){
//         return Db.noteSQLiteParse(result.rows[0]);
//       }else{
//         return Db.noteFullParse(result.rows[0]);
//       }
//     }else{
//       throw new Error(Const.ERR_NOTE_NOT_FOUND);
//     }
//   })
// }
//
//
// //old code:
// // return this.db.executeSql(Query.SELECT_NOTE_BY_ID, [_id])
// //   .then(result=>{
// //     let note, noteFinal;
// //     if(result.rows.length == 0){
// //     }else{
// //       //query the orher table.
// //       return this.db.executeSql(Query.SELECT_NOTE_BY_ID_FROM_TO_SAVE, [_id])
// //       .then(secondResult=>{
// //         if(secondResult.rows.length == 0){
// //           throw new Error(Const.ERR_NOTE_NOT_FOUND);
// //         }
// //       })
// //       note = Db.noteFullParse(result.rows[0]);
// //       return this.db.executeSql(Db.prepareStringNoteFromTags(note), {})
// //         .then(secondResult=>{
// //           //add a check.
// //           if(secondResult.rows>0){
// //             note = Db.finishFullNote(secondResult.rows, note);
// //           }
// //           return this.db.executeSql(Db.prepareStringNoteFromTagsToSave(note), {})
// //         })
// //         .then(thirdResult=>{ /*it's always needed to do the third query because we can't
// //                               known if there 's something in the other table.'*/
// //           if(thirdResult.rows>0){
// //               note = Db.finishFullNote(thirdResult.rows, note);
// //           }
// //           return note;
// //         })
// //     }
// //     // else{
// //     //   throw new Error(Const.ERR_NOTE_NOT_FOUND);
// //     // }
// //   })
//
// /*
// Get the full note object, along with its tags (_id and title),
// */
// public getFullNoteById(_id: string):Promise<any>{
//   let fromToSave = false;
//   let note;
//   return this.getBasicNoteFullById(_id)
//     .then(result=>{
//       //here if there is a result.
//       if(result===NoteFull){
//         fromToSave = true;
//       }else if(result !==NoteSQLite){
//         throw new Error('should never happens');
//       }
//       /*do the first linking.*/
//       note = result;
//       return this.db.executeSql(Db.prepareStringAddTagsToNoteFromTags(note), {})
//     })
//     .then(secondResult=>{
//       if(secondResult.rows.lenth > 0){
//         note = Db.finishFullNote(secondResult.rows, note);
//       }
//       return this.db.executeSql(Db.prepareStringAddTagsToNoteFromTagsToSave(note), {})
//     })
//     .then(thirdResult=>{
//       if(thirdResult.rows.length>0){
//         note = Db.finishFullNote(thirdResult.rows, note);
//       }
//       return note;
//     })
//     .catch(error=>{
//       console.log(JSON.stringify(error));
//     });
// }
//
// /*
// prepare the query in the note table.
// */
// private static prepareStringAddNotesToTagFromNotes(tag: TagFull):string{
//   let init = 'select _id, title from notes where _id = ';
//   let array = Utils.getEffectiveNotesFromTags(tag);
//   //
//   // for(let i=0;i<tag.notes_length;i++){
//   //   if(i!=tag.notes_length-1 && tag.notes[i].title==null){
//   //     init = init.concat('\''+tag.notes[i]._id+'\' or _id = ');
//   //   }
//   //   else if(tag.notes[i].title==null){
//   //     init = init.concat('\''+tag.notes[i]._id+'\'');
//   //   }
//   // }
//
//   for(let i=0;i<array.length;i++){
//     if(i!=array.length-1 && array[i].title==null){
//       init = init.concat('\''+array[i]._id+'\' or _id = ');
//     }
//     else if(array[i].title==null){
//       init = init.concat('\''+array[i]._id+'\'');
//     }
//   }
//
//   return init;
// }
//
// /*
// prepare the query in the notes_to_save table.
// */
// private static prepareStringAddNotesToTagFromNotesToSave(tag: TagFull):string{
//   let init = 'select _id, title from notes_to_save where _id = ';
//   let array = Utils.getEffectiveNotesFromTags(tag);
//
//   for(let i=0;i<array.length;i++){
//     if(i!=array.length-1 && array[i].title==null){
//       init = init.concat('\''+array[i]._id+'\' or _id = ');
//     }
//     else if(array[i].title==null){
//       init = init.concat('\''+array[i]._id+'\'');
//     }
//   }
//   return init;
// }
//
//
//
// private static finishFullTag(rows: any[], tag: TagFull):TagFull{
//   for(let i=0;i<rows.length;i++){
//     /*very ugly*/
//     // tag.notes.push(<NoteFull>Db.noteMinParse(rows[i]));
//     //ok this is better even if it's a nested for.
//     for(let j=0;j<tag.notes_length;j++){
//       if(rows[i]._id==tag.notes[j]._id){
//         tag.notes[j].title=rows[i].title;
//       }
//     }
//   }
//   return tag;
// }
//
// /*
// SELECT * FROM TAGS WHERE ID = ?; IF RESULT IS NULL SELECT * FROM TAGS_TO_SAVE.
// */
// private getBasicTagFullById(_id: string):Promise<any>{
//   // return this.db.executeSql(Query.SELECT_TAG_BY_ID, [_id])
//   // .then(result=>{
//   //   if(result.rows.length == 0){
//   //     return this.db.executeSql(Query.SELECT_TAG_BY_ID_FROM_TO_SAVE, [_id])
//   //   }else{
//   //     return Db.tagSQLiteParse(result.rows[0]);
//   //   }
//   // })
//   // .then(secondResult=>{
//   //   if(secondResult.rows.length == 0){
//   //     throw new Error(Const.ERR_TAG_NOT_FOUND);
//   //   }else{
//   //     return Db.tagFullParse(secondResult.rows[0]);
//   //   }
//   // })
//   return this.db.executeSql(Query.SELECT_TAG_BY_ID_V2, [_id, _id])
//   .then(result=>{
//     if(result.rows.length>0){
//       if(result.rows[0].addedNotes){
//         return Db.tagSQLiteParse(result.rows[0]);
//       }else{
//         return Db.tagFullParse(result.rows[0]);
//       }
//     }else{
//       throw new Error(Const.ERR_TAG_NOT_FOUND);
//     }
//   })
// }
// //old code.
// // return this.db.executeSql(Query.SELECT_TAG_ALMOST_MIN, [_id])
// //   .then(result=>{
// //     if(result.rows.length > 0){
// //       let tag = Db.fullTagParse(result.rows[_id]);
// //       if(tag.notes_length>0){
// //         return this.db.executeSql(Db.prepareStringTagFromNotes(tag), {})
// //           .then(secondResult=>{
// //             if(secondResult.rows>0){
// //               tag = Db.finishFullTag(secondResult.rows, tag);
// //             }
// //             return this.db.executeSql(Db.prepareStringTagFromNotesToSave(tag), {})
// //           })
// //           .then(thirdResult=>{
// //             if(thirdResult.rows>0){
// //               tag = Db.finishFullTag(thirdResult.rows, tag);
// //             }
// //             return tag;
// //           })
// //       }
// //     }else{
// //       throw new Error(Const.ERR_TAG_NOT_FOUND);
// //     }
// //   })
//
// public getFullTagById(_id: string):Promise<any>{
//   let tag: TagFull;
//   return this.getBasicTagFullById(_id)
//     .then(result=>{
//       tag = result;
//       return this.db.executeSql(Db.prepareStringAddNotesToTagFromNotes(tag), {})
//     })
//     .then(secondResult=>{
//       if(secondResult.rows.length > 0){
//         tag = Db.finishFullTag(secondResult.rows, tag);
//       }
//       return this.db.executeSql(Db.prepareStringAddNotesToTagFromNotesToSave(tag), {})
//     })
//     .then(thirdResult=>{
//       if(thirdResult.rows.length >0){
//         tag = Db.finishFullTag(thirdResult.rows, tag)
//       }
//       return tag;
//     })
//     .catch(error=>{
//       console.log(JSON.stringify(error));
//     })
// }
//
// public getNotesToPublish():Promise<NoteFull[]>{
//   return this.db.executeSql(Query.SELECT_NOTES_TO_PUBLISH, {})
//     .then(result=>{
//       if(result.rows.length >0){
//         let note = Db.noteFullParse(result.rows);
//         return note;
//       }else{
//         throw new Error(Const.ERR_NO_NOTE_TO_PUBLISH);
//       }
//     })
// }
//
// public getTagsToPublish():Promise<TagFull>{
//   return this.db.executeSql(Query.SELECT_TAGS_TO_PUBLISH, {})
//     .then(result=>{
//       if(result.rows.length >0){
//         let tag = Db.tagFullParse(result.rows);
//         return tag;
//       }else{
//         throw new Error(Const.ERR_NO_NOTE_TO_PUBLISH);
//       }
//     })
// }
//
// /*
// union type can cause too many errors.
// */
// // private static prepareStringInsertIntoLogs(obj:LogObject):string{
// //   let res: string;
// //   if(obj.refNotes!=null){
// //     res = Query.INSERT_INTO_LOGS_NOTES;
// //   }else if(obj.refTags!=null){
// //     res = Query.INSERT_INTO_LOGS_TAGS;
// //   }else if(obj.refNotesToSave!=null){
// //     res = Query.INSERT_INTO_LOGS_NOTES_TO_SAVE;
// //   }else{
// //     res = Query.INSERT_INTO_LOGS_TAGS_TO_SAVE;
// //   }
// //   return res;
// // }
// private static which(obj:LogObject):WhichField{
//   let res;
//   if(obj.refNotes!=null){
//     res = WhichField.Notes;
//   }else if(obj.refTags!=null){
//     res = WhichField.Tags;
//   }else if(obj.refNotesToSave!=null){
//     res = WhichField.NotesToSave
//   }else{
//     res = WhichField.TagsToSave;
//   }
//   return res;
// }
//
// private static prepareStringInsertIntoLogs(which: WhichField):string{
//   let res: string;
//   switch(which){
//     case WhichField.Notes:
//       res = Query.INSERT_INTO_LOGS_NOTES;
//     case WhichField.Tags:
//       res = Query.INSERT_INTO_LOGS_TAGS;
//     case WhichField.NotesToSave:
//       res = Query.INSERT_INTO_LOGS_NOTES_TO_SAVE;
//     case WhichField.TagsToSave:
//       res = Query.INSERT_INTO_LOGS_TAGS_TO_SAVE;
//   }
//   return res;
// }
//
// private static getRef(which: WhichField, obj:LogObject):any{
//   let res : any;
//   switch(which){
//     case WhichField.Notes:
//       res = obj.refNotes;
//     case WhichField.Tags:
//       res = obj.refTags;
//     case WhichField.NotesToSave:
//       res = obj.refNotesToSave;
//     case WhichField.TagsToSave:
//       res = obj.refTagsToSave;
//   }
//   return res;
// }
//
// // private static prepareObjectInsertIntoLOgs(obj: LogObject):any[]{
// //   // let res: any[];
// //   // if(obj.refNotes!=null){
// //   //   res
// //   // }else if(obj.refTags!=null){
// //   //   res = Query.INSERT_INTO_LOGS_TAGS;
// //   // }else if(obj.refNotesToSave!=null){
// //   //   res = Query.INSERT_INTO_LOGS_NOTES_TO_SAVE;
// //   // }else{
// //   //   res = Query.INSERT_INTO_LOGS_TAGS_TO_SAVE;
// //   // }
// //   // return res;
// //
// // }
// /*
// array[0]=ref,
// array[1]=data,
// array[2]=action
// */
//
// public deleteNoteFromNotesToSave(_id: number):Promise<any>{
//   return this.db.executeSql(Query.DELETE_FROM_NOTES_TO_SAVE, {_id});
// }
//
// public deleteNotesFromNotes(_id: string):Promise<any>{
//   return this.db.executeSql(Query.DELETE_FROM_NOTES, {_id});
// }
//
// public deleteFromTagsToSave(_id: number):Promise<any>{
//   return this.db.executeSql(Query.DELETE_FROM_TAGS_TO_SAVE, {_id});
// }
//
// public deleteFromTags(_id: string):Promise<any>{
//   return this.db.executeSql(Query.DELETE_FROM_TAGS, {_id});
// }
//
//
//
// private static setArrayObjInsertIntoLogs(obj:LogObject):DbUtils{
//
//   let res: any[]=[3];
//
//   let dbUtils = new DbUtils();
//
//   let which = Db.which(obj);
//   let query = Db.prepareStringInsertIntoLogs(which);
//
//   res[2]=Action[obj.action];
//   res[1]=JSON.stringify(obj.data);
//   res[0]=Db.getRef(which, obj);
//
//   dbUtils.data=res;
//   dbUtils.query=query;
//
//   console.log('the ref is:');
//   console.log(res);
//
//   return dbUtils;
//
//   // switch(obj.action){
//   //   case Action.CreateNote:
//   //   case Action.CreateTag:
//   //   case Action.ChangeNoteTitle:
//   //   case Action.ChangeText:
//   //   case Action.AddMainTags:
//   //   case Action.AddOtherTags:
//   //   case Action.RemoveMainTags:
//   //   case Action.RemoveOtherTags:
//   //   case Action.ChangeTagTitle:
//   //   case Action.AddLinks:
//   //   case Action.RemoveLinks:
//   //   case Action.SetDone:
//   //   case Action.DeleteNote:
//   //   case Action.DeleteTag:
//   // }
// }
//
//
// public setModification(obj:LogObject){
//   let dbUtils = Db.setArrayObjInsertIntoLogs(obj);
//   return this.db.executeSql(dbUtils.query, dbUtils.data);
// }
//
//
// public getThinsToDo():Promise<Queue<LogObject>>{
//   return this.db.executeSql(Query.SELECT_LOGS, {})
//     .then((result)=>{
//       if(result.rows.length>0){
//         let queue = new Queue<LogObject>();
//         for(let i =0;i<result.rows.length;i++){
//           let obj = LogObject.LogObjectParse(result.rows[i]);
//           queue.enqueue(obj);
//         }
//         return queue;
//       }else{
//         console.log('no data');
//         throw new Error(Const.ERR_NO_LOG); /*even if it's not an error*/
//       }
//     })
// }
//
// private static prepareArrayCreateNoteInNotes(note: NoteMin):any[]{
//   let array: any[] = [9];
//   array[0]=note._id;
//   array[1]=note.text;
//   array[2]=note.title;
//   array[3]=note.isDone;
//   array[4]=JSON.stringify(note.links);
//   array[5]=JSON.stringify(note.creationDate);
//   array[6]=JSON.stringify(note.lastModificationDate);
//   array[7]=JSON.stringify(note.mainTags);
//   array[8]=JSON.stringify(note.otherTags);
//   return array;
// }
//
// private static prepareArrayCreateNoteInNotesToSave(note: NoteMin):any[]{
//   let array: any[] = [8];
//   array[0]=note.text;
//   array[1]=note.title;
//   array[2]=note.isDone;
//   array[3]=JSON.stringify(note.links);
//   array[4]=JSON.stringify(note.creationDate);
//   array[5]=JSON.stringify(note.lastModificationDate);
//   array[6]=JSON.stringify(note.mainTags);
//   array[7]=JSON.stringify(note.otherTags);
//   return array;
// }
//
//
// /*
// this function is called when the current note from notes_to_save has been sent
// to the server, we have obtained a valid _id, we will use it to insert into notes
// and to delete this note from notes_to_save and from the log.
// @param oldId: the old _id into notes_to_save
// @param logId: the _id of the log record.
// @param note: the new note object to insert into notes
// */
// public transactionProcessNote(oldId: number, logId: number, note: NoteMin):Promise<any>{
//   return this.db.transaction((tx)=>{
//     tx.executeSql(Query.INSERT_INTO_NOTES, Db.prepareArrayCreateNoteInNotes(note));
//     tx.executeSql(Query.DELETE_FROM_NOTES_TO_SAVE, [oldId]);
//     tx.executeSql(Query.SET_LOG_DONE, [logId])
//   })
// }
//
// /*
// when deleting a note, immediately delete it from tags, no need to log.
// */
//
// /*
// note: sqlite support union on string and integer.
// */
// private static prepareStringSelectTags(tags: any[]):string{
//   let array = tags;
//   let query = Query.SELECT_TAGS_FROM_NOTE_PART_1;
//   query = query.concat(array[0]);
//   for(let i=1;i<array.length;i++){
//     // if(i==array.length-1){
//       query = query.concat('or _id='+array[i]);
//     // }else{
//     //   query = query.concat()
//     // }
//   }
//   query = query.concat(Query.SELECT_TAGS_FROM_NOTE_PART_2);
//   query = query.concat(array[0]);
//   for(let i=1;i<array.length;i++){
//       query = query.concat('or _id='+array[i]);
//   }
//   return query;
// }
//
// /*
// fortunately JS supports array of different types.
// SQLite does not throw error if _id is not found in the update.
// */
// public transactionDeleteNoteFromNotesToSave(_id: number, tags: any[]):Promise<any>{
//   return this.db.transaction(tx=>{
//     tx.executeSql(Db.prepareStringSelectTags(tags), {})
//     .then(result=>{
//       if(result.rows.length>0){
//         console.log('tags to update');
//         console.log(JSON.stringify(result.rows));
//         for(let i=0;i<result.rows.length;i++){
//           let tagId = result.rows[i]._id;
//           let data = <any[]>JSON.parse(result.rows[i].notes);
//           console.log('the casted data');
//           console.log(JSON.stringify(data));
//           data.splice(data.indexOf(_id), 1);
//           console.log('the after splice data');
//           console.log(JSON.stringify(data));
//           //let notes_length = result.rows[i].notes_length;
//           tx.executeSql(Query.UPDATE_TAG_SET_DATA_NOTES_LENGTH, [tagId, JSON.stringify(data)]);
//           tx.executeSql(Query.UPDATE_TAG_TO_SAVE_SET_DATA_NOTES_LENGTH, [tagId, JSON.stringify(data)]);
//         }
//       }
//     })
//     tx.executeSql(Query.INSERT_INTO_LOGS_NOTES_TO_SAVE,[_id, null, Action[Action.DeleteNote]]);
//     tx.executeSql(Query.SET_NOTE_TO_DELETE_NOTES_TO_SAVE, [_id]);
//   })
// }
//
//
// public transactionDeleteNoteFromNotes(_id: string, tags: any[]):Promise<any>{
//   return this.db.transaction(tx=>{
//     tx.executeSql(Query.INSERT_INTO_LOGS_NOTES,[_id, null, Action[Action.DeleteNote]]);
//     tx.executeSql(Query.SET_NOTE_TO_DELETE_NOTES, [_id]);
//   })
// }
//
//
// private static prepareArrayCreateTagInTags(tag: TagMin):any[]{
//   let array: any[] = [4];
//   array[0]=tag._id;
//   array[1]=tag.title;
//   array[2]=tag.notes_length;
//   array[3]=JSON.stringify(tag.notes);
//   return array;
// }
//
// private static prepareArrayCreateTagInTagsToSave(tag: TagMin):any[]{
//   let array: any[] = [3];
//   array[0]=tag.title;
//   array[1]=tag.notes_length;
//   array[2]=JSON.stringify(tag.notes);
//   return array;
// }
//
// public transactionProcessTag(oldId: number, logId: number, tag: TagMin):Promise<any>{
//   return this.db.transaction((tx)=>{
//     tx.executeSql(Query.INSERT_INTO_TAGS, Db.prepareArrayCreateTagInTags(tag));
//     tx.executeSql(Query.DELETE_FROM_TAGS_TO_SAVE, [oldId]);
//     tx.executeSql(Query.SET_LOG_DONE, [logId]);
//   })
// }
//
// // public eot(tx: any){
// //
// // }
//
//
//
//
//





}
