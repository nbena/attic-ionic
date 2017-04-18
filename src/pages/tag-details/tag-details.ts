import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';

import { /*TagFull, TagExtraMin, */TagMin } from '../../models/tags';
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

  tag: TagMin;
  title: string;

  constructor(public navCtrl: NavController, public navParams: NavParams,
    private atticTags: AtticTags) {
      this.title=navParams.get('title');
      this.tagByTitle(this.title);
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad TagDetailsPage');
  }

  tagByTitle(title: string){
    this.atticTags.tagByTitle(this.title)
      .then(result=>{

        this.tag = new TagMin();
        this.tag.title = result.tag.title;
        this.tag.noteslength=result.tag.noteslength;
        for(let i=0;i<result.tag.notes.length;i++){
          this.tag.notes.push(result.tag.notes[i].notetitle);
        }
      })
      .catch(err=>{
        console.log(err);
      })
  }

  displayNoteDetails(title: string){
    this.navCtrl.push(NoteDetailsPage, {title});
  }

  refresh(refresher){
    this.tagByTitle(this.title);
    setTimeout(()=>{
      refresher.complete();
    },2000);
  }

}
