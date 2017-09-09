import { Injectable } from '@angular/core';
import { Auth } from './auth';
import { NetManager } from './net-manager';
import { UserSummary } from '../models/user_summary';
// import { AtticCache } from './attic-cache';
import { Db } from './db';
import 'rxjs/add/operator/map';
import {HttpProvider} from './http';
// import { FormControl  } from '@angular/forms';
import { Events } from 'ionic-angular';

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
    // private atticCache: AtticCache,
    private events: Events
  ) {
    console.log('Hello AtticUserProvider Provider');
  }

  private mixSummary(fromDb:UserSummary, fromNet:UserSummary):UserSummary{
    let ret:UserSummary = fromNet;
    ret.data.logscount = fromDb.data.logscount;
    return ret;
  }


  //summary is not cachable because it requires a db query for the count.
  public getUserSummary(force:boolean):Promise<UserSummary>{
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
      let p:Promise<UserSummary>[];
      if(useDb){
        p = [this.db.getUserSummary(this.auth.userid)];
      }else{
        p = [this.db.getUserSummary(this.auth.userid), this.http.get('/api/users/'+this.auth.userid)];
      }
      Promise.all(p)
      .then(results=>{
        if(useDb){
          resolve(results[0]);
        }else{
          //create a new summary object by mixing the two.
          let trueRes:UserSummary = this.mixSummary(results[0], results[1]);
          resolve(trueRes);
          this.db.insertSetFree(results[1].data.isfree, this.auth.userid);
        }
      })
      .catch(error=>{
        console.log('error in get summary provider');
        console.log(JSON.stringify(error.message));
        reject(error);
      })
    })
  }


  // getUserSummary(force: boolean):Promise<UserSummary>{
  //   return new Promise<UserSummary>((resolve, reject)=>{
  //     let useDb: boolean = true;
  //     let isNteworkAvailable: boolean = this.netManager.isConnected;
  //     if(force){
  //       useDb=false;
  //     }
  //     if(!isNteworkAvailable){
  //       useDb = true;
  //     }
  //     console.log('use db summary');console.log(JSON.stringify(useDb));
  //     let p:Promise<UserSummary>;
  //     // let userSummary:UserSummary;
  //     if(useDb){
  //       // if(!this.atticCache.isSummaryEmpty()){
  //       //   console.log('using cache');
  //       //   p=Promise.resolve(this.atticCache.getSummary());
  //       // }else{
  //       //   console.log('the summary is not in the cache');
  //         p=this.db.getUserSummary(this.auth.userid);
  //       // }
  //     }else{
  //       p=this.http.get('/api/users/'+this.auth.userid);
  //     }
  //
  //     p.then(fetchingResult=>{
  //       // userSummary = fetchingResult as UserSummary;
  //       resolve(fetchingResult);
  //       if(useDb){
  //         //resolve(userSummary);
  //         // p=Promise.resolve(fetchingResult as UserSummary);
  //       }else{
  //         /*just set free*/
  //         this.db.insertSetFree((fetchingResult as UserSummary).data.isfree, this.auth.userid);
  //         // return Promise.resolve(fetchingResult as UserSummary);
  //       }
  //     })
  //     // .then(summary=>{
  //     //   this.atticCache.setSummary(summary);
  //     //   // resolve(summary);
  //     // })
  //     .catch(error=>{
  //       console.log('error in get summary provider');
  //       console.log(JSON.stringify(error.message));
  //       reject(error);
  //     })
  //   })
  // }


  //not used.
  // public isUserValid(control:FormControl):Promise<boolean>{
  //   return new Promise<boolean>((resolve, reject)=>{
  //     this.http.post('/api/users/is-available', JSON.stringify({userid: control.value.userid}))
  //     .then(value=>{
  //       resolve(value);
  //     }).catch(error=>{
  //       console.log('error in get user available');console.log(error.message);
  //       reject(error);
  //     })
  //   })
  // }


  public deleteEverything():Promise<void>{
    //this.atticCache.clean();
    this.events.publish('clean-cache');
    return this.db.empty(this.auth.userid);
  }

  // public logout():Promise<void>{
  //   return new Promise<void>((resolve, reject)=>{
  //     this.db.logout(this.auth.userid)
  //     .then(()=>{
  //       console.log('ok logout now remove userid');
  //       this.auth.userid=null;
  //       resolve();
  //     }).catch(error=>{
  //       console.log('error in logout');console.log(JSON.stringify(error.message));
  //       reject(error);
  //     })
  //   })
  // }

}
