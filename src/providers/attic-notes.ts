import { Injectable } from '@angular/core';
// import { Http, Headers } from '@angular/http';
/* importing auth because I need the token. */
import { Auth } from './auth';
import { DbActionNs/*, Const */} from '../public/const';
import { NoteExtraMin/*, NoteSmart,*/, NoteFull,/*NoteMin,/*, NoteBarebon,*/ NoteExtraMinWithDate } from '../models/notes';
import { Utils } from '../public/utils';
import { Db/*, LogObject*/ } from './db';
import { NetManager } from './net-manager';

import { Synch } from './synch';
// import { AtticTags } from './attic-tags';
import { TagAlmostMin, TagExtraMin, TagFull } from '../models/tags';

import { AtticCache } from './attic-cache';
import { HttpProvider } from './http';

import { AtticError } from '../public/errors';

import { /*FormControl*/AbstractControl } from '@angular/forms'

import 'rxjs/add/operator/map';

/*
  Generated class for the AtticNotes provider.

  See https://angular.io/docs/ts/latest/guide/dependency-injection.html
  for more info on providers and Angular 2 DI.
*/
@Injectable()
export class AtticNotes {

  // private cachedExtraMinNote: NoteExtraMin[] = null;
  // private cachedFullNote: NoteFull[] = null;

  constructor(public auth: Auth,
    // private atticTags: AtticTags,
    private atticCache: AtticCache,
    private db: Db, private netManager: NetManager,
    private synch: Synch,
    private http:HttpProvider
  ) {
    console.log('Hello AtticNotes Provider');
  }


  /*
  only one instance for all the pages.
  */

  public static areMainTagsArrayValid(control: /*FormControl*/AbstractControl):any{
    return ((control.value.length <= 3) ? null : {error: true});
  }

  public static areOtherTagsArrayValid(control:/*FormControl*/AbstractControl):any{
      return ((control.value.length) <= 10 ? null : {error:true});
  }

  public static verifyMainTagsOtherTagsValid(mainTags:TagExtraMin[], otherTags:TagExtraMin[]):boolean{
    // console.log('1');console.log(JSON.stringify(mainTags));console.log('2');console.log(JSON.stringify(otherTags));
    // let diff1Length:number = Utils.arrayDiff(mainTags,
    //   otherTags,
    //   (arg0:TagExtraMin, arg1:TagExtraMin):number=>{return arg0.title.localeCompare(arg1.title)}
    //   //TagExtraMin.ascendingCompare
    // ).length;
    //
    // let diff2Length:number = Utils.arrayDiff(otherTags,
    //   mainTags,
    //   //TagExtraMin.ascendingCompare
    //   (arg0:TagExtraMin, arg1:TagExtraMin):number=>{return arg0.title.localeCompare(arg1.title)}
    // ).length;
    //
    // return diff1Length!=0 && diff2Length!=0
    let valid:boolean =  true;
    // let sortedMaintags = mainTags.sort((arg0:TagExtraMin, arg1:TagExtraMin):number=>{return arg0.title.localeCompare(arg1.title)});
    // let sortedOthertags = otherTags.sort((arg0:TagExtraMin, arg1:TagExtraMin):number=>{return arg0.title.localeCompare(arg1.title)});
    // for(let i=0;i<sortedOthertags.length;i++){
    //   let index = Utils.binarySearch(sortedMaintags, sortedOthertags[i],(arg0:TagExtraMin, arg1:TagExtraMin):number=>{return arg0.title.localeCompare(arg1.title)});
    //   if(index!=-1){
    //     valid = false;
    //     i=sortedOthertags.length;
    //   }
    //
    // }
    //using a normal scan because I assume that probably we'll stop before the end,
    //and, there's no real difference between 2(13log13)+log13 and 10*3 (in fact, the first is more expensive... (30.something))
    for(let i=0;i<otherTags.length;i++){
      for(let j=0;j<mainTags.length;j++){
        if(otherTags[i].title==mainTags[j].title){
          valid = false;
          j=3; /*the limit to main tags and othertags*/
          i=10;
        }
      }
    }
    return valid;
  }
  /**
  *loading all the notes.
  */
  // loadFull(){
  //   return Utils.getBasic('/api/notes/all', this.http, this.auth.token);
  // }


  // loadNoPopulation(){
  //   return Utils.getBasic('/api/notes/all/unpop', this.http, this.auth.token);
  // }

