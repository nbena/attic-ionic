import { Injectable } from '@angular/core';
import { Http, Headers } from '@angular/http';
/* importing auth because I need the token. */
import { Auth } from './auth';
import { Const } from '../public/const';
import { NoteExtraMin, NoteSmart, NoteFull } from '../models/notes';

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
    return new Promise((resolve, reject)=>{

      let headers = new Headers();
      headers.append('Authorization', this.auth.token);

      let uri = Const.API_URI+'/api/notes/all';
      this.http.post(uri, {}, {headers: headers})
      .subscribe(res=>{

        let data=res.json();
        console.log(data);
        //handle error.
        if(data.ok==false){
          throw new Error(data.msg);
        }
        resolve(data.result);
      }, (err)=>{
        reject(err);
      })
    });
  }


  loadNoPopulation(){
    return new Promise((resolve, reject)=>{

      let headers = new Headers();
      headers.append('Authorization', this.auth.token);

      let url = Const.API_URI;
      url = url+'/api/notes/all/unpop';
      this.http.get(url,{headers: headers})
        .subscribe(res=>{

          let data=res.json();
          // console.log(data);
          //handle error.
          if(data.ok==false){
            throw new Error(data.msg);
          }
          resolve(data.result);
        }, (err)=>{
          reject(err);
        })
    });
  }

  loadNotesMin(){
    return new Promise((resolve, reject)=>{

      let headers = new Headers();
      headers.append('Authorization', this.auth.token);

      let uri = Const.API_URI+'/api/notes/all/min';
      this.http.get(uri, {headers: headers})
        .subscribe(res=>{

          let data = res.json();
          if(data.ok==false){
            throw new Error(data.msg);
          }
          resolve(data.result);
        }, (err)=>{
          reject(err);
        })
    });
  }

  noteById(id: string){
    return new Promise((resolve, reject)=>{

      let headers = new Headers();
      headers.append('Authorization', this.auth.token);

      let uri = Const.API_URI+'/api/notes/'+id;
      this.http.get(uri, {headers: headers})
        .subscribe(res=>{

          let data = res.json();
          if(data.ok==false){
            throw new Error(data.msg);
          }
          resolve(data.result);
        },(err)=>{
          reject(err);
        })
    });
  }

}
