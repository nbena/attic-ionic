/*
This provider is used to handle authentication. It is possible either
to create a new account or to login.
*/
import { Injectable } from '@angular/core';
import { Http, Headers } from '@angular/http';
import { Storage } from '@ionic/storage';
// import { Storage} from 'ionic-angular';
import 'rxjs/add/operator/map';

import { tokenNotExpired } from 'angular2-jwt';

import { Const } from '../public/const';
import { User } from '../models/user';
import { Db } from './db';
import { Platform } from 'ionic-angular';

/*
  Generated class for the Auth provider.

  See https://angular.io/docs/ts/latest/guide/dependency-injection.html
  for more info on providers and Angular 2 DI.
*/
@Injectable()
export class Auth {

  public token: any;
  public userid: string;


  constructor(private http: Http, private platform: Platform,
    public storage: Storage, private db: Db) {
    console.log('Hello Auth Provider');
  }

  checkAuthentication(){

    //return this.platform.ready().then(ready=>{
      console.log('checking auth');
      return this.db.getToken()
      .then(result=>{
        // console.log('db result in checkauth is');
        // console.log(JSON.stringify(result));
        // this.userid = result.userid;
        // if(tokenNotExpired(result.token)){
        //   this.token = result.token;
        //   return true;
        // }else{
        //   return false;
        // }
        console.log('raw result is:');
        console.log(JSON.stringify(result));
        if(result.rows.length <= 0){
          return false;
        }else{
          this.token = result.rows.item(0).token;
          this.userid = result.rows.item(0).userid;
          return true;
        }
      })
      .catch(error=>{
        console.log('error while trying to get token');
        console.log(JSON.stringify(error));
        return false;
      })
    //})
  }


  createAccount(user: User){

  return new Promise((resolve, reject) => {

      let headers = new Headers();
      headers.append('Content-Type', 'application/json');

      let uri = Const.API_URI+'/api/users/create';

      this.http.post(uri, JSON.stringify(user), {headers: headers})
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

      var uri = Const.API_URI+'/api/auth/login';

      this.http.post(uri, JSON.stringify(user), {headers: headers})
        .subscribe(res => {

          if(res.status!=200){
            reject(new Error(res.statusText));
          }

          let data = res.json();
          //one we get the token, save it to local storage.
          this.token = data.result;
          this.userid = user.userid;
          this.db.setToken(data.result, user.userid);

          resolve(data);
          // resolve(res.json());

        }, (err) => {
          reject(err);
        });

  });

}

logout(){
  this.storage.set('token', '');
}

}