  /*
  force: force the download from the network.
  */
  /*
  can be rewritten: an error will force a call to the network.
  */
  loadNotesMin(force: boolean):Promise<NoteExtraMinWithDate[]>{
    return new Promise<NoteExtraMinWithDate[]>((resolve, reject)=>{
      // let useForce: boolean = force;
      let useCache: boolean = false;
      let isNteworkAvailable: boolean = this.netManager.isConnected;
      let areThereNotesInTheDb: boolean;
      let useDb: boolean;
      this.db.getNotesCount(this.auth.userid)
      .then(number=>{
        areThereNotesInTheDb = (number > 0) ? true : false;
        // console.log('the numberof notes is');console.log(number);
        useDb = Utils.shouldUseDb(isNteworkAvailable, areThereNotesInTheDb, force);
        console.log('use db note: ');console.log(JSON.stringify(useDb));
        let p:Promise<NoteExtraMinWithDate[]>;
        if(useDb){
          if(!this.atticCache.areDifferentlySortedCachedNotesExtraMinEmpty()){
            useCache=true;
            console.log('using cache');
            p = Promise.resolve(this.atticCache.getDifferentlySortedCachedNotesExtraMin());
          }else{
            console.log('no cache using db');
            p = this.db.getNotesMin(this.auth.userid);
          }
        }else{
          console.log('using the network');
          p = this.http.get('/api/notes/all/min/with-date');
        }
        return p;
      })
      .then(fetchingResult=>{
        let res:NoteExtraMinWithDate[];
        if(!useDb){
          res = fetchingResult.map(obj=>{return NoteExtraMinWithDate.safeNewNoteFromJsObject(obj)});
        }else{res = fetchingResult/* as NoteExtraMinWithDate[]*/;}
        resolve(res);
        if(!this.synch.isNoteFullyLocked() && !useDb && res.length>0){ /*can insert only if lock is free*/
          this.db.insertNotesMinSmartAndCleanify(res, this.auth.userid);
          //return new Promise<NoteExtraMin[]>((resolve, reject)=>{resolve(fetchingResult)});
        }else{
          console.log('fetched notes min but it is locked (or I\'ve used db)');
        }
        if(!useCache){
          this.atticCache.pushAllToDifferentlySortedCachedExtraMinNote(res);
        }
        //}
      })
      // .then(notes=>{
      //   this.atticCache.pushAllToDifferentlySortedCachedExtraMinNote(notes as NoteExtraMinWithDate[]);
      //   // resolve(notes);
      //   console.log('added to notes');
      // })
      .catch(error=>{
        console.log('error notes:');
        console.log(JSON.stringify(error.message));
        reject(/*AtticError.getError(error)*/error);
      })
    });
  }





  private noteByTitle_loadFromNetworkAndInsert(title: string):Promise<NoteFull>{
    return new Promise<NoteFull>((resolve, reject)=>{
      this.http.get('/api/notes/'+title)
      .then(result=>{
        // console.log('the resul from network is: ');console.log(JSON.stringify(result.note));
        /*inserting in the DB.*/
        let note:NoteFull = null;
        if(result.note!=null){
          note=NoteFull.safeNewNoteFromJsObject(result.note);
          // console.log('the safe result is: ');console.log(JSON.stringify(note));
          if(!this.synch.isNoteFullyLocked()){
            this.db.insertOrUpdateNote(note, this.auth.userid); /*promise is resolved before is done.*/
          }else{
            console.log('fetched note by title but it is locked');
          }
        }
        resolve(note);
    })
    .catch(error=>{
      reject(error);
    })
  })
}

