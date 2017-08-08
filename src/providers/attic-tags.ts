import { Injectable } from '@angular/core';
import {  Headers } from '@angular/http';
import 'rxjs/add/operator/map';

import { Auth } from './auth';
// import { Const } from '../public/const';
// import { NoteExtraMin, NoteSmart, NoteFull } from '../models/notes';
// import { TagExtraMin, TagMin, TagFull } from '../models/tags';
import { Utils } from '../public/utils';

import { TagExtraMin, TagAlmostMin, TagFull } from '../models/tags';
import {NoteExtraMin, NoteFull} from '../models/notes';
import { Db } from './db';
import { NetManager } from './net-manager';
import { Synch } from './synch';
import { DbAction, Const } from '../public/const';

import { AtticCache } from './attic-cache';
import { HttpProvider } from './http';

import { AtticError } from '../public/attic-errors';

/*
  Generated class for the AtticTags provider.

  See https://angular.io/docs/ts/latest/guide/dependency-injection.html
  for more info on providers and Angular 2 DI.
*/
@Injectable()
export class AtticTags {

  // private cachedAlmostMinTag:TagAlmostMin[]=null;
  //private cachedFullTag:TagFull[]=null;

  constructor(private http: HttpProvider, public auth: Auth,
    private db: Db, private netManager: NetManager,
    private synch: Synch,
    private atticCache: AtticCache
  ) {
    console.log('Hello AtticTags Provider');
  }


  // loadFull(){
  //   return Utils.getBasic('/api/tags/all', this.http, this.auth.token);
  // }
  //
  // loadNoPopulation(){
  //   return Utils.getBasic('/api/tags/all/unpop', this.http, this.auth.token);
  //
  // }

  loadTagsMin(force: boolean){
    return new Promise<TagAlmostMin[]>((resolve, reject)=>{
        let useForce: boolean = force;
        let isNteworkAvailable: boolean = this.netManager.isConnected;
        let areThereTagsInTheDb: boolean;
        let tags:TagAlmostMin[]=[];
        let useDb: boolean;
        this.db.getTagsCount(this.auth.userid)
        .then(number=>{
          areThereTagsInTheDb = (number > 0) ? true : false;
          console.log('the number of tags is');
          console.log(number);
          // let useDb = !isNteworkAvailable || areThereNotesInTheDb || !force;
          useDb = Utils.shouldUseDb(isNteworkAvailable, areThereTagsInTheDb, force/*, this.synch.isSynching()*/);
          console.log('usedb tag: ');
          console.log(JSON.stringify(useDb));
          //   return this.db.getTagsMin(this.auth.userid);
          if(useDb){
            let p:Promise<TagAlmostMin[]>;
            if(!this.atticCache.AreAlmostMinTagsEmpty()){
              console.log('using cache');
              p = new Promise<TagAlmostMin[]>((resolve, reject)=>{resolve(this.atticCache.getCachedAlmostMinTags())});
            }else{
              console.log('no cache using db');
              p = this.db.getTagsMin(this.auth.userid);
            }
            return p;
          }else{
            console.log('no tags, using the network');
            //return Utils.getBasic('/api/tags/all/min', this.http, this.auth.token);
            return this.http.get('/api/tags/all/min');
          }
        })
        .then(fetchingResult=>{
          console.log('fetch result is:');
          console.log(JSON.stringify(fetchingResult));
          if(useDb){
            /*fetchingResult = NoteMin[] from the DB.*/
            // if(this.cachedAlmostMinTag==null){
              this.atticCache.pushAllToCachedAlmostMinTags(fetchingResult as TagAlmostMin[]);
            // }
            resolve(fetchingResult);
          }else{
            /*fetchingResult = NoteMin[] from the network, need to insert.*/
            if(!this.synch.isTagLocked()){
              tags = fetchingResult as TagAlmostMin[];
              // for(let i=0;i<tags.length;i++){
              //   this.db.insertTagMinQuietly(tags[i], this.auth.userid);
              // }
              this.db.insertTagsMinSmartAndCleanify(tags, this.auth.userid);
              // this.cachedAlmostMinTag = fetchingResult as TagAlmostMin[];
              this.atticCache.pushAllToCachedAlmostMinTags(fetchingResult as TagAlmostMin[]);
            }else{
              console.log('fetched tags by title but it is locked');
            }
            resolve(tags);
          }
        })
        .catch(error=>{
          console.log('error tags:');
          console.log(JSON.stringify(error.message));
        })
      })
    }


