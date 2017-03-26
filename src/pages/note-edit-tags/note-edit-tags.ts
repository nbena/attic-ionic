import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { NoteFull } from '../../models/notes';
import { TagExtraMin } from '../../models/tags';
import { AtticNotes } from '../../providers/attic-notes';

/*
  Generated class for the NoteEditTags page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
  selector: 'page-note-edit-tags',
  templateUrl: 'note-edit-tags.html'
})
export class NoteEditTagsPage {

  note: NoteFull;

  mainTags: TagExtraMin[];
  otherTags: TagExtraMin[];
  // isDone: boolean;

  mainTagsString: string[];
  otherTagsString: string[];

  constructor(public navCtrl: NavController, public navParams: NavParams,
    private atticNotes: AtticNotes) {
    this.note=navParams.get('note');
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad NoteEditTagsPage');
  }

  submit(){
    // this.atticNotes.addMainTags(this.note._id, this.mainTagsString)
    if(this.mainTagsString.length>0 && this.otherTagsString.length>0){

    }else if(this.mainTagsString.length>0){

    }else if(this.otherTagsString.length>0){

    }
  }

  cancel(){
    this.navCtrl.pop();
  }

}
