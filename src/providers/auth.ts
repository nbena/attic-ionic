/*
This provider is used to handle authentication. It is possible either
to create a new account or to login.
*/
import { Injectable } from '@angular/core';
// import { Http, Headers } from '@angular/http';
//import { Storage } from '@ionic/storage';
// import { Storage} from 'ionic-angular';
import 'rxjs/add/operator/map';

 import { /*tokenNotExpired*/JwtHelper } from 'angular2-jwt';

//import { Const } from '../public/const';
import { User } from '../models/user';
import { Db } from './db';
//import { Platform } from 'ionic-angular';
import { HttpProvider} from './http';
import { AtticCache } from './attic-cache';

//import { AtticError } from '../public/errors'

/*
  Generated class for the Auth provider.

  See https://angular.io/docs/ts/latest/guide/dependency-injection.html
  for more info on providers and Angular 2 DI.
*/
@Injectable()
export class Auth {

  public token: any;
  public userid: string;


  constructor(private http: HttpProvider/*, private platform: Platform,
    public storage: Storage, */,private db: Db,
    private atticCache: AtticCache
  ) {
    console.log('Hello Auth Provider');
  }

  checkAuthentication():Promise<boolean>{
    return new Promise<boolean>((resolve, reject)=>{
      console.log('checking auth');
      this.db.getToken()
      .then(result=>{

        console.log('not-raw result is:');console.log(JSON.stringify(result));
        let helper:JwtHelper = new JwtHelper();

        if(result==null){
          resolve(false);
        }else{
          console.log('the exp date is');console.log(JSON.stringify(helper.getTokenExpirationDate(result.token)));
          if(!helper.isTokenExpired(result.token)){
            this.token = result.token;
            this.userid = result.userid;

            this.http.setToken(result.token);

            resolve(true);
          }else{
            console.log('token is expired');
            resolve(false);
          }
        }
      })
      .catch(error=>{
        console.log('error while trying to get token');
        console.log(JSON.stringify(error));
        reject(error);
      })
    })
  }


  createAccount(user: User){

  return new Promise((resolve, reject) => {

      // let headers = new Headers();
      // headers.append('Content-Type', 'application/json');
      //
      // let uri = Const.API_URI+'/api/users/create';
      //
      // this.http.post(uri, JSON.stringify(user), {headers: headers})
      //   .subscribe(res => {
      //
      //     let data = res.json();
      //     this.token = data.token;
      //     this.storage.set('token', data.token);
      //     resolve(data);
      //
      //   }, (err) => {
      //     reject(err);
      //   });
      this.http.unauthenticatedPut('/api/users/create',JSON.stringify(user))
      .then(token=>{
        // if(token as boolean){
          this.token = token;
          this.userid = user.userid;

          this.http.setToken(token);

          this.db.setToken(token, user.userid); //done asynchronously.
          resolve();
        // }else{
        //   reject(new Error(AtticError.POSTGRES_DUPLICATE_KEY_USERS));
        // }
      })
      .catch(error=>{
        console.log('error in auth');
        console.log(JSON.stringify(error.message));
        reject(error);
      })

  });

}

login(user: User){

  // return new Promise((resolve, reject) => {
  //
  //     let headers = new Headers();
  //     headers.append('Content-Type', 'application/json');
  //
  //     var uri = Const.API_URI+'/api/auth/login';
  //
  //     this.http.post(uri, JSON.stringify(user), {headers: headers})
  //       .subscribe(res => {
  //
  //         if(res.status!=200){
  //           reject(new Error(res.statusText));
  //         }
  //
  //         let data = res.json();
  //         //one we get the token, save it to local storage.
  //         this.token = data.result;
  //         this.userid = user.userid;
  //         this.db.setToken(data.result, user.userid);
  //
  //         resolve(data);
  //         // resolve(res.json());
  //
  //       }, (err) => {
  //         reject(err);
  //       });
  //
  // });
  return new Promise<void>((resolve, reject)=>{
    this.http.unauthenticatedPost('/api/auth/login', JSON.stringify(user))
    .then(token=>{
      console.log('token is');console.log(JSON.stringify(token));
      this.token = token;
      this.userid = user.userid;

      this.http.setToken(token);
      return this.db.setToken(token, user.userid); //done asynchronously.
    })
    .then(()=>{
      resolve();
    })
    .catch(error=>{
      console.log('error in auth');
      console.log(JSON.stringify(error.message));
      reject(error);
    })
  })


}

// logout(){
//   this.storage.set('token', '');
// }


public logout():Promise<void>{
  return new Promise<void>((resolve, reject)=>{
    this.db.logout(this.userid)
    .then(()=>{
      console.log('ok logout now remove userid');
      this.atticCache.clean();
      this.userid=null;
      resolve();
    }).catch(error=>{
      console.log('error in logout');console.log(JSON.stringify(error.message));
      reject(error);
    })
  })
}

}
