import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';

import { TagFull, TagExtraMin, TagMin } from '../../models/tags';
import { AtticTags } from '../../providers/attic-tags';
import { NoteDetailsPage } from '../note-details/note-details';

/*
  Generated class for the TagDetails page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
  selector: 'page-tag-details',
  templateUrl: 'tag-details.html'
})
export class TagDetailsPage {

  tag: TagFull;
  _id: string;
  title: string;

  constructor(public navCtrl: NavController, public navParams: NavParams,
    private atticTags: AtticTags) {
      this._id=navParams.get('_id');
      this.title=navParams.get('title');
      this.tagById(this._id);
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad TagDetailsPage');
  }

  tagById(_id: string){
    this.atticTags.tagById(this._id)
      .then(result=>{
        this.tag=<TagFull>result;
      })
      .catch(err=>{
        console.log(err);
      })
  }

  displayNoteDetails(_id: string, title: string){
    this.navCtrl.push(NoteDetailsPage, {_id, title});
  }

  refresh(refresher){
    this.tagById(this._id);
    setTimeout(()=>{
      refresher.complete();
    },2000);
  }

}
