import { Injectable } from '@angular/core';
import { Http, Headers } from '@angular/http';
/* importing auth because I need the token. */
// import { Auth } from '../providers/auth';
import { Const } from '../public/const';
import { NoteBarebon, NoteFull, NoteMin, NoteSQLite } from '../models/notes';
import { TagExtraMin, TagFull, TagSQLite } from '../models/tags';
import { ToastController, AlertController } from 'ionic-angular';

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

static putBasic(uriFinal: string, body: any, http: Http, token: any){
  return new Promise((resolve, reject)=>{

    let headers = new Headers();
    headers.append('Authorization', token);

    if(body!=null && body!=""){
      headers.append('Content-type', 'application/json');
    }

    let uri = Const.API_URI+uriFinal;
    http.put(uri, body, {headers: headers})
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

static postBasic(uriFinal: string, body: any, http: Http, token: any){
  return new Promise((resolve, reject)=>{

    let headers = new Headers();
    headers.append('Authorization', token);

    if(body!=null && body!=""){
      headers.append('Content-type', 'application/json');
    }

    let uri = Const.API_URI+uriFinal;
    http.post(uri, body, {headers: headers})
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


static deleteBasic(uriFinal: string, http: Http, token: any){
  return new Promise((resolve, reject)=>{

    let headers = new Headers();
    headers.append('Authorization', token);

    let uri = Const.API_URI+uriFinal;
    http.delete(uri, {headers: headers})
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

static logTags(tag: TagExtraMin):string{
  let result='';
  result+=(' id: '+tag._id);
  return result;
}

static logNote(note: NoteBarebon):string{
  let result = '';
  result+=('title '+note.title);
  result+=(' text '+note.text);
  result+=(' isDone '+(note.isDone ? "true" : "false"));
  result+=(' links '+note.links.toString());

  if(note instanceof NoteFull || note instanceof NoteMin){
    result+='mainTags: ';
    for(let i=0;i<note.mainTags.length;i++){
      result+=Utils.logTags(<TagExtraMin>note.mainTags[i]);
    }
    result+='otherTags: ';
    for(let i=0;i<note.otherTags.length;i++){
      result+=Utils.logTags(<TagExtraMin>note.otherTags[i]);
    }
  }

  return result;
}

static presentToast(toastCtrl: ToastController, message: string){
  let toast = toastCtrl.create({
    message: message,
    duration: 2000,
    position: 'bottom'
  });
  toast.present();
}

static askConfirm(alertCtrl: AlertController, message: string, cb: ((_ :boolean)=>void)){
  let alert = alertCtrl.create({
    title: 'Confirm delete',
    message: message,
    buttons: [
      {
        text: 'Cancel',
        role: 'cancel',
        handler: () => {
          console.log('nothing to do');
          cb(false);
        }
      },
      {
        text: 'Ok',
        handler: () => {
          console.log('cancellation confirmed');
          cb(true);
        }
      }
    ]
  });
  alert.present();
}

static arrayDiff(arg0: any[], arg1: any[]){
  return arg0.filter(function(el){
      return arg1.indexOf(el)<0;
    })
  }

  static arrayDiff2(arg0: TagExtraMin[], arg1: TagExtraMin[]){
    return arg0.filter(function(el){
        return arg1.indexOf(el)<0;
      })
  }

  static arrayDiff3(arg0: TagExtraMin[], arg1: TagExtraMin[]){
    // let k=0;
    let array: TagExtraMin[];
    // for(let i=0;i<arg0.length;i++){
    //   for(let j=0;j<arg1.length;j++){
    //     console.log("matching: "+arg0[i]._id+" and "+arg1[j]._id, "? "+arg0[i]._id!=arg1[j]._id);
    //     if(arg0[i]._id!=arg1[j]._id){
    //       array.push(arg0[i]);
    //
    //     }

console.log("arg0 length is "+arg0.length);
console.log("arg1 length is "+arg1.length);
for(let i=0;i<arg0.length;i++){
  console.log(i);
  //console.log(j);
        let obj = arg0[i];
        let bool = true;
        for(let j=0;j<arg1.length;j++){
                if(obj._id==arg1[j]._id){
                        bool=false;
                }
        }
        if(bool){
                array.push(obj);
                bool = false;
        }
}
console.log("the result is: ");
console.log(array.length.toString());
return array;
      }
    //}
    // return array;

    // console.log(JSON.stringify(arg0)+"\n"+JSON.stringify(arg1));
    // return arg0.filter(x => arg1.indexOf(x) == -1);
  //}

static pushAll(arg0: TagExtraMin[], arg1: TagExtraMin[]){
  for(let i of arg1){
    arg0.push(i);
  }

}

static pushAllJSON(arg0: TagExtraMin[], arg1: string[]){
  for(let i of arg1){
    arg0.push(JSON.parse(i));
  }
}

static myIndexOf(arg0: TagExtraMin[], arg1: TagExtraMin): number{
  // console.log('the first string is');
  // console.log(JSON.stringify(arg0));
  let i = -1;
  for(let j=0;j<arg0.length;j++){
    if(arg0[j]._id.localeCompare(arg1._id)==0){
      i=j;
      j=arg0.length;
    }
  }
  return i;
}

// static assign(arg0: TagExtraMin[], arg1: TagExtraMin[]){
//   for(let tag of arg0){
//     tag
//   }
// }

static fromTagsToString(tags: TagExtraMin[]):string[]{
  let result : string [] = [];
  for(let i=0;i<tags.length;i++){
    result.push(tags[i]._id);
  }
  return result;
}

static pushLink(alertCtrl:AlertController, cb: ((_: any)=>void) ){
    let prompt=alertCtrl.create({
      title: 'New link',
      message: 'Insert the new link',
      inputs:[
        {
          name: 'link',
          placeholder: 'link'
        }
      ],
      buttons:[
        {
          text: 'Cancel',
          handler: data => {}
        },
        {
          text: 'Add',
          handler: data=>{
            cb(data);
            // console.log('pushed');
            // console.log(data.link);
          }
        }
      ]
    });
    prompt.present();
  }

  static getEffectiveTagsFromNotes(note: NoteFull):TagFull[]{
    let array: TagFull[];
    if(typeof note== 'NoteFull'){
      array = note.mainTags.concat(note.otherTags);
    }else if(typeof note == 'NoteSQLite'){
      let noteRes = <NoteSQLite>note;
      array = noteRes.mainTags.concat(noteRes.otherTags, noteRes.mainTagsToAdd, noteRes.otherTagsToAdd);
      array = Utils.arrayDiff(array, noteRes.mainTagsToRemove.concat(noteRes.otherTagsToRemove));
    // }
    // array = note.mainTags.concat(note.otherTags, note.mainTagsToAdd, note.otherTagsToAdd);
    // array = Utils.arrayDiff(array, note.mainTagsToRemove.concat(note.otherTagsToRemove));
    // return array;
  }
  return array;
}

 static getEffectiveNotesFromTags(tag: TagFull):NoteFull[]{
   let array: NoteFull[];
   if(typeof tag == 'TagFull'){
     array = tag.notes;
   }else if(typeof tag == 'TagSQLite'){
     let tagRes = <TagSQLite>tag;
     array = tagRes.notes.concat(tagRes.addedNotes);
     array = Utils.arrayDiff(array, tagRes.removedNotes);
   }
   return array;
 }

}
