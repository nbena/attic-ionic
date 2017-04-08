import { Table } from './const';
export class Query{
  /*even if ugly use this.*/
  static readonly CREATE_NOTES_TABLE = 'create table if not exists notes(_id char(12) primary key,text text,title varchar(64) unique,isDone boolean,links text,creationDate char(24),lastModificationDate char(24),mainTags text,otherTags text)';
  static readonly CREATE_TAGS_TABLE = 'create table if not exists tags(_id char(12) primary key,title varchar(64) unique,notes text, notes_length integer)';
  static readonly CREATE_NOTES_TO_SAVE_TABLE = 'create table if not exists notes_to_save(_id integer primary key autoincrement, title varchar(64) unique, text text, isDone boolean,links text,creationDate char(24),lastModificationDate char(24),mainTags text,otherTags text)';
  static readonly CREATE_TAGS_TO_SAVE_TABLE='create table if not exists tags_to_save( _id integer primary key autoincrement,  title varchar(64) unique, notes text, notes_length integer)';
  static COUNT ='select count(*) as count from ?';

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