  /*
  get a full note object:
  -if request, it will search the note on the server,
    then it will download it, insert in the DB,
    then return via promise.
  -if not requested, it will initially search in the DB, if
    not present it will download it, then insert in the DB,
    then return via promise.
  */
  noteByTitle(title: string, force: boolean):Promise<NoteFull>{
    /*first check in the DB.*/
    return new Promise<NoteFull>((resolve, reject)=>{
      let areThereNotesInTheDb: boolean;
      let useDb: boolean;
      let useCache: boolean = false;
      this.db.getNotesCount(this.auth.userid)
      .then(number=>{
        areThereNotesInTheDb = (number > 0) ? true : false;
        useDb = Utils.shouldUseDb(this.netManager.isConnected, areThereNotesInTheDb, force/*, this.synch.isSynching()*/);
        // callNet = !useDb;
        console.log('use db note');console.log(JSON.stringify(useDb));
        let p:Promise<NoteFull>;
        if(useDb){
          let note:NoteFull=this.atticCache.getNoteFullOrNull(new NoteExtraMin(title));
          if(note!=null){
            console.log('the note is in the cache'); useCache=true;
            //p=new Promise<NoteFull>((resolve, reject)=>{resolve(note)});
            p=Promise.resolve(note);
          }else{
            console.log('the note is not in the cache');
            p=this.db.getNoteFull(title, this.auth.userid);
          }
        }else{
          p= this.noteByTitle_loadFromNetworkAndInsert(title);
        }
        return p;
      })
      .then(noteFull=>{
        // console.log('the notefull'+JSON.stringify(noteFull));
        if(noteFull!=null){
          // console.log('note is not null');
          resolve(noteFull);
          return Promise.resolve(noteFull);
        }else if(noteFull==null && useDb){
          console.log('trying to load from network');
          return this.noteByTitle_loadFromNetworkAndInsert(title);
        }
        // else{
        //   return Promise.resolve(noteFull); //this is important because I need to
        //   //provide a value for the next promise in order to leave the possibility to
        //   //insert to the cache.
        // }
      })
      .then(lastAttempt=>{
        // console.log('last attempt: '+JSON.stringify(lastAttempt));
        if(lastAttempt==null){
          reject(AtticError.getNewNetworkError()); //or note is not present.
        }else{
          resolve(lastAttempt);
        }
        if(!useCache){
          this.atticCache.pushToCachedFullNotes(lastAttempt);
          //this.atticCache.pushNoteFullToAll(lastAttempt);
        }
      })
      .catch(error=>{
        console.log('error in getting full note');
        console.log(JSON.stringify(error.message));
        reject(/*AtticError.getError(error)*/error);
      })
    })
  }

  /*
  force can't be used because we need to respect the log order, so the note is put into the db,
  then the log will be consumed.
  THE CONTROL ON THE NOTE WITH ANOTHER SAME TITLE MUST BE ALREADY DONE.
  */


  // private minifyNoteFullForCration(note:NoteFull):NoteFull{
  //   let noteRes:NoteFull = note;
  //   let maintags:TagExtraMin[]=noteRes.maintags.map(obj=>{return TagExtraMin.NewTag(obj.title)});
  //   let othertags:TagExtraMin[]=noteRes.othertags.map(obj=>{return TagExtraMin.NewTag(obj.title)});
  //   noteRes.maintags = maintags;
  //   noteRes.othertags = othertags;
  //   return noteRes;
  // }

  // private addTagsToNote(necessaryTags:TagFull[], note:NoteExtraMin):void{
  //   console.log('the tag');console.log(JSON.stringify(necessaryTags));
  //   necessaryTags.forEach(obj=>{
  //     let oldNoteslength:number = obj.noteslength;
  //     // obj.noteslength++;
  //     // obj.notes.push(note);
  //     this.atticCache.updateTag2(obj, null, oldNoteslength);
  //   })
  // }


  createNote2(note: NoteFull/*, tags: TagAlmostMin[]*/):Promise<void>{

    // return this.db.createNewNote2(note, tags, this.auth.userid);
    return new Promise<void>((resolve, reject)=>{
      if(!this.synch.isSynching()){

        //try to provide to the db more fulltag as possible.

        let cachedTags:TagFull[]=this.atticCache.getCachedFullTags();
        let necessaryTags:TagFull[]=Utils.binaryGetFullObjectTag(cachedTags, note.getTagsAsTagsExtraMinArray().sort(TagExtraMin.ascendingCompare)).slice();


        this.db.createNewNote2(note.getMinifiedVersionForCreation(), /*tags, */this.auth.userid, necessaryTags)
        //Promise.resolve(note)
        .then(result=>{
          // this.atticCache.pushToCachedFullNotes(note);

          this.atticCache.pushNoteFullToAll(note);
          //console.log('pushed to note full');
          // this.addTagsToNote(necessaryTags.slice(), note.forceCastToNoteExtraMin());
          if(note.maintags.length+note.othertags.length>0){
            this.atticCache.invalidateTags();
          }
          resolve();
        })
        .catch(error=>{
          reject(error/*AtticError.getBetterSqliteError(error.message as string)*/);
        })
      }else{
        // let s = new Date (Date.parse('2017-04-14T11:35:49.546Z'));
        console.log('trying to create note but it is locked');
        reject(AtticError.getSynchingError(DbActionNs.DbAction.create));
      }
    })
  }


