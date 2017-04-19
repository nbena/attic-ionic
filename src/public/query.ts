import { Table } from './const';
export class Query{
  /*even if ugly use this.*/
  // static readonly CREATE_NOTES_TABLE = 'create table if not exists notes(_id char(12) primary key,text text,title varchar(64) unique,isDone boolean,links text,creationDate char(24),lastModificationDate char(24),mainTags text,otherTags text, mainTagsToAdd text default null, otherTagsToAdd text default null, mainTagsToRemove text default null, otherTagsToRemove text default null, mustBeDeleted boolean default false)';
  //   static readonly CREATE_TAGS_TABLE = 'create table if not exists tags(_id char(12) primary key,title varchar(64) unique,notes text, notes_length integer, mustBeDeleted boolean default false)';
  // // static readonly CREATE_TAGS_TABLE = 'create table if not exists tags(_id char(12) primary key,title varchar(64) unique,notes text, notes_length integer, addedNotes text, removedNotes text, mustBeDeleted boolean default false)';
  // static readonly CREATE_NOTES_TO_SAVE_TABLE = 'create table if not exists notes_to_save(_id integer primary key autoincrement, title varchar(64) unique, text text, isDone boolean,links text,creationDate char(24),lastModificationDate char(24),mainTags text,otherTags text, mustBeDeleted boolean default false)';
  // static readonly CREATE_TAGS_TO_SAVE_TABLE='create table if not exists tags_to_save( _id integer primary key autoincrement,  title varchar(64) unique, notes text, notes_length integer, mustBeDeleted boolean default false)';
  // //static readonly CREATE_NOTES_TAGS_TABLE = 'create table if not exists notes_tags(id integer autoincrement primary key, _id_note char(12),_id_tag char(12), _id_note_to_save integer, _id_tag_to_save integer, foreign key(_id_note) references notes(_id), foreign key(_id_tag) references tags(_id))';
  // //the key-table
  // static readonly CREATE_LOG ='create table if not exists log(_id integer primary key autoincrement,refNotes varchar(12),refTags varchar(12),refNotesToSave integer, refTagsToSave integer, done boolean default false, action varchar(50), data text, foreign key(refNotes) references notes(_id), foreign key(refTags) references tags(_id), foreign key(refNotesToSave) references notes_to_save(_id) foreign key(refTagsToSave) references tags_to_save(_id))';
  //
  // static readonly COUNT ='select count(*) as count from ?';
  // static readonly SELECT_ALL = 'select * from ? where mustBeDeleted=false';
  // static readonly SELECT_NOTES_EXTRA_MIN = 'select _id, title,lastModificationDate from notes where mustBeDeleted=\'false\' union select _id,title,lastModificationDate from notes_to_save where mustBeDeleted=\'false\' order by lastModificationDate desc';
  // static readonly SELECT_TAG_ALMOST_MIN = 'select _id, title, notes_length from tags where mustBeDeleted=\'false\' union select _id,title,notes_length from tags_to_save where mustBeDeleted=\'false\' order by notes_length desc';
  // static readonly SELECT_NOTE_BY_ID = 'select * from notes where _id = ? and mustBeDeleted=\'false\'';
  // static readonly SELECT_NOTE_BY_ID_FROM_TO_SAVE = 'select * from notes_to_save wehere _id=? and mustBeDeleted=\'false\'';
  // static readonly SELECT_TAG_BY_ID_FROM_TO_SAVE = 'select * from tags where id = ? and mustBeDeleted=\'false\'';
  // static readonly SELECT_TAG_BY_ID = 'select * from tags where id = ? and mustBeDeleted=\'false\'';
  // /*improved queries.*/
  // static readonly SELECT_NOTE_BY_ID_V2 = 'select * from notes where mustBeDeleted=false and _id=? union select * from notes_to_save where mustBeDeleted=false and _id=?';
  // static readonly SELECT_TAG_BY_ID_V2 = 'select * from tags where mustBeDeleted=false and _id=? union select * from tags_to_save where mustBeDeleted=false and _id=?';
  // /*
  // need to decide if we can just delete the notes in this table.
  // */
  // static readonly SELECT_NOTES_TO_PUBLISH = 'select * from notes_to_save where mustBeDeleted=\'false\'';
  // static readonly SELECT_TAGS_TO_PUBLISH = 'select * from tags_to_save where mustBeDeleted=\'false\'';
  //
  // static readonly SELECT_LOGS = 'select * from log where done=\'false\'';
  // static readonly SELECT_LOGS_JOIN = 'select * from log join notes on refNotes=notes._id join tags on refTags=tags._id join notes_to_save on refNotesToSave=notes_to_save._id join tags_to_save on refTagsToSave=tags_to_save._id';
  //
  //
  // static readonly INSERT_INTO_LOGS_NOTES = 'insert into log(refNotes, data, action) values (?,?,?)';
  // static readonly INSERT_INTO_LOGS_NOTES_TO_SAVE = 'insert into log(refNotesToSave, data, action) values (?,?,?)';
  // static readonly INSERT_INTO_LOGS_TAGS  = 'insert into log(refTags, data, action) values(?,?,?)';
  // static readonly INSERT_INTO_LOGS_TAGS_TO_SAVE = 'insert into log(refTagsToSave, data, action) values (?,?,?)';
  //
  // static readonly SET_LOG_DONE = 'update log set done=\'true\' where _id=?';
  //
  // static readonly INSERT_INTO_NOTES = 'insert into notes(_id, text, title, isDone, links, creationDate, lastModificationDate, mainTags, otherTags)values(?,?,?,?,?,?,?,?,?)';
  // static readonly DELETE_FROM_NOTES_TO_SAVE = 'delete from notes_to_save where _id=?';
  //
  // static readonly INSERT_INTO_TAGS = 'insert into tags(_id, title, notes_length, notes) values (?,?,?,?)';
  // static readonly DELETE_FROM_TAGS_TO_SAVE = 'delete from tags_to_save where _id=?';
  //
  // static readonly INSERT_INTO_NOTES_TO_SAVE = 'insert into notes_to_save(text,title, isDone, links, creationDate, lastModificationDate, mainTags, otherTags) values (?,?,?,?,?,?,?,?)';
  // static readonly INSERT_INTO_TAGS_TO_SAVE = 'insert into tags_to_save(title, notes, notes_length) values (?,?,?)';
  //
  // static readonly DELETE_FROM_NOTES = 'delete from notes where _id=?';
  // static readonly DELETE_FROM_TAGS = 'delete from tags where _id=?';
  //
  // static readonly SET_NOTE_TO_DELETE_NOTES_TO_SAVE = 'update notes_to_save set mustBeDeleted=\'true\' where _id=?';
  // static readonly SET_NOTE_TO_DELETE_NOTES = 'update notes set mustBeDeleted=\'true\' where _id=?';
  //
  // static readonly SET_NOTE_TO_DELETE_TAGS_TO_SAVE = 'update tags_to_save set mustBeDeleted=\'true\' where _id=?';
  // static readonly SET_NOTE_TO_DELETE_TAGS = 'update tags set mustBeDeleted=\'true\' where _id=?';
  //
  // static readonly SELECT_TAGS_FROM_NOTE_PART_1 = 'select * from tags where _id=';
  // static readonly SELECT_TAGS_FROM_NOTE_PART_2 = 'union select * from tags_to_save where _id=';
  //
  //
  // static readonly UPDATE_TAG_SET_DATA_NOTES_LENGTH = 'update tags set notes=?, notes_length=notes_length-1 where _id=?';
  // static readonly UPDATE_TAG_TO_SAVE_SET_DATA_NOTES_LENGTH = 'update tags_to_save set notes=?, notes_length=notes_length-1 where _id=?';

