import { Injectable } from '@angular/core';
import { Auth } from './auth';
import { NetManager } from './net-manager';
import { UserSummary } from '../models/user_summary';
import { AtticCache } from './attic-cache';
import { Db } from './db';
import 'rxjs/add/operator/map';
import {HttpProvider} from './http';

/*
  Generated class for the AtticUserProvider provider.

  See https://angular.io/docs/ts/latest/guide/dependency-injection.html
  for more info on providers and Angular DI.
*/
@Injectable()
export class AtticUserProvider {

  constructor(public http: HttpProvider,
    private auth: Auth,
    private netManager: NetManager,
    private db: Db,
    private atticCache: AtticCache
  ) {
    console.log('Hello AtticUserProvider Provider');
  }


  getUserSummary(force: boolean):Promise<UserSummary>{
    return new Promise<UserSummary>((resolve, reject)=>{
      let useDb: boolean = true;
      let isNteworkAvailable: boolean = this.netManager.isConnected;
      if(force){
        useDb=false;
      }
      if(!isNteworkAvailable){
        useDb = true;
      }
      console.log('use db summary');console.log(JSON.stringify(useDb));
      let p:Promise<UserSummary>;
      // let userSummary:UserSummary;
      if(useDb){
        if(!this.atticCache.isSummaryEmpty()){
          console.log('using cache');
          p=new Promise<UserSummary>((resolve, reject)=>{resolve(this.atticCache.getSummary())});
        }else{
          console.log('the summary is not in the cache');
          p=this.db.getUserSummary(this.auth.userid);
        }
      }else{
        p=this.http.get('/api/users/'+this.auth.userid);
      }
      p.then(fetchingResult=>{
        // userSummary = fetchingResult as UserSummary;
        resolve(fetchingResult);
        if(useDb){
          //resolve(userSummary);
          return new Promise<UserSummary>((resolve, reject)=>{resolve(fetchingResult as UserSummary)});
        }else{
          /*just set free*/
          this.db.insertSetFree((fetchingResult as UserSummary).data.isfree, this.auth.userid);
          return new Promise<UserSummary>((resolve, reject)=>{resolve(fetchingResult as UserSummary)});
        }
      })
      .then(summary=>{
        this.atticCache.setSummary(summary);
        // resolve(summary);
      })
      .catch(error=>{
        console.log('error in get summary provider');
        console.log(JSON.stringify(error.message));
        reject(error);
      })
    })
  }


  public deleteEverything():Promise<void>{
    return this.db.empty(this.auth.userid);
  }

}