  // notesByTag(tags: string[], force: boolean){
  //   // return Utils.postBasic('/api/notes/by-tags-no-role', JSON.stringify({tags: tags}), this.http, this.auth.token);
  //   return this.db.getNotesByTags(tags);
  // }

  /*================================================================================*/
  /*policy used here:
  if requested, go to the db and check the result.length, if it is the same
  of sum(tags.length) ok, if not, calling the network, and to the try-insert.
  The downloaded notes will be kept (TODO) and then fully downloaded.
  */

  // notesByTags_loadFromNetworkAndInsert(tags: TagAlmostMin[]):Promise<NoteExtraMin[]>{
  //   return new Promise<NoteExtraMin[]>((resolve, reject)=>{
  //     Utils.postBasic('/api/notes/by-tags-no-role', JSON.stringify({tags: tags.map((tag)=>{return tag.title})}), this.http, this.auth.token)
  //     .then(result=>{
  //       let parsedResult:NoteExtraMin[] = [];
  //       console.log('data from network is:');
  //       console.log(JSON.stringify(result));
  //       /*need to parse, it will be changed (maybe)*/
  //       for(let i=0;i<result.length;i++){
  //         let note:NoteExtraMin = new NoteExtraMin();
  //         note.title = result[i].title;
  //         parsedResult.push(note);
  //         /*note.userid = result[i].userid;*/
  //         if(!this.synch.isNoteFullyLocked()){
  //           // this.db.insertNoteMinQuietly(note, this.auth.userid);
  //           this.db.insertNotesMinSmartAndCleanify([note], this.auth.userid);
  //         }else{
  //           console.log('fetched notes by tags but it is locked');
  //         }
  //       }
  //       resolve(parsedResult);
  //     })
  //     .catch(error=>{
  //       reject(error);
  //     })
  //   })
  // }

  private static getAPINotesByTags(and:boolean){
    let res:string;
    if(and){
      res='/api/notes/by-tags/and/with-date';
    }else{
      res='/api/notes/by-tags/or/with-date';
    }
    return res;
  }

  //THIS IS DONE THROUGH THE CACHE.
  //please remember that the research is done by AND.
  notesByTag2(tags:TagAlmostMin[], and: boolean, force: boolean):Promise<NoteExtraMin[]>{
    return new Promise<NoteExtraMin[]>((resolve, reject)=>{
      let isNteworkAvailable: boolean = this.netManager.isConnected;
      let areThereNotesInTheDb: boolean;
      // let useCache: boolean = false;
      let useDb: boolean;
      let expectedResult: number = 0;
      tags.forEach((tag)=>{expectedResult+=tag.noteslength});
      /*doing this to avoid useless queries*/
      if(expectedResult == 0){
        resolve([]);
      }
      this.db.getNotesCount(this.auth.userid)
      .then(number=>{
        areThereNotesInTheDb = (number > 0) ? true : false;
        // console.log('the numberof notes is');console.log(number);
        useDb = Utils.shouldUseDb(isNteworkAvailable, areThereNotesInTheDb, force/*, this.synch.isSynching()*/);
        console.log('usedb note: ');console.log(JSON.stringify(useDb));
        let p:Promise<NoteExtraMin[]>;
        if(useDb){
          p= this.db.getNotesByTags(tags, this.auth.userid, and);
        }else{
          console.log('no notes, using the network');
          p= this.http.post(AtticNotes.getAPINotesByTags(and), JSON.stringify({tags: tags.map((tag)=>{return tag.title})}));
        }
        return p;
      })
      .then(fetchingResult=>{
        // console.log('fetchingResult is');
        // console.log(JSON.stringify(fetchingResult));
        let res:NoteExtraMin[];
        if(!useDb){
          res = fetchingResult.map(obj=>{return NoteExtraMin.safeNewNoteFromJsObject(obj);});
        }else{res=fetchingResult;}
        resolve(res)
      })
      .catch(error=>{
        console.log('error notes:');
        console.log(JSON.stringify(error));
        reject(/*AtticError.getError(error)*/error);
      })

    });
  }

