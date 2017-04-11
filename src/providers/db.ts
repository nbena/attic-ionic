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
// import 'rxjs/add/operator/map';

class SQLiteLogObject{
  _id: number;
  action: string;
  refNotes: string;
  refTags: string;
  refNotesToSave: number;
  refTagsToSave: number;
  done: boolean;
  data: string;
}


export class LogObject{
  _id: number;
  action: Action;
  refNotes: string;
  refTags: string;
  refNotesToSave: number;
  refTagsToSave: number;
  done: boolean;
  data: any;

  public static LogObjectParse(row: any):LogObject{
    let obj = new LogObject();
    obj._id=row._id;
    obj.action=Action[<string>row.action];
    obj.refNotes=row.refNote;
    obj.refTags=row.refTag;
    obj.refNotesToSave=row.refNoteToSave;
    obj.refTagsToSave=row.refTagToSave;
    obj.done=row.done;
    obj.data = JSON.parse(row.data);
    return obj;
  }

  public toSQLiteObject():SQLiteLogObject{
    let obj = new SQLiteLogObject();
    obj._id=this._id;
    obj.action=Action[this.action];
    obj.refNotes=this.refNotes;
    obj.refTags=this.refTags;
    obj.refNotesToSave=this.refNotesToSave;
    obj.refTagsToSave=this.refTagsToSave;
    obj.done=this.done;
    obj.data = JSON.stringify(this.data);
    return obj;
  }

}

class DbUtils{
  query: string;
  data: any[];
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

