import { Injectable } from '@angular/core';
import { Http, Headers } from '@angular/http';
import 'rxjs/add/operator/map';
import { Const } from '../public/const';
//import { User } from '../models/user';

/*
  Generated class for the HttpProvider provider.

  See https://angular.io/docs/ts/latest/guide/dependency-injection.html
  for more info on providers and Angular DI.
*/
@Injectable()
export class HttpProvider {

  private token:string;

  constructor(public http: Http) {
    console.log('Hello HttpProvider Provider');
  }

  public setToken(token:string){
    this.token = token;
  }

  private mkAuthHeader():Headers{
    let headers = new Headers({'Authorization':this.token});
    return headers;
  }

  public get(finalUri:string):Promise<any>{
    return new Promise((resolve, reject)=>{

      // let headers = new Headers();
      // headers.append('Authorization', this.token);
      let headers:Headers = this.mkAuthHeader();

      let uri = Const.API_URI+finalUri;
      this.http.get(uri, {headers: headers})
        .subscribe(res=>{

          if(res.status!=200){
            reject(res.statusText);
          }
          let data = res.json();
          if(data.ok==false){
            throw new Error(data.msg);
          }
          resolve(data.result);
        },(err)=>{
          // console.log('get error');
          // console.log(JSON.stringify(err));
          reject(err);
        })
    });
  }




  public put(finalUri: string, body?: any){
    return new Promise((resolve, reject)=>{

      // let headers = new Headers();
      // headers.append('Authorization', this.token);
      let headers:Headers = this.mkAuthHeader();

      if(body!=null && body!=""){
        headers.append('Content-type', 'application/json');
        //some PUT API does not require a body (create tag).
      }

      let uri = Const.API_URI+finalUri;
      this.http.put(uri, body, {headers: headers})
        .subscribe(res=>{

          let data = res.json();
          if(data.ok==false){
            reject(data.msg);
          }
          if(data.result){
            resolve(data.result);
          }else{
            resolve(true);
          }

        },(err)=>{
          console.log('err in put');
          console.log(JSON.stringify(err));
          reject(err);
        })
    });
  }

  public unauthenticatedPost(finalUri:string, body:any):Promise<any>{
    return new Promise<any>((resolve, reject)=>{
          let headers = new Headers();
          headers.append('Content-Type', 'application/json');

          var uri = Const.API_URI+finalUri;

          this.http.post(uri, body/*JSON.stringify(body)*/, {headers: headers})
            .subscribe(res => {

              if(res.status!=200){
                reject(new Error(res.statusText));
              }

              let data = res.json();
              if(data.ok!=true){
                reject(data.msg);
              }else{
                resolve(data.result);
              }
              //one we get the token, save it to local storage.
              // this.token = data.result;
              // this.userid = user.userid;
              // this.db.setToken(data.result, user.userid);
              //
              // resolve(data);
              // resolve(res.json());
              // resolve(data.result);

            }, (err) => {
              reject(err);
            });
    })
   }


   public unauthenticatedPut(finalUri:string, body:any):Promise<any>{
     return new Promise<any>((resolve, reject)=>{
           let headers = new Headers();
           headers.append('Content-Type', 'application/json');

           var uri = Const.API_URI+finalUri;

           this.http.put(uri, body/*JSON.stringify(body)*/, {headers: headers})
             .subscribe(res => {

               if(res.status!=200){
                 reject(new Error(res.statusText));
               }

               let data = res.json();
               if(data.ok!=true){
                 reject(data.msg);
               }else{
                 resolve(data.result);
               }
               //one we get the token, save it to local storage.
               // this.token = data.result;
               // this.userid = user.userid;
               // this.db.setToken(data.result, user.userid);
               //
               // resolve(data);
               // resolve(res.json());
              //  resolve(data.result);

             }, (err) => {
               reject(err);
             });
     })
    }


  public post(finalUri: string, body?: any):Promise<any>{
    return new Promise((resolve, reject)=>{

      // let headers = new Headers();
      // headers.append('Authorization',  this.token);
      let headers:Headers = this.mkAuthHeader();

      if(body!=null && body!=""){
        headers.append('Content-type', 'application/json');
      }

      let uri = Const.API_URI+finalUri;
      this.http.post(uri, body, {headers: headers})
        .subscribe(res=>{

          let data = res.json();
          if(data.ok==false){
            reject(data.msg);
          }
          if(data.result){
            resolve(data.result);
          }else{
            resolve(true);
          }
        },(err)=>{
          reject(err);
        })
    });
  }


  public delete(finalUri: string){
    return new Promise((resolve, reject)=>{

      // let headers = new Headers();
      // headers.append('Authorization',  this.token);
      let headers:Headers = this.mkAuthHeader();
      //console.log('the fucking headers:');console.log(JSON.stringify(headers));

      let uri = Const.API_URI+finalUri;
      this.http.delete(uri, {headers:headers})
        .subscribe(res=>{

          let data = res.json();
          if(data.ok==false){
            reject(data.msg);
          }
          if(data.result){
            resolve(data.result);
          }else{
            resolve(true);
          }
        },(err)=>{
          reject(err);
        })
    });
  }

}
