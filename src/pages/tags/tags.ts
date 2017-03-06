import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';


import { TagExtraMin, TagMin, Tag } from '../../models/tags';
import { AtticTags } from '../../providers/attic-tags';
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

  constructor(public navCtrl: NavController, private atticTags: AtticTags) {
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
        this.tags=<Tag[]>result;
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

  displayTagDetails(id: string, title: string){
    //this.navCtrl.push(TagDetaislPage, {_id, title});
  }


}
