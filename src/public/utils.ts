import { Injectable } from '@angular/core';
import { Http, Headers } from '@angular/http';
/* importing auth because I need the token. */
// import { Auth } from '../providers/auth';
import { Const } from '../public/const';

export class Utils{
  static getBasic(uriFinal: string, http: Http, token: any){
    return new Promise((resolve, reject)=>{

      let headers = new Headers();
      headers.append('Authorization', token);

      let uri = Const.API_URI+uriFinal;
      http.get(uri, {headers: headers})
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
