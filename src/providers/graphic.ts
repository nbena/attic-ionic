import { Injectable } from '@angular/core';
//import { Http } from '@angular/http';
import 'rxjs/add/operator/map';

import { ToastController, AlertController, LoadingController, Loading } from 'ionic-angular';
import { AtticError, ErrData } from '../public/errors';

/*
  Generated class for the GraphicProvider provider.

  See https://angular.io/docs/ts/latest/guide/dependency-injection.html
  for more info on providers and Angular DI.
*/
@Injectable()
export class GraphicProvider {

  constructor(private toastCtrl:ToastController,
    private alertCtrl:AlertController,
    private loadingCtrl: LoadingController
  ) {
    console.log('Hello GraphicProvider Provider');
  }

  public presentToast(message:string, duration?:number):Promise<any>{
    let toast = this.toastCtrl.create({
      message: message,
      duration: duration!=null ? duration : 2000,
      position: 'bottom',
      showCloseButton: true,
      closeButtonText: 'Ok',
    });
    // if(error){
    //     toast._cssClass = 'toast-error-css';
    // }
    return toast.present();
  }

  public askConfirm(title:string, message:string, callback:((_:boolean)=>void)):Promise<any>{
    let alert = this.alertCtrl.create({
      title: title,
      message: message,
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          handler: () => {
            // console.log('nothing to do');
            callback(false);
          }
        },
        {
          text: 'Ok',
          handler: () => {
            // console.log('cancellation confirmed');
            callback(true);
          }
        }
      ]
    });
    return alert.present();
  }



  public genericAlert(title:string, message:string, inputsValue:{name:string, placeholder:string}[] | {name:string,value:string}[],
    noCancelText:string, callback:((_:any)=>void)):Promise<any>{
    let prompt=this.alertCtrl.create({
      title: title,
      message: message,
      inputs: inputsValue,
      buttons:[
        {
          text: 'Cancel',
          handler: data => {}
        },
        {
          text: noCancelText,
          handler: data=>{
            callback(data);
          }
        }
      ]
    });
    return prompt.present();
  }

  public genericAlertInput(title:string, inputs:{type:string, label:string, value:string}[], callback:((_:any)=>void)):Promise<any>{
    let alert = this.alertCtrl.create();
    alert.setTitle(title);

    inputs.forEach(obj=>{
      alert.addInput(obj);
    })

    alert.addButton('Cancel');
    alert.addButton({
      text: 'Ok',
      handler: data => {
        // console.log(JSON.stringify(data));
        callback(data);
      }
    })
    return alert.present();
}

public alertMessage(title:string, message:string):Promise<any>{
  let alert = this.alertCtrl.create({
    title:title,
    message:message,
    buttons:['Ok']
  });
  return alert.present();
}

// public altertRadio(title:string, inputs:{label:string, value:string}[], callback:((_:any)=>void)):Promise<any>{
//   let alert = this.alertCtrl.create();
//   alert.setTitle(title);
//
//   inputs.forEach(obj=>{
//     alert.addInput({
//       type:'radio',
//       label: obj.label,
//       value:obj.value
//     });
//   })
//
//   alert.addButton('Cancel');
//   alert.addButton({
//     text: 'Ok',
//     handler: data => {
//       callback(data);
//     }
//   })
//   return alert.present();
// }

    public showErrorAlert(errorIn:any, otherMsg?:string):Promise<any>{
      //console.log('the error');console.log(JSON.stringify(errorIn));console.log(JSON.stringify(errorIn.message));
      let error:ErrData = AtticError.getNewError(errorIn);
      let msg:string;
      console.log('the error is '+JSON.stringify(error));
      msg = ((error.isSpecific) ? error.error.message : 'Something went wrong');
      if(otherMsg!=null){msg+=otherMsg}
      // let alert = this.alertCtrl.create({
      //   title: 'Error',
      //   buttons: ['OK'],
      //   message:msg
      // });
      // return alert.present();
      return this.alertMessage('Error', msg);
  }


  public showLoading(message?:string):Loading{
    let loading:Loading;
    if(message!=null){
      loading = this.loadingCtrl.create({
        content: message
      })
    }else{
      loading = this.loadingCtrl.create({})
    }
    loading.present();
    return loading;
  }


  public dismissLoading(loading:Loading):Promise<any>{
    return loading.dismiss();
  }

}
