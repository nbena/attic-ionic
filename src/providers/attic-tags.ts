import { Injectable } from '@angular/core';
import { Http, Headers } from '@angular/http';
import 'rxjs/add/operator/map';

import { Auth } from './auth';
// import { Const } from '../public/const';
// import { NoteExtraMin, NoteSmart, NoteFull } from '../models/notes';
// import { TagExtraMin, TagMin, TagFull } from '../models/tags';
import { Utils } from '../public/utils';

import { TagExtraMin, TagAlmostMin, TagFull } from '../models/tags';
import { Db } from './db';
import { NetManager } from './net-manager';
import { Synch } from './synch';

/*
  Generated class for the AtticTags provider.

  See https://angular.io/docs/ts/latest/guide/dependency-injection.html
  for more info on providers and Angular 2 DI.
*/
@Injectable()
export class AtticTags {

  constructor(public http: Http, public auth: Auth,
    private db: Db, private netManager: NetManager,
    private synch: Synch
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
        this.db.getNumberOfTags(this.auth.userid)
        .then(number=>{
          areThereTagsInTheDb = (number > 0) ? true : false;
          console.log('the number of tags is');
          console.log(number);
          // let useDb = !isNteworkAvailable || areThereNotesInTheDb || !force;
          useDb = Utils.shouldUseDb(isNteworkAvailable, areThereTagsInTheDb, force/*, this.synch.isSynching()*/);
          console.log('usedb tag: ');
          console.log(JSON.stringify(useDb));
          if(useDb){
            return this.db.getTagsMin(this.auth.userid);
          }else{
            console.log('no tags, using the network');
            return Utils.getBasic('/api/tags/all/min', this.http, this.auth.token);
          }
        })
        .then(fetchingResult=>{
          console.log('fetch result is:');
          console.log(JSON.stringify(fetchingResult));
          if(useDb){
            /*fetchingResult = NoteMin[] from the DB.*/
            resolve(fetchingResult);
          }else{
            /*fetchingResult = NoteMin[] from the network, need to insert.*/
            if(!this.synch.isTagLocked()){
              tags = fetchingResult as TagAlmostMin[];
              for(let i=0;i<tags.length;i++){
                this.db.insertTagMinQuietly(tags[i], this.auth.userid);
              }
            }else{
              console.log('fetched tags by title but it is locked');
            }
            resolve(tags);
          }
        })
        .catch(error=>{
          console.log('error tags:');
          console.log(JSON.stringify(error));
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
        Utils.getBasic('/api/tags/'+title, this.http, this.auth.token)
        .then(result=>{
          console.log('the resul from network is: ');
          console.log(JSON.stringify(result.tag));
          tag = result.tag as TagFull;
          /*inserting in the DB.*/
          /*===============================================*/
          /*tags are always min!!!! it just change the json_object*/
          if(!this.synch.isTagLocked()){
            this.db.insertTagMinQuietly(tag, this.auth.userid); /*this will be done asynchronously?*/
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
        this.db.getNumberOfTags(this.auth.userid)
        .then(number=>{
          areThereTagsInTheDb = (number > 0) ? true : false;
          useDb = Utils.shouldUseDb(this.netManager.isConnected, areThereTagsInTheDb, force/*, this.synch.isSynching()*/);
          callNet = !useDb;
          if(useDb){
            return this.db.getTagFull(title, this.auth.userid)
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
              resolve(tagFull);
            }
          }else{
            /*we have the note and it has been inserted into the DB*/
            resolve(tagFull);
          }
        })
        .then(fromNet=>{
          /*if here the note is not in the DB.*/
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
  createTag(tag: TagFull):Promise<any>{
    // return Utils.putBasic('/api/tags/'+title, '', this.http, this.auth.token);
    if(!this.synch.isTagLocked()){
      return this.db.createTag(tag, this.auth.userid);
    }else{
      return new Promise<any>((resolve, reject)=>{
        console.log('trying to create tag but it is locked');
        reject(new Error('synching'));
      })
    }
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

  changeTitle(tag: TagExtraMin, newTitle: string):Promise<any>{
    if( (!this.synch.isNoteFullyLocked()) && (!this.synch.isTagLocked()) ){
      return new Promise<any>((resolve, reject)=>{
        console.log('going to send');
        console.log(JSON.stringify({
          tag:{
            title: tag.title,
            newtitle: newTitle
          }
        }));
        Utils.postBasic('/api/tags/mod/change-title', JSON.stringify({
          tag:{
            title: tag.title,
            newtitle: newTitle
          }
        }),
        this.http,this.auth.token
      )
      .then(sentTitle=>{
        /*pushsing data to db*/
        return this.db.setTagTitle(tag, newTitle, this.auth.userid);
      })
      .then(changedLocally=>{
        resolve(true);
      })
      .catch(error=>{
        console.log('error in changing title');
        reject(error);
      })
      })
    }else{
      return new Promise<any>((resolve, reject)=>{
        console.log('trying to change title but it is locked');
        reject(new Error('synching'));
      });
    }
  }

  deleteTag(tag: TagExtraMin):Promise<any>{
    // return Utils.deleteBasic('/api/tags/'+tag.title, this.http, this.auth.token);
    if(!this.synch.isTagLocked()){
      return this.db.deleteTag(tag, this.auth.userid);
    }else{
      return new Promise<any>((resolve, reject)=>{
        console.log('trying to delete tag but it is locked');
        reject(new Error('synching'));
      })
    }
  }

  /*the note full object is not kept in the DB as json, is recreated everytime.*/

}
