import { Component } from '@angular/core';
import { NavController, NavParams, ToastController, AlertController, ViewController } from 'ionic-angular';
import { TagFull } from '../../models/tags';
import { AtticTags } from '../../providers/attic-tags';
import { Utils } from '../../public/utils';

/*
  Generated class for the TagsPopover page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
  selector: 'page-tags-popover',
  templateUrl: 'tags-popover.html'
})
export class TagsPopoverPage {

  tag: TagFull;

  constructor(public navCtrl: NavController, public navParams: NavParams,
    private toastCtrl: ToastController, private alertCtrl: AlertController,
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
        placeholder: 'Title'
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
  this.close();
  }

  changeTitleAPI(newTitle:string){
    this.atticTags.changeTitle(this.tag, newTitle)
    .then(result=>{
      Utils.presentToast(this.toastCtrl, 'Title updated');
    })
    .catch(error=>{
      console.log(JSON.stringify(error))
    })
  }

  close(){
    this.viewCtrl.dismiss();
  }

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
      Utils.presentToast(this.toastCtrl, 'Tag deleted');
    })
    .catch(error=>{
      console.log(JSON.stringify(error))
    })
  }


}
