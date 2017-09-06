import { Injectable } from '@angular/core';
// import { Http } from '@angular/http';
// import 'rxjs/add/operator/map';
import {NoteFull, NoteExtraMin, NoteExtraMinWithDate} from '../models/notes';
import {TagFull, TagExtraMin, TagAlmostMin} from '../models/tags';
import {Utils} from '../public/utils';
//import { UserSummary } from '../models/user_summary';


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

  // private summary:UserSummary = null;


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

  private pushToCachedAlmostMinTags(tag:TagAlmostMin){
    if(tag!=null){
      Utils.binaryArrayInsertNoDuplicate(this.cachedAlmostMinTags, tag, TagExtraMin.ascendingCompare);
    }
  }

  private pushToCachedExtraMinNote(note:NoteExtraMin){
    if(note!=null){
      Utils.binaryArrayInsertNoDuplicate(this.cachedExtraMinNotes, note, NoteExtraMin.ascendingCompare);
    }
  }


  private pushToDifferentlySortedCachedAlmostMinTags(tag:TagAlmostMin){
    if(tag!=null){
      Utils.binaryArrayInsertNoDuplicate(this.differentlySortedCachedAlmostMinTags, tag, TagAlmostMin.descendingCompare);
    }
  }

  private pushToDifferentlySortedCachedExtraMinNote(note:NoteExtraMin){
    if(note!=null){
      Utils.binaryArrayInsertNoDuplicate(this.differentlySortedCachedExtraMinNotes, note, NoteExtraMinWithDate.descendingCompare);
    }
  }



  // public pushAllToCachedFullTags(tags:TagFull[], searchForDuplicate:boolean){
  //   if(tags!=null){
  //     this.cachedFullTags = [];
  //     for(let tag of tags){
  //       if(!searchForDuplicate){
  //         Utils.binaryArrayInsert(this.cachedFullTags, tag, TagExtraMin.ascendingCompare);
  //       }else{
  //         Utils.binaryArrayInsertNoDuplicate(this.cachedFullTags, tag, TagExtraMin.ascendingCompare);
  //       }
  //     }
  //   }
  // }
  //
  // public pushAllToCachedFullNotes(notes:NoteFull[], searchForDuplicate:boolean){
  //   if(notes!=null){
  //     this.cachedFullNotes = [];
  //     for(let note of notes){
  //       if(!searchForDuplicate){
  //         Utils.binaryArrayInsert(this.cachedFullNotes, note, NoteExtraMin.ascendingCompare);
  //       }else{
  //         Utils.binaryArrayInsertNoDuplicate(this.cachedFullNotes, note, NoteExtraMin.ascendingCompare);
  //       }
  //     }
  //   }
  // }
  //
  private pushAllToCachedAlmostMinTags(tags:TagAlmostMin[], searchForDuplicate:boolean){
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

  private pushAllToCachedExtraMinNote(notes:NoteExtraMin[], searchForDuplicate:boolean){
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
      //console.log('what I\'m going to push:');console.log(JSON.stringify(notes));
      this.differentlySortedCachedExtraMinNotes = [];
      this.differentlySortedCachedExtraMinNotes = notes;
      this.pushAllToCachedExtraMinNote(notes.slice(), false);
      //console.log('the new NoteExtraMinWithDate:');console.log(JSON.stringify(this.differentlySortedCachedExtraMinNotes));
    }
  }

  public pushAllToDifferentlySortedCachedAlmostMinTags(tags:TagAlmostMin[]){
    if(tags!=null){
      // console.log('what i\'m going to push:\n'+JSON.stringify(tags));
      this.differentlySortedCachedAlmostMinTags = [];
      this.differentlySortedCachedAlmostMinTags = tags;
      this.pushAllToCachedAlmostMinTags(tags.slice(), false);
      // console.log('the new TagAlmostMin:\n'+JSON.stringify(this.differentlySortedCachedAlmostMinTags));
    }
  }



  public pushNoteFullToAll(note:NoteFull):void{
    // console.log('the diff');console.log(JSON.stringify(this.differentlySortedCachedExtraMinNotes));
    // console.log('the note');console.log(JSON.stringify(note as NoteExtraMinWithDate));
    if(note!=null){
      // try{
        Utils.binaryArrayInsertNoDuplicate(this.differentlySortedCachedExtraMinNotes, note.forceCastToNoteExtraMinWithDate(), NoteExtraMinWithDate.descendingCompare);
        // console.log('inserted into diff notes');
        // console.log(JSON.stringify(this.differentlySortedCachedExtraMinNotes));
      // }catch(e){
      //   console.log('error in differently');console.log(JSON.stringify(e.message));
      // }
      // try{
        Utils.binaryArrayInsertNoDuplicate(this.cachedExtraMinNotes, note.forceCastToNoteExtraMin(), NoteExtraMin.ascendingCompare);
      //   console.log('inserted into extra min');
      // }catch(e){
      //   console.log('error in extra min');console.log(JSON.stringify(e));
      // }
      // try{
        Utils.binaryArrayInsertNoDuplicate(this.cachedFullNotes, note, NoteExtraMin.ascendingCompare);
      //   console.log('inserted in full');
      // }catch(e){
      //   console.log('error in full');console.log(JSON.stringify(e));
      // }
    }
  }


  public pushTagFullToAll(tag:TagFull):void{
    if(tag!=null){
      console.log('before insert');
      console.log(JSON.stringify(this.differentlySortedCachedAlmostMinTags));
      console.log(JSON.stringify(this.cachedFullTags));
      console.log(JSON.stringify(this.cachedAlmostMinTags));
      // console.log('before insert in diff:');console.log(JSON.stringify(this.differentlySortedCachedAlmostMinTags));
      Utils.binaryArrayInsertNoDuplicate(this.differentlySortedCachedAlmostMinTags, tag.forceCastToTagAlmostMin(), TagAlmostMin.descendingCompare);
      // console.log('afetr insert in diff:');console.log(JSON.stringify(this.differentlySortedCachedAlmostMinTags));
      Utils.binaryArrayInsertNoDuplicate(this.cachedAlmostMinTags, tag.forceCastToTagAlmostMin(), TagAlmostMin.ascendingCompare);
      Utils.binaryArrayInsertNoDuplicate(this.cachedFullTags, tag, TagAlmostMin.ascendingCompare);
      console.log('post insert');
      console.log(JSON.stringify(this.differentlySortedCachedAlmostMinTags));
      console.log(JSON.stringify(this.cachedFullTags));
      console.log(JSON.stringify(this.cachedAlmostMinTags));
    }
  }


  // public setSummary(summary:UserSummary):void{
  //   if(this.summary==null){
  //     this.summary=summary;
  //   }
  //   else if(!this.summary.equals(summary)){
  //     this.summary=summary;
  //   }
  // }

  // public getSummary():UserSummary{
  //   return this.summary;
  // }

  private getIndexOfNoteFull(note:NoteExtraMin):number{
    console.log('the note extra min to search is');console.log(JSON.stringify(note));
    return Utils.binarySearch(this.cachedFullNotes, note, NoteExtraMin.ascendingCompare);
  }

  private getIndexOfTagFull(tag:TagExtraMin):number{
    return Utils.binarySearch(this.cachedFullTags, tag, TagExtraMin.ascendingCompare);
  }

  private getIndexOfNoteFromDifferentlyCachedNotes(note:NoteExtraMinWithDate):number{
    let index:number;
    index = Utils.binarySearch(this.differentlySortedCachedExtraMinNotes, note, NoteExtraMinWithDate.descendingCompare);
    // console.log('the index is'+index);
    return index;
  }

  private getIndexOfTagFromDifferentlyCachedTags(tag:TagAlmostMin):number{
    return Utils.binarySearch(this.differentlySortedCachedAlmostMinTags, tag, TagAlmostMin.descendingCompare);
  }

  private getIndexOfNoteFromExtraMin(note:NoteExtraMin):number{
    return Utils.binarySearch(this.cachedExtraMinNotes, note, NoteExtraMin.ascendingCompare);
  }

  private getIndexOfTagFromAlmostMin(tag:TagExtraMin):number{
    return Utils.binarySearch(this.cachedAlmostMinTags, tag, TagExtraMin.ascendingCompare);
  }


  public getNoteFullOrNull(note:NoteExtraMin):NoteFull{
    let res:NoteFull=null;
    let n:number = /*Utils.binarySearch(this.cachedFullNotes, note, NoteExtraMin.ascendingCompare);*/
      this.getIndexOfNoteFull(note);
    if(n!=-1){
      res = this.cachedFullNotes[n];
    }
    console.log('the note found is');console.log(JSON.stringify(res));
    return res;
  }

  public getTagFullOrNull(tag:TagExtraMin):TagFull{
    let res:TagFull=null;
    let n:number = /*Utils.binarySearch(this.cachedFullTags, tag, TagExtraMin.ascendingCompare);*/
      this.getIndexOfTagFull(tag);
    if(n!=-1){
      res = this.cachedFullTags[n];
    }
    return res;
  }


  // //is it necessary...?
  // public getNoteExtraMinOrNull(note:NoteExtraMin):NoteExtraMin{
  //   let res:NoteExtraMin=null;
  //   let n:number = Utils.binarySearch(this.cachedExtraMinNotes, note, NoteExtraMin.ascendingCompare);
  //   if(n!=-1){
  //     res = this.cachedExtraMinNotes[n];
  //   }
  //   return res;
  // }
  //
  // public getTagAlmostMinOrNull(tag:TagExtraMin):TagAlmostMin{
  //   let res:TagAlmostMin=null;
  //   let n:number = Utils.binarySearch(this.cachedAlmostMinTags, tag, TagExtraMin.ascendingCompare);
  //   if(n!=-1){
  //     res = this.cachedAlmostMinTags[n];
  //   }
  //   return res;
  // }


  // private getIndexOfTagAlmostMin(tag:TagExtraMin):number{
  //   return Utils.binarySearch(this.cachedAlmostMinTags, tag, TagExtraMin.ascendingCompare);
  // }
  //
  // private getIndexOfTagAlmostMinInDifferentlyCached(tag:TagAlmostMin):number{
  //
  // }

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


  public changeNoteTitle(note:NoteExtraMinWithDate, newTitle:string/*, upsert:boolean*/,lastmod:Date):void{
    // let n1:number = /*Utils.binarySearch(this.cachedExtraMinNotes, note, NoteExtraMin.ascendingCompare);*/
    //   this.getIndexOfNoteFromExtraMin(note);
    // if(n1!=-1){
    //   this.cachedExtraMinNotes[n1].title = newTitle;
    // }
    // let n2:number = /*Utils.binarySearch(this.cachedFullNotes, note, NoteExtraMin.ascendingCompare);*/
    //   this.getIndexOfNoteFull(note);
    // if(n2!=-1){
    //   this.cachedFullNotes[n2].title=newTitle;
    // }
    // let n3:number = /*Utils.binarySearch(this.differentlySortedCachedExtraMinNotes, note, NoteExtraMinWithDate.descendingCompare);*/
    //   this.getIndexOfNoteFromDifferentlyCachedNotes(note)
    // if(n3!=-1){
    //   this.differentlySortedCachedExtraMinNotes[n3].title=newTitle;
    // }
    // if(upsert){
    let oldExtra:NoteExtraMinWithDate = new NoteExtraMinWithDate({title:note.title, lastmodificationdate: lastmod});
    //oldExtra.lastmodificationdate=lastmod;
    // console.log('before changing title');
    // console.log(JSON.stringify(this.differentlySortedCachedExtraMinNotes));
    // console.log(JSON.stringify(this.cachedExtraMinNotes));
    // console.log(JSON.stringify(this.cachedFullNotes));
    // console.log('the note in is:');console.log(JSON.stringify(note));
    let n1:boolean = this.removeNoteFromNotesExtraMin(note);
    let n2:boolean = this.removeNoteFromNotesFull(note);
    let n3:boolean = this.removeNoteFromDifferentlyCachedNotes(oldExtra);
    // console.log(JSON.stringify([n1, n2, n3]));
      note.title=newTitle;
      if(n1){
        this.pushToCachedExtraMinNote(note);
      }
      if(n2 && note instanceof NoteFull){
        this.pushToCachedFullNotes(note as NoteFull);
      }
      if(n3){
        this.pushToDifferentlySortedCachedExtraMinNote(note);
      }
    // }
    // console.log('post changing title');
    // console.log(JSON.stringify(this.differentlySortedCachedExtraMinNotes));
    // console.log(JSON.stringify(this.cachedExtraMinNotes));
    // console.log(JSON.stringify(this.cachedFullNotes));
  }


  // public updateTag2(tag:TagFull, newTitle?:string, oldNoteslength?:number):void{
  //   console.log('tag in is:');console.log(JSON.stringify(tag));
  //   let oldMin:TagAlmostMin = new TagAlmostMin(tag.title);
  //   if(oldNoteslength!=null){
  //     oldMin.noteslength=oldNoteslength;
  //   }else{
  //     oldMin.noteslength=tag.noteslength;
  //   }
  //   let n1:boolean = this.removeTagFromAlmostMin(tag);
  //   let n2:boolean = this.removeTagFromTagFull(tag);
  //   let n3:boolean = this.removeTagFromDifferentlyCachedTags(oldMin);
  //   console.log(JSON.stringify([n1, n2, n3]));
  //   console.log('before changing title');
  //   console.log(JSON.stringify(this.differentlySortedCachedAlmostMinTags));
  //   console.log(JSON.stringify(this.cachedAlmostMinTags));
  //   console.log(JSON.stringify(this.cachedFullTags));
  //   if(newTitle!=null){
  //     tag.title=newTitle;
  //   }
  //   if(n1){
  //     this.pushToCachedAlmostMinTags(tag.forceCastToTagAlmostMin());
  //   }
  //   if(n2){
  //     this.pushToCachedFullTags(tag);
  //   }
  //   if(n3){
  //     this.pushToDifferentlySortedCachedAlmostMinTags(tag.forceCastToTagAlmostMin());
  //   }
  //   console.log('post changing title');
  //   console.log(JSON.stringify(this.differentlySortedCachedAlmostMinTags));
  //   console.log(JSON.stringify(this.cachedAlmostMinTags));
  //   console.log(JSON.stringify(this.cachedFullTags));
  // }



  public changeTagTitle(tag:TagAlmostMin, newTitle:string/*, upsert:boolean*/):void{
    // let n1:number = /*Utils.binarySearch(this.cachedAlmostMinTags, tag, TagAlmostMin.ascendingCompare);*/
    //   this.getIndexOfTagFromAlmostMin(tag);
    // if(n1!=-1){
    //   this.cachedAlmostMinTags[n1].title = newTitle;
    // }
    // let n2:number = /*Utils.binarySearch(this.cachedFullTags, tag, TagAlmostMin.ascendingCompare);*/
    //   this.getIndexOfTagFull(tag);
    // if(n2!=-1){
    //   this.cachedFullTags[n2].title=newTitle;
    // }
    // let n3:number = /*Utils.binarySearch(this.differentlySortedCachedAlmostMinTags, tag, TagAlmostMin.descendingCompare);*/
    //   this.getIndexOfTagFromDifferentlyCachedTags(tag);
    // if(n3!=-1){
    //   this.differentlySortedCachedAlmostMinTags[n3].title=newTitle;
    // }
    // if(upsert){
    let oldMin:TagAlmostMin = new TagAlmostMin({title:tag.title, noteslength:tag.noteslength});
    //oldMin.noteslength=tag.noteslength;
    let n1:boolean = this.removeTagFromAlmostMin(tag);
    let n2:boolean = this.removeTagFromTagFull(tag);
    let n3:boolean = this.removeTagFromDifferentlyCachedTags(oldMin);
      tag.title=newTitle;
      if(n1){
        this.pushToCachedAlmostMinTags(tag);
      }
      if(n2 && tag instanceof TagFull){
        this.pushToCachedFullTags(tag as TagFull);
      }
      if(n3){
        this.pushToDifferentlySortedCachedAlmostMinTags(tag);
      }
    // }
    // console.log('post changing title');
    // console.log(JSON.stringify(this.differentlySortedCachedAlmostMinTags));
    // console.log(JSON.stringify(this.cachedAlmostMinTags));
    // console.log(JSON.stringify(this.cachedFullTags));
  }
  //
  //
  //
  // public updateTag(tag:TagFull/*, upsert:boolean*/,oldNoteslength:number):void{
  //   // let n1:number = /*Utils.binarySearch(this.cachedAlmostMinTags, tag, TagAlmostMin.ascendingCompare);*/
  //   //   this.getIndexOfTagFromAlmostMin(tag);
  //   // if(n1!=-1){
  //   //   this.cachedAlmostMinTags[n1].title = newTitle;
  //   // }
  //   // let n2:number = /*Utils.binarySearch(this.cachedFullTags, tag, TagAlmostMin.ascendingCompare);*/
  //   //   this.getIndexOfTagFull(tag);
  //   // if(n2!=-1){
  //   //   this.cachedFullTags[n2].title=newTitle;
  //   // }
  //   // let n3:number = /*Utils.binarySearch(this.differentlySortedCachedAlmostMinTags, tag, TagAlmostMin.descendingCompare);*/
  //   //   this.getIndexOfTagFromDifferentlyCachedTags(tag);
  //   // if(n3!=-1){
  //   //   this.differentlySortedCachedAlmostMinTags[n3].title=newTitle;
  //   // }
  //   // if(upsert){
  //   let oldMin:TagAlmostMin = new TagAlmostMin(tag.title);
  //   oldMin.noteslength=oldNoteslength;
  //   let n1:boolean = this.removeTagFromAlmostMin(tag);
  //   let n2:boolean = this.removeTagFromTagFull(tag);
  //   let n3:boolean = this.removeTagFromDifferentlyCachedTags(oldMin);
  //
  //     if(n1){
  //       this.pushToCachedAlmostMinTags(tag);
  //     }
  //     if(n2 && tag instanceof TagFull){
  //       this.pushToCachedFullTags(tag as TagFull);
  //     }
  //     if(n3){
  //       this.pushToDifferentlySortedCachedAlmostMinTags(tag);
  //     }
  //   // }
  //   // console.log('post changing title');
  //   // console.log(JSON.stringify(this.differentlySortedCachedAlmostMinTags));
  //   // console.log(JSON.stringify(this.cachedAlmostMinTags));
  //   // console.log(JSON.stringify(this.cachedFullTags));
  // }



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
    return this.cachedFullTags==null ? [] : this.cachedFullTags;
  }

  public getCachedFullNotes():NoteFull[]{
    return this.cachedFullNotes==null ? [] : this.cachedFullNotes;
  }

  public getCachedAlmostMinTags():TagAlmostMin[]{
    return this.cachedAlmostMinTags==null ? [] : this.cachedAlmostMinTags;
  }

  public getCachedExtraMinNote():NoteExtraMin[]{
    return this.cachedExtraMinNotes==null ? [] : this.cachedExtraMinNotes;
  }

  public getDifferentlySortedCachedNotesExtraMin():NoteExtraMinWithDate[]{
    return this.differentlySortedCachedExtraMinNotes==null ? [] : this.differentlySortedCachedExtraMinNotes;
  }

  public getDifferentlySortedCachedTagAlmostMin():TagAlmostMin[]{
    return this.differentlySortedCachedAlmostMinTags==null ? [] : this.differentlySortedCachedAlmostMinTags;
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

  // public isSummaryEmpty():boolean{
  //   return this.summary==null;
  // }


  private removeNoteFromDifferentlyCachedNotes(note:NoteExtraMin):boolean{
    let ret:boolean=false;
    let n3:number=-1;
    if((note instanceof NoteExtraMinWithDate || note instanceof NoteFull) && note.lastmodificationdate!=null){
      n3 = /*Utils.binarySearch(this.differentlySortedCachedExtraMinNotes, note as NoteExtraMinWithDate, NoteExtraMinWithDate.descendingCompare);*/
        this.getIndexOfNoteFromDifferentlyCachedNotes(note);
    }else{
      n3 = Utils.search(this.differentlySortedCachedExtraMinNotes, note, NoteExtraMin.ascendingCompare);
    }
    if(n3!=-1){
      ret=true;
      this.differentlySortedCachedExtraMinNotes.splice(n3, 1);
    }
    return ret;
  }

  private removeNoteFromNotesFull(note:NoteExtraMin):boolean{
    let ret:boolean=false;
    let n1:number = this.getIndexOfNoteFull(note);
    if(n1!=-1){
      ret=true;
      this.cachedFullNotes.splice(n1, 1);
    }
    return ret;
  }

  private removeNoteFromNotesExtraMin(note:NoteExtraMin):boolean{
    let ret:boolean=false;
    let n1:number = this.getIndexOfNoteFromExtraMin(note);
    if(n1!=-1){
      ret=true;
      this.cachedExtraMinNotes.splice(n1, 1);
    }
    return ret;
  }


  private removeTagFromDifferentlyCachedTags(tag:TagExtraMin):boolean{
    let ret:boolean=false;
    let n3:number;
    if((tag instanceof TagAlmostMin || tag instanceof TagFull) && tag.noteslength!=null){
      n3 = this.getIndexOfTagFromDifferentlyCachedTags(tag as TagAlmostMin);
    }else{
      n3 = Utils.search(this.differentlySortedCachedAlmostMinTags, tag, TagExtraMin.ascendingCompare);
    }
    if(n3!=-1){
      ret=true;
      this.differentlySortedCachedAlmostMinTags.splice(n3, 1);
    }
    return ret;
  }


  private removeTagFromTagFull(tag:TagExtraMin):boolean{
    let ret:boolean=false;
    let n1:number = this.getIndexOfTagFull(tag);
    if(n1!=-1){
      ret=true;
      this.cachedFullTags.splice(n1, 1);
    }
    return ret;
  }

  private removeTagFromAlmostMin(tag:TagExtraMin):boolean{
    let ret:boolean=false;
    let n1:number = this.getIndexOfTagFromAlmostMin(tag);
    if(n1!=-1){
      ret=true;
      this.cachedAlmostMinTags.splice(n1, 1);
    }
    return ret;
  }


  public removeNote(note:NoteExtraMin){
    // let n3:number;
    // // console.log(typeof  note);
    // // console.log(JSON.stringify(note as NoteExtraMinWithDate));
    // if((note instanceof NoteExtraMinWithDate || note instanceof NoteFull) && note.lastmodificationdate!=null){
    //   // console.log('using binary search');
    //   n3 = Utils.binarySearch(this.differentlySortedCachedExtraMinNotes, note as NoteExtraMinWithDate, NoteExtraMinWithDate.descendingCompare);
    // }else{
    //   // console.log('using search');
    //   n3 = Utils.search(this.differentlySortedCachedExtraMinNotes, note, NoteExtraMin.ascendingCompare);
    // }
    // // console.log(n3);
    //
    // let n1:number = Utils.binarySearch(this.cachedFullNotes, note, NoteExtraMin.ascendingCompare);
    // let n2:number = Utils.binarySearch(this.cachedExtraMinNotes, note, NoteExtraMin.ascendingCompare);
    // //let n3:number = Utils.binarySearch(this.differentlySortedCachedExtraMinNotes, note, NoteExtraMinWithDate.descendingCompare);
    // if(n1!=-1){
    //   this.cachedFullNotes.splice(n1, 1);
    // }
    // if(n2!=-1){
    //   this.cachedExtraMinNotes.splice(n2, 1);
    // }
    // if(n3!=-1){
    //   // console.log('going to delete');
    //   this.differentlySortedCachedExtraMinNotes.splice(n3, 1);
    //   // console.log('deleted');
    //   // console.log(JSON.stringify(this.differentlySortedCachedExtraMinNotes));
    // }
    this.removeNoteFromDifferentlyCachedNotes(note);
    this.removeNoteFromNotesFull(note);
    this.removeNoteFromNotesExtraMin(note);
  }


  public removeTag(tag:TagAlmostMin){
    // let n1:number = Utils.binarySearch(this.cachedFullTags, tag, TagExtraMin.ascendingCompare);
    // let n2:number = Utils.binarySearch(this.cachedAlmostMinTags, tag, TagExtraMin.ascendingCompare);
    // let n3:number = Utils.binarySearch(this.differentlySortedCachedAlmostMinTags, tag, TagAlmostMin.descendingCompare);
    // if(n1!=-1){
    //   this.cachedFullTags.splice(n1, 1);
    // }
    // if(n2!=-1){
    //   this.cachedAlmostMinTags.splice(n2, 1);
    // }
    // if(n3!=-1){
    //   this.differentlySortedCachedAlmostMinTags.splice(n3, 1);
    // }
    this.removeTagFromDifferentlyCachedTags(tag);
    this.removeTagFromTagFull(tag);
    this.removeTagFromAlmostMin(tag);
  }



  public moveToHeadDifferentlyCachedNotes(note:NoteExtraMinWithDate, lastmod:Date, throwError:boolean){
    // this.removeNote(note);
    // this.cachedFullNotes.unshift(note);
    // this.cachedExtraMinNotes.

    let oldExtra: NoteExtraMinWithDate = new NoteExtraMinWithDate({title:note.title, lastmodificationdate:lastmod});

    if(NoteExtraMinWithDate.descendingCompare(note, this.differentlySortedCachedExtraMinNotes[0])<=0){
      console.log('ok modification allowed');
      //
      // console.log('before remove:');console.log(JSON.stringify(this.differentlySortedCachedExtraMinNotes));
      // try{
        this.removeNoteFromDifferentlyCachedNotes(oldExtra);
      //   console.log('after remove:');console.log(JSON.stringify(this.differentlySortedCachedExtraMinNotes));
      // }catch(e){console.log(JSON.stringify(e));console.log(JSON.stringify(e.message))}
      this.differentlySortedCachedExtraMinNotes.unshift(note);
      // console.log('after adding:');console.log(JSON.stringify(this.differentlySortedCachedExtraMinNotes));
    }else{
      console.log('modification not allowed');
      if(throwError){
        throw new Error('you cannot move to head');
      }
    }

  }

  public moveToHeadDifferentlyCachedTags(tag:TagAlmostMin, throwError:boolean){
    if(TagAlmostMin.descendingCompare(tag, this.differentlySortedCachedAlmostMinTags[0])<=0){
      console.log('ok modification allowed');
      this.removeTagFromDifferentlyCachedTags(tag);
      this.differentlySortedCachedAlmostMinTags.unshift(tag);
    }else{
      console.log('modification not allowed');
      if(throwError){
        throw new Error('you cannot move to head');
      }
    }
  }

  public updateNote(note:NoteFull, moveToHead:boolean, throwError:boolean, lastmod: Date){
    let n:number = this.getIndexOfNoteFull(note);
    if(n!=-1){
      if(this.cachedFullNotes[n].title!=note.title){
        throw new Error('you cannot change the title');
      }
      //console.log('before insert');console.log(JSON.stringify(this.cachedFullNotes));
      this.cachedFullNotes[n]=note;
      //console.log('post insert');console.log(JSON.stringify(this.cachedFullNotes));
    }else{
      if(throwError){
        throw new Error('note not found');
      }else{console.log('note not found');}
    }
    if(moveToHead){
      // let noteExtraMin:NoteExtraMinWithDate = new NoteExtraMinWithDate();
      // noteExtraMin.title = note.title;
      // noteExtraMin.lastmodificationdate = lastmod;
      this.moveToHeadDifferentlyCachedNotes(note.forceCastToNoteExtraMinWithDate(),lastmod, true);
    }
  }



  // public updateTag(tag:TagFull,moveToHead:boolean, throwError?:boolean){
  //   let n:number = this.getIndexOfTagFull(tag);
  //   if(n!=-1){
  //     if(this.cachedFullTags[n].title!=tag.title){
  //       throw new Error('you cannot change the title');
  //     }
  //     this.cachedFullTags[n]=tag;
  //   }else{
  //     if(throwError){
  //       throw new Error('tag not found');
  //     }else{console.log('tag not found');}
  //   }
  //   if(moveToHead){
  //     this.moveToHeadDifferentlyCachedTags(tag.forceCastToTagAlmostMin(), true);
  //   }
  // }



  public clean():void{
    // this.differentlySortedCachedExtraMinNotes=[];
    // this.cachedExtraMinNotes=[];
    // this.cachedFullNotes=[];
    this.invalidateNotes();

    // this.differentlySortedCachedAlmostMinTags=[];
    // this.cachedAlmostMinTags=[];
    // this.cachedFullTags=[];
    this.invalidateTags();
  }

  public invalidateNotes(){
    this.differentlySortedCachedExtraMinNotes=[];
    this.cachedExtraMinNotes=[];
    this.cachedFullNotes=[];
  }


  public invalidateTags(){
    this.differentlySortedCachedAlmostMinTags=[];
    this.cachedFullTags=[];
    this.cachedAlmostMinTags=[];
  }

  public invalidateFullNotes(){
    this.cachedFullNotes=[];
  }


}
