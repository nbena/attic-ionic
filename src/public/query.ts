import {TagExtraMin} from '../models/tags';
import {TagType} from './const';
// import { Table } from './const';

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

  //TODO: look at queries and see when 'role is | is not null can be removed'

  static readonly CREATE_AUTH_TABLE = 'create table if not exists auth(token text default null, userid varchar(64), free boolean default true, primary key(userid));';
  // static readonly CREATE_NOTES_TABLE ='create table if not exists notes(title varchar(64),userid varchar(64) default null,text text default null, links text default null, isdone boolean default false,creationdate date default (strftime(\'%Y-%m-%d %H:%M:%f\', \'now\')), lastmodificationdate date default (strftime(\'%Y-%m-%d %H:%M:%f\', \'now\')),mustbedeleted boolean default false, json_object text default null,primary key(title, userid, mustbedeleted), foreign key(userid) references auth(userid) on update cascade on delete cascade);';
  static readonly CREATE_NOTES_TABLE = 'create table if not exists notes(title varchar(64), userid varchar(64) default null, text text default null,'+
    //'json_object text default null, lastmodificationdate date default (strftime(\'%Y-%m-%d %H:%M:%f\', \'now\')), mustbedeleted boolean default false, '+
    'json_object text default null, lastmodificationdate text default null, mustbedeleted boolean default false, '+
    'primary key(title, userid, mustbedeleted), foreign key(userid) references auth(userid) on update cascade on delete cascade)';
  static readonly CREATE_TAGS_TABLE = 'create table if not exists tags(title varchar(64),userid varchar(64) default null, mustbedeleted boolean default false, json_object text default null,primary key(title, userid, mustbedeleted), foreign key(userid) references auth(userid) on update cascade on delete cascade);';
  // static readonly CREATE_NOTES_TAGS_TABLE ='create table if not exists notes_tags(notetitle varchar(64), userid varchar(64), tagtitle varchar(64),role varchar(9),mustbedeleted boolean default false,primary key(notetitle, tagtitle, userid, mustbedeleted),foreign key(notetitle) references notes(title) on update cascade on delete cascade,foreign key(tagtitle) references tags(title) on update cascade on delete cascade, foreign key(userid) references auth(userid) on update cascade on delete cascade,constraint role_check check (role = \'mainTags\' or role = \'otherTags\'));';
  static readonly CREATE_LOGS_TABLE = 'create table if not exists logs_sequence(id integer primary key autoincrement,notetitle varchar(64) default null,oldtitle varchar(64),tagtitle varchar(64) default null,role varchar(9) default null,action varchar(64) not null, creationdate date default(strftime(\'%Y-%m-%d %H:%M:%f\', \'now\')), userid varchar(64), foreign key(notetitle) references notes(title) on update cascade on delete cascade,foreign key(tagtitle) references tags(title) on update cascade on delete cascade, foreign key(userid) references auth(userid) on update cascade on delete cascade, constraint action_check check(action=\'create\' or action=\'delete\' or action=\'change-title\' or action=\'change-text\' or action=\'add-tag\' or action=\'remove-tag\' or action =\'set-done\' or action=\'set-link\'),constraint role_check check (role =\'mainTags\' or role = \'otherTags\' or role is null),constraint if_all check ((role is not null and noteTitle is not null and tagTitle is not null or (noteTitle is not null) or (tagTitle is not null))));'

  static readonly CREATE_TAGS_HELP_TABLE = 'create table if not exists tags_help(title varchar(64), userid varchar(64), json_object text default null, primary key(title, userid));';
  //static readonly CREATE_NOTES_HELP_TABLE = 'create table if not exists notes_help(title varchar(64), userid varchar(64), json_object text default null, primary key(title, userid));';
    static readonly CREATE_NOTES_HELP_TABLE = 'create table if not exists notes_help(title varchar(64), userid varchar(64), json_object text default null,lastmodificationdate text default null, primary key(title, userid));';



  static readonly CREATE_TRIGGER_DELETE_NOTE_COMPRESSION = 'create trigger if not exists deleteNoteCompression after update of mustbedeleted on notes for each row when exists ( select * from logs_sequence where action=\'create\' and notetitle = old.title and userid=old.userid) begin delete from logs_sequence where notetitle = old.title and userid=old.userid; delete from notes where title = old.title and userid=old.userid; end;';
  static readonly CREATE_TRIGGER_DELETE_TAG_COMPRESSION = 'create trigger if not exists deleteTagCompression after update of mustbedeleted on tags for each row when exists ( select * from logs_sequence where action=\'create\' and tagtitle = old.title and userid=old.userid) and not exists (select * from logs_sequence where action=\'add-tag\' and tagtitle=old.title and userid=old.userid)begin delete from logs_sequence where tagtitle = old.title and userid=old.userid; delete from tags where title=old.title and userid=old.userid; end;'

  static readonly CREATE_VIEW_COUNTS =' create view if not exists counts(count, type, userid) as select count(*), \'notes\', userid from notes where mustbedeleted=\'false\' union select count(*), \'tags\', userid from tags where mustbedeleted=\'false\' union select count(*), \'logs\', userid from logs_sequence;';
  // static readonly GET_LOGS_COUNT = 'select count(*) as count from logs_sequence where userid=?';
  // static readonly GET_NOTES_COUNT = 'select count(*) as count from notes where mustbedeleted=\'false\' and userid=?';
  // static readonly GET_NOTES_COUNT_TOTAL = 'select count(*) as count from notes where userid=?';
  // static readonly GET_TAGS_COUNT = 'select count(*) as count from tags where mustbedeleted=\'false\' and userid=?';
  // static readonly GET_TAGS_COUNT_TOTAL = 'select count(*) as count from tag where userid=?';

  /*static readonly GET_LOGS_COUNT = 'select count from counts where userid=? and type=\'logs\'';
  static readonly GET_NOTES_COUNT = 'select count from counts where userid=? and type=\'notes\'';
  static readonly GET_TAGS_COUNT = 'select count from counts where userid=? and type=\'tags\'';
  */

  //for join with logs.
  static readonly CREATE_INDEX_NOTE_1 = 'create index if not exists index_note_title_userid on notes(title, userid)';

  //for get_notes_min
  static readonly CREATE_INDEX_NOTE_2 = 'create index if not exists index_note_min_for_sort on notes(lastmodificationdate desc, title asc, userid, mustbedeleted)';

  //for general searches on logs.
  static readonly CREATE_INDEX_LOGS = 'create index if not exists index_logs on logs_sequence(id asc, userid, action)';

  static readonly GET_TAGS_COUNT = 'select case when not exists(select * from counts where userid=? and type=\'tags\') then 0 else count end as count from counts where type=\'tags\'';
  static readonly GET_NOTES_COUNT = 'select case when not exists(select * from counts where userid=? and type=\'notes\') then 0 else count end as count from counts where type=\'notes\'';
  static readonly GET_LOGS_COUNT = 'select case when not exists(select * from counts where userid=? and type=\'logs\') then 0 else count end as count from counts where type=\'logs\'';

  static readonly GET_SUMMARY = 'select count, type from counts where userid=?';
  static readonly GET_SMART_SUMMARY = 'select count, type from counts where userid=? union select \'is_free\', free from auth where userid=?';

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
  static readonly GET_TAG_FULL_JSON = 'select json_object from tags where mustbedeleted=\'false\' and title=? and userid=?';

  static readonly INSERT_NOTE = 'insert into notes(title, userid, text, creationdate, lastmodificationdate, isdone, links, json_object) values (?,?,?,?,?,?,?,?)';
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
  //static readonly UPDATE_NOTE_2 = 'update notes set text=?, lastmodificationdate=?, creationdate=?, isdone=?, links=?, json_object=? where title=? and json_object <> ? and userid=?';
  // static readonly UPDATE_TAG = 'update tags set title=?, userid=?, json_obectj=? where title=?';
  static readonly UPDATE_TAG_2 = 'update tags set json_object=? where title=? and json_object <> ? and userid=?';
  // static readonly UPDATE_NOTES_TAGS = 'update notes_tags set notetitle=?, tagtitle=?, role=?, userid=?, where notetitle=? and tagtitle=?';

  static readonly NOTE_EXISTS_AND_IS_FULL = 'select text from notes where mustbedeleted=\'false\' and title=? and userid=?';
  static readonly TAG_EXISTS_AND_IS_FULL = 'select json_object from tags where mustbedeleted=\'false\' and title=? and userid=?';
  static readonly TAGS_EXIST_AND_ARE_FULL =  'select json_object from tags where mustbedeleted=\'false\' and userid=? and (';



  static readonly INSERT_NOTE_MIN = 'insert into notes(title, json_object, userid) values (?,?,?)';
  static readonly INSERT_TAG_MIN = 'insert into tags(title, json_object, userid) values (?,?,?)';

  static readonly INSERT_NOTE_MIN_2 = 'insert into notes(title, json_object, userid) values ';

  static readonly SELECT_JUST_TITLE = 'select title from notes where userid=? order by notes';

  static readonly SELECT_NOTES_MIN = 'select title, lastmodificationdate from notes where mustbedeleted=\'false\' and userid=? order by lastmodificationdate desc, title asc';

  //static readonly SELECT_NOTES_MIN = 'select json_object from notes where mustbedeleted=\'false\' and userid=? order by lastmodificationdate desc, title asc';
  static readonly SELECT_TAGS_MIN = 'select json_object from tags where mustbedeleted=\'false\' and userid=?';

  // static readonly IS_NOTE_UP_TO_DATE = 'select title from notes where mustbedeleted=\'false\' and title=? and json_object=?';

  // static readonly UPDATE_JSON_OBJ_IF_NECESSARY_TAG = 'update tags set json_object=? where title=? and json_object <> ?';

  // static readonly UPDATE_JSON_OBJ_TAG ='update tags set json_object=? where title=? and userid=?';
  // static readonly UPDATE_JSON_OBJ_NOTE ='update notes set json_object=? where title=? and userid=?';

  static readonly UPDATE_JSON_OBJ_TAG_IF_NEEDED ='update tags set json_object=? where title=? and json_object <> ? and userid=?';
  // static readonly UPDATE_JSON_OBJ_NOTE_IF_NEEDED ='update notes set json_object=? where title=? and json_object <> ? and userid=?';
  // static readonly UPDATE_JSON_OBJ_NOTE_IF_NEEDED_LAST_MOD ='update notes set json_object=?, lastmodificationdate=? where title=? and json_object <> ? and userid=?';

  static readonly UPDATE_JSON_OBJ_NOTE_IF_NEEDED_2 ='update notes set json_object=?, text=? where title=? and json_object <> ? and userid=?';
  static readonly UPDATE_JSON_OBJ_NOTE_IF_NEEDED_LAST_MOD_2 ='update notes set json_object=? text=?, lastmodificationdate=? where title=? and json_object <> ? and userid=?';

  static readonly GET_TITLE_AND_JSON_OF_NOTES_TO_UPDATE = 'select title, role, json_object from notes join notes_tags on title=notetitle where notes.mustbedeleted=\'false\' and notes_tags.mustbedeleted=\'false\' and tagtitle=? and notes.userid=? and notes_tags.userid=notes.userid';
  // static readonly EMPLTY_NOTES = 'delete from notes';
  // static readonly EMPTY_TAGS = 'delete from tags';

  // static readonly INSERT_NOTE_INTO_LOGS = 'insert into logs (notetitle, action) values(?,?)';

  static readonly INSERT_TOKEN = 'insert into auth (token, userid) values(?,?)';
  static readonly INSERT_ONLY_TOKEN = 'update auth set token=? where userid=?';

  static readonly GET_TOKEN = 'select * from auth where token is not null limit 1;';

  static readonly UPDATE_NOTE_SET_DONE = 'update notes set lastmodificationdate=?, isdone=?, json_object=? where title=? and userid=?';
  static readonly UPDATE_NOTE_SET_TEXT = 'update notes set lastmodificationdate=?, text=?, json_object=? where title=? and userid=?';
  static readonly UPDATE_NOTE_SET_LINKS = 'update notes set lastmodificationdate=?, links=?, json_object=? where title=? and userid=?';
  static readonly UPDATE_NOTE_SET_TITLE = 'update notes set lastmodificationdate=?, title=?, json_object=? where title=? and userid=?';

  static readonly UPDATE_TAG_SET_TITLE = 'update tags set title=?, json_object=? where title=? and userid=?;';

  static readonly INSERT_NOTE_OLDTITLE_INTO_LOGS = 'insert into logs_sequence(notetitle, oldtitle, action, userid) values (?,?,?,?)';
  static readonly INSERT_TAG_OLDTITLE_INTO_LOGS = 'insert into logs_sequence(tagtitle, oldtitle, action, userid) values (?,?,?,?)';

  static readonly INSERT_NOTE_TAG_INTO_LOGS = 'insert into logs_sequence(notetitle, oldtitle, tagtitle, role, action, userid) values (?,?,?,?,?,?)';


  static readonly IS_NOTE_NOT_IN_THE_SERVER = 'select * from logs_sequence where notetitle=? and action=\'create\' and userid=?';

  //static readonly SELECT_NOTES_MIN_BY_TAGS = 'select notetitle from notes_tags where userid=? and mustbedeleted=\'false\' and tagtitle=?';
  static readonly SELECT_NOTES_EXTRA_MIN_WITH_DATE_BY_TEXT = 'select title, lastmodificationdate from notes where text like ? and mustbedeleted=\'false\' and userid=? order by lastmodificationdate desc, title asc';

  static readonly SET_NOTE_DELETED = 'update notes set mustbedeleted=\'true\' where title=? and userid=?';
  static readonly SET_NOTE_DELETED_NOTES_TAGS = 'update notes_tags set mustbedeleted=\'true\' where notetitle=? and userid=?';

  static readonly SET_TAG_DELETED = 'update tags set mustbedeleted=\'true\' where title=? and userid=?';
  /*not ready.*/
  static readonly SET_TAG_DELETED_NOTES_TAGS = 'update notes_tags set mustbedeleted=\'true\' where notetitle=? and userid=? and (';

  static readonly SET_TAG_DELETED_IN_ALL_NOTES_TAGS = 'update notes_tags set mustbedeleted=\'true\' where tagtitle=? and userid=?';

  //static readonlt INSERT_TAG_TO_REMOVE_FROM_NOTES_INTO_LOGS = 'insert itno logs_sequence(notetitle, tagtitle, action, userid) values ()'


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

