import { Injectable } from '@angular/core';
import { Http, Headers } from '@angular/http';
import 'rxjs/add/operator/map';

import { Auth } from './auth';
import { Const } from '../public/const';
import { NoteExtraMin, NoteSmart, NoteFull } from '../models/notes';
import { TagExtraMin, TagMin, Tag } from '../models/tags';
import { Utils } from '../public/utils';

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


  loadFull(){
    return Utils.getBasic('/api/tags/all', this.http, this.auth.token);
  }

  loadNoPopulation(){
    return Utils.getBasic('/api/tags/all/unpop', this.http, this.auth.token);

  }

  loadTagsMin(){
    return Utils.getBasic('/api/tags/all/min', this.http, this.auth.token);
  }

  tagById(id: string){
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
    return Utils.getBasic('/api/tags/'+id, this.http, this.auth.token);
  }

}
