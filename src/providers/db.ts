import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import { SQLite } from 'ionic-native';
import { Platform } from 'ionic-angular';
import { Query } from '../public/query';
import { Table, Const } from '../public/const';
import { NoteExtraMin, NoteFull } from '../models/notes';
import { TagExtraMin, TagFull, TagMin, TagAlmostMin } from '../models/tags';
import 'rxjs/add/operator/map';

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
      this.platform.ready().then((ready) => {
        this.db = new SQLite();
        this.db.openDatabase(
          {name: "attic.db", location: "default"})
            .then(() => {
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

//during the startup we'll decide which type of tags we will require.
private static TagAlmostMinParse(row: any):TagAlmostMin{
  let tag = new TagAlmostMin();
  tag._id = row._id;
  tag.title = row.title;
  tag.notes_length = row.notes_length;
  return tag;
}

private static TagFullParse(row: any):TagFull{
  let tag = new TagFull();
  tag._id = row._id;
  tag.title = row.title;
  tag.notes_length = row.notes_length;
  tag.notes = JSON.parse(row.notes);
  return tag;
}

//examples

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

public getAllFullNotes():Promise<any>{
  let sql = Query.getQueryTable(Table.Notes, Query.SELECT_ALL);
  return this.db.executeSql(sql, {})
    .then((result)=>{
      let notes: NoteFull[] = [];
      if(result.rows.length > 0){
        for(let i=0;i<result.rows.length;i++){
          let note = Db.noteFullParse(result.rows[i]);
        }
      }
      return notes;
    })
}


public getAllExtraMinNotes():Promise<any>{
  return this.db.executeSql(Query.SELECT_NOTES_EXTRA_MIN, {})
    .then((result)=>{
      let notes: NoteFull[] = [];
      if(result.rows.length > 0){
        for(let i=0;i<result.rows.length;i++){
          let note = Db.noteFullParse(result.rows[i]);
        }
      }
      return notes;
    })
}


public getAlmostMinTags():Promise<any>{
  return this.db.executeSql(Query.SELECT_TAG_ALMOST_MIN, {})
    .then((result)=>{
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

private static prepareStringNote(note: NoteFull):string{
  let init = 'select _id, title from notes where _id = ';
  let array = note.mainTags.concat(note.otherTags);
  for(let i=0;i<array.length;i++){
    if(i!=array.length-1){
      init = init.concat('\''+array[i]._id+'\' or _id = ');
    }
    else{
      init = init.concat('\''+array[i][i]._id+'\'');
    }
  }
  return init;
}

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


public getFullNoteById(_id: string):Promise<any>{
  // return this.db.executeSql(Query.SELECT_NOTE_BY_ID, [_id])
  //   .then(result=>{
  //     let note;
  //     if(result.rows.length > 0){
  //       note = Db.noteFullParse(result.rows[0]);
  //     }
  //     else{
  //       throw new Error(Const.ERR_NOTE_NOT_FOUND);
  //     }
  //     return note;
  //   })
  return this.db.executeSql(Query.SELECT_NOTE_BY_ID, [_id])
    .then(result=>{
      let note;
      if(result.rows.length > 0){
        note = Db.noteFullParse(result.rows[0]);
        return this.db.executeSql(Db.prepareStringNote(note), {})
          .then(secondResult=>{
            //add a check.
            note = Db.finishFullNote(secondResult.rows, note);
            return note;
          })
      }
      else{
        throw new Error(Const.ERR_NOTE_NOT_FOUND);
      }
    })
}

private static prepareStringTag(tag: TagFull):string{
  let init = 'select _id, title from notes where _id = ';
  for(let i=0;i<tag.notes_length;i++){
    if(i!=tag.notes_length-1){
      init = init.concat('\''+tag.notes[i]._id+'\' or _id = ');
    }
    else{
      init = init.concat('\''+tag.notes[i]._id+'\'');
    }
  }
  return init;
}

private static finishFullTag(rows: any[], tag: TagFull):TagFull{
  for(let i=0;i<rows.length;i++){
    /*very ugly*/
    tag.notes.push(<NoteFull>Db.noteMinParse(rows[i]));
  }
  return tag;
}

public getFullTagById(_id: string):Promise<any>{
  return this.db.executeSql(Query.SELECT_TAG_ALMOST_MIN, [_id])
    .then(result=>{
      if(result.rows.length > 0){
        let tag = Db.TagFullParse(result.rows[_id]);
        if(tag.notes_length>0){
          return this.db.executeSql(Db.prepareStringTag(tag), {})
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

}