//===========================================
  static readonly SELECT_NOTES_TO_SAVE = 'select * from notes join logs_sequence on title=notetitle and notes.userid=logs_sequence.userid where notes.userid=? and action=\'create\'';
  static readonly SELECT_TAGS_TO_SAVE = 'select * from logs_sequence where logs_sequence.userid=? and tagtitle is not null and notetitle is null and action=\'create\'';

  static readonly SELECT_TAGS_TO_DELETE = 'select * from logs_sequence where notetitle is null and userid=? and tagtitle is not null and action=\'delete\'';
  static readonly SELECT_NOTES_TO_DELETE = 'select * from logs_sequence where notetitle is not null and userid=? and tagtitle is null and action=\'delete\'';

  static readonly DELETE_NOTES_TO_SAVE_LOGS = 'delete from logs_sequence where id in (select id from logs_sequence where action=\'create\' and userid=? and tagtitle is null and notetitle is not null);'
  static readonly DELETE_TAGS_TO_SAVE_LOGS = 'delete from logs_sequence where id in (select id from logs_sequence where action=\'create\' and userid=? and tagtitle is not null and notetitle is null);'

  static readonly SELECT_TAGS_TO_ADD_TO_NOTES = 'select * from logs_sequence where logs_sequence.userid=? and tagtitle is not null and notetitle is not null and action=\'add-tag\' and role is not null';
  static readonly DELETE_TAGS_TO_ADD_TO_NOTES = 'delete from logs_sequence where id in (select id from logs_sequence where action=\'add-tag\' and userid=? and tagtitle is not null and notetitle is not null and role is not null);';

  static readonly SELECT_NOTES_TO_CHANGE_TEXT = 'select notetitle, text from logs_sequence join notes on notetitle=title and logs_sequence.userid=notes.userid where logs_sequence.userid=? and tagtitle is null and notetitle is not null and action=\'change-text\';'
  static readonly DELETE_NOTES_TO_CHANGE_TEXT = 'delete from logs_sequence where id in (select id from logs_sequence where action=\'change-text\' and userid=? and tagtitle is null and notetitle is not null);';

  static readonly SELECT_NOTES_TO_CHANGE_LINKS = 'select notetitle, json_object from logs_sequence join notes on notetitle=title and logs_sequence.userid=notes.userid where logs_sequence.userid=? and tagtitle is null and notetitle is not null and action=\'change-links\';'
  static readonly DELETE_NOTES_TO_CHANGE_LINKS = 'delete from logs_sequence where id in (select id from logs_sequence where action=\'change-links\' and userid=? and tagtitle is null and notetitle is not null);';

  static readonly SELECT_NOTES_TO_SET_DONE = 'select notetitle, json_object from logs_sequence join notes on notetitle=title and logs_sequence.userid=notes.userid where logs_sequence.userid=? and tagtitle is null and notetitle is not null and action=\'set-done\';'
  static readonly DELETE_NOTES_TO_SET_DONE = 'delete from logs_sequence where id in (select id from logs_sequence where action=\'set-done\' and userid=? and tagtitle is null and notetitle is not null);';

  static readonly SELECT_TAGS_TO_ADD_TO_NOTES_2 = 'select * from logs_sequence where notetitle is not null and tagtitle is not null and role is not null and action=\'add-tag\' and userid=? order by notetitle, role';

  static readonly SELECT_TAGS_TO_REMOVE_FROM_NOTES_2 = 'select * from logs_sequence where notetitle is not null and tagtitle is not null and action=\'remove-tag\' and userid=? order by notetitle;';

  static readonly ADD_TAGS_TO_NOTE = 'insert into notes_tags(notetitle, tagtitle, role, userid) values (?,?,?,?)';


  //===============================SINGLE DELETE FROM LOGS_SEQUENCE========================0

  /*functions to work directly on logs are divided into two types:
  -delete all the set (e.g.: all the notes that must be saved)
  -delete just one (e.g.: the note with a certain title that must be saved)
  Both are necessary because when Synch tries to Synch, if it works for all of the set,
  the we can delete all the set, if it works just for a couple of, we can keep track of what
  is correct, and delete just them.
  */

  //tags-to-add and tags-to-remove
  static readonly DELETE_FROM_LOGS_TAGS_TO_DELETE_FROM_NOTE_WHERE_NOTE_AND_TAG_MULTI = 'delete from logs_sequence where tagtitle is not null and role is not null and action=\'remove-tag\' and notetitle=? and userid=?  and ';
  static readonly DELETE_FROM_LOGS_TAGS_TO_ADD_TO_NOTE_WHERE_NOTE_AND_TAG_MULTI = 'delete from logs_sequence where tagtitle is not null and role is not null and action=\'add-tag\' and notetitle=? and userid=?  and ';
  static readonly DELETE_FROM_LOGS_TAGS_TO_ADD_TO_NOTE_WHERE_NOTE_AND_TAG = 'delete from logs_sequence where tagtitle is not null and role is not null and action=\'add-tag\' and notetitle=? and tagtitle=? and userid=?';
  static readonly DELETE_FROM_LOGS_TAGS_TO_ADD_TO_NOTE_WHERE_NOTE = 'delete from logs_sequence where userid=? and tagtitle is not null and role is not null and action=\'add-tag\' and ';
  static readonly DELETE_FROM_LOGS_TAGS_TO_DELETE_FROM_NOTE_WHERE_NOTE = 'delete from logs_sequence where userid=? and tagtitle is not null and action=\'remove-tag\' and ';


  //note and tag to create
  //static readonly DELETE_FROM_LOGS_TAG_CREATED_WHERE_TAG = 'delete from logs_sequence where userid=? and notetitle is null and action=\'create\' and (tagtitle=?)';
  // static readonly DELETE_FROM_LOGS_NOTE_CREATED_WHERE_NOTE = 'delete from logs_sequence where userid=? and tagtitle is null and action=\'create\' and (notetitle=?)';
  static readonly DELETE_FROM_LOGS_TAG_CREATED_WHERE_TAG = 'delete from logs_sequence where userid=? and notetitle is null and action=\'create\' and ';
  static readonly DELETE_FROM_LOGS_NOTE_CREATED_WHERE_NOTE = 'delete from logs_sequence where userid=? and tagtitle is null and action=\'create\' and ';



  static readonly DELETE_FROM_LOGS_NOTE_SET_DONE_WHERE_NOTE = 'delete from logs_sequence where userid=? and action=\'set-done\' and tagtitle is null and ';
  static readonly DELETE_FROM_LOGS_NOTE_SET_LINK_WHERE_NOTE = 'delete from logs_sequence where userid=? and action=\'set-link\' and tagtitle is null and ';
  static readonly DELETE_FROM_LOGS_NOTE_CHANGE_TEXT_WHERE_NOTE = 'delete from logs_sequence where userid=? and action=\'change-text\' and tagtitle is null and ';
  // static readonly DELETE_FROM_LOGS_NOTE_SET_DONE_WHERE_NOTE = 'delete from logs_sequence where userid=? and action=\'set-done\' and tagtitle is null and (notetitle=?)';
  // static readonly DELETE_FROM_LOGS_NOTE_SET_LINK_WHERE_NOTE = 'delete from logs_sequence where userid=? and action=\'set-link\' and tagtitle is null and (notetitle=?)';
  // static readonly DELETE_FROM_LOGS_NOTE_CHANGE_TEXT_WHERE_NOTE = 'delete from logs_sequence where userid=? and action=\'change-text\' and tagtitle is null and (notetitle=?)';


  static readonly DELETE_FROM_NOTES_NOTES_TO_DELETE_WHERE_NOTE = 'delete from notes where userid=? and mustbedeleted=\'true\' and ';
  static readonly DELETE_FROM_LOGS_NOTES_TO_DELETE_WHERE_NOTE = 'delete from logs_sequence where userid=? and action=\'delete\' and tagtitle is null and ';
  //static readonly DELETE_FROM_LOGS_NOTES_TO_DELETE_WHERE_NOTE = 'delete from logs_sequence where userid=? and action=\'delete\' and tagtitle is null and (notetitle=?)';
  //static readonly DELETE_FROM_NOTES_NOTES_TO_DELETE_WHERE_NOTE = 'delete from notes where userid=? and mustbedeleted=\'true\' and (title=?)';

  // static readonly DELETE_FROM_LOGS_TAGS_TO_DELETE_WHERE_TAG = 'delete from logs_sequence where userid=? and action=\'delete\' and notetitle is null and (tagtitle=?)';
  // static readonly DELETE_FROM_TAGS_TAGS_TO_DELETE_WHERE_TAG = 'delete from tags where userid=? and mustbedeleted=\'true\' and (title=?)';
  static readonly DELETE_FROM_LOGS_TAGS_TO_DELETE_WHERE_TAG = 'delete from logs_sequence where userid=? and action=\'delete\' and notetitle is null and ';
  static readonly DELETE_FROM_TAGS_TAGS_TO_DELETE_WHERE_TAG = 'delete from tags where userid=? and mustbedeleted=\'true\' and ';


  static readonly INSERT_INTO_NOTES_HELP = 'insert into notes_help(title, json_object, lastmodificationdate, userid) values ';
  static readonly INSERT_INTO_TAGS_HELP = 'insert into tags_help(title, json_object, userid) values ';

  static readonly DELETE_DIRTY_NOTES = 'delete from notes as n1 where title not in (select title from notes_help as n2 where n1.userid=n2.userid) and title not in (select notetitle from logs_sequence as l1 where n1.userid=l1.userid) and n1.userid=?';
  static readonly DELETE_DIRTY_TAGS = 'delete from tags as t1 where title not in (select title from tags_help as t2 where t1.userid=t2.userid) and title not in (select tagtitle from logs_sequence as l1 where t1.userid=l1.userid) and t1.userid=?';

  static readonly DELETE_NOTES_HELP = 'delete from notes_help where userid=?';
  static readonly DELETE_TAGS_HELP = 'delete from tags_help where userid=?';


  static readonly SMART_NOTES_MIN_INSERT = ' insert into notes(title, json_object, lastmodificationdate, userid) select title,json_object, lastmodificationdate, userid from notes_help as nh1 where title not in (select title from notes where nh1.userid=userid) and nh1.userid=? order by lastmodificationdate desc, title asc;';
  static readonly SMART_NOTES_REMOVE_DIRTY = 'delete from notes where title  not in (select title from notes_help as nh1 where notes.userid=nh1.userid) and title not in (select notetitle from logs_sequence as l1 where l1.userid=notes.userid) and userid=?;'

  static readonly SMART_TAGS_MIN_INSERT = ' insert into tags(title, json_object, userid) select title,json_object, userid from tags_help as th1 where title not in (select title from tags where th1.userid=userid) and th1.userid=?;';
  static readonly SMART_TAGS_REMOVE_DIRTY = 'delete from tags where title  not in (select title from tags_help as th1 where tags.userid=th1.userid) and title not in (select tagtitle from logs_sequence as l1 where l1.userid=tags.userid) and userid=?;'


  static readonly INSERT_SET_FREE = 'update auth set free=? where free <> ? and userid=?';

  static readonly FORCE_DELETE_NOTE = 'delete from notes where title=? and userid=?';
  static readonly FORCE_DELETE_TAG = 'delete from tags where title=? and userid=?';

  static readonly REMOVE_NOTES_FROM_TAGS_SMART_REPLACE = 'update tags set json_object = replace(json_object, ?, \'\')  where instr(json_object, ?) <> 0 and userid=?';
  static readonly REMOVE_NOTES_FROM_TAGS_CLEANUP_ONE = 'update tags set json_object = replace(json_object, \'[,\', \'[\') where instr(json_object, \'[,\') <> 0 and userid=?';
  static readonly REMOVE_NOTES_FROM_TAGS_CLEANUP_TWO = 'update tags set json_object = replace(json_object, \'},,{\', \'},{\') where instr(json_object, \'},,{\') <> 0 and userid=?';
  static readonly REMOVE_NOTES_FROM_TAGS_CLEANUP_THREE = 'update tags set json_object = replace(json_object, \',]\', \']\') where instr(json_object, \'],\') <> 0 and userid=?';
  static readonly REDUCE_NOTES_LENGTH = 'with involved_tag(title, json_object) as'+
