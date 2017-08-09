import { Injectable } from '@angular/core';
// import { Http } from '@angular/http';
// import 'rxjs/add/operator/map';
import {NoteFull, NoteExtraMin, NoteExtraMinWithDate} from '../models/notes';
import {TagFull, TagExtraMin, TagAlmostMin} from '../models/tags';
import {Utils} from '../public/utils';
import { UserSummary } from '../models/user_summary';


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


  //especially for the min
  private differentlySortedCachedExtraMinNotes: NoteExtraMinWithDate[] = null;
  private differentlySortedCachedAlmostMinTags: TagAlmostMin[] =null;

  private summary:UserSummary = null;


//TODO when insert single item before check that it's not present.
//TODO add an option to not sort, but I don't think it's valid.

  constructor(/*public http: Http*/) {
    this.cachedFullTags = [];
    this.cachedFullNotes = [];
    this.cachedAlmostMinTags = [];
    this.cachedExtraMinNotes = [];
    this.differentlySortedCachedExtraMinNotes = [];
    this.differentlySortedCachedAlmostMinTags = [];
    //this.summary = new UserSummary(); must be kept to null
    console.log('Hello AtticCacheProvider Provider');
  }

  //using ascendingCompare for extra min make the sort suitable for every class.

  public pushToCachedFullTags(tag:TagFull){
    if(tag!=null){
      Utils.binaryArrayInsertNoDuplicate(this.cachedFullTags, tag, TagExtraMin.ascendingCompare);
    }
  }

  public pushToCachedFullNotes(note:NoteFull){
    if(note!=null){
      Utils.binaryArrayInsertNoDuplicate(this.cachedFullNotes, note, NoteExtraMin.ascendingCompare);
    }
  }

  public pushToCachedAlmostMinTags(tag:TagAlmostMin){
    if(tag!=null){
      Utils.binaryArrayInsertNoDuplicate(this.cachedAlmostMinTags, tag, TagExtraMin.ascendingCompare);
    }
  }

  public pushToCachedExtraMinNote(note:NoteExtraMin){
    if(note!=null){
      Utils.binaryArrayInsertNoDuplicate(this.cachedExtraMinNotes, note, NoteExtraMin.ascendingCompare);
    }
  }


  public pushToDifferentlySortedCachedAlmostMinTags(tag:TagAlmostMin){
    if(tag!=null){
      Utils.binaryArrayInsertNoDuplicate(this.differentlySortedCachedAlmostMinTags, tag, TagAlmostMin.descendingCompare);
    }
  }

  public pushToDifferentlySortedCachedExtraMinNote(note:NoteExtraMin){
    if(note!=null){
      Utils.binaryArrayInsertNoDuplicate(this.differentlySortedCachedExtraMinNotes, note, NoteExtraMinWithDate.descendingCompare);
    }
  }



  public pushAllToCachedFullTags(tags:TagFull[], searchForDuplicate:boolean){
    if(tags!=null){
      this.cachedFullTags = [];
      for(let tag of tags){
        if(!searchForDuplicate){
          Utils.binaryArrayInsert(this.cachedFullTags, tag, TagExtraMin.ascendingCompare);
        }else{
          Utils.binaryArrayInsertNoDuplicate(this.cachedFullTags, tag, TagExtraMin.ascendingCompare);
        }
      }
    }
  }

  public pushAllToCachedFullNotes(notes:NoteFull[], searchForDuplicate:boolean){
    if(notes!=null){
      this.cachedFullNotes = [];
      for(let note of notes){
        if(!searchForDuplicate){
          Utils.binaryArrayInsert(this.cachedFullNotes, note, NoteExtraMin.ascendingCompare);
        }else{
          Utils.binaryArrayInsertNoDuplicate(this.cachedFullNotes, note, NoteExtraMin.ascendingCompare);
        }
      }
    }
  }

  public pushAllToCachedAlmostMinTags(tags:TagAlmostMin[], searchForDuplicate:boolean){
    if(tags!=null){
      this.cachedAlmostMinTags = [];
      for(let tag of tags){
        if(!searchForDuplicate){
          Utils.binaryArrayInsert(this.cachedAlmostMinTags, tag, TagExtraMin.ascendingCompare);
        }else{
          Utils.binaryArrayInsertNoDuplicate(this.cachedAlmostMinTags, tag, TagExtraMin.ascendingCompare);
        }
      }
    }
  }

  public pushAllToCachedExtraMinNote(notes:NoteExtraMin[], searchForDuplicate:boolean){
    if(notes!=null){
      this.cachedExtraMinNotes = [];
      for(let note of notes){
        if(!searchForDuplicate){
          Utils.binaryArrayInsert(this.cachedExtraMinNotes, note, NoteExtraMin.ascendingCompare);
        }else{
          Utils.binaryArrayInsertNoDuplicate(this.cachedExtraMinNotes, note, NoteExtraMin.ascendingCompare);
        }
      }
    }
  }

  public pushAllToDifferentlySortedCachedExtraMinNote(notes:NoteExtraMinWithDate[]){
    if(notes!=null){
      this.differentlySortedCachedExtraMinNotes = [];
      this.differentlySortedCachedExtraMinNotes = notes;
      this.pushAllToCachedExtraMinNote(notes, false);
    }
  }

  public pushAllToDifferentlySortedCachedAlmostMinTags(tags:TagAlmostMin[]){
    if(tags!=null){
      this.differentlySortedCachedAlmostMinTags = [];
      this.differentlySortedCachedAlmostMinTags = tags;
      this.pushAllToCachedAlmostMinTags(tags, false);
    }
  }


  public setSummary(summary:UserSummary):void{
    if(this.summary==null){
      this.summary=summary;
    }
    else if(!this.summary.equals(summary)){
      this.summary=summary;
    }
  }

  public getSummary():UserSummary{
    return this.summary;
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
  // public upsertNoteFull(note:NoteFull):void{
  //   let n:number = Utils.binarySearch(this.cachedFullNotes, note, NoteExtraMin.ascendingCompare);
  //   if(n!=-1){
  //     this.cachedFullNotes[n]=note;
  //   }
  // }
  //
  //
  //
  // public upsertNoteExtraMin(note:NoteExtraMin):void{
  //   let n:number = Utils.binarySearch(this.cachedExtraMinNotes, note, NoteExtraMin.ascendingCompare);
  //   if(n!=-1){
  //     this.cachedExtraMinNotes[n]=note;
  //   }
  // }
  //
  //
  //
  // public upsertTagFull(tag:TagFull):void{
  //   let n:number = Utils.binarySearch(this.cachedFullTags, tag, TagAlmostMin.ascendingCompare);
  //   if(n!=-1){
  //     this.cachedFullTags[n]=tag;
  //   }
  // }
  //
  //
  //
  // public upsertTagAlmosttMin(tag:TagAlmostMin):void{
  //   let n:number = Utils.binarySearch(this.cachedAlmostMinTags, tag, TagAlmostMin.ascendingCompare);
  //   if(n!=-1){
  //     this.cachedAlmostMinTags[n]=tag;
  //   }
  // }


  public changeNoteTitle(note:NoteExtraMin, newTitle:string, upsert:boolean):void{
    let n1:number = Utils.binarySearch(this.cachedExtraMinNotes, note, NoteExtraMin.ascendingCompare);
    if(n1!=-1){
      this.cachedExtraMinNotes[n1].title = newTitle;
    }
    let n2:number = Utils.binarySearch(this.cachedFullNotes, note, NoteExtraMin.ascendingCompare);
    if(n2!=-1){
      this.cachedFullNotes[n2].title=newTitle;
    }
    let n3:number = Utils.binarySearch(this.differentlySortedCachedExtraMinNotes, note, NoteExtraMinWithDate.descendingCompare);
    if(n3!=-1){
      this.differentlySortedCachedExtraMinNotes[n3].title=newTitle;
    }
    if(upsert){
      note.title=newTitle;
      if(n1==-1){
        this.pushToCachedExtraMinNote(note);
      }
      if(n2==-1 && note instanceof NoteFull){
        this.pushToCachedFullNotes(note as NoteFull);
      }
      if(n3==-1){
        this.pushToDifferentlySortedCachedExtraMinNote(note);
      }
    }
  }



  public changeTagTitle(tag:TagAlmostMin, newTitle:string, upsert:boolean):void{
    let n1:number = Utils.binarySearch(this.cachedAlmostMinTags, tag, TagAlmostMin.ascendingCompare);
    if(n1!=-1){
      this.cachedAlmostMinTags[n1].title = newTitle;
    }
    let n2:number = Utils.binarySearch(this.cachedFullTags, tag, TagAlmostMin.ascendingCompare);
    if(n2!=-1){
      this.cachedFullTags[n2].title=newTitle;
    }
    let n3:number = Utils.binarySearch(this.differentlySortedCachedAlmostMinTags, tag, TagAlmostMin.descendingCompare);
    if(n3!=-1){
      this.differentlySortedCachedAlmostMinTags[n3].title=newTitle;
    }
    if(upsert){
      tag.title=newTitle;
      if(n1==-1){
        this.pushToCachedAlmostMinTags(tag);
      }
      if(n2==-1 && tag instanceof TagFull){
        this.pushToCachedFullTags(tag as TagFull);
      }
      if(n3==-1){
        this.pushToDifferentlySortedCachedAlmostMinTags(tag);
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

  public getDifferentlySortedCachedNotesExtraMin():NoteExtraMinWithDate[]{
    return this.differentlySortedCachedExtraMinNotes;
  }

  public getDifferentlySortedCachedTagAlmostMin():TagAlmostMin[]{
    return this.differentlySortedCachedAlmostMinTags;
  }

  public areExtraMinNotesEmpty():boolean{
    return (this.cachedExtraMinNotes.length==0);
  }


  public areAlmostMinTagsEmpty():boolean{
    return (this.cachedAlmostMinTags.length==0);
  }

  public areFullNotesEmpty():boolean{
    return (this.cachedFullNotes.length==0);
  }

  public areFullTagsEmpty():boolean{
    return (this.cachedFullTags.length==0);
  }

  public areDifferentlySortedCachedNotesExtraMinEmpty():boolean{
    return this.differentlySortedCachedExtraMinNotes.length==0;
  }

  public areDifferentlySortedCachedTagsAlmostMinEmpty():boolean{
    return this.differentlySortedCachedAlmostMinTags.length==0;
  }

  public isSummaryEmpty():boolean{
    return this.summary==null;
  }




  public removeNote(note:NoteExtraMin):void{
    let n3:number;
    // console.log(typeof  note);
    console.log(JSON.stringify(note as NoteExtraMinWithDate));
    if(note instanceof NoteExtraMinWithDate && note.lastmodificationdate!=null){
      console.log('using binary search');
      n3 = Utils.binarySearch(this.differentlySortedCachedExtraMinNotes, note as NoteExtraMinWithDate, NoteExtraMinWithDate.descendingCompare);
    }else{
      console.log('using search');
      n3 = Utils.search(this.differentlySortedCachedExtraMinNotes, note, NoteExtraMin.ascendingCompare);
    }
    console.log(n3);

    let n1:number = Utils.binarySearch(this.cachedFullNotes, note, NoteExtraMin.ascendingCompare);
    let n2:number = Utils.binarySearch(this.cachedExtraMinNotes, note, NoteExtraMin.ascendingCompare);
    //let n3:number = Utils.binarySearch(this.differentlySortedCachedExtraMinNotes, note, NoteExtraMinWithDate.descendingCompare);
    if(n1!=-1){
      this.cachedFullNotes.splice(n1, 1);
    }
    if(n2!=-1){
      this.cachedExtraMinNotes.splice(n2, 1);
    }
    if(n3!=-1){
      console.log('going to delete');
      this.differentlySortedCachedExtraMinNotes.splice(n3, 1);
      console.log('deleted');
      console.log(JSON.stringify(this.differentlySortedCachedExtraMinNotes));
    }
  }


  public removeTag(tag:TagAlmostMin):void{
    let n1:number = Utils.binarySearch(this.cachedFullTags, tag, TagExtraMin.ascendingCompare);
    let n2:number = Utils.binarySearch(this.cachedAlmostMinTags, tag, TagExtraMin.ascendingCompare);
    let n3:number = Utils.binarySearch(this.differentlySortedCachedAlmostMinTags, tag, TagAlmostMin.descendingCompare);
    if(n1!=-1){
      this.cachedFullTags.splice(n1, 1);
    }
    if(n2!=-1){
      this.cachedAlmostMinTags.splice(n2, 1);
    }
    if(n3!=-1){
      this.differentlySortedCachedAlmostMinTags.splice(n3, 1);
    }
  }

}
