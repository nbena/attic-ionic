import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import { Auth } from './auth';
import { NetManager } from './net-manager';
import { UserSummary } from '../models/user_summary';
import { Db } from './db';
import { Utils } from '../public/utils';
import 'rxjs/add/operator/map';

/*
  Generated class for the AtticUserProvider provider.

  See https://angular.io/docs/ts/latest/guide/dependency-injection.html
  for more info on providers and Angular DI.
*/
@Injectable()
export class AtticUserProvider {

  constructor(public http: Http,
    private auth: Auth,
    private netManager: NetManager,
    private db: Db
  ) {
    console.log('Hello AtticUserProvider Provider');
  }


  getUserSummary(force: boolean):Promise<UserSummary>{
    return new Promise<UserSummary>((resolve, reject)=>{
      let useDb: boolean = true;
      let isNteworkAvailable: boolean = this.netManager.isConnected;
      // console.log('is connected');
      // console.log(JSON.stringify(isNteworkAvailable));
      if(force){
        useDb=false;
      }
      if(!isNteworkAvailable){
        useDb = true;
      }
      console.log('use db summary');
      console.log(JSON.stringify(useDb));
      let p;
      let userSummary:UserSummary;
      if(useDb){
        // console.log('use db');
        p=this.db.getUserSummary(this.auth.userid);
      }else{
        // console.log('not use db');
        p=Utils.getBasic('/api/users/'+this.auth.userid, this.http, this.auth.token);
      }
      p.then(fetchingResult=>{
        userSummary = fetchingResult as UserSummary;
        if(useDb){
          resolve(userSummary);
        }else{
          /*just set free*/
          this.db.insertSetFree(userSummary.data.isfree, this.auth.userid);
          resolve(userSummary);
        }
      })
      // return this.db.getUserSummary(this.auth.userid);
      this.db.getUserSummary(this.auth.userid)
      .then(summary=>{
        resolve(summary);
      })
      .catch(error=>{
        console.log('error in get summary provider');
        console.log(JSON.stringify(error));
        reject(error);
      })
    })
  }


  public deleteEverything():Promise<void>{
    return this.db.empty(this.auth.userid);
  }

}
