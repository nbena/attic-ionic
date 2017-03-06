import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';

import { NoteExtraMin, NoteFull, NoteMin, NoteSmart } from '../../models/notes';

import { AtticNotes } from '../../providers/attic-notes';

import { TagExtraMin } from '../../models/tags';
import { TagDetailsPage } from '../tag-details/tag-details';

/*
  Generated class for the NoteDetails page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
  selector: 'page-note-details',
  templateUrl: 'note-details.html'
})


export class NoteDetailsPage {

  note: NoteFull;
  // _mainTags: TagExtraMin[];
  // _otherTags: TagExtraMin[];
  // _links: string[];
  _id : string;
  title: string;

  constructor(public navCtrl: NavController, public navParams: NavParams,
    private atticNotes: AtticNotes) {
    this._id=navParams.get('_id');
    this.title=navParams.get('title');
    this.noteById();
  }

  noteById(){
    this.atticNotes.noteById(this._id)
      .then(result=>{
        this.note=<NoteFull>result;
        // this._mainTags=this.note.mainTags;
        // this._otherTags=this.note.otherTags;
        // this._links=this.note.links;
      })
      .catch(err=>{
        console.log(err);
      })
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad NoteDetailsPage');
  }

  displayTagDetails(_id: string, title: string){
    this.navCtrl.push(TagDetailsPage, {_id, title})
  }

}