  // filterNotesByTitle(notes: NoteExtraMin[], term: string):NoteExtraMin[]{
  //   return notes.filter((note)=>{
  //     return note.title.indexOf(term.toLowerCase())>-1;
  //   });
  // }

  filterNotesByTitle(notes: NoteExtraMinWithDate[], term: string):NoteExtraMinWithDate[]{
    return notes.filter((note)=>{
      return note.title.indexOf(term.toLowerCase())>-1;
    });
  }



  notesByText(text: string, force: boolean):Promise<NoteExtraMin[]>{

    return new Promise<NoteExtraMin[]>((resolve,reject)=>{
      let isNteworkAvailable: boolean = this.netManager.isConnected;
      let areThereNotesInTheDb: boolean;
      let useDb: boolean;
      // let useCache: boolean = false;
      this.db.getNotesCount(this.auth.userid)
      .then(number=>{
        areThereNotesInTheDb = (number > 0) ? true : false;
        // console.log('the numberof notes is');console.log(number);
        useDb = Utils.shouldUseDb(isNteworkAvailable, areThereNotesInTheDb, force/*, this.synch.isSynching()*/);
        console.log('usedb note: ');console.log(JSON.stringify(useDb));
        let p:Promise<NoteExtraMin[]>;
        if(useDb){
          p=this.db.getNotesByText(text, this.auth.userid);
        }else{
          console.log('no notes, using the network');
          p= this.http.post('/api/notes/by-text', JSON.stringify({note:{text:text}}));
        }
        return p;
      })
      .then(fetchingResult=>{
        let res:NoteExtraMin[];
        if(!useDb){
          res = fetchingResult.map(obj=>{return NoteExtraMin.safeNewNoteFromJsObject(obj);});
        }else{res=fetchingResult;}
        console.log('the notes by text are: ');console.log(JSON.stringify(res));
        resolve(res);
      })
      .catch(error=>{
        console.log('error in getting text');
        console.log(JSON.stringify(error));
        reject(/*AtticError.getError(error)*/error);
      })
    })
  }



  notesByIsDone(isdone:boolean, force: boolean):Promise<NoteExtraMin[]>{

    return new Promise<NoteExtraMin[]>((resolve,reject)=>{
      let isNteworkAvailable: boolean = this.netManager.isConnected;
      let areThereNotesInTheDb: boolean;
      let useDb: boolean;
      // let useCache: boolean = false;
      this.db.getNotesCount(this.auth.userid)
      .then(number=>{
        areThereNotesInTheDb = (number > 0) ? true : false;
        // console.log('the numberof notes is');console.log(number);
        useDb = Utils.shouldUseDb(isNteworkAvailable, areThereNotesInTheDb, force/*, this.synch.isSynching()*/);
        console.log('usedb note: ');console.log(JSON.stringify(useDb));
        let p:Promise<NoteExtraMin[]>;
        if(useDb){
          p=this.db.getNotesByIsDone(isdone, this.auth.userid);
        }else{
          console.log('no notes, using the network');
          p= this.http.post('/api/notes/by-is-done', JSON.stringify({note:{isdone:isdone}}));
        }
        return p;
      })
      .then(fetchingResult=>{
        let res:NoteExtraMin[];
        if(!useDb){
          res = fetchingResult.map(obj=>{return NoteExtraMin.safeNewNoteFromJsObject(obj);});
        }else{res=fetchingResult;}
        console.log('the notes by is done are: ');console.log(JSON.stringify(res));
        resolve(res);
      })
      .catch(error=>{
        console.log('error in getting by is done');
        console.log(JSON.stringify(error));
        reject(/*AtticError.getError(error)*/error);
      })
    })
  }

  /**
  This only checks if exists another note with the same title.
  If exists, it returns a promise=false, if not, promise=true.
  */
  isTitleModificationAllowed(title:string):Promise<boolean>{
    return new Promise<boolean>((resolve, reject)=>{
      this.db.selectTitleFromNotes(title, true, this.auth.userid)
      .then(result=>{
        if(result==null){
          resolve(true);
        }else{
          resolve(false);
        }
      })
      .catch(error=>{
        console.log('error in select title from notes');
        console.log(JSON.stringify(error.message));
        resolve(false);
      })
    })
  }


