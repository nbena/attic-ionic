import { Injectable } from '@angular/core';
import { Http, Headers } from '@angular/http';
import 'rxjs/add/operator/map';

import { Auth } from './auth';
// import { Const } from '../public/const';
// import { NoteExtraMin, NoteSmart, NoteFull } from '../models/notes';
// import { TagExtraMin, TagMin, TagFull } from '../models/tags';
import { Utils } from '../public/utils';

import { TagExtraMin } from '../models/tags';

/*
  Generated class for the AtticTags provider.

  See https://angular.io/docs/ts/latest/guide/dependency-injection.html
  for more info on providers and Angular 2 DI.
*/
@Injectable()
export class AtticTags {

  constructor(public http: Http, public auth: Auth) {
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

  loadTagsMin(){
    return Utils.getBasic('/api/tags/all/min', this.http, this.auth.token);
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

  filterTagByTitle(tags: TagExtraMin[], title: string):TagExtraMin[]{
    return tags.filter((tag)=>{
      return tag.title.indexOf(title.toLowerCase())>-1;
    });
  }

  changeTitle(tag: TagExtraMin, newTitle: string):Promise<any>{
    return Utils.postBasic('/api/tags/mod/changetitle', JSON.stringify({tag:
      {title: tag.title, newtitle: newTitle}}),this.http, this.auth.token);
  }

  deleteTag(tag: TagExtraMin):Promise<any>{
    return Utils.deleteBasic('/api/tags/'+tag.title, this.http, this.auth.token);
  }

}
