import { Component } from '@angular/core';
import { NavController, NavParams, PopoverController } from 'ionic-angular';

import { /*TagFull, TagExtraMin, *//*TagMin*/TagFull } from '../../models/tags';
import { AtticTags } from '../../providers/attic-tags';
import { NoteDetailsPage } from '../note-details/note-details';
import { TagDetailsPopoverPage } from '../tag-details-popover/tag-details-popover';
import {GraphicProvider} from '../../providers/graphic';

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
  title: string;

  constructor(public navCtrl: NavController, public navParams: NavParams,
    private popoverCtrl: PopoverController,
    private atticTags: AtticTags,
    private graphicProvider:GraphicProvider
  ) {
      this.title=navParams.get('title');
      this.tagByTitle(this.title, false);
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad TagDetailsPage');
  }

  tagByTitle(title: string, force: boolean){
    this.atticTags.tagByTitle(this.title, force)
      .then(result=>{

        // this.tag = new TagFull();
        // this.tag.title = result.tag.title;
        // this.tag.noteslength=result.tag.noteslength;
        // for(let i=0;i<result.tag.notes.length;i++){
        //   this.tag.notes.push(result.tag.notes[i].notetitle);
        // }
        this.tag=result;
        // console.log('the tag is:');
        // console.log(JSON.stringify(this.tag));
      })
      .catch(error=>{
        console.log('tag by title error:'+error);
        this.graphicProvider.showErrorAlert(error);
      })
  }

  displayNoteDetails(title: string){
    this.navCtrl.push(NoteDetailsPage, {title});
  }

  refresh(refresher){
    this.tagByTitle(this.title, true);
    setTimeout(()=>{
      refresher.complete();
    },2000);
  }

  showPopover(event){
    let popover=this.popoverCtrl.create(TagDetailsPopoverPage, {tag: this.tag});
    popover.present({
      ev:event
    });
  }

}
