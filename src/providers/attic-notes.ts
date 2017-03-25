import { Injectable } from '@angular/core';
import { Http, Headers } from '@angular/http';
/* importing auth because I need the token. */
import { Auth } from './auth';
import { Const } from '../public/const';
import { /*NoteExtraMin, NoteSmart, NoteFull*/NoteMin } from '../models/notes';
import { Utils } from '../public/utils';

import 'rxjs/add/operator/map';

/*
  Generated class for the AtticNotes provider.

  See https://angular.io/docs/ts/latest/guide/dependency-injection.html
  for more info on providers and Angular 2 DI.
*/
@Injectable()
export class AtticNotes {

  constructor(public http: Http, public auth: Auth) {
    console.log('Hello AtticNotes Provider');
  }


  /**
  *loading all the notes.
  */
  loadFull(){
    // return new Promise((resolve, reject)=>{
    //
    //   let headers = new Headers();
    //   headers.append('Authorization', this.auth.token);
    //
    //   let uri = Const.API_URI+'/api/notes/all';
    //   this.http.post(uri, {}, {headers: headers})
    //   .subscribe(res=>{
    //
    //     let data=res.json();
    //     console.log(data);
    //     //handle error.
    //     if(data.ok==false){
    //       throw new Error(data.msg);
    //     }
    //     resolve(data.result);
    //   }, (err)=>{
    //     reject(err);
    //   })
    // });
    return Utils.getBasic('/api/notes/all', this.http, this.auth.token);
  }


  loadNoPopulation(){
    // return new Promise((resolve, reject)=>{
    //
    //   let headers = new Headers();
    //   headers.append('Authorization', this.auth.token);
    //
    //   let url = Const.API_URI;
    //   url = url+'/api/notes/all/unpop';
    //   this.http.get(url,{headers: headers})
    //     .subscribe(res=>{
    //
    //       let data=res.json();
    //       // console.log(data);
    //       //handle error.
    //       if(data.ok==false){
    //         throw new Error(data.msg);
    //       }
    //       resolve(data.result);
    //     }, (err)=>{
    //       reject(err);
    //     })
    // });
    return Utils.getBasic('/api/notes/all/unpop', this.http, this.auth.token);
  }

  loadNotesMin(){
    // return new Promise((resolve, reject)=>{
    //
    //   let headers = new Headers();
    //   headers.append('Authorization', this.auth.token);
    //
    //   let uri = Const.API_URI+'/api/notes/all/min';
    //   this.http.get(uri, {headers: headers})
    //     .subscribe(res=>{
    //
    //       let data = res.json();
    //       if(data.ok==false){
    //         throw new Error(data.msg);
    //       }
    //       resolve(data.result);
    //     }, (err)=>{
    //       reject(err);
    //     })
    // });
    return Utils.getBasic('/api/notes/all/min', this.http, this.auth.token);
  }

  noteById(id: string){
    // return new Promise((resolve, reject)=>{
    //
    //   let headers = new Headers();
    //   headers.append('Authorization', this.auth.token);
    //
    //   let uri = Const.API_URI+'/api/notes/'+id;
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
    return Utils.getBasic('/api/notes/'+id, this.http, this.auth.token);
  }

  createNote(note: NoteMin){
    return Utils.putBasic('/api/notes/create', JSON.stringify({note:note}), this.http, this.auth.token);
  }

  notesByTag(tags: string[]){
    return Utils.postBasic('/api/notes/by-tag/unpop', JSON.stringify({tags: tags}), this.http, this.auth.token);
  }

  notesByMainTag(tags: string[]){
    return Utils.postBasic('/api/notes/by-tag/unpop', JSON.stringify({mainTags: tags}), this.http, this.auth.token);
  }

  notesByOtherTag(tags: string[]){
    return Utils.postBasic('/api/notes/by-tag/unpop', JSON.stringify({otherTags: tags}), this.http, this.auth.token);
  }

  notesByTitle(title: string){
    return Utils.postBasic('/api/notes/by-title/reg/unpop', JSON.stringify({title: title}), this.http, this.auth.token);
  }

  notesByText(text: string){
    return Utils.postBasic('/api/notes/by-text/unpop', JSON.stringify({text: text}), this.http, this.auth.token);
  }

}
