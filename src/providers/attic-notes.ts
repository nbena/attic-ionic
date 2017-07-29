import { Injectable } from '@angular/core';
import { Http, Headers } from '@angular/http';
/* importing auth because I need the token. */
import { Auth } from './auth';
import { DbAction, Const, SqliteError } from '../public/const';
import { NoteExtraMin/*, NoteSmart,*/, NoteFull,NoteMin, NoteBarebon, NoteExtraMinWithDate } from '../models/notes';
import { Utils } from '../public/utils';
import { Db/*, LogObject*/ } from './db';
import { NetManager } from './net-manager';

import { Synch } from './synch';
import { AtticTags } from './attic-tags';
import { TagAlmostMin, TagExtraMin, TagFull } from '../models/tags';

import 'rxjs/add/operator/map';

/*
  Generated class for the AtticNotes provider.

  See https://angular.io/docs/ts/latest/guide/dependency-injection.html
  for more info on providers and Angular 2 DI.
*/
@Injectable()
export class AtticNotes {

  private cachedExtraMinNote: NoteExtraMin[] = null;
  private cachedFullNote: NoteFull[] = null;

  constructor(public http: Http, public auth: Auth,
    private atticTags: AtticTags,
    private db: Db, private netManager: NetManager,
    private synch: Synch
  ) {
    console.log('Hello AtticNotes Provider');
  }


  /*
  only one instance for all the pages.
  */


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
  loadNotesMin(force: boolean):Promise<NoteExtraMin[]>{
    return new Promise<NoteExtraMin[]>((resolve, reject)=>{
      let useForce: boolean = force;
      let isNteworkAvailable: boolean = this.netManager.isConnected;
      let areThereNotesInTheDb: boolean;
      let notes:NoteExtraMinWithDate[]=[];
      let useDb: boolean;
      this.db.getNotesCount(this.auth.userid)
      .then(number=>{
        areThereNotesInTheDb = (number > 0) ? true : false;
        console.log('the numberof notes is');
        console.log(number);
        // let useDb = !isNteworkAvailable || areThereNotesInTheDb || !force;
        useDb = Utils.shouldUseDb(isNteworkAvailable, areThereNotesInTheDb, force/*, this.synch.isSynching()*/);
        console.log('usedb note: ');
        console.log(JSON.stringify(useDb));
        if(useDb){
          // if(this.cachedExtraMinNote!=null){
          //   resolve(this.cachedExtraMinNote);
          // }else{
          //   return this.db.getNotesMin(this.auth.userid);
          // }
          let p:Promise<NoteExtraMin[]>;
          if(this.cachedExtraMinNote!=null){
            console.log('using cache');
            p = new Promise<NoteExtraMin[]>((resolve, reject)=>{resolve(this.cachedExtraMinNote)});
          }else{
            console.log('no cache using db');
            p = this.db.getNotesMin(this.auth.userid);
          }
          return p;
        }else{
          console.log('using the network');
          return Utils.getBasic('/api/notes/all/min/with-date', this.http, this.auth.token);
        }
      })
      .then(fetchingResult=>{
        if(useDb){
          /*fetchingResult = NoteMin[] from the DB.*/
          if(this.cachedExtraMinNote==null){
            this.cachedExtraMinNote = fetchingResult;
          }
          resolve(fetchingResult);
        }else{
          /*fetchingResult = NoteMin[] from the network, need to insert.*/
          /*inserting is available only if the locks are available*/
          if(!this.synch.isNoteFullyLocked()){
            notes = fetchingResult as NoteExtraMinWithDate[];
            // for(let i=notes.length-1;i>=0;i--){
            //   this.db.insertNoteMinQuietly(notes[i], this.auth.userid);
            // }
            this.db.insertNotesMinSmartAndCleanify(notes, this.auth.userid);
            this.cachedExtraMinNote = fetchingResult as NoteExtraMinWithDate[];
            resolve(notes);
          }else{
            /*can't insert*/
            console.log('fetched notes min but it is locked');
          }
        }
      })
      .catch(error=>{
        console.log('error notes:');
        console.log(JSON.stringify(error));
      })

    });
    // return Utils.getBasic('/api/notes/all/min', this.http, this.auth.token);
  }





