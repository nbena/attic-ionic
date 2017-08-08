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

  private cachedExtraMinNotes: NoteExtraMin[] = null;
  private cachedFullNotes: NoteFull[] = null;
  private cachedAlmostMinTags:TagAlmostMin[]=null;
  private cachedFullTags:TagFull[]=null;


//TODO when insert single item before check that it's not present.
//TODO add an option to not sort, but I don't think it's valid.

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

  public pushToCachedExtraMinNote(note:NoteExtraMin){
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
      Utils.binaryArrayInsert(this.cachedAlmostMinTags, tag, TagExtraMin.ascendingCompare);
    }
    // console.log('the cached almost min');
    // console.log(JSON.stringify(this.cachedAlmostMinTags));
  }

  public pushAllToCachedExtraMinNote(notes:NoteExtraMin[]){
    this.cachedExtraMinNotes = [];
    for(let note of notes){
      Utils.binaryArrayInsert(this.cachedExtraMinNotes, note, NoteExtraMin.ascendingCompare);
    }
    console.log('the cached extra min');
    console.log(JSON.stringify(this.cachedExtraMinNotes));
  }


  public getNoteFullOrNull(note:NoteExtraMin):NoteFull{
    let res:NoteFull=null;
    let n:number = Utils.binarySearch(this.cachedFullNotes, note, NoteExtraMin.ascendingCompare);
    if(n!=-1){
      res = this.cachedFullNotes[n];
    }
    return res;
  }

  public getTagFullOrNull(tag:TagExtraMin):TagFull{
    let res:TagFull=null;
    let n:number = Utils.binarySearch(this.cachedFullTags, tag, TagExtraMin.ascendingCompare);
    if(n!=-1){
      res = this.cachedFullTags[n];
    }
    return res;
  }


  //is it necessary...?
  public getNoteExtraMinOrNull(note:NoteExtraMin):NoteExtraMin{
    let res:NoteExtraMin=null;
    let n:number = Utils.binarySearch(this.cachedExtraMinNotes, note, NoteExtraMin.ascendingCompare);
    if(n!=-1){
      res = this.cachedExtraMinNotes[n];
    }
    return res;
  }

  public getTagAlmostMinOrNull(tag:TagExtraMin):TagAlmostMin{
    let res:TagAlmostMin=null;
    let n:number = Utils.binarySearch(this.cachedAlmostMinTags, tag, TagExtraMin.ascendingCompare);
    if(n!=-1){
      res = this.cachedAlmostMinTags[n];
    }
    return res;
  }

  //for everything unless title.
  public upsertNoteFull(note:NoteFull):void{
    let n:number = Utils.binarySearch(this.cachedFullNotes, note, NoteExtraMin.ascendingCompare);
    if(n!=-1){
      this.cachedFullNotes[n]=note;
    }
  }



  public upsertNoteExtraMin(note:NoteExtraMin):void{
    let n:number = Utils.binarySearch(this.cachedExtraMinNotes, note, NoteExtraMin.ascendingCompare);
    if(n!=-1){
      this.cachedExtraMinNotes[n]=note;
    }
  }



  public upsertTagFull(tag:TagFull):void{
    let n:number = Utils.binarySearch(this.cachedFullTags, tag, TagAlmostMin.ascendingCompare);
    if(n!=-1){
      this.cachedFullTags[n]=tag;
    }
  }



  public upsertTagAlmosttMin(tag:TagAlmostMin):void{
    let n:number = Utils.binarySearch(this.cachedAlmostMinTags, tag, TagAlmostMin.ascendingCompare);
    if(n!=-1){
      this.cachedAlmostMinTags[n]=tag;
    }
  }


  public changeNoteTitle(note:NoteExtraMin, newTitle:string, upsert:boolean):void{
    let n1:number = Utils.binarySearch(this.cachedExtraMinNotes, note, NoteExtraMin.ascendingCompare);
    if(n1!=-1){
      this.cachedExtraMinNotes[n1].title = newTitle;
    }
    let n2:number = Utils.binarySearch(this.cachedFullNotes, note, NoteExtraMin.ascendingCompare);
    if(n2!=1){
      this.cachedFullNotes[n2].title=newTitle;
    }
    if(upsert){
      note.title=newTitle;
      if(n1==-1){
        this.pushToCachedExtraMinNote(note);
      }
      if(n2==-1 && note instanceof NoteFull){
        this.pushToCachedFullNotes(note as NoteFull);
      }
    }
  }



  public changeTagTitle(tag:TagAlmostMin, newTitle:string, upsert:boolean):void{
    let n1:number = Utils.binarySearch(this.cachedAlmostMinTags, tag, TagAlmostMin.ascendingCompare);
    if(n1!=-1){
      this.cachedAlmostMinTags[n1].title = newTitle;
    }
    let n2:number = Utils.binarySearch(this.cachedFullTags, tag, TagAlmostMin.ascendingCompare);
    if(n2!=1){
      this.cachedFullTags[n2].title=newTitle;
    }
    if(upsert){
      tag.title=newTitle;
      if(n1==-1){
        this.pushToCachedAlmostMinTags(tag);
      }
      if(n2==-1 && tag instanceof TagFull){
        this.pushToCachedFullTags(tag as TagFull);
      }
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

  public getCachedExtraMinNote():NoteExtraMin[]{
    return this.cachedExtraMinNotes;
  }

  public AreExtraMinNotesEmpty():boolean{
    return (this.cachedExtraMinNotes.length==0);
  }

  public AreAlmostMinTagsEmpty():boolean{
    return (this.cachedAlmostMinTags.length==0);
  }

  public AreFullNotesEmpty():boolean{
    return (this.cachedFullNotes.length==0);
  }

  public AreFullTagsEmpty():boolean{
    return (this.cachedFullTags.length==0);
  }

}
