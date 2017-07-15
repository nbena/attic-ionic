import { Component } from '@angular/core';
import { NavController, NavParams, ToastController, AlertController, ViewController, App } from 'ionic-angular';
import { TagFull } from '../../models/tags';
import { AtticTags } from '../../providers/attic-tags';
import { Utils } from '../../public/utils';
import { TagsPage } from '../tags/tags';

/*
  Generated class for the TagsPopover page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
  selector: 'page-tag-details-popover',
  templateUrl: 'tag-details-popover.html'
})
export class TagDetailsPopoverPage {

  tag: TagFull;

  constructor(public navCtrl: NavController, public navParams: NavParams,
    private toastCtrl: ToastController, private alertCtrl: AlertController,
    private app: App,
    private viewCtrl: ViewController,
    private atticTags: AtticTags) {
      this.tag = navParams.get('tag');
    }

  ionViewDidLoad() {
    console.log('ionViewDidLoad TagsPopoverPage');
  }

  changeTitle(){
    let prompt = this.alertCtrl.create({
      title: 'New title',
      message: 'Enter a new title',
      inputs:[
        {
        name: 'title',
        /*placeholder: 'Title'*/
        value: this.tag.title
        }
      ],
      buttons: [
        {
          text: 'Cancel',
          handler: data => {}
        },
        {
          text: 'Save',
          handler: data=>{
            this.changeTitleAPI(<string>data.title);
          }
        }
      ]
    });
    prompt.present();
  // this.close();
  }

  changeTitleAPI(newTitle:string){
    this.viewCtrl.dismiss()
    .then(()=>{
      return this.atticTags.changeTitle(this.tag, newTitle)
    })
    .then(()=>{
      return Utils.presentToast(this.toastCtrl, 'Title updated');
    })
    // this.atticTags.changeTitle(this.tag, newTitle)
    // .then(result=>{
    //   return Utils.presentToast(this.toastCtrl, 'Title updated')
    // })
    // .then(()=>{
    //   return this.viewCtrl.dismiss()
    // })
    // .then(()=>{
    //   this.app.getRootNav().push(TagsPage);
    // })
    .catch(error=>{
      console.log('some errors happen');
      console.log(JSON.stringify(error))
    })
  }

  // close(){
  //   this.viewCtrl.dismiss();
  // }

  deleteTag(){
    Utils.askConfirm(this.alertCtrl, 'Are you sure to delete tag \''+this.tag.title+'\'',(_ : boolean)=>{
      if(_){
        this.deleteTagAPI();
      }/*else{
        nothing to do.
      }*/
    });
  }

  deleteTagAPI(){
    this.atticTags.deleteTag(this.tag)
    .then(result=>{
      return Utils.presentToast(this.toastCtrl, 'Tag deleted')
    })
    .then(()=>{
      return this.viewCtrl.dismiss()
    })
    .then(()=>{
      this.app.getRootNav().push(TagsPage);
    })
    .catch(error=>{
      console.log(JSON.stringify(error))
    })
  }


}
