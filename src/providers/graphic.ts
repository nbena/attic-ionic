import { Injectable } from '@angular/core';
//import { Http } from '@angular/http';
import 'rxjs/add/operator/map';

import { ToastController, AlertController } from 'ionic-angular';

/*
  Generated class for the GraphicProvider provider.

  See https://angular.io/docs/ts/latest/guide/dependency-injection.html
  for more info on providers and Angular DI.
*/
@Injectable()
export class GraphicProvider {

  constructor(private toastCtrl:ToastController,
    private alertCtrl:AlertController) {
    console.log('Hello GraphicProvider Provider');
  }

  public presentToast(message:string, error?:boolean):Promise<any>{
    let toast = this.toastCtrl.create({
      message: message,
      duration: 2000,
      position: 'bottom',
      showCloseButton: true,
      closeButtonText: 'Ok',
    });
    // if(error){
    //     toast._cssClass = 'toast-error-css';
    // }
    return toast.present();
  }

  public askConfirm(message:string, callback:((_:boolean)=>void)):Promise<any>{
    let alert = this.alertCtrl.create({
      title: 'Confirm delete',
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

  public genericAlertInput(title:string, input:{type:string, label:string, value:string}[], callback:((_:any)=>void)):Promise<any>{
    let alert = this.alertCtrl.create();
    alert.setTitle("Add main tags");

    input.forEach(obj=>{
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

    public showErrorAlert(errorMsg:string):void{
      let alert = this.alertCtrl.create({
        title: 'Error',
        buttons: ['OK'],
        message:errorMsg
      });
      alert.present();
  }

}