  private noteByTitle_loadFromNetworkAndInsert(title: string):Promise<any>{
    return new Promise<any>((resolve, reject)=>{
      let note:NoteFull;
      Utils.getBasic('/api/notes/'+title, this.http, this.auth.token)
      .then(result=>{
        console.log('the resul from network is: ');
        console.log(JSON.stringify(result.note));
        note = result.note as NoteFull;
        /*inserting in the DB.*/
        if(!this.synch.isNoteFullyLocked()){
          this.db.insertOrUpdateNote(note, this.auth.userid); /*this will be done asynchronously? yes... maybe*/
        }else{
          console.log('fetched note by title but it is locked');
        }
        resolve(note);
      // .catch(error=>{
      //   console.log('errror while fetching and inserting.');
      //   console.log(JSON.stringify(error));
      //   reject(error);
      // })
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
      let callNet: boolean;
      this.db.getNotesCount(this.auth.userid)
      .then(number=>{
        areThereNotesInTheDb = (number > 0) ? true : false;
        useDb = Utils.shouldUseDb(this.netManager.isConnected, areThereNotesInTheDb, force/*, this.synch.isSynching()*/);
        callNet = !useDb;
        if(useDb){
          let p:Promise<NoteFull>;
          let res:number=-1;
          if(this.cachedFullNote!=null){
            res = Utils.binarySearch(this.cachedFullNote, NoteExtraMin.NewNoteExtraMin(title), NoteExtraMin.ascendingCompare);
          }
          if(res!=-1){
            console.log('the note is in the cache');
            p = new Promise<NoteFull>((resolve, reject)=>{resolve(this.cachedFullNote[res])});
          }else{
            console.log('using the db for full note');
            p=this.db.getNoteFull(title, this.auth.userid);
          }
          return p;
        }else{
          return this.noteByTitle_loadFromNetworkAndInsert(title);
        }
      })
      .then(noteFull=>{
        if(useDb){
          /*we have the note and nothing more should have done.*/
          if(noteFull==null){
            /*if it's not in the db.*/
            return this.noteByTitle_loadFromNetworkAndInsert(title);
          }else{
            //resolve(noteFull);
            return new Promise<NoteFull>((resolve, reject)=>{resolve(noteFull)})
            //resolve a bit in late but so I leave a unique exit point.
          }
        }else{
          /*we have the note and it has been inserted into the DB*/
          //resolve(noteFull);
          return new Promise<NoteFull>((resolve, reject)=>{resolve(noteFull)});
        }
      })
      .then(fromNet=>{
        /*if here the note is not in the DB.*/ /*--> no longer*/
        //resolve(fromNet);
        if(this.cachedFullNote==null){
          this.cachedFullNote=[];
        }
        this.cachedFullNote = Utils.binaryArrayInsert(this.cachedFullNote, fromNet, NoteExtraMin.ascendingCompare);
        resolve(fromNet);
      })
      .catch(error=>{
        console.log('error in getting full note');
        console.log(JSON.stringify(error));
        reject(error);
      })
    })
    //   if(useDb){
    //     /*check if the note is full.
    //     this.db.getNoteFull(title)
    //     .then(result=>{
    //       /*we are not in the catch only if the note is there and it's full.
    //       console.log('the note is full');
    //       resolve(result);
    //     })
    //     .catch(error=>{
    //       /*if any error, call the network.
    //       console.log('error from getNoteFull');
    //       console.log(JSON.stringify(error));
    //       console.log('loading from the network and saving');
    //       this.noteByTitle_loadFromNetworkAndInsert(title)
    //       .then(result=>{
    //         resolve(result);
    //       })
    //       .catch(error=>{
    //         reject(error);
    //       })
    //     })
    //   }else{
    //     console.log('loading from the network and saving, no db use.');
    //     this.noteByTitle_loadFromNetworkAndInsert(title)
    //     .then(result=>{
    //       resolve(result);
    //     })
    //     .catch(error=>{
    //       reject(error);
    //     })
    //   }
    // });
    //
    //
    // //return Utils.getBasic('/api/notes/'+title, this.http, this.auth.token);
  }

  /*
  force can't be used because we need to respect the log order, so the note is put into the db,
  then the log will be consumed.
  THE CONTROL ON THE NOTE WITH ANOTHER SAME TITLE MUST BE ALREADY DONE.
  */
  // createNote(note: NoteFull):Promise<any>{
  //   return new Promise<any>((resolve, reject)=>{
  //     this.db.createNewNote(note);
  //     resolve(true);
  //   });
  //   //return Utils.putBasic('/api/notes/create', JSON.stringify({note:note}), this.http, this.auth.token);
  // }

  private minifyNoteFullForCration(note:NoteFull):NoteFull{
    let noteRes:NoteFull = note;
    let maintags:TagExtraMin[]=noteRes.maintags.map(obj=>{return TagExtraMin.NewTag(obj.title)});
    let othertags:TagExtraMin[]=noteRes.othertags.map(obj=>{return TagExtraMin.NewTag(obj.title)});
    noteRes.maintags = maintags;
    noteRes.othertags = othertags;
    return noteRes;
  }

  private reget(arg0:TagFull[], arg1:TagExtraMin[]):TagFull[]{
    let array:TagFull[]=[];
    arg1.map(obj=>{
      let index:number;
      index=Utils.indexOfCmp(arg0, obj, TagExtraMin.ascendingCompare);
      return arg0[index];
    })
    return array;
  }

  createNote2(note: NoteFull/*, tags: TagAlmostMin[]*/):Promise<void>{
    // return this.db.createNewNote2(note, tags, this.auth.userid);
    return new Promise<void>((resolve, reject)=>{
      if(!this.synch.isSynching()){

        //try to provide to the db more fulltag as possible.

        let cachedTags:TagFull[]=this.atticTags.getFullCachedTags();
        let necessaryTags:TagFull[]=this.reget(cachedTags, note.getTagsAsTagsExtraMinArray());

        this.db.createNewNote2(this.minifyNoteFullForCration(note), /*tags, */this.auth.userid, necessaryTags)
        .then(result=>{
          resolve();
        })
        .catch(error=>{
          reject(SqliteError.getBetterSqliteError(error.message as string));
        })
      }else{
        console.log('trying to create note but it is locked');
        reject(Utils.getSynchingError(DbAction.DbAction.create));
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

  notesByTag2(tags:TagAlmostMin[], force: boolean):Promise<any>{
    return new Promise<any>((resolve, reject)=>{
      let useForce: boolean = force;
      let isNteworkAvailable: boolean = this.netManager.isConnected;
      let areThereNotesInTheDb: boolean;
      let notes:NoteExtraMin[]=[];
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
        console.log('the numberof notes is');
        console.log(number);
        // let useDb = !isNteworkAvailable || areThereNotesInTheDb || !force;
        useDb = Utils.shouldUseDb(isNteworkAvailable, areThereNotesInTheDb, force/*, this.synch.isSynching()*/);
        console.log('usedb note: ');
        console.log(JSON.stringify(useDb));
        if(useDb){
          return this.db.getNotesByTags(tags, this.auth.userid)
        }else{
          console.log('no notes, using the network');
          return Utils.postBasic('/api/notes/by-tags-no-role', JSON.stringify({tags: tags.map((tag)=>{return tag.title})}), this.http, this.auth.token)
        }
      })
      .then(fetchingResult=>{
        resolve(fetchingResult as NoteExtraMin[])
      })
      // .then(secondFetch=>{
      //   /*just the one from the network*/
      //   resolve(secondFetch);
      // })
      .catch(error=>{
        console.log('error notes:');
        console.log(JSON.stringify(error));
      })

    });
    // return Utils.getBasic('/api/notes/all/min', this.http, this.auth.token);
  }

  // notesByTag2(tags:TagAlmostMin[], force: boolean):Promise<any>{
  //   return new Promise<any>((resolve, reject)=>{
  //     let useForce: boolean = force;
  //     let isNteworkAvailable: boolean = this.netManager.isConnected;
  //     let areThereNotesInTheDb: boolean;
  //     let notes:NoteExtraMin[]=[];
  //     let useDb: boolean;
  //     let expectedResult: number = 0;
  //     tags.forEach((tag)=>{expectedResult+=tag.noteslength});
  //     /*doing this to avoid useless queries*/
  //     if(expectedResult == 0){
  //       resolve([]);
  //     }
  //     this.db.getNotesCount(this.auth.userid)
  //     .then(number=>{
  //       areThereNotesInTheDb = (number > 0) ? true : false;
  //       console.log('the numberof notes is');
  //       console.log(number);
  //       // let useDb = !isNteworkAvailable || areThereNotesInTheDb || !force;
  //       useDb = Utils.shouldUseDb(isNteworkAvailable, areThereNotesInTheDb, force/*, this.synch.isSynching()*/);
  //       console.log('usedb note: ');
  //       console.log(JSON.stringify(useDb));
  //       if(useDb){
  //         return this.db.getNotesByTags(tags, this.auth.userid)
  //       }else{
  //         console.log('no notes, using the network');
  //         return this.notesByTags_loadFromNetworkAndInsert(tags);
  //       }
  //     })
  //     .then(fetchingResult=>{
  //       if(useDb){
  //         /*fetchingResult = NoteMin[] from the DB.*/
  //         fetchingResult = fetchingResult as NoteExtraMin[];
  //         if(expectedResult == fetchingResult.length){
  //           /*ok, nothing to do.*/
  //           resolve(fetchingResult);
  //         }
  //         else{
  //           /*error*/
  //           console.log('there is an error, need to fetch data from the network.')
  //           if(isNteworkAvailable==false){
  //             resolve([]);
  //           }else{
  //             /*TODO , saving the title of note returned here, it will fully downloaded.*/
  //             return this.notesByTags_loadFromNetworkAndInsert(tags);
  //           }
  //         }/*end of useDb*/
  //       }else{
  //         /*fetchingResult from first network calling.*/
  //         // notes = fetchingResult as NoteExtraMin[];
  //         // for(let i=0;i<notes.length;i++){
  //         //   this.db.insertNoteMinQuietly(notes[i]);
  //         // }
  //         // resolve(notes);
  //         /*the data are already fetched from the network, and started to be inserted in the DB*/
  //         resolve(fetchingResult);
  //       }
  //     })
  //     .then(secondFetch=>{
  //       /*just the one from the network*/
  //       resolve(secondFetch);
  //     })
  //     .catch(error=>{
  //       console.log('error notes:');
  //       console.log(JSON.stringify(error));
  //     })
  //
  //   });
  //   // return Utils.getBasic('/api/notes/all/min', this.http, this.auth.token);
  // }
  //
  // notesByMainTag(tags: string[]){
  //   return Utils.postBasic('/api/notes/by-tag/unpop', JSON.stringify({mainTags: tags}), this.http, this.auth.token);
  // }
  //
  // notesByOtherTag(tags: string[]){
  //   return Utils.postBasic('/api/notes/by-tag/unpop', JSON.stringify({otherTags: tags}), this.http, this.auth.token);
  // }
/*
return this.items.filter((item) => {
    return item.title.toLowerCase().indexOf(searchTerm.toLowerCase()) > -1;
});
*/
  filterNotesByTitle(notes: NoteExtraMin[], term: string):NoteExtraMin[]{
    return notes.filter((note)=>{
      return note.title.indexOf(term.toLowerCase())>-1;
    });
  }

  // filterNotesByTags(notes: NoteExtraMin[], tags: TagExtraMin):NoteExtraMin[]{
  //   return notes.filter((note)=>{
  //
  //   })
  // }

  // notesByTitle(title: string){
  //   return Utils.postBasic('/api/notes/by-title/reg/unpop', JSON.stringify({title: title}), this.http, this.auth.token);
  // }

  notesByText(text: string, force: boolean){

    // return Utils.postBasic('/api/notes/by-text', JSON.stringify({note:
    //   {text: text}}), this.http, this.auth.token);
    return new Promise<NoteExtraMin[]>((resolve,reject)=>{
      let useForce: boolean = force;
      let isNteworkAvailable: boolean = this.netManager.isConnected;
      let areThereNotesInTheDb: boolean;
      let notes:NoteExtraMin[]=[];
      let useDb: boolean;
      this.db.getNotesCount(this.auth.userid)
      .then(number=>{
        areThereNotesInTheDb = (number > 0) ? true : false;
        console.log('the numberof notes is');
        console.log(number);
        // let useDb = !isNteworkAvailable || areThereNotesInTheDb || !force;
        useDb = Utils.shouldUseDb(isNteworkAvailable, areThereNotesInTheDb, force/*, this.synch.isSynching()*/);
        console.log('usedb note: ');
        console.log(JSON.stringify(useDb));
        if(useDb){
          return this.db.getNotesByText(text, this.auth.userid);
        }else{
          console.log('no notes, using the network');
          return Utils.postBasic('/api/notes/by-text', JSON.stringify({note:{text:text}}),this.http, this.auth.token);
        }
      })
      .then(fetchingResult=>{
        resolve(fetchingResult);
      })
      .catch(error=>{
        console.log('error in getting text');
        console.log(JSON.stringify(error));
        reject(error);
      })
    })
  }

  isTitleModificationAllowed(title:string):Promise<boolean>{
    return new Promise<boolean>((resolve, reject)=>{
      this.db.selectTitleFromNotes(title, this.auth.userid)
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


  changeTitle(note: NoteFull, newTitle: string):Promise<void>{
    // return Utils.postBasic('/api/notes/mod/title', JSON.stringify({note:
    //   {title: noteTitle, newTitle: newTitle}}), this.http, this.auth.token);
    let isAllowed: boolean = false;
    if(!this.synch.isNoteFullyLocked()){
      return new Promise<void>((resolve, reject)=>{
        this.isTitleModificationAllowed(newTitle)
        .then(result=>{
          isAllowed = result;
          if(result){
            return Utils.postBasic('/api/notes/mod/change-title', JSON.stringify({
              note:{
                title: note.title,
                newtitle: newTitle
              }
            }),
            this.http,
            this.auth.token
          )
          }else{
            reject(new Error(Const.NOTE_TITLE_IMPOSSIBLE));
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
          resolve();
        }
      })
      .catch(error=>{
        console.log('error in changing title');
        reject(SqliteError.getBetterSqliteError(error.message as string));;
      })
      })
    }else{
      return new Promise<void>((resolve, reject)=>{
        console.log('trying to change title but it is locked');
        reject(Utils.getSynchingError(DbAction.DbAction.change_title));
      });
    }
  }


  addTags(note: NoteFull, mainTags: TagExtraMin[], otherTags: TagExtraMin[]){
    // return Utils.postBasic('/api/notes/mod/addtags', JSON.stringify({note:
    //   {title: note.title,
    //     maintags: mainTags.map((tag)=>{return tag.title}),
    //     othertags: otherTags.map((tag)=>{tag.title})}}),
    //     this.http, this.auth.token);
    if(!this.synch.isNoteFullyLocked()){
      return this.db.addTags(note, this.auth.userid, mainTags, otherTags);
    }else{
      return new Promise<void>((resolve, reject)=>{
        console.log('trying to add tags but it is locked');
        reject(Utils.getSynchingError(DbAction.DbAction.add_tag));
      })
    }
  }


  addMainTags(note: NoteFull, mainTags: TagExtraMin[]){
    // return Utils.postBasic('/api/notes/mod/addtags', JSON.stringify({note:
    //   {title: note.title,
    //     mainTags: mainTags.map((tag)=>{tag.title}) }}),
    //     this.http, this.auth.token);
    if(!this.synch.isNoteFullyLocked()){
      return this.db.addTags(note, this.auth.userid, mainTags);
    }else{
      return new Promise<void>((resolve, reject)=>{
        console.log('trying to add main tags but it is locked');
        reject(Utils.getSynchingError(DbAction.DbAction.add_tag));
      })
    }
  }

  addOtherTags(note: NoteFull, otherTags: TagExtraMin[]){
    // return Utils.postBasic('/api/notes/mod/addtags', JSON.stringify({note:
    //   {title: note.title,
    //     othertags: otherTags.map((tag)=>{return tag.title}) }}),
    //     this.http, this.auth.token);
    if(!this.synch.isNoteFullyLocked()){
      return this.db.addTags(note, this.auth.userid, null, otherTags);
    }else{
      return new Promise<void>((resolve, reject)=>{
        console.log('trying to add other tags but it is locked');
        reject(Utils.getSynchingError(DbAction.DbAction.add_tag));
      })
    }
  }

  // removeMainTags(noteId: string, tagIds: string[]){
  //   return Utils.postBasic('/api/notes/mod/removetags', JSON.stringify({id: noteId, mainTags: tagIds }), this.http, this.auth.token);
  // }
  //
  // removeOtherTags(noteId: string, tagIds: string[]){
  //   return Utils.postBasic('/api/notes/mod/removetags', JSON.stringify({id: noteId, otherTags: tagIds }), this.http, this.auth.token);
  // }
  removeTags(note: NoteFull, tags: TagExtraMin[]){
    // return Utils.postBasic('/api/notes/mod/removetags',JSON.stringify({note:
    //   {title:noteTitle, tags:tags}}), this.http, this.auth.token );
    if(!this.synch.isNoteFullyLocked()){
      return this.db.removeTagsFromNote(note, this.auth.userid, tags);
    }else{
      return new Promise<void>((resolve, reject)=>{
        console.log('trying to remove tags but it is locked');
        reject(Utils.getSynchingError(DbAction.DbAction.remove_tag));
      })
    }
  }

  // addLinks(noteId: string, links: string[]){
  //   // console.log('going to: ');
  //   // console.log(JSON.stringify({id:noteId, links: links}));
  //   return Utils.postBasic('/api/notes/mod/addlinks', JSON.stringify({id: noteId, links: links }), this.http, this.auth.token);
  // }
  //
  // removeLinks(noteId: string, links: string[]){
  //   return Utils.postBasic('/api/notes/mod/removelinks', JSON.stringify({id: noteId, links: links }), this.http, this.auth.token);
  // }
  changeLinks(/*noteTitle: string, links:string[]*/note:NoteFull){
    // return Utils.postBasic('/api/notes/mod/links', JSON.stringify({note:
    //   {title: noteTitle, links:links}}), this.http, this.auth.token);
    if(!this.synch.isNoteFullyLocked()){
      return this.db.setLinks(note, this.auth.userid);
    }else{
      return new Promise<any>((resolve, reject)=>{
        console.log('trying to change links but it is locked');
        reject(Utils.getSynchingError(DbAction.DbAction.set_link));
      })
    }
  }

  changeText(/*noteTitle: string, text:string*/note:NoteFull){
    // return Utils.postBasic('/api/notes/mod/text', JSON.stringify({note:
    //   {title:noteTitle, text:text}}), this.http, this.auth.token);
    if(!this.synch.isNoteFullyLocked()){
      return this.db.setText(note, this.auth.userid);
    }else{
      return new Promise<any>((resolve, reject)=>{
        console.log('trying to change text but it is locked');
        reject(Utils.getSynchingError(DbAction.DbAction.change_text));
      })
    }
  }

  changeDone(/*noteTitle: string, done: boolean*/note: NoteFull){
    // return Utils.postBasic('/api/notes/mod/setdone', JSON.stringify({note:
    //   {title:noteTitle, isDone:done}}), this.http, this.auth.token);
    if(!this.synch.isNoteFullyLocked()){
      return this.db.setDone(note, this.auth.userid);
    }else{
      return new Promise<any>((resolve, reject)=>{
        console.log('trying to set done but it is locked');
        reject(Utils.getSynchingError(DbAction.DbAction.set_done));
      })
    }
  }

  deleteNote(note: NoteExtraMin):Promise<any>{
    // if(_id instanceof Number){
    //   // let obj = new LogObject();
    //   // obj.action = Action.DeleteNote;
    //   // obj.refNotesToSave = <number>_id;
    //   return this.db.transactionDeleteNoteFromNotesToSave(<number>_id);
    // }else{
    //   return this.db.transactionDeleteNoteFromNotes(<string>_id);
    // }
    if(!this.synch.isNoteFullyLocked()){
      return this.db.deleteNote(note, this.auth.userid);
    }else{
      return new Promise<any>((resolve, reject)=>{
        console.log('trying to delete but it is locked');
        reject(Utils.getSynchingError(DbAction.DbAction.delete));
      })
    }
  }

  /*warning, a note full object can be saved in the db if there are pending operations on it?*/

}
