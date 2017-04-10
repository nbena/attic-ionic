import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';
import { Db } from './db';
import { NoteExtraMin, NoteFull, NoteSQLite, NoteMin } from '../models/notes';
import { TagExtraMin, TagFull, TagSQLite } from '../models/tags';
//import * as Collections from 'typescript-collections';
import { Queue } from 'typescript-collections';

/*
  Generated class for the Synch provider.

  See https://angular.io/docs/ts/latest/guide/dependency-injection.html
  for more info on providers and Angular 2 DI.
*/

/*
defining data types needed.
*/

/*
very important to decide the order!
*/


@Injectable()
export class Synch {


  private notesToSave: Queue<NoteMin>; /*the correct form required by the server.*/
  private notesToDelete: Queue<string>;

  private notesToChangeText: Queue<[string, string]>;
  private notesToChangeTitle: Queue<[string, string]>;
  private notesToAddTags: Queue<[string, string[]]>;
  private notesToRemoveTags: Queue<[string, string[]]>

  constructor(private db: Db) {

  }

  private tagsToPublish(){
    let tagQueue = new Queue<TagFull>();
    let tags = this.db.getTagsToPublish()
    .then(tags=>{
      //filter the tags, at first just the tag with not notes.
    })
    .catch(error=>{
      console.log(JSON.stringify(error));
    })
  }



}
