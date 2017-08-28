import { Injectable } from '@angular/core';
//import {  Headers } from '@angular/http';
import 'rxjs/add/operator/map';

import { Auth } from './auth';
// import { Const } from '../public/const';
// import { NoteExtraMin, NoteSmart, NoteFull } from '../models/notes';
// import { TagExtraMin, TagMin, TagFull } from '../models/tags';
import { Utils } from '../public/utils';

import { TagExtraMin, TagAlmostMin, TagFull } from '../models/tags';
import {/*NoteExtraMin, */NoteFull} from '../models/notes';
import { Db } from './db';
import { NetManager } from './net-manager';
import { Synch } from './synch';
import { DbActionNs/*, Const*/ } from '../public/const';

import { AtticCache } from './attic-cache';
import { HttpProvider } from './http';

import { AtticError } from '../public/errors';

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
    private db: Db,
    private netManager: NetManager,
    private synch: Synch,
    private atticCache: AtticCache
  ) {
    console.log('Hello AtticTags Provider');
  }

  loadTagsMin(force: boolean){
    return new Promise<TagAlmostMin[]>((resolve, reject)=>{
        //let useForce: boolean = force;
        let isNteworkAvailable: boolean = this.netManager.isConnected;
        let areThereTagsInTheDb: boolean;
        let useCache: boolean = false;
        // let tags:TagAlmostMin[]=[];
        let useDb: boolean;
        this.db.getTagsCount(this.auth.userid)
        .then(number=>{
          areThereTagsInTheDb = (number > 0) ? true : false;
          // console.log('the number of tags is');console.log(number);
          // let useDb = !isNteworkAvailable || areThereNotesInTheDb || !force;
          useDb = Utils.shouldUseDb(isNteworkAvailable, areThereTagsInTheDb, force/*, this.synch.isSynching()*/);
          console.log('use db tag: ');console.log(JSON.stringify(useDb));
          let p:Promise<TagAlmostMin[]>;
          if(useDb){
            if(!this.atticCache.areDifferentlySortedCachedTagsAlmostMinEmpty()){
              useCache=true;
              console.log('using cache');
              p=Promise.resolve(this.atticCache.getDifferentlySortedCachedTagAlmostMin());
            }else{
              console.log('no cache using db');
              p = this.db.getTagsMin(this.auth.userid);
            }
          }else{
            console.log('no tags, using the network');
            p=this.http.get('/api/tags/all/min');
          }
          return p;
        })
        .then(fetchingResult=>{
          let res:TagAlmostMin[];
          if(!useDb){
            res = fetchingResult.map(obj=>{return TagAlmostMin.safeNewTagFromJsObject(obj)});
          }else{res=fetchingResult;}
          resolve(res/*fetchingResult as TagAlmostMin[]*/);
          if(!this.synch.isTagLocked() && !useDb && res.length>0){
            this.db.insertTagsMinSmartAndCleanify(fetchingResult/* as TagAlmostMin[]*/, this.auth.userid);
          }else{
            console.log('fetched tags but is locked (or I\'ve used db)');
          }
          if(!useCache){
            this.atticCache.pushAllToDifferentlySortedCachedAlmostMinTags(fetchingResult/* as TagAlmostMin[]*/);
          }
        })
        .catch(error=>{
          console.log('error tags:');
          console.log(JSON.stringify(error.message));
          reject(/*AtticError.getError(error)*/error);
        })
      })
    }


    private tagByTitle_loadFromNetworkAndInsert(title: string):Promise<any>{
      return new Promise<any>((resolve, reject)=>{
        this.http.get('/api/tags/'+title)
        .then(result=>{
          // console.log('the resul from network is: ');
          // console.log(JSON.stringify(result.tag));
          let tag:TagFull = null;
          if(result.tag!=null){
            tag=TagFull.safeNewTagFromJsObject(result.tag);
            console.log('the tag from net');console.log(JSON.stringify(tag));
            if(!this.synch.isTagLocked()){
              this.db.insertOrUpdateTag(tag, this.auth.userid);
            }else{
              console.log('fetched tag by title but it is locked')
            }
          }
          resolve(tag);
      })
      .catch(error=>{
        reject(error);
      })
    })
    }

    public tagByTitle(title: string, force: boolean):Promise<TagFull>{
      return new Promise<TagFull>((resolve, reject)=>{
        let areThereTagsInTheDb: boolean;
        let useDb: boolean;
        let useCache: boolean = false;
        this.db.getTagsCount(this.auth.userid)
        .then(number=>{
          areThereTagsInTheDb = (number > 0) ? true : false;
          useDb = Utils.shouldUseDb(this.netManager.isConnected, areThereTagsInTheDb, force/*, this.synch.isSynching()*/);
          console.log('use db tag: ');console.log(JSON.stringify(useDb));
          let p:Promise<TagFull>;
          if(useDb){
            let tag:TagFull=this.atticCache.getTagFullOrNull(new TagExtraMin(title));
            if(tag!=null){
              console.log('the tag is in the cache'); useCache=true;
              p=Promise.resolve(tag);
            }else{
              console.log('the tag is not in the cache');
              p=this.db.getTagFull(title, this.auth.userid);
            }
          }else{
            p= this.tagByTitle_loadFromNetworkAndInsert(title);
          }
          return p;
        })
        .then(tagFull=>{
          // if(useDb){
          //   /*we have the note and nothing more should have done.*/
          //   if(tagFull==null){
          //     return this.tagByTitle_loadFromNetworkAndInsert(title);
          //   }else{
          //     return new Promise<TagFull>((resolve, reject)=>{resolve(tagFull)});
          //   }
          // }else{
          //   /*we have the note and it has been inserted into the DB*/
          //   return new Promise<TagFull>((resolve, reject)=>{resolve(tagFull)});
          // }
          // console.log('the tag full post db');console.log(JSON.stringify(tagFull));
          if(tagFull!=null){
            resolve(tagFull);
            return Promise.resolve(tagFull);
          }else if(tagFull==null && useDb){
            console.log('trying to load from network');
            return this.tagByTitle_loadFromNetworkAndInsert(title);
          }
        })
        .then(lastAttempt=>{
          // this.atticCache.pushToCachedFullTags(fromNet as TagFull);
          // resolve(fromNet);
          if(lastAttempt==null){ //or is not found in the db.
            reject(AtticError.getNewNetworkError());
          }else{
            resolve(lastAttempt);
          }
          if(!useCache){
            this.atticCache.pushToCachedFullTags(lastAttempt);
            //this.atticCache.pushTagFullToAll(lastAttempt);
          }
        })
        .catch(error=>{
          console.log('error in getting full tag');
          console.log(JSON.stringify(error.message));
          reject(/*AtticError.getError(error)*/error);
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
        // Promise.resolve(tag)
        .then(result=>{
          //this.atticCache.pushToCachedFullTags(tag);
          this.atticCache.pushTagFullToAll(tag);
          resolve();
        })
        .catch(error=>{
          //error = AtticError.getBetterSqliteError(error.message as string);
          reject(error);
        })
      }
      else{
        console.log('trying to create tag but it is locked');
        reject(AtticError.getSynchingError(DbActionNs.DbAction.create));
      }
    })
  }


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
  changeTitle(tag: TagFull, newTitle: string):Promise<void>{
    let isAllowed: boolean = false;
    let p:Promise<void>;
    if( (!this.synch.isNoteFullyLocked()) && (!this.synch.isTagLocked()) ){
      p= new Promise<void>((resolve, reject)=>{
        this.isTitleModificationAllowed(newTitle)
        .then(result=>{
          isAllowed = result;
          if(result){
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
      .then(sentTitle=>{
        /*pushsing data to db*/
        if(isAllowed){
          return this.db.setTagTitle(tag, newTitle, this.auth.userid);
        }
      })
      .then(changedLocally=>{
        if(isAllowed){
          this.atticCache.changeTagTitle(tag, newTitle, /*false*/);
          //this.atticCache.updateTag2(tag, newTitle, null);
          if(tag.noteslength>0){
            this.atticCache.invalidateNotes();
          }
          resolve();
        }
      })
      .catch(error=>{
        console.log('error in changing title');
        reject(/*AtticError.getBetterSqliteError(error.message as string)*/error);
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


  deleteTag(tag: TagFull):Promise<void>{
    let p:Promise<void>
    if(!this.synch.isTagLocked()){
      p=new Promise<void>((resolve, reject)=>{
        let cachedNotes:NoteFull[]=this.atticCache.getCachedFullNotes();
        let necessaryNotes:NoteFull[]=null;
        if(tag instanceof TagFull){
          necessaryNotes=Utils.getFullObjectNote(cachedNotes, (tag as TagFull).notes);
        }
        this.db.deleteTag(tag, this.auth.userid, necessaryNotes)
        .then(()=>{
          this.atticCache.removeTag(tag);
          if(tag.noteslength>0){
            this.atticCache.invalidateNotes();
          }
        })
        .catch(error=>{
          console.log(JSON.stringify(error.message));console.log(JSON.stringify(error));reject(error);
        })
      })
    }else{
        p= new Promise<any>((resolve, reject)=>{
        console.log('trying to delete tag but it is locked');
        reject(AtticError.getSynchingError(DbActionNs.DbAction.delete));
      })
    }
    return p;
  }

  /*the note full object is not kept in the DB as json, is recreated everytime.*/

}

/*see how to manage remote rename*/
