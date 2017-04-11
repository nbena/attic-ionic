import { Injectable } from '@angular/core';
// import { Http } from '@angular/http';
// import 'rxjs/add/operator/map';
//import { Network } from '@ionic-native/network';
import { Network } from '@ionic-native/network';

/*
  Generated class for the NetManager provider.

  See https://angular.io/docs/ts/latest/guide/dependency-injection.html
  for more info on providers and Angular 2 DI.
*/
@Injectable()
export class NetManager {

  isConnected: boolean = false;
  disconnectedSubscription : any;
  connectedSubscription : any;

  constructor(private network: Network) {

    this.disconnectedSubscription = this.network.onDisconnect().subscribe(()=>{
      console.log('network disconnected');
    })

    this.connectedSubscription = this.network.onConnect().subscribe(()=>{
      console.log('network connected');
    })

  }

  unwatchDisconnection(){
    this.disconnectedSubscription.unsubscribe();
  }

  unwatchConnection(){
    this.connectedSubscription.unsubscribe();
  }



}