  changeTitle(note: NoteFull, newTitle: string, lastmod:Date):Promise<void>{
    let isAllowed: boolean = false;
    let p:Promise<void>
    if(!this.synch.isNoteFullyLocked()){
      p=new Promise<void>((resolve, reject)=>{
        this.isTitleModificationAllowed(newTitle)
        .then(result=>{
          isAllowed = result;
          if(result){
          return this.http.post('/api/notes/mod/change-title', JSON.stringify({
                note:{
                  title: note.title,
                  newtitle: newTitle
                }
              })
          )
          }else{
            reject(new Error(AtticError.NOTE_TITLE_IMPOSSIBLE));
          }
        })

      .then(sentTitle=>{
        /*pushsing data to db*/
        if(isAllowed){
          return this.db.setNoteTitle(note, newTitle, this.auth.userid);
        }

      })
      .then(changedLocally=>{
        if(isAllowed){
          this.atticCache.changeNoteTitle(note, newTitle/*, false*/,lastmod);
          this.atticCache.invalidateTags();
          resolve();
        }
      })
      .catch(error=>{
        console.log('error in changing title');
        reject(/*AtticError.getError(error)*/error);
      })
      })
    }else{
      p=new Promise<void>((resolve, reject)=>{
        console.log('trying to change title but it is locked');
        reject(AtticError.getSynchingError(DbActionNs.DbAction.change_title));
      });
    }
    return p;
  }


  addTags(note: NoteFull, mainTags: TagExtraMin[], otherTags: TagExtraMin[]/*, oldlastmod: Date*/){
    let p:Promise<void>;
    if(!this.synch.isNoteFullyLocked()){
      p=new Promise<void>((resolve, reject)=>{
        this.db.addTags(note, this.auth.userid, mainTags, otherTags)
        .then(()=>{
          //this.atticCache.updateNote(note, true, true, oldlastmod);
          //no need to update the cache because the note returned is the same.
          this.atticCache.invalidateTags();
          resolve();
        })
        .catch(error=>{
            console.log(JSON.stringify(error.message));console.log(JSON.stringify(error));reject(error);
        })
      })
    }else{
      // return new Promise<void>((resolve, reject)=>{
        console.log('trying to add tags but it is locked');
        p=Promise.reject(AtticError.getSynchingError(DbActionNs.DbAction.add_tag));
      // })
    }
    return p;
  }


  addMainTags(note: NoteFull, mainTags: TagExtraMin[]/*, oldlastmod: Date*/){
    let p:Promise<void>;
    if(!this.synch.isNoteFullyLocked()){
      p=new Promise<void>((resolve, reject)=>{
        this.db.addTags(note, this.auth.userid, mainTags)
        .then(()=>{
          //this.atticCache.updateNote(note, true, true, oldlastmod);
          this.atticCache.invalidateTags();
          resolve();
        })
        .catch(error=>{
            console.log(JSON.stringify(error.message));console.log(JSON.stringify(error));reject(error);
        })
      })
    }else{
      // return new Promise<void>((resolve, reject)=>{
        console.log('trying to add main tags but it is locked');
        p=Promise.reject(AtticError.getSynchingError(DbActionNs.DbAction.add_tag));
      // })
    }
    return p;
  }

  addOtherTags(note: NoteFull, otherTags: TagExtraMin[]/*, oldlastmod: Date*/){
    let p:Promise<void>;
    if(!this.synch.isNoteFullyLocked()){
      p=new Promise<void>((resolve, reject)=>{
        this.db.addTags(note, this.auth.userid, null, otherTags)
        .then(()=>{
          //this.atticCache.updateNote(note, true, true, oldlastmod);
          this.atticCache.invalidateTags();
          resolve();
        })
        .catch(error=>{
            console.log(JSON.stringify(error.message));console.log(JSON.stringify(error));reject(error);
        })
      })
    }else{
      // return new Promise<void>((resolve, reject)=>{
        console.log('trying to add other tags but it is locked');
        p=Promise.reject(AtticError.getSynchingError(DbActionNs.DbAction.add_tag));
      // })
    }
    return p;
  }

