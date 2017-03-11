import { Component } from '@angular/core';
import { NavController, NavParams, AlertController } from 'ionic-angular';


import { TagExtraMin, TagMin, TagFull } from '../../models/tags';
import { AtticTags } from '../../providers/attic-tags';
import { TagDetailsPage } from '../tag-details/tag-details';
/*
  Generated class for the Tags page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
  selector: 'page-tags',
  templateUrl: 'tags.html'
})
export class TagsPage {

  tags: TagExtraMin[] = null;

  constructor(public navCtrl: NavController,
    public alertCtrl: AlertController,
    private atticTags: AtticTags) {
    if(this.tags==null){
      this.loadMin();
    }
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad TagsPage');
  }

  loadFull(){
    //basically just a wrapper.
    this.atticTags.loadFull()
      .then(result=>{
        this.tags=<TagFull[]>result;
        // console.log(this.notes);
      })
      .catch(error =>{
        console.log(error);
      })
  }

  loadMin(){
    this.atticTags.loadTagsMin()
      .then(result=>{
        this.tags=<TagExtraMin[]>result;
      })
      .catch(error=>{
        console.log(error);
      })
  }

  displayTagDetails(_id: string, title: string){
    this.navCtrl.push(TagDetailsPage, {_id, title});
  }

  refresh(refresher){
    this.loadFull();
    setTimeout(()=>{
      refresher.complete();
    },2000);
  }


  createNewTag(){
    let prompt = this.alertCtrl.create({
      title: 'New tag',
      message: 'Enter a name for the new tag',
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
            this.createNewTagAPI(<string>data.title);
          }
        }
      ]
    });
    prompt.present();
  }

  createNewTagAPI(title: string){




    this.atticTags.createTag(title)
      .then(result=>{
        this.tags.push(<TagFull>result);
      })
      .catch(error=>{
        let alert = this.alertCtrl.create({
          title: error,
          buttons: ['OK']
        });
        alert.present();
      })
  }


}
