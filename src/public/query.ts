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

  static readonly CREATE_AUTH_TABLE = 'create table if not exists auth(token text default null, userid varchar(64), primary key(userid));';
  static readonly CREATE_NOTES_TABLE ='create table if not exists notes(title varchar(64),userid varchar(64) default null,text text default null, links text default null, isdone boolean default false,creationdate date default (datetime(\'now\',\'localtime\')),local_lastmodificationdate date default (datetime(\'now\',\'localtime\')), remote_lastmodificationdate date default (datetime(\'now\',\'localtime\')),mustbedeleted boolean default false, json_object text default null,primary key(title, userid), foreign key(userid) references auth(userid) on update cascade on delete cascade);';
  static readonly CREATE_TAGS_TABLE = 'create table if not exists tags(title varchar(64),userid varchar(64) default null, mustbedeleted boolean default false, json_object text default null,primary key(title, userid), foreign key(userid) references auth(userid) on update cascade on delete cascade);';
  static readonly CREATE_NOTES_TAGS_TABLE ='create table if not exists notes_tags(notetitle varchar(64), userid varchar(64), tagtitle varchar(64),role varchar(9),mustbedeleted boolean default false,primary key(notetitle, tagtitle, userid),foreign key(notetitle) references notes(title) on update cascade on delete cascade,foreign key(tagtitle) references tags(title) on update cascade on delete cascade, foreign key(userid) references auth(userid) on update cascade on delete cascade,constraint role_check check (role = \'mainTags\' or role = \'otherTags\'))';
  static readonly CREATE_LOGS_TABLE = 'create table if not exists logs_sequence(id integer primary key autoincrement,notetitle varchar(64) default null,tagtitle varchar(64) default null,role varchar(9) default null,action varchar(64) not null, creationdate date default(datetime(\'now\',\'localtime\')), userid varchar(64), foreign key(notetitle) references notes(title) on update cascade on delete cascade,foreign key(tagtitle) references tags(title) on update cascade on delete cascade, foreign key(userid) references auth(userid) on update cascade on delete cascade, constraint action_check check(action=\'create\' or action=\'delete\' or action=\'change-title\' or action=\'change-text\' or action=\'add-tag\' or action=\'remove-tag\' or action =\'set-done\' or action=\'set-link\'),constraint role_check check (role =\'mainTags\' or role = \'otherTags\' or role is null),constraint if_all check ((role is not null and noteTitle is not null and tagTitle is not null) or (noteTitle is not null) or (tagTitle is not null)));'

  static readonly GET_LOGS_COUNT = 'select count(*) as count from logs_sequence where userid=?';
  static readonly GET_NOTES_COUNT = 'select count(*) as count from notes where mustbedeleted=\'false\' and userid=?';
  static readonly GET_NOTES_COUNT_TOTAL = 'select count(*) as count from notes where userid=?';
  static readonly GET_TAGS_COUNT = 'select count(*) as count from tags where mustbedeleted=\'false\' and userid=?';
  static readonly GET_TAGS_COUNT_TOTAL = 'select count(*) as count from tag where userid=?';

  // static readonly GET_NOTES_MIN = 'select title from notes where mustbedeleted=\'false\' and userid=?';
  /*postgres:select title, count(tagTitle)::integer as notesLength
  from attic.tags as t left join attic.notes_tags on title=tagTitle
  where t.userId=$1
  group by title, t.userId
  order by notesLength desc, title asc;*/
  /*this query has been tested and it works.*/
  // static readonly GET_TAGS_MIN = 'select title, count(tagtitle) as noteslength from tags left join notes_tags on title=tagtitle where mustbedeleted=\'false\' and userid=? group by title order by noteslength desc, title asc;'
  /*here we use the json_obj.*/
  static readonly GET_NOTE_FULL_JSON ='select json_object from notes where title=? and mustbedeleted=\'false\' and userid=?';
  /*here we use the json_obj.*/
  static readonly GET_TAG_FULL_JSON = 'select json_object from tags where title=? and userid=?';

  static readonly INSERT_NOTE = 'insert into notes(title, userid, text, creationdate, remote_lastmodificationdate, isdone, links, json_object) values (?,?,?,?,?,?,?,?)';
  //static readonly INSERT_NOTE_LOCAL = 'insert into notes(title, userid, text, creationdate, remote_lastmodificationdate, isdone, links, json_object) values (?,?,?,?,?,?,?,?,?)';

  //static readonly INSERT_CLIENT_CREATED_NOTE = 'insert into notes(title, text, links, isdone)';

  static readonly INSERT_TAG = 'insert into tags(title, userid, json_object)  values(?,?,?);';
  static readonly INSERT_NOTES_TAGS = 'insert into notes_tags(notetitle,tagtitle, role, userid) values (?,?,?,?)';

  static readonly NOTE_EXISTS = 'select title from notes where title=? and userid=?';
  static readonly TAG_EXISTS = 'select title from tags where title=? and userid=?';
  static readonly NOTES_TAGS_EXISTS_NO_ROLE = 'select notetitle from notes_tags where notetitle=? and tagtitle=? and userid=?';
  static readonly NOTES_TAGS_EXISTS_WITH_ROLE = 'select notetitle from notes_tags where notetitle=? and tagtitle=? and role=? and userid=?';

  /*
  The update functions on notes and tags will update the object only if there is some differences,
  how do I do this? By checking that the json_object saved is different from the right-now-calculated.
  */

  // static readonly UPDATE_NOTE = 'update notes set title=?, userid=?, text=?, remote_lastmodificationdate=?, isdone=?, links=?, json_object=? where title=? and json_object <> ?';
  static readonly UPDATE_NOTE_2 = 'update notes set text=?, remote_lastmodificationdate=?, creationdate=?, isdone=?, links=?, json_object=? where title=? and json_object <> ? and userid=?';
  // static readonly UPDATE_TAG = 'update tags set title=?, userid=?, json_obectj=? where title=?';
  static readonly UPDATE_TAG_2 = 'update tags set json_object=? where title=? and json_object <> ? and userid=?';
  // static readonly UPDATE_NOTES_TAGS = 'update notes_tags set notetitle=?, tagtitle=?, role=?, userid=?, where notetitle=? and tagtitle=?';

  static readonly NOTE_EXISTS_AND_IS_FULL = 'select text from notes where mustbedeleted=\'false\' and title=? and userid=?';
  static readonly TAG_EXISTS_AND_IS_FULL = 'select json_object from tags where mustbedeleted=\'false\' and title=? and userid=?';

  static readonly INSERT_NOTE_MIN = 'insert into notes(title, json_object, userid) values (?,?,?)';
  static readonly INSERT_TAG_MIN = 'insert into tags(title, json_object, userid) values (?,?.?)';

  static readonly SELECT_NOTES_MIN = 'select json_object from notes where mustbedeleted=\'false\' and userid=?';
  static readonly SELECT_TAGS_MIN = 'select json_object from tags where mustbedeleted=\'false\' and userid=?';

  // static readonly IS_NOTE_UP_TO_DATE = 'select title from notes where mustbedeleted=\'false\' and title=? and json_object=?';

  // static readonly UPDATE_JSON_OBJ_IF_NECESSARY_TAG = 'update tags set json_object=? where title=? and json_object <> ?';

  static readonly UPDATE_JSON_OBJ_TAG ='update tags set json_object=? where title=? and userid=?';
  static readonly UPDATE_JSON_OBJ_NOTE ='update notes set json_object=? where title=? and userid=?';

  static readonly GET_TITLE_AND_JSON_OF_NOTES_TO_UPDATE = 'select title, role, json_object from notes join notes_tags on title=notetitle where notes.mustbedeleted=\'false\' and notes_tags.mustbedeleted=\'false\' and tagtitle=? and notes.userid=? and notes_tags.userid=notes.userid';
  // static readonly EMPLTY_NOTES = 'delete from notes';
  // static readonly EMPTY_TAGS = 'delete from tags';

  // static readonly INSERT_NOTE_INTO_LOGS = 'insert into logs (notetitle, action) values(?,?)';

  static readonly INSERT_TOKEN = 'insert into auth (token, userid) values(?,?)';
  static readonly INSERT_ONLY_TOKEN = 'update auth set token=? where userid=?';

  static readonly GET_TOKEN = 'select * from auth where token is not null limit 1;';

  static readonly UPDATE_NOTE_SET_DONE = 'update notes set isdone=?, json_object=? where title=? and userid=?';
  static readonly UPDATE_NOTE_SET_TEXT = 'update notes set text=?, json_object=? where title=? and userid=?';
  static readonly UPDATE_NOTE_SET_LINKS = 'update notes set links=?, json_object=? where title=? and userid=?';
  static readonly UPDATE_NOTE_SET_TITLE = 'update notes set title=?, json_object=? where title=? and userid=?';

  static readonly INSERT_NOTE_OLDTITLE_INTO_LOGS = 'insert into logs_sequence(notetitle, oldtitle, action, userid) values (?,?,?,?)';
  static readonly INSERT_TAG_OLDTITLE_INTO_LOGS = 'insert into logs_sequence(tagtitle, oldtitle, action, userid) values (?,?,?,?)';


  static readonly IS_NOTE_NOT_IN_THE_SERVER = 'select * from logs_sequence where notetitle=? and action=\'create\' and userid=?';

  static readonly SELECT_NOTES_MIN_BY_TAGS = 'select notetitle from notes_tags where userid=? and mustbedeleted=\'false\' and tagtitle=?';
  static readonly SELECT_NOTES_MIN_BY_TEXT = 'select title from notes where text like %?% and mustbedeleted=\'false\' and userid=?';

  static readonly SET_NOTE_DELETED = 'update notes set mustbedeleted=\'true\' where title=? and userid=?';
  static readonly SET_NOTE_DELETED_NOTES_TAGS = 'update notes_tags set mustbedeleted=\'true\' where notetitle=? and userid=?';

  static readonly SET_TAG_DELETED = 'update tags set mustbedeleted=\'true\' where title=? and userid=?';
  static readonly SET_TAG_DELETED_NOTES_TAGS = 'update notes_tags set mustbedeleted=\'true\' where tagtitle=? and userid=?';



  static readonly NOTES_TO_CLEAN_UP_CREATE = 'select distinct notetitle from logs_sequence as l where exists (select * from logs_sequence as l1 where action=\'delete\' and l.notetitle=l1.notetitle and userid=?) and exists (select * from logs_sequence as l1 where action=\'create\' and l.notetitle=l1.notetitle and userid=?)';
  static readonly CLEAN_UP_NOTES_CREATE = 'delete from notes where title in (select distinct notetitle from logs_sequence as l where exists (select * from logs_sequence as l1 where action=\'delete\' and l.notetitle=l1.notetitle  and userid=?) and exists (select * from logs_sequence as l1 where action=\'create\' and l.notetitle=l1.notetitle and userid=?));'

  static readonly TAGS_TO_CLEAN_UP_CREATE = 'select distinct tagtitle from logs_sequence as l where exists (select * from logs_sequence as l1 where action=\'delete\' and l.tagtitle=l1.tagtitle) and exists (select * from logs_sequence as l1 where action=\'create\' and l.tagtitle=l1.tagtitle)';
  static readonly CLEAN_UP_TAGS_CREATE = 'delete from tags where title in (select distinct tagtitle from logs_sequence as l where exists (select * from logs_sequence as l1 where action=\'delete\' and l.tagtitle=l1.tagtitle and userid=?) and exists (select * from logs_sequence as l1 where action=\'create\' and l.tagtitle=l1.tagtitle and userid=?));'

  static readonly CLEAN_UP_NOTES_SET_DONE = 'select id from logs_sequence as l where action=\'set-done\' and userid=? and id < (select max(id) from logs_sequence as l1 where action=\'set-done\' and l.notetitle = l1.notetitle and userid=?);';
  static readonly NOTES_TO_CLEAN_UP_SET_DONE = 'delete from logs_sequence where id in (select id from logs_sequence as l where action=\'set-done\' and userid=? and id < (select max(id) from logs_sequence as l1 where action=\'set-done\' and l.notetitle = l1.notetitle and userid=?));';

  static readonly CLEAN_UP_NOTES_SET_TEXT = 'select id from logs_sequence as l where action=\'change-text\' and userid=? and id < (select max(id) from logs_sequence as l1 where action=\'change-text\' and l.notetitle = l1.notetitle and userid=?);';
  static readonly NOTES_TO_CLEAN_UP_SET_TEXT = 'delete from logs_sequence where id in (select id from logs_sequence as l where action=\'change-text\' and userid=? and id < (select max(id) from logs_sequence as l1 where action=\'change-text\' and l.notetitle = l1.notetitle and userid=?));';

  static readonly CLEAN_UP_NOTES_SET_LINK = 'select id from logs_sequence as l where action=\'set-link\' and userid=? and id < (select max(id) from logs_sequence as l1 where action=\'set-link\' and l.notetitle = l1.notetitle and userid=?);';
  static readonly NOTES_TO_CLEAN_UP_SET_LINK = 'delete from logs_sequence where id in (select id from logs_sequence as l where action=\'set-link\' and userid=? and id < (select max(id) from logs_sequence as l1 where action=\'set-link\' and l.notetitle = l1.notetitle and userid=?));';


  static readonly SELECT_NOTES_TO_SAVE = 'select * from notes join logs_sequence on title=notetitle and notes.userid=logs.userid where notes.userid=? and action=\'create\'';
  static readonly SELECT_TAGS_TO_SAVE = 'select * from logs where logs_sequence.userid=? and tagtitle is not null and notetitle is null and action=\'create\'';

  static readonly DELETE_NOTES_TO_SAVE_LOGS = 'delete from logs_sequence where id in (select id from logs_sequence where action=\'create\' and userid=?  and tagtitle is null and notetitle is not null);'
  static readonly DELETE_TAGS_TO_SAVE_LOGS = 'delete from logs_sequence where id in (select id from logs_sequence where action=\'create\' and userid=?  and tagtitle is not null and notetitle is null and role is null);'

  static readonly SELECT_TAGS_TO_ADD_TO_NOTES = 'select * from logs_sequence where logs_sequence.userid=? and tagtitle is not null and notetitle is not null and action=\'create\' and role is not null';
  static readonly DELETE_TAGS_TO_ADD_TO_NOTES = 'delete fro logs_sequence where id in (select id from logs_sequence where action=\'create\' and userid=? and tagtitle is not null and notetitle is not null and role is not null);';

  static readonly SELECT_TAGS_TO_ADD_TO_NOTES_2 = 'select * from logs_sequence where notetitle is not null and tagtitle is not null and role is not null and action=\'add-tag\' and userid=? order by notetitle, role';

  /*
  tag and notes in the db just memorize an array of ids.
  */
  //static readonly INSERT_SET_DONE_INTO_LOGS = 'insert into logs(notetitle, action) values (?,?)';

  // static getQueryTable(table: Table, sql: string): string{
  //   let result: string;
  //   switch(table){
  //     case Table.Notes:
  //     result = sql.replace('?', 'notes');
  //     case Table.NotesToSave:
  //     result = sql.replace('?', 'notes_to_save');
  //     case Table.Tags:
  //     result = sql.replace('?', 'tags');
  //     case Table.TagsToSave:
  //     result = sql.replace('?', 'tags_to_save');
  //   }
  //   return result;
  // }

 }
