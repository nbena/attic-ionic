import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import { Auth } from './auth';
import { NetManager } from './net-manager';
import { UserSummary } from '../models/user_summary';
import { Db } from './db';
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
      let useForce: boolean = force;
      let useDb: boolean = false;
      let isNteworkAvailable: boolean = this.netManager.isConnected;
      if(force){
        useDb=false;
      }
      if(!isNteworkAvailable){
        useDb = true;
      }
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

}