  // loadTagsMinWithNotesLength(){
  //   return Utils.getBasic('/api/tags/all/min/notes-length', this.http, this.auth.token);
  // }

  // tagByTitle(title: string):Promise<any>{
  //   return Utils.getBasic('/api/tags/'+title, this.http, this.auth.token);
  // }


    private tagByTitle_loadFromNetworkAndInsert(title: string):Promise<any>{
      return new Promise<any>((resolve, reject)=>{
        let tag:TagFull;
        //Utils.getBasic('/api/tags/'+title, this.http, this.auth.token)
        this.http.get('/api/tags/'+title)
        .then(result=>{
          console.log('the resul from network is: ');
          console.log(JSON.stringify(result.tag));
          tag = result.tag as TagFull;
          /*inserting in the DB.*/
          /*===============================================*/
          /*tags are always min!!!! it just change the json_object*/
          /*no it's false ahah*/
          if(!this.synch.isTagLocked()){
            //this.db.insertTagsMinSmartAndCleanify([tag], this.auth.userid); /*this will be done asynchronously?*/
            this.db.insertTag(tag, this.auth.userid);
          }else{
            console.log('fetched tag by title but it is locked')
          }
          resolve(tag);
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

    public tagByTitle(title: string, force: boolean):Promise<TagFull>{
      console.log('title:');
      console.log(title);
      return new Promise<TagFull>((resolve, reject)=>{
        let areThereTagsInTheDb: boolean;
        let useDb: boolean;
        let callNet: boolean;
        this.db.getTagsCount(this.auth.userid)
        .then(number=>{
          areThereTagsInTheDb = (number > 0) ? true : false;
          useDb = Utils.shouldUseDb(this.netManager.isConnected, areThereTagsInTheDb, force/*, this.synch.isSynching()*/);
          callNet = !useDb;
          if(useDb){
            let p:Promise<TagFull>;
            let res:number=-1;
            if(!this.atticCache.AreFullTagsEmpty()){
              //i can use a tag extra min because the tag is loaded only if
              //it's fulll.
              res = Utils.binarySearch(this.atticCache.getCachedFullTags(), TagExtraMin.NewTag(title),TagExtraMin.ascendingCompare)
            }
            if(res!=-1){
              console.log('the tag is in the cache');
              p=new Promise<TagFull>((resolve, reject)=>{resolve(this.atticCache.getCachedFullTags()[res])});
            }else{
              console.log('using the db for full tag');
              p=this.db.getTagFull(title, this.auth.userid);
            }
            // return this.db.getTagFull(title, this.auth.userid)
            return p;
          }else{
            return this.tagByTitle_loadFromNetworkAndInsert(title);
          }
        })
        .then(tagFull=>{
          if(useDb){
            /*we have the note and nothing more should have done.*/
            if(tagFull==null){
              return this.tagByTitle_loadFromNetworkAndInsert(title);
            }else{
              //resolve(tagFull);
              return new Promise<TagFull>((resolve, reject)=>{resolve(tagFull)});
            }
          }else{
            /*we have the note and it has been inserted into the DB*/
            //resolve(tagFull);
            return new Promise<TagFull>((resolve, reject)=>{resolve(tagFull)});
          }
        })
        .then(fromNet=>{
          /*if here the note is not in the DB.*/
          // if(this.cachedFullTag==null){
          //   this.cachedFullTag = [];
          // }
          this.atticCache.pushToCachedFullTags(fromNet as TagFull);
          resolve(fromNet);
        })
        .catch(error=>{
          console.log('error in getting full tag');
          console.log(JSON.stringify(error));
          reject(error);
        })
      })
    }



  /*
  * create a new tag.
  */
  createTag(tag: TagFull):Promise<void>{
    return new Promise<void>((resolve, reject)=>{
      if(!this.synch.isTagLocked()){
        this.db.createTag(tag, this.auth.userid)
        .then(result=>{

          this.atticCache.pushToCachedFullTags(tag);

          resolve();
        })
        .catch(error=>{
          error = AtticError.getBetterSqliteError(error.message as string);
          reject(error);
        })
      }
      else{
        console.log('trying to create tag but it is locked');
        reject(Utils.getSynchingError(DbAction.DbAction.create));
      }
    })
    // return Utils.putBasic('/api/tags/'+title, '', this.http, this.auth.token);
    // if(!this.synch.isTagLocked()){
    //   return this.db.createTag(tag, this.auth.userid);
    // }else{
    //   return new Promise<any>((resolve, reject)=>{
    //     console.log('trying to create tag but it is locked');
    //     reject(new Error('synching'));
    //   })
    // }
  }

  // tagsByTitle(title: string){
  //   return Utils.postBasic('/api/tags/by-title/reg/unpop', {title: title}, this.http, this.auth.token);
  // }

  // filterTagByTitle(tags: TagExtraMin[], title: string):TagExtraMin[]{
  //   return tags.filter((tag)=>{
  //     return tag.title.indexOf(title.toLowerCase())>-1;
  //   });
  // }

  filterTagByTitle(tags: TagAlmostMin[], title: string):TagAlmostMin[]{
    return tags.filter((tag)=>{
      return tag.title.indexOf(title.toLowerCase())>-1;
    });
  }

  isTitleModificationAllowed(title:string):Promise<boolean>{
    return new Promise<boolean>((resolve, reject)=>{
      this.db.selectTitleFromTags(title, this.auth.userid)
      .then(result=>{
        if(result==null){
          resolve(true);
        }else{
          resolve(false);
        }
      })
      .catch(error=>{
        console.log('error in select title from tags');
        console.log(JSON.stringify(error.message));
        resolve(false);
      })
    })
  }
  //the allow is done in order to avoid situation such as:
    //ok update on the server but not on the local db
  changeTitle(tag: TagExtraMin, newTitle: string):Promise<void>{
    let isAllowed: boolean = false;
    if( (!this.synch.isNoteFullyLocked()) && (!this.synch.isTagLocked()) ){
      return new Promise<void>((resolve, reject)=>{
        this.isTitleModificationAllowed(newTitle)
        .then(result=>{
          isAllowed = result;
          if(result){
          //   return Utils.postBasic('/api/tags/mod/change-title', JSON.stringify({
          //     tag:{
          //       title: tag.title,
          //       newtitle: newTitle
          //     }
          //   }),
          //   this.http,this.auth.token
          // )
          return this.http.post('/api/tags/mod/change-title', JSON.stringify({
            tag:{
              title: tag.title,
              newtitle: newTitle
            }
          }))
        }else{
          reject(new Error(AtticError.TAG_TITLE_IMPOSSIBLE));
        }
        })
        // console.log('going to send');
        // console.log(JSON.stringify({
        //   tag:{
        //     title: tag.title,
        //     newtitle: newTitle
        //   }
        // }));

      .then(sentTitle=>{
        /*pushsing data to db*/
        if(isAllowed){
          return this.db.setTagTitle(tag, newTitle, this.auth.userid);
        }
      })
      .then(changedLocally=>{
        if(isAllowed){
          resolve();
        }
      })
      .catch(error=>{
        console.log('error in changing title');
        reject(AtticError.getBetterSqliteError(error.message as string));
      })
      })
    }else{
      return new Promise<void>((resolve, reject)=>{
        console.log('trying to change title but it is locked');
        reject(Utils.getSynchingError(DbAction.DbAction.change_title));
      });
    }
  }



  // private reget(arg0:NoteFull[], arg1:NoteExtraMin[]):NoteFull[]{
  //   let array:NoteFull[]=[];
  //   arg1.map(obj=>{
  //     let index:number;
  //     index=Utils.indexOfCmp(arg0, obj, NoteExtraMin.ascendingCompare);
  //     return arg0[index];
  //   })
  //   return array;
  // }

  deleteTag(tag: TagExtraMin):Promise<any>{
    // return Utils.deleteBasic('/api/tags/'+tag.title, this.http, this.auth.token);
    if(!this.synch.isTagLocked()){

      let cachedNotes:NoteFull[]=this.atticCache.getCachedFullNotes();
      let necessaryNotes:NoteFull[]=null;
      if(tag instanceof TagFull){
        necessaryNotes=Utils.getFullObjectNote(cachedNotes, (tag as TagFull).notes);
      }
      return this.db.deleteTag(tag, this.auth.userid, necessaryNotes);
    }else{
      return new Promise<any>((resolve, reject)=>{
        console.log('trying to delete tag but it is locked');
        reject(Utils.getSynchingError(DbAction.DbAction.delete));
      })
    }
  }

  /*the note full object is not kept in the DB as json, is recreated everytime.*/

}

/*see how to manage remote rename*/
