import { Injectable } from '@angular/core';
// import { Http } from '@angular/http';
// import 'rxjs/add/operator/map';
import {NoteFull, NoteExtraMin, NoteExtraMinWithDate} from '../models/notes';
import {TagFull, TagExtraMin, TagAlmostMin} from '../models/tags';
import {Utils} from '../public/utils';


/*
  Generated class for the AtticCacheProvider provider.

  See https://angular.io/docs/ts/latest/guide/dependency-injection.html
  for more info on providers and Angular DI.
*/
@Injectable()
export class AtticCache {

  private cachedExtraMinNotes: NoteExtraMinWithDate[] = null;
  private cachedFullNotes: NoteFull[] = null;
  private cachedAlmostMinTags:TagAlmostMin[]=null;
  private cachedFullTags:TagFull[]=null;




  constructor(/*public http: Http*/) {
    this.cachedFullTags = [];
    this.cachedFullNotes = [];
    this.cachedAlmostMinTags = [];
    this.cachedExtraMinNotes = [];
    console.log('Hello AtticCacheProvider Provider');
  }

  //using ascendingCompare for extra min make the sort suitable for every class.

  public pushToCachedFullTags(tag:TagFull){
    Utils.binaryArrayInsert(this.cachedFullTags, tag, TagExtraMin.ascendingCompare);
  }

  public pushToCachedFullNotes(note:NoteFull){
    Utils.binaryArrayInsert(this.cachedFullNotes, note, NoteExtraMin.ascendingCompare);
  }

  public pushToCachedAlmostMinTags(tag:TagAlmostMin){
    Utils.binaryArrayInsert(this.cachedAlmostMinTags, tag, TagExtraMin.ascendingCompare);
  }

  public pushToCachedExtraMinNote(note:NoteExtraMinWithDate){
    Utils.binaryArrayInsert(this.cachedExtraMinNotes, note, NoteExtraMin.ascendingCompare);
  }


  public pushAllToCachedFullTags(tags:TagFull[]){
    this.cachedFullTags = [];
    for(let tag of tags){
      Utils.binaryArrayInsert(this.cachedFullTags, tag, TagExtraMin.ascendingCompare);
    }
  }

  public pushAllToCachedFullNotes(notes:NoteFull[]){
    this.cachedFullNotes = [];
    for(let note of notes){
      Utils.binaryArrayInsert(this.cachedFullNotes, note, NoteExtraMin.ascendingCompare);
    }
  }

  public pushAllToCachedAlmostMinTags(tags:TagAlmostMin[]){
    this.cachedAlmostMinTags = [];
    for(let tag of tags){
      Utils.binaryArrayInsert(this.cachedFullTags, tag, TagExtraMin.ascendingCompare);
    }
  }

  public pushAllToCachedExtraMinNote(notes:NoteExtraMinWithDate[]){
    this.cachedExtraMinNotes = [];
    for(let note of notes){
      Utils.binaryArrayInsert(this.cachedExtraMinNotes, note, NoteExtraMin.ascendingCompare);
    }
  }


  // public pushAllToCachedFullTags(tags:TagFull[]){
  //   for(let tag of tags){
  //     Utils.binaryArrayInsert(this.cachedFullTags, tag, TagExtraMin.ascendingCompare);
  //   }
  // }
  //
  // public pushAllToCachedFullNotes(notes:NoteFull[]){
  //   for(let note of notes){
  //     Utils.binaryArrayInsert(this.cachedFullNotes, note, NoteExtraMin.ascendingCompare);
  //   }
  // }
  //
  // public pushAllToCachedAlmostMinTags(tags:TagAlmostMin[]){
  //   for(let tag of tags){
  //     Utils.binaryArrayInsert(this.cachedFullTags, tag, TagExtraMin.ascendingCompare);
  //   }
  // }
  //
  // public pushAllToCachedExtraMinNote(notes:NoteExtraMinWithDate[]){
  //   for(let note of notes){
  //     Utils.binaryArrayInsert(this.cachedExtraMinNotes, note, NoteExtraMin.ascendingCompare);
  //   }
  // }



  public getCachedFullTags():TagFull[]{
    return this.cachedFullTags;
  }

  public getCachedFullNotes():NoteFull[]{
    return this.cachedFullNotes;
  }

  public getCachedAlmostMinTags():TagAlmostMin[]{
    return this.cachedAlmostMinTags;
  }

  public getCachedExtraMinNote():NoteExtraMinWithDate[]{
    return this.cachedExtraMinNotes;
  }

  public AreExtraMinNotesEmpty():boolean{
    return this.cachedExtraMinNotes.length==0;
  }

  public AreAlmostMinTagsEmpty():boolean{
    return this.cachedAlmostMinTags.length==0;
  }

  public AreFullNotesEmpty():boolean{
    return this.cachedFullNotes.length==0;
  }

  public AreFullTagsEmpty():boolean{
    return this.cachedFullTags.length==0;
  }

}