  //opt: a json field for each object.

  static readonly CREATE_NOTES_TABLE ='create table if not exists notes(title varchar(64),userid varchar(64),text text, links text, isdone boolean default false,creationdate date,lastmodificationdate date,mustbedeleted boolean default false json_obj text,primary key(title))';
  static readonly CREATE_TAGS_TABLE = 'create table if not exists tags(title varchar(64),userid varchar(64), json_object text,primary key(title));';
  static readonly CREATE_NOTES_TAGS_TABLE ='create table if not exists notes_tags(notetitle varchar(64),tagtitle varchar(64),role varchar(9),primary key(noteTitle, tagTitle),foreign key(noteTitle) references notes(title) on update cascade on delete cascade,foreign key(tagTitle) references tags(title) on update cascade on delete cascade,constraint role_check check (role = \'mainTags\' or role = \'otherTags\'))';
  static readonly CREATE_LOGS_TABLE = 'create table if not exists logs(id integer primary key autoincrement,notetitle varchar(64),tagtitle varchar(64),role varchar(9),action varchar(64) not null,foreign key(noteTitle) references notes(title) on update cascade on delete cascade,foreign key(tagTitle) references tags(title) on update cascade on delete cascade,constraint action_check check(action=\'create\' or action=\'delete\' or action=\'change-title\' or action=\'change-text\' or action=\'add-tag\' or action=\'remove-tag\' or action =\'set-done\' or action=\'set-link\'),constraint role_check check (role =\'mainTags\' or role = \'otherTags\' or role is null),constraint if_all check ((role is not null and noteTitle is not null and tagTitle is not null) or (noteTitle is not null) or (tagTitle is not null)));'

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