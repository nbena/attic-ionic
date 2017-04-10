import { Table } from './const';
export class Query{
  /*even if ugly use this.*/
  static readonly CREATE_NOTES_TABLE = 'create table if not exists notes(_id char(12) primary key,text text,title varchar(64) unique,isDone boolean,links text,creationDate char(24),lastModificationDate char(24),mainTags text,otherTags text, mainTagsToAdd text, otherTagsToAdd text, mainTagsToRemove text, otherTagsToRemove text, mustBeDeleted boolean default false)';
  /*there won't be the need to push the addedNotes to the server because it is done automatically when we add a tag to the notes, same for removed. notes_length must be kept synchronized.*/
  static readonly CREATE_TAGS_TABLE = 'create table if not exists tags(_id char(12) primary key,title varchar(64) unique,notes text, notes_length integer, addedNotes text, removedNotes text, mustBeDeleted boolean default false)';
  static readonly CREATE_NOTES_TO_SAVE_TABLE = 'create table if not exists notes_to_save(_id integer primary key autoincrement, title varchar(64) unique, text text, isDone boolean,links text,creationDate char(24),lastModificationDate char(24),mainTags text,otherTags text, mustBeDeleted boolean default false)';
  static readonly CREATE_TAGS_TO_SAVE_TABLE='create table if not exists tags_to_save( _id integer primary key autoincrement,  title varchar(64) unique, notes text, notes_length integer, mustBeDeleted boolean default false)';
  //static readonly CREATE_NOTES_TAGS_TABLE = 'create table if not exists notes_tags(id integer autoincrement primary key, _id_note char(12),_id_tag char(12), _id_note_to_save integer, _id_tag_to_save integer, foreign key(_id_note) references notes(_id), foreign key(_id_tag) references tags(_id))';
  static readonly COUNT ='select count(*) as count from ?';
  static readonly SELECT_ALL = 'select * from ? where mustBeDeleted=false';
  static readonly SELECT_NOTES_EXTRA_MIN = 'select _id, title,lastModificationDate from notes where mustBeDeleted=\'false\' union select _id,title,lastModificationDate from notes_to_save where mustBeDeleted=\'false\' order by lastModificationDate desc';
  static readonly SELECT_TAG_ALMOST_MIN = 'select _id, title, notes_length from tags where mustBeDeleted=\'false\' union select _id,title,notes_length from tags_to_save where mustBeDeleted=\'false\' order by notes_length desc';
  static readonly SELECT_NOTE_BY_ID = 'select * from notes where _id = ? and mustBeDeleted=false';
  static readonly SELECT_NOTE_BY_ID_FROM_TO_SAVE = 'select * from notes_to_save wehere _id=? and mustBeDeleted=false';
  static readonly SELECT_TAG_BY_ID_FROM_TO_SAVE = 'select * from tags where id = ? and mustBeDeleted=false';
  static readonly SELECT_TAG_BY_ID = 'select * from tags where id = ? and mustBeDeleted=false';
  /*improved queries.*/
  static readonly SELECT_NOTE_BY_ID_V2 = 'select * from notes where mustBeDeleted=false and _id=? union select * from notes_to_save where mustBeDeleted=false and _id=?';
  static readonly SELECT_TAG_BY_ID_V2 = 'select * from tags where mustBeDeleted=false and _id=? union select * from tags_to_save where mustBeDeleted=false and _id=?';

  /*
  tag and notes in the db just memorize an array of ids.
  */

  static getQueryTable(table: Table, sql: string): string{
    let result: string;
    switch(table){
      case Table.Notes:
      result = sql.replace('?', 'notes');
      case Table.NotesToSave:
      result = sql.replace('?', 'notes_to_save');
      case Table.Tags:
      result = sql.replace('?', 'tags');
      case Table.TagsToSave:
      result = sql.replace('?', 'tags_to_save');
    }
    return result;
  }

 }