  constructor(private platform: Platform) {
    console.log('Hello Db Provider');

    if(!this.open) {

      this.platform.ready().then(ready=>{
        this.db = new SQLite();
        this.db.openDatabase(
          {name: "attic.db", location: "default"})
            .then((db)=>{
              return this.db.executeSql(Query.CREATE_NOTES_TABLE,{})
            })
            .then(()=>{
              return this.db.executeSql(Query.CREATE_TAGS_TABLE, {})
            })
            .then(()=>{
              return this.db.executeSql(Query.CREATE_NOTES_TO_SAVE_TABLE, {})
            })
            .then(()=>{
              return this.db.executeSql(Query.CREATE_TAGS_TO_SAVE_TABLE, {})
            })
            .then(()=>{
              return this.db.executeSql(Query.CREATE_LOG, {})
            })
            .then(()=>{
              this.open = true;
              // return;
            })
            .catch(error=>{
              this.open=false;
              console.log('error in creating tables.');
              console.log(JSON.stringify(error));
            })
      });
    //});
  }

}

private static noteMinParse(row: any):NoteExtraMin{
  let note = new NoteExtraMin();
  note._id = row.id;
  note.title = row.title;
  return note;
}

private static noteFullParse(row: any):NoteFull{
    let note = new NoteFull();
    note._id = row._id;
    note.title = row.title;
    note.text = row.text;
    note.mainTags = JSON.parse(row.mainTags);
    note.otherTags = JSON.parse(row.otherTags);
    note.links = JSON.parse(row.links);
    note.isDone = JSON.parse(row.isDone);
    note.creationDate = row.creationDate;
    note.lastModificationDate = JSON.parse(row.lastModificationDate);
    return note;
}

private static noteSQLiteParse(row: any):NoteSQLite{
  let note = Db.noteFullParse(row);
  let noteRes = <NoteSQLite>note; //need to cast.
  noteRes.mainTagsToAdd = JSON.parse(row.mainTagsToAdd);
  noteRes.mainTagsToRemove = JSON.parse(row.mainTagsToRemove);
  noteRes.otherTagsToAdd = JSON.parse(row.otherTagsToAdd);
  noteRes.otherTagsToRemove = JSON.parse(row.otherTagsToRemove);
  return noteRes;
}

//during the startup we'll decide which type of tags we will require.
private static TagAlmostMinParse(row: any):TagAlmostMin{
  let tag = new TagAlmostMin();
  tag._id = row._id;
  tag.title = row.title;
  tag.notes_length = row.notes_length;
  return tag;
}

private static tagFullParse(row: any):TagFull{
  let tag = new TagFull();
  tag._id = row._id;
  tag.title = row.title;
  tag.notes_length = row.notes_length;
  tag.notes = JSON.parse(row.notes);
  return tag;
}

private static tagSQLiteParse(row: any):TagSQLite{
  let tag = Db.tagFullParse(row);
  let tagRes = <TagSQLite>tag;
  tagRes.addedNotes = JSON.parse(row.addedNotes);
  tagRes.removedNotes = JSON.parse(row.removedNotes);
  return tagRes;
}

//examples

/*
Count how many rows there are in the provided table.
*/
public count(table: Table){
  let sql = Query.getQueryTable(table, Query.COUNT);
  return this.db.executeSql(sql, {})
    .then((result)=>{
      let res = 0;
      if(result.rows.length > 0){
        res = result.rows.item(0).count;
      }
      return res;
    })
}

/*
I known that nested for-s aare ugly but we can assume that
the loops will be done on small amount of data.
*/

/*
incomplete.
*/
// public getAllFullNotes():Promise<any>{
//   let sql = Query.getQueryTable(Table.Notes, Query.SELECT_ALL);
//   return this.db.executeSql(sql, {})
//     .then((result)=>{
//       let notes: NoteFull[] = [];
//       if(result.rows.length > 0){
//         for(let i=0;i<result.rows.length;i++){
//           let note = Db.noteFullParse(result.rows[i]);
//         }
//       }
//       return notes;
//     })
// }

/*
Get all the notes in the NoteExtraMin format
(_id, title).
*/
public getAllExtraMinNotes():Promise<any>{
  return this.db.executeSql(Query.SELECT_NOTES_EXTRA_MIN, {})
    .then(result=>{
      let notes: NoteExtraMin[] = [];
      if(result.rows.length > 0){
        for(let i=0;i<result.rows.length;i++){
          let note = Db.noteMinParse(result.rows[i]);
          notes.push(note);
        }
      }
    })
}

/*
Get all the tags in the TagExtraMin object.
(_id, title, notes_length)
*/
public getAlmostMinTags():Promise<any>{
  return this.db.executeSql(Query.SELECT_TAG_ALMOST_MIN, {})
    .then(result=>{
      let tags: TagExtraMin[] = [];
      if(result.rows.length > 0){
        for(let i=0;i<result.rows.length;i++){
          let tag = Db.TagAlmostMinParse(result.rows[i]);
        }
      }
      return tags;
    })
}
/*
public getFullTag(_id: string):Promise<any>{
  return this.db.executeSql(Query.SELECT_TAG_ALMOST_MIN, [_id])
    .then(result=>{
      if(result.rows.length > 0){
        let tag = Db.TagFullParse(result.rows[_id]);
        if(tag.notes_length>0){
          return this.db.executeSql(Db.prepareString(tag), {})
            .then(secondResult=>{
              if(secondResult.rows.length != tag.notes_length){
                throw new Error(Const.ERR_MISMATCH);
              }
              tag = Db.finishFullTag(secondResult.rows, tag);
              return tag;
            })
        }
      }else{
        throw new Error(Const.ERR_TAG_NOT_FOUND);
      }
    })
}
*/

/*
to improve performance on prepareString methods we can
check if the title is already set or no.
*/
/*
Prepare the SQL query in order to get the all the tags (_id, title)
that are in this note's mainTags/otherTags.
How this is done:
effective tag = note.mainTags + note.otherTags + note.mainTagsToAdd +
note.otherTagsToAdd - (note.mainTagsToRemove, +note.otherTagsToRemove).
The table used here to search is <code>tags</code>.
*/
private static prepareStringAddTagsToNoteFromTags(note: NoteSQLite):string{
  let init = 'select _id, title from tags where _id = ';

  // let array = note.mainTags.concat(note.otherTags, note.mainTagsToAdd, note.otherTagsToAdd);
  // array = Utils.arrayDiff(array, note.mainTagsToRemove.concat(note.otherTagsToRemove));
  let array = Utils.getEffectiveTagsFromNotes(note);

  for(let i=0;i<array.length;i++){
    if(i!=array.length-1 && array[i].title==null){
      init = init.concat('\''+array[i]._id+'\' or _id = ');
    }
    else if(array[i].title==null){
      init = init.concat('\''+array[i][i]._id+'\'');
    }
  }
  return init;
}

/*
Prepare the SQL query in order to get the all the tags (_id, title)
that are in this note's mainTags/otherTags.
How this is done:
effective tag = note.mainTags + note.otherTags + note.mainTagsToAdd +
note.otherTagsToAdd - (note.mainTagsToRemove, +note.otherTagsToRemove).
The table used here to search is <code>tags_to_save</code>.
*/
private static prepareStringAddTagsToNoteFromTagsToSave(note: NoteFull):string{
  let init = 'select _id, title from tags_to_save where _id = ';
  // let array = note.mainTags.concat(note.otherTags);
  let array = Utils.getEffectiveTagsFromNotes(note);
  for(let i=0;i<array.length;i++){
    if(i!=array.length-1 && array[i].title==null){
      init = init.concat('\''+array[i]._id+'\' or _id = ');
    }
    else if(array[i].title==null){
      init = init.concat('\''+array[i][i]._id+'\'');
    }
  }
  return init;
}

/*
Add to a note the mainTags and the otherTags.
Indeed, the note is saved just with the _id of tha tags,
here we add the tag title too.
*/
private static finishFullNote(rows: any[], note: NoteFull){
  for(let i=0;i<rows.length;i++){
    for(let j=0;j<note.mainTags.length;j++){
      if(rows[i]._id==note.mainTags[j]._id){
        note.mainTags[j].title=rows[i].title;
      }
    }
    for(let j=0;j<note.otherTags.length;j++){
      if(rows[i]._id==note.otherTags[j]._id){
        note.otherTags[j].title=rows[i].title;
      }
    }
  }
  return note;
}

/*
SELECT * FROM NOTES WHERE ID = ?; IF RESULT IS NULL SELECT * FROM NOTES_TO_SAVE.
*/
private getBasicNoteFullById(_id: string):Promise<any>{
  // return this.db.executeSql(Query.SELECT_NOTE_BY_ID, [_id])
  // .then(result=>{
  //   if(result.rows.length == 0){
  //     return this.db.executeSql(Query.SELECT_NOTE_BY_ID_FROM_TO_SAVE, [_id])
  //   }else{
  //     /*parsed as SQLite if comes from notes*/
  //     return Db.noteSQLiteParse(result.rows[0]);
  //   }
  // })
  // .then(secondResult=>{
  //   if(secondResult.rows.length == 0){
  //     throw new Error(Const.ERR_NOTE_NOT_FOUND);
  //   }else{
  //     return Db.noteFullParse(secondResult.rows[0])
  //   }
  // })
  return this.db.executeSql(Query.SELECT_TAG_BY_ID_V2, [_id,_id])
  .then(result=>{
    if(result.rows.length>0){
      if(result.rows.mainTagsToAdd){
        return Db.noteSQLiteParse(result.rows[0]);
      }else{
        return Db.noteFullParse(result.rows[0]);
      }
    }else{
      throw new Error(Const.ERR_NOTE_NOT_FOUND);
    }
  })
}


//old code:
// return this.db.executeSql(Query.SELECT_NOTE_BY_ID, [_id])
//   .then(result=>{
//     let note, noteFinal;
//     if(result.rows.length == 0){
//     }else{
//       //query the orher table.
//       return this.db.executeSql(Query.SELECT_NOTE_BY_ID_FROM_TO_SAVE, [_id])
//       .then(secondResult=>{
//         if(secondResult.rows.length == 0){
//           throw new Error(Const.ERR_NOTE_NOT_FOUND);
//         }
//       })
//       note = Db.noteFullParse(result.rows[0]);
//       return this.db.executeSql(Db.prepareStringNoteFromTags(note), {})
//         .then(secondResult=>{
//           //add a check.
//           if(secondResult.rows>0){
//             note = Db.finishFullNote(secondResult.rows, note);
//           }
//           return this.db.executeSql(Db.prepareStringNoteFromTagsToSave(note), {})
//         })
//         .then(thirdResult=>{ /*it's always needed to do the third query because we can't
//                               known if there 's something in the other table.'*/
//           if(thirdResult.rows>0){
//               note = Db.finishFullNote(thirdResult.rows, note);
//           }
//           return note;
//         })
//     }
//     // else{
//     //   throw new Error(Const.ERR_NOTE_NOT_FOUND);
//     // }
//   })

/*
Get the full note object, along with its tags (_id and title),
*/
public getFullNoteById(_id: string):Promise<any>{
  let fromToSave = false;
  let note;
  return this.getBasicNoteFullById(_id)
    .then(result=>{
      //here if there is a result.
      if(result===NoteFull){
        fromToSave = true;
      }else if(result !==NoteSQLite){
        throw new Error('should never happens');
      }
      /*do the first linking.*/
      note = result;
      return this.db.executeSql(Db.prepareStringAddTagsToNoteFromTags(note), {})
    })
    .then(secondResult=>{
      if(secondResult.rows.lenth > 0){
        note = Db.finishFullNote(secondResult.rows, note);
      }
      return this.db.executeSql(Db.prepareStringAddTagsToNoteFromTagsToSave(note), {})
    })
    .then(thirdResult=>{
      if(thirdResult.rows.length>0){
        note = Db.finishFullNote(thirdResult.rows, note);
      }
      return note;
    })
    .catch(error=>{
      console.log(JSON.stringify(error));
    });
}

/*
prepare the query in the note table.
*/
private static prepareStringAddNotesToTagFromNotes(tag: TagFull):string{
  let init = 'select _id, title from notes where _id = ';
  let array = Utils.getEffectiveNotesFromTags(tag);
  //
  // for(let i=0;i<tag.notes_length;i++){
  //   if(i!=tag.notes_length-1 && tag.notes[i].title==null){
  //     init = init.concat('\''+tag.notes[i]._id+'\' or _id = ');
  //   }
  //   else if(tag.notes[i].title==null){
  //     init = init.concat('\''+tag.notes[i]._id+'\'');
  //   }
  // }

  for(let i=0;i<array.length;i++){
    if(i!=array.length-1 && array[i].title==null){
      init = init.concat('\''+array[i]._id+'\' or _id = ');
    }
    else if(array[i].title==null){
      init = init.concat('\''+array[i]._id+'\'');
    }
  }

  return init;
}

/*
prepare the query in the notes_to_save table.
*/
private static prepareStringAddNotesToTagFromNotesToSave(tag: TagFull):string{
  let init = 'select _id, title from notes_to_save where _id = ';
  let array = Utils.getEffectiveNotesFromTags(tag);

  for(let i=0;i<array.length;i++){
    if(i!=array.length-1 && array[i].title==null){
      init = init.concat('\''+array[i]._id+'\' or _id = ');
    }
    else if(array[i].title==null){
      init = init.concat('\''+array[i]._id+'\'');
    }
  }
  return init;
}



private static finishFullTag(rows: any[], tag: TagFull):TagFull{
  for(let i=0;i<rows.length;i++){
    /*very ugly*/
    // tag.notes.push(<NoteFull>Db.noteMinParse(rows[i]));
    //ok this is better even if it's a nested for.
    for(let j=0;j<tag.notes_length;j++){
      if(rows[i]._id==tag.notes[j]._id){
        tag.notes[j].title=rows[i].title;
      }
    }
  }
  return tag;
}

/*
SELECT * FROM TAGS WHERE ID = ?; IF RESULT IS NULL SELECT * FROM TAGS_TO_SAVE.
*/
private getBasicTagFullById(_id: string):Promise<any>{
  // return this.db.executeSql(Query.SELECT_TAG_BY_ID, [_id])
  // .then(result=>{
  //   if(result.rows.length == 0){
  //     return this.db.executeSql(Query.SELECT_TAG_BY_ID_FROM_TO_SAVE, [_id])
  //   }else{
  //     return Db.tagSQLiteParse(result.rows[0]);
  //   }
  // })
  // .then(secondResult=>{
  //   if(secondResult.rows.length == 0){
  //     throw new Error(Const.ERR_TAG_NOT_FOUND);
  //   }else{
  //     return Db.tagFullParse(secondResult.rows[0]);
  //   }
  // })
  return this.db.executeSql(Query.SELECT_TAG_BY_ID_V2, [_id, _id])
  .then(result=>{
    if(result.rows.length>0){
      if(result.rows[0].addedNotes){
        return Db.tagSQLiteParse(result.rows[0]);
      }else{
        return Db.tagFullParse(result.rows[0]);
      }
    }else{
      throw new Error(Const.ERR_TAG_NOT_FOUND);
    }
  })
}
//old code.
// return this.db.executeSql(Query.SELECT_TAG_ALMOST_MIN, [_id])
//   .then(result=>{
//     if(result.rows.length > 0){
//       let tag = Db.fullTagParse(result.rows[_id]);
//       if(tag.notes_length>0){
//         return this.db.executeSql(Db.prepareStringTagFromNotes(tag), {})
//           .then(secondResult=>{
//             if(secondResult.rows>0){
//               tag = Db.finishFullTag(secondResult.rows, tag);
//             }
//             return this.db.executeSql(Db.prepareStringTagFromNotesToSave(tag), {})
//           })
//           .then(thirdResult=>{
//             if(thirdResult.rows>0){
//               tag = Db.finishFullTag(thirdResult.rows, tag);
//             }
//             return tag;
//           })
//       }
//     }else{
//       throw new Error(Const.ERR_TAG_NOT_FOUND);
//     }
//   })

public getFullTagById(_id: string):Promise<any>{
  let tag: TagFull;
  return this.getBasicTagFullById(_id)
    .then(result=>{
      tag = result;
      return this.db.executeSql(Db.prepareStringAddNotesToTagFromNotes(tag), {})
    })
    .then(secondResult=>{
      if(secondResult.rows.length > 0){
        tag = Db.finishFullTag(secondResult.rows, tag);
      }
      return this.db.executeSql(Db.prepareStringAddNotesToTagFromNotesToSave(tag), {})
    })
    .then(thirdResult=>{
      if(thirdResult.rows.length >0){
        tag = Db.finishFullTag(thirdResult.rows, tag)
      }
      return tag;
    })
    .catch(error=>{
      console.log(JSON.stringify(error));
    })
}

public getNotesToPublish():Promise<NoteFull[]>{
  return this.db.executeSql(Query.SELECT_NOTES_TO_PUBLISH, {})
    .then(result=>{
      if(result.rows.length >0){
        let note = Db.noteFullParse(result.rows);
        return note;
      }else{
        throw new Error(Const.ERR_NO_NOTE_TO_PUBLISH);
      }
    })
}

public getTagsToPublish():Promise<TagFull>{
  return this.db.executeSql(Query.SELECT_TAGS_TO_PUBLISH, {})
    .then(result=>{
      if(result.rows.length >0){
        let tag = Db.tagFullParse(result.rows);
        return tag;
      }else{
        throw new Error(Const.ERR_NO_NOTE_TO_PUBLISH);
      }
    })
}

/*
union type can cause too many errors.
*/
// private static prepareStringInsertIntoLogs(obj:LogObject):string{
//   let res: string;
//   if(obj.refNotes!=null){
//     res = Query.INSERT_INTO_LOGS_NOTES;
//   }else if(obj.refTags!=null){
//     res = Query.INSERT_INTO_LOGS_TAGS;
//   }else if(obj.refNotesToSave!=null){
//     res = Query.INSERT_INTO_LOGS_NOTES_TO_SAVE;
//   }else{
//     res = Query.INSERT_INTO_LOGS_TAGS_TO_SAVE;
//   }
//   return res;
// }
private static which(obj:LogObject):WhichField{
  let res;
  if(obj.refNotes!=null){
    res = WhichField.Notes;
  }else if(obj.refTags!=null){
    res = WhichField.Tags;
  }else if(obj.refNotesToSave!=null){
    res = WhichField.NotesToSave
  }else{
    res = WhichField.TagsToSave;
  }
  return res;
}

private static prepareStringInsertIntoLogs(which: WhichField):string{
  let res: string;
  switch(which){
    case WhichField.Notes:
      res = Query.INSERT_INTO_LOGS_NOTES;
    case WhichField.Tags:
      res = Query.INSERT_INTO_LOGS_TAGS;
    case WhichField.NotesToSave:
      res = Query.INSERT_INTO_LOGS_NOTES_TO_SAVE;
    case WhichField.TagsToSave:
      res = Query.INSERT_INTO_LOGS_TAGS_TO_SAVE;
  }
  return res;
}

private static getRef(which: WhichField, obj:LogObject):any{
  let res : any;
  switch(which){
    case WhichField.Notes:
      res = obj.refNotes;
    case WhichField.Tags:
      res = obj.refTags;
    case WhichField.NotesToSave:
      res = obj.refNotesToSave;
    case WhichField.TagsToSave:
      res = obj.refTagsToSave;
  }
  return res;
}

// private static prepareObjectInsertIntoLOgs(obj: LogObject):any[]{
//   // let res: any[];
//   // if(obj.refNotes!=null){
//   //   res
//   // }else if(obj.refTags!=null){
//   //   res = Query.INSERT_INTO_LOGS_TAGS;
//   // }else if(obj.refNotesToSave!=null){
//   //   res = Query.INSERT_INTO_LOGS_NOTES_TO_SAVE;
//   // }else{
//   //   res = Query.INSERT_INTO_LOGS_TAGS_TO_SAVE;
//   // }
//   // return res;
//
// }
/*
array[0]=ref,
array[1]=data,
array[2]=action
*/



private static setArrayObjInsertIntoLogs(obj:LogObject):DbUtils{

  let res: any[]=[3];

  let dbUtils = new DbUtils();

  let which = Db.which(obj);
  let query = Db.prepareStringInsertIntoLogs(which);

  res[2]=Action[obj.action];
  res[1]=JSON.stringify(obj.data);
  res[0]=Db.getRef(which, obj);

  dbUtils.data=res;
  dbUtils.query=query;

  console.log('the ref is:');
  console.log(res);

  return dbUtils;

  // switch(obj.action){
  //   case Action.CreateNote:
  //   case Action.CreateTag:
  //   case Action.ChangeNoteTitle:
  //   case Action.ChangeText:
  //   case Action.AddMainTags:
  //   case Action.AddOtherTags:
  //   case Action.RemoveMainTags:
  //   case Action.RemoveOtherTags:
  //   case Action.ChangeTagTitle:
  //   case Action.AddLinks:
  //   case Action.RemoveLinks:
  //   case Action.SetDone:
  //   case Action.DeleteNote:
  //   case Action.DeleteTag:
  // }
}


public setModification(obj:LogObject){
  let dbUtils = Db.setArrayObjInsertIntoLogs(obj);
  return this.db.executeSql(dbUtils.query, dbUtils.data);
}


public getThinsToDo():Promise<Queue<LogObject>>{
  return this.db.executeSql(Query.SELECT_LOGS, {})
    .then((result)=>{
      if(result.rows.length>0){
        let queue = new Queue<LogObject>();
        for(let i =0;i<result.rows.length;i++){
          let obj = LogObject.LogObjectParse(result.rows[i]);
          queue.enqueue(obj);
        }
        return queue;
      }else{
        console.log('no data');
        throw new Error(Const.ERR_NO_LOG); /*even if it's not an error*/
      }
    })
}

private static prepareArrayCreateNoteInNotes(note: NoteMin):any[]{
  let array: any[] = [9];
  array[0]=note._id;
  array[1]=note.text;
  array[2]=note.title;
  array[3]=note.isDone;
  array[4]=JSON.stringify(note.links);
  array[5]=JSON.stringify(note.creationDate);
  array[6]=JSON.stringify(note.lastModificationDate);
  array[7]=JSON.stringify(note.mainTags);
  array[8]=JSON.stringify(note.otherTags);
  return array;
}

private static prepareArrayCreateNoteInNotesToSave(note: NoteMin):any[]{
  let array: any[] = [8];
  array[0]=note.text;
  array[1]=note.title;
  array[2]=note.isDone;
  array[3]=JSON.stringify(note.links);
  array[4]=JSON.stringify(note.creationDate);
  array[5]=JSON.stringify(note.lastModificationDate);
  array[6]=JSON.stringify(note.mainTags);
  array[7]=JSON.stringify(note.otherTags);
  return array;
}

/*
@param oldId: the old _id into notes_to_save
@param logId: the _id of the log record.
@param note: the new note object to insert into notes
*/
public transactionProcessNote(oldId: number, logId: number, note: NoteMin):Promise<any>{
  return this.db.transaction((tx)=>{
    tx.executeSql(Query.INSERT_INTO_NOTES, Db.prepareArrayCreateNoteInNotes(note));
    tx.executeSql(Query.DELETE_FROM_NOTES_TO_SAVE, [oldId]);
    tx.executeSql(Query.SET_LOG_DONE, [logId])
  })
}


private static prepareArrayCreateTagInTags(tag: TagMin):any[]{
  let array: any[] = [4];
  array[0]=tag._id;
  array[1]=tag.title;
  array[2]=tag.notes_length;
  array[3]=JSON.stringify(tag.notes);
  return array;
}

private static prepareArrayCreateTagInTagsToSave(tag: TagMin):any[]{
  let array: any[] = [3];
  array[0]=tag.title;
  array[1]=tag.notes_length;
  array[2]=JSON.stringify(tag.notes);
  return array;
}

public transactionProcessTag(oldId: number, logId: number, tag: TagMin):Promise<any>{
  return this.db.transaction((tx)=>{
    tx.executeSql(Query.INSERT_INTO_TAGS, Db.prepareArrayCreateTagInTags(tag));
    tx.executeSql(Query.DELETE_FROM_TAGS_TO_SAVE, [oldId]);
    tx.executeSql(Query.SET_LOG_DONE, [logId]);
  })
}

// public eot(tx: any){
//
// }





}
