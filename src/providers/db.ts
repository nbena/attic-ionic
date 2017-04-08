import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import { SQLite } from 'ionic-native';
import { Platform } from 'ionic-angular';
import { Query } from '../public/query';
import 'rxjs/add/operator/map';

/*
  Generated class for the Db provider.

  See https://angular.io/docs/ts/latest/guide/dependency-injection.html
  for more info on providers and Angular 2 DI.
*/
@Injectable()
export class Db {

  open : boolean = false; /*to be sure everything is ok.*/
  private db : SQLite;

  constructor(private platform: Platform) {
    console.log('Hello Db Provider');

    if(!this.open) {
      this.platform.ready().then((ready) => {
        this.db = new SQLite();
        this.db.openDatabase(
          {name: "attic.db", location: "default"})
            .then(() => {
              return this.db.executeSql(Query.CREATE_NOTES_TABLE,{})
            })
            .then(()=>{
              return this.db.executeSql(Query.CREATE_TAGS_TABLE, {})
            })
            .then(()=>{
              return this.db.executeSql(Query.CREATE_NOTES_TO_SAVE_TABLE, {})
            })
            .then(()=>{
              return this.db.executeSql(Query.CREATE_TAGS_TO_SAVE_TABLE, {})
            })
            .then(()=>{
              this.open = true;
              // return;
            })
            .catch(error=>{
              this.open=false;
              console.log('error in creating tables.');
              console.log(JSON.stringify(error));
            })


              // this.db.executeSql(Query.CREATE_NOTES_TABLE,{})
              // .then(()=>{
              //   this.db.executeSql(Query.CREATE_TAGS_TABLE, {})
              // })
              // .then(()=>{
              //   this.db.executeSql(Query.CREATE_NOTES_TO_SAVE_TABLE, {})
              // })
              // .then(()=>{
              //   this.db.executeSql(Query.CREATE_TAGS_TO_SAVE_TABLE, {})
              // })
              // .then(()=>{
              //   this.open = true;
              //   return;
              // })
              // .catch(error=>{
              //   this.open=false;
              //   console.log('error in creating tables.');
              //   console.log(JSON.stringify(error));
              // })
        //})

      //  );
        });
    //});
  }

}

// public getPokemon(): Promise<any> {
// return new Promise((resolve, reject) => {
//     this.platform.ready().then((readySource) => {
//         this.storage.executeSql("SELECT * FROM pokemon", []).then((data) => {
//             let pokemon = [];
//             if(data.rows.length > 0) {
//                 for(let i = 0; i < data.rows.length; i++) {
//                     pokemon.push({
//                         id: data.rows.item(i).id,
//                         name: data.rows.item(i).name,
//                         url: data.rows.item(i).url
//                     });
//                 }
//             }
//             resolve(pokemon);
//         }, (error) => {
//             reject(error);
//         });
//     });
// });
// }
//
// public createPokemon(name: string, url: string) {
// return new Promise((resolve, reject) => {
//     this.platform.ready().then((readySource) => {
//         this.storage.executeSql("INSERT INTO pokemon (name, url) VALUES (?, ?)", [name, url]).then((data) => {
//             resolve(data);
//         }, (error) => {
//             reject(error);
//         });
//     });
// });
// }
//
// }

}
