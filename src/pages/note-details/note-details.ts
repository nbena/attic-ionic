import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';

import { NoteExtraMin, NoteFull, NoteMin, NoteSmart } from '../../models/notes';

import { AtticNotes } from '../../providers/attic-notes';

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

  note: NoteExtraMin;
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
      })
      .catch(err=>{
        console.log(err);
      })
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad NoteDetailsPage');
  }

}