'	(select title, json_object from tags where title=? and userid=?)'+
'update tags set json_object=('+
'with noteslength_temp as ('+
'	select substr((select json_object from involved_tag),'+
'	instr('+
'				(select json_object from involved_tag), '+
'			\'"noteslength":\''+
'	)'+
'	)),'+
'	old_noteslength_str as ('+
'	select replace((select * from noteslength_temp),'+
'								\'}\','+
'								\'\')'+
'	),'+
'	old_noteslength_value as ('+
'	select substr((select * from noteslength_temp), '+
'							instr((select * from noteslength_temp), \':\' )+1'+
'							)'+
'),'+
'	new_noteslength_str as ('+
'		select printf(\'%s:%d\', \'"noteslength"\', ((select * from old_noteslength_value)-1))'+
'	),'+
'final_result(replacement) as ('+
'	select replace((select json_object from involved_tag'+
'								where instr(json_object, title) <> 0'+
'								),'+
'								(select * from old_noteslength_str),'+
'								(select * from new_noteslength_str))'+
') '+
'select * from final_result'+
'where instr(replacement, title) <> 0'+
')'+
'where title = (select title from involved_tag);'


  static readonly REMOVE_TAGS_FROM_NOTES_SMART_REPLACE = 'update notes set json_object = replace(json_object, ?, \'\') where instr(json_object, ?) <> 0 and userid=?';
  static readonly REMOVE_TAGS_FROM_NOTES_CLEANUP_ONE = 'update notes set json_object = replace(json_object, \'[,\', \'[\') where instr(json_object, \'[,\') <> 0 and userid=?';
  static readonly REMOVE_TAGS_FROM_NOTES_CLEANUP_TWO = 'update notes set json_object = replace(json_object, \'},,{\', \'},{\') where instr(json_object, \'},,{\') <> 0 and userid=?';
  static readonly REMOVE_TAGS_FROM_NOTES_CLEANUP_THREE = 'update notes set json_object = replace(json_object, \',]\', \']\') where instr(json_object, \'],\') and userid=?';


  static readonly DELETE_EVERYTHING_FROM_NOTES = 'delete from notes where userid=?';
  static readonly DELETE_EVERYTHING_FROM_TAGS = 'delete from tags where userid=?';
  static readonly DELETE_EVERYTHING_FROM_LOGS  = 'delete from logs_sequence where userid=?';


  static readonly SELECT_TITLE_FROM_NOTES = 'select title from notes where title=? and userid=?';
  static readonly SELECT_TITLE_FROM_TAGS = 'select title from tags where title=? and userid=?';

  //static readonly NEED_TO_SYNCH = 'select count(*) as c from logs_sequence where userid=?';


  //static readonly UPDATE_JSON_OBJ_NOTE_IF_NECESSARY = 'update notes set json_object=? where length(json_object) < length(?) and title=? and userid=?';
  static readonly INSERT_INTO_NOTES_2 = 'insert into notes(title, json_object, text, lastmodificationdate,userid) values (?,?,?,?,?)';

  static readonly EMPTY_RESULT_SET ='with a(b) as (select \'true\') select b from a where b=\'false\'';
  static readonly INSERT_MULTI_TAGS ='insert into tags(title, json_object, userid) values ';

  //static readonly INSERT_NOTE_2 = 'insert into notes(title, text, lastmodificationdate, json_object, userid) values (?,?,?,?,?)';

  //static readonly INSERT_NOTE_2 = 'insert into notes(title, text, json_object, userid) values (?,?,?,?)';
  static readonly INSERT_NOTE_2 = 'insert into notes(title, text, json_object, lastmodificationdate, userid) values (?,?,?,?,?)';


  static readonly INSERT_NOTE_TAG_INTO_LOGS_2 = 'insert into logs_sequence(notetitle, tagtitle, role, action, userid) values ';
  static readonly INSERT_NOTE_TAG_INTO_LOGS_2_NO_ROLE = 'insert into logs_sequence(notetitle, tagtitle, action, userid) values ';

  // static readonly SELECT_NOTE_TITLE_BY_TAGS_NO_ROLE = 'select title from notes where json_object like ? and userid=?';
  // static readonly SELECT_NOTE_TITLE_JSON_BY_TAGS_NO_ROLE = 'select title, json_object from notes where json_object like ? and userid=?'

  static readonly SELECT_NOTES_EXTRA_MIN_WITH_DATE_BY_TAGS_NO_ROLE_AND = 'select title,lastmodificationdate from notes where userid=? and mustbedeleted=\'false\' and json_object like ? order by lastmodificationdate desc, title asc';
  static readonly SELECT_NOTES_EXTRA_MIN_WITH_DATE_BY_TAGS_NO_ROLE_OR = 'select title,lastmodificationdate from notes where userid=? and mustbedeleted=\'false\' and json_object regexp ? order by lastmodificationdate desc, title asc';
  //static readonly SELECT_NOTE_TITLE_JSON_BY_TAGS_NO_ROLE = 'select title, json_object from notes where userid=? and mustbedeleted=\'false\' and json_object like ?';


  static readonly SELECT_NOTES_FULL_MIN_WITH_DATE_BY_TAGS_NO_ROLE_AND = 'select json_object from notes where userid=? and mustbedeleted=\'false\' and json_object like ? order by lastmodificationdate desc, title asc';
  static readonly SELECT_NOTES_FULL_MIN_WITH_DATE_BY_TAGS_NO_ROLE_OR = 'select json_object from notes where userid=? and mustbedeleted=\'false\' and json_object regexp ? order by lastmodificationdate desc, title asc';

  static readonly SELECT_NOTES_FULL_BASE ='select json_object from notes where userid=? '
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
  static readonly GET_LOGS_BY_NOTE = "select json_object, action from notes join logs_sequence "+
  "on title=notetitle and notes.userid=logs_sequence.userid where notes.userid=? and action="+
  "'set-done' or action='change-text' or action='set-link' or action='add-tag' or "+
  "action='remove-tag' and title=?";

  static readonly FORCE_DELETE_NOTE_MULTI = 'delete from notes where userid=? and ';
  static readonly FORCE_DELETE_TAG_MULTI = 'delete from tags where userid=? and ';

  static readonly DELETE_TOKEN = 'delete from auth where userid=?';

  static readonly UPDATE_NOTE_SET_TEXT_2 = 'update notes set lastmodificationdate=?, text=?, json_object=? where text <> ? and title=? and userid=?';

  static readonly SELECT_NOTES_EXTRA_MIN_WITH_DATE_BY_ISDONE = 'select title, lastmodificationdate from notes where json_object like ? and mustbedeleted=\'false\' and userid=? order by lastmodificationdate desc, title asc';



  public static prepareQueryTagExistAndAreFull(length:number):string{
    let result:string = Query.TAGS_EXIST_AND_ARE_FULL;
    for(let i=0;i<length;i++){
      result+='title=? or ';
    }
    result=result.substr(0, result.lastIndexOf('or '));
    result+=')';
    if(length==0){
      result=Query.EMPTY_RESULT_SET;
    }
    console.log('result is '+result);
    return result;
  }


  public static expandArrayTagsMinWithEverything(tags:TagExtraMin[], userid:string):string[]{
    let array:string[]=[];
    for(let i=tags.length-1;i>=0;i--){
      array.push(tags[i].title);
      array.push(JSON.stringify(tags[i]));
      array.push(userid);
    }
    return array;
  }


  public static prepareQueryInsertIntoHelp(baseQuery: string, length:number, userid:string, questionMark:number):string{
    for(let i=0;i<length;i++){
      //baseQuery += '(?,?,?,?),';

      let temp:string='?,'.repeat(questionMark);
      temp=temp.substr(0, temp.length-1);
      temp = '('+temp+'),';
      baseQuery+=temp;
    }
    baseQuery = baseQuery.substr(0, baseQuery.length-1);
    return baseQuery;
  }



  public static expandInsertNoteTagsIntoLogs(title:string, userid:string, tags:TagExtraMin[]):string[]{
    let array:string[]=[];
    for(let i=0;i<tags.length;i++){
      array.push(title);
      array.push(tags[i].title);
      array.push(userid);
    }
    return array;
  }

  public static expandTagType(tags:TagExtraMin[], type:TagType):TagType[]{
    return tags.map(obj=>{
      return type;
    })
  }

  public static prepareQueryInsertNotesTagsIntoLogs(tags:TagExtraMin[], roles: TagType[]):string{
    if(roles.length != tags.length){
      throw new Error('error length must be the same');
    }
    let result:string = Query.INSERT_NOTE_TAG_INTO_LOGS_2;
    for(let i=0;i<tags.length;i++){
      if(roles[i]==TagType.MAIN){
        result+='(?,?,\'mainTags\',\'add-tag\', ?),';
      }else{
        result+='(?,?,\'otherTags\',\'add-tag\', ?),';
      }
    }
    result=result.substr(0, result.length-1);
    return result;
  }

  public static prepareQueryRemoveTagsFromNotesLogs(length:number):string{
    let result:string = Query.INSERT_NOTE_TAG_INTO_LOGS_2_NO_ROLE;
    for(let i=0;i<length;i++){
      result+='(?,?,\'remove-tag\', ?),';
    }
    result=result.substr(0, result.length-1);
    return result;
  }

  public static prepareNotesMultiVersion(length:number, query:string, fromLogs:boolean):string{
    let res:string = query;
    res+='(';
    for(let i=0;i<length;i++){
      if(fromLogs){
        res+=' notetitle=? or'
      }else{
        res+=' title=? or'
      }
    }
    res = res.substr(0, res.lastIndexOf('or'));
    res+=')';
    return res;
  }



  //tested in console.
  /**
  return a query that must be formed in the following mode:
  '.... from ... where... and ', what is done here is an adding in the followfing form:
  '(tagtitle=? or tagtitle=?)' if last is set to true, or '(title=? or title=?)'
  */
  public static prepareTagsMultiVersion(length:number, queryString: string, fromLogs:boolean):string{
    //let res: string = Query.DELETE_FROM_LOGS_TAG_CREATED_WHERE_TAG;
    let res: string = queryString;
    res+='(';
    for(let i=0;i<length;i++){
      if(fromLogs){
        res+=' tagtitle=? or';
      }else{
        res+=' title=? or';
      }
    }
    res = res.substr(0, res.lastIndexOf('or'));
    res+=')';
    return res;
  }



 }
