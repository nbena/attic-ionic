import { Component } from '@angular/core';
import { NavController, NavParams, /*ToastController, AlertController,*/ ViewController, App } from 'ionic-angular';
import { TagFull } from '../../models/tags';
import { AtticTags } from '../../providers/attic-tags';
import { Utils } from '../../public/utils';
import { TagsPage } from '../tags/tags';
import { GraphicProvider} from '../../providers/graphic'

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
    // private toastCtrl: ToastController, private alertCtrl: AlertController,
    private app: App,
    private viewCtrl: ViewController,
    private atticTags: AtticTags,
    private graphicProvider:GraphicProvider
  ) {
      this.tag = navParams.get('tag');
    }

  ionViewDidLoad() {
    console.log('ionViewDidLoad TagsPopoverPage');
  }

  changeTitle(){
    // let prompt = this.alertCtrl.create({
    //   title: 'New title',
    //   message: 'Enter a new title',
    //   inputs:[
    //     {
    //     name: 'title',
    //     /*placeholder: 'Title'*/
    //     value: this.tag.title
    //     }
    //   ],
    //   buttons: [
    //     {
    //       text: 'Cancel',
    //       handler: data => {}
    //     },
    //     {
    //       text: 'Save',
    //       handler: data=>{
    //         this.changeTitleAPI(<string>data.title);
    //       }
    //     }
    //   ]
    // });
    // prompt.present();
    this.graphicProvider.genericAlert('New title', 'Enter a new title',
      [{name:'title', value:this.tag.title}],
      'Save',
      (data)=>{this.changeTitleAPI(data.title as string)}
      )
  }

  changeTitleAPI(newTitle:string){
    this.viewCtrl.dismiss()
    .then(()=>{
      return this.atticTags.changeTitle(this.tag, newTitle)
    })
    .then(()=>{
      // return Utils.presentToast(this.toastCtrl, 'Title updated');
      return this.graphicProvider.presentToast('Title updated');
    })
    .catch(error=>{
      // console.log('some errors happen');
      // console.log(JSON.stringify(error))
      this.graphicProvider.showErrorAlert(error);
    })
  }

  // close(){
  //   this.viewCtrl.dismiss();
  // }

  deleteTag(){
    // Utils.askConfirm(this.alertCtrl, 'Are you sure to delete tag \''+this.tag.title+'\'',(_ : boolean)=>{
    //   if(_){
    //     this.deleteTagAPI();
    //   }/*else{
    //     nothing to do.
    //   }*/
    // });
    this.graphicProvider.askConfirm('Are you sure to delete tag \''+this.tag.title+'\?',
      (res:boolean)=>{if(res){this.deleteTagAPI();}}
    )
  }

  deleteTagAPI(){
    this.viewCtrl.dismiss()
    .then(()=>{
      return this.atticTags.deleteTag(this.tag)
    })
    .then(()=>{
      return this.app.getRootNav().push(TagsPage);
    })
    .then(()=>{
      //return Utils.presentToast(this.toastCtrl, 'Tag deleted');
      return this.graphicProvider.presentToast('Tag deleted');
    })
    .catch(error=>{
      console.log(JSON.stringify(error))
    })
  }


}
