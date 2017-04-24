import { Injectable } from '@angular/core';
import { Http, Headers } from '@angular/http';
import 'rxjs/add/operator/map';

import { Auth } from './auth';
// import { Const } from '../public/const';
// import { NoteExtraMin, NoteSmart, NoteFull } from '../models/notes';
// import { TagExtraMin, TagMin, TagFull } from '../models/tags';
import { Utils } from '../public/utils';

import { TagExtraMin, TagAlmostMin } from '../models/tags';
import { Db } from './db';
import { NetManager } from './net-manager';

/*
  Generated class for the AtticTags provider.

  See https://angular.io/docs/ts/latest/guide/dependency-injection.html
  for more info on providers and Angular 2 DI.
*/
@Injectable()
export class AtticTags {

  constructor(public http: Http, public auth: Auth,
    private db: Db, private netManager: NetManager) {
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
          useDb = Utils.shouldUseDb(isNteworkAvailable, areThereTagsInTheDb, force);
          console.log('usedb note: ');
          console.log(JSON.stringify(useDb));
          if(useDb){
            return this.db.getTagsMin(this.auth.userid);
          }else{
            console.log('no notes, using the network');
            return Utils.getBasic('/api/tags/all/min', this.http, this.auth.token);
          }
        })
        .then(fetchingResult=>{
          if(useDb){
            /*fetchingResult = NoteMin[] from the DB.*/
            resolve(fetchingResult);
          }else{
            /*fetchingResult = NoteMin[] from the network, need to insert.*/
            tags = fetchingResult as TagAlmostMin[];
            for(let i=0;i<tags.length;i++){
              this.db.insertNoteMinQuietly(tags[i], this.auth.userid);
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

  tagByTitle(title: string):Promise<any>{
    // return new Promise((resolve, reject)=>{
    //
    //   let headers = new Headers();
    //   headers.append('Authorization', this.auth.token);
    //
    //   let uri = Const.API_URI+'/api/tags/'+id;
    //   this.http.get(uri, {headers: headers})
    //     .subscribe(res=>{
    //
    //       let data = res.json();
    //       if(data.ok==false){
    //         throw new Error(data.msg);
    //       }
    //       resolve(data.result);
    //     },(err)=>{
    //       reject(err);
    //     })
    // });
    return Utils.getBasic('/api/tags/'+title, this.http, this.auth.token);
  }

  /*
  * create a new tag.
  */
  createTag(title: string):Promise<any>{
    return Utils.putBasic('/api/tags/'+title, '', this.http, this.auth.token);
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
    return Utils.postBasic('/api/tags/mod/changetitle', JSON.stringify({tag:
      {title: tag.title, newtitle: newTitle}}),this.http, this.auth.token);
  }

  deleteTag(tag: TagExtraMin):Promise<any>{
    // return Utils.deleteBasic('/api/tags/'+tag.title, this.http, this.auth.token);
    return this.db.deleteTag(tag, this.auth.userid);
  }

  /*the note full object is not kept in the DB as json, is recreated everytime.*/

}
