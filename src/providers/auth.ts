import { Injectable } from '@angular/core';
import { Http, Headers } from '@angular/http';
import { Storage } from '@ionic/storage';
import 'rxjs/add/operator/map';

import { tokenNotExpired } from 'angular2-jwt';

import { Const } from '../public/const';
import { User } from '../models/user';

/*
  Generated class for the Auth provider.

  See https://angular.io/docs/ts/latest/guide/dependency-injection.html
  for more info on providers and Angular 2 DI.
*/
@Injectable()
export class Auth {

  public token: any;


  constructor(public http: Http, public storage: Storage) {
    console.log('Hello Auth Provider');
  }

//change
  checkAuthentication(){
    // return new Promise((resolve, reject) => {
    //
    //   //if token exists, load it.
    //   this.storage.get('token').then((value)=>{
    //
    //     this.token=value;
    //     let headers = new Headers();
    //     headers.append('Authorization', this.token);
    //
    //     this.http.get('${Const.API_URI}/notes/', {headers: headers})
    //       .subscribe(res=>{
    //         resolve(res);
    //       }, (err)=>{
    //         reject(err);
    //       });
    //   });
    // });
    return tokenNotExpired();
  }


  createAccount(user: User){

  return new Promise((resolve, reject) => {

      let headers = new Headers();
      headers.append('Content-Type', 'application/json');

      this.http.post('${Const.API_URI}/auth/create', JSON.stringify(user), {headers: headers})
        .subscribe(res => {

          let data = res.json();
          this.token = data.token;
          this.storage.set('token', data.token);
          resolve(data);

        }, (err) => {
          reject(err);
        });

  });

}

login(user: User){

  return new Promise((resolve, reject) => {

      let headers = new Headers();
      headers.append('Content-Type', 'application/json');

      var uri = Const.API_URI+"/auth/login";
      console.log("request: ", JSON.stringify(user));


      this.http.post(uri, JSON.stringify(user), {headers: headers})
        .subscribe(res => {

          let data = res.json();
          this.token = data.token;
          this.storage.set('token', data.token);
          resolve(data);

          resolve(res.json());
        }, (err) => {
          reject(err);
        });

  });

}

logout(){
  this.storage.set('token', '');
}

}