  removeTags(note: NoteFull, tags: TagExtraMin[]/*, oldlastmod: Date*/){
    let p:Promise<void>;
    if(!this.synch.isNoteFullyLocked()){
      p=new Promise<void>((resolve, reject)=>{
        this.db.removeTagsFromNote(note, this.auth.userid, tags)
        .then(()=>{
          //this.atticCache.updateNote(note, true, true, oldlastmod);
          this.atticCache.invalidateNotes();
          this.atticCache.invalidateTags();
          resolve();
        })
        .catch(error=>{
            console.log(JSON.stringify(error.message));console.log(JSON.stringify(error));reject(error);
        })
      })
    }else{
      // return new Promise<void>((resolve, reject)=>{
        console.log('trying to remove tags but it is locked');
        p=Promise.reject(AtticError.getSynchingError(DbActionNs.DbAction.remove_tag));
      // })
    }
    return p;
  }


  changeLinks(/*noteTitle: string, links:string[]*/note:NoteFull/*, oldlastmod: Date*/){
    let p:Promise<void>;
    if(!this.synch.isNoteFullyLocked()){
      p=new Promise<void>((resolve, reject)=>{
        this.db.setLinks(note, this.auth.userid)
        .then(()=>{
          //this.atticCache.updateNote(note, true, true, oldlastmod);
          resolve();
        })
        .catch(error=>{
            console.log(JSON.stringify(error.message));console.log(JSON.stringify(error));reject(error);
        })
      })
    }else{
      // return new Promise<any>((resolve, reject)=>{
        console.log('trying to change links but it is locked');
        p=Promise.reject(AtticError.getSynchingError(DbActionNs.DbAction.set_link));
      // })
    }
    return p;
  }

  changeText(/*noteTitle: string, text:string*/note:NoteFull/*, oldlastmod: Date*/){
    let p:Promise<void>;
    if(!this.synch.isNoteFullyLocked()){
      p=new Promise<void>((resolve, reject)=>{
        this.db.setText(note, this.auth.userid)
        .then(()=>{
          //this.atticCache.updateNote(note, true, true, oldlastmod);
          resolve();
        })
        .catch(error=>{
            console.log(JSON.stringify(error.message));console.log(JSON.stringify(error));reject(error);
        })
      })
    }else{
      // return new Promise<any>((resolve, reject)=>{
        console.log('trying to change text but it is locked');
        p=Promise.reject(AtticError.getSynchingError(DbActionNs.DbAction.change_text));
      // })
    }
    return p;
  }

  changeDone(/*noteTitle: string, done: boolean*/note: NoteFull/*, oldlastmod: Date*/){
    let p:Promise<void>;

    if(!this.synch.isNoteFullyLocked()){
      p=new Promise<void>((resolve, reject)=>{
        this.db.setDone(note, this.auth.userid)
        .then(()=>{
          //this.atticCache.updateNote(note, true, true, oldlastmod);
          resolve();
        })
        .catch(error=>{
          console.log(JSON.stringify(error.message));console.log(JSON.stringify(error));reject(error);
        })
      })
    }else{
      // return new Promise<any>((resolve, reject)=>{
        console.log('trying to set done but it is locked');
        p=Promise.reject(AtticError.getSynchingError(DbActionNs.DbAction.set_done));
      // })
    }
    return p;
  }

  deleteNote(note: NoteFull):Promise<void>{
    console.log('the note in: '+JSON.stringify(note));
    let p:Promise<void>;
    if(!this.synch.isNoteFullyLocked()){
      p=new Promise<void>((resolve, reject)=>{
        let cachedTags:TagFull[]=this.atticCache.getCachedFullTags();
        let necessaryTags:TagFull[]=null;
          if(note instanceof NoteFull){
            necessaryTags=Utils.binaryGetFullObjectTag(cachedTags, note.getTagsAsTagsExtraMinArray().sort(TagExtraMin.ascendingCompare));
           }
           this.db.deleteNote(note, this.auth.userid, necessaryTags)
           .then(()=>{
             this.atticCache.removeNote(note);
             if(note.maintags.length+note.othertags.length>0){
               this.atticCache.invalidateTags();
             }
             resolve();
           })
           .catch(error=>{
             console.log(JSON.stringify(error.message));console.log(JSON.stringify(error));reject(error);
           })
      })
    }else{
      // return new Promise<void>((resolve, reject)=>{
        console.log('trying to delete but it is locked');
        p=Promise.reject(AtticError.getSynchingError(DbActionNs.DbAction.delete));
      // })
    }
    return p;
  }



  /*warning, a note full object can be saved in the db if there are pending operations on it?*/

}
