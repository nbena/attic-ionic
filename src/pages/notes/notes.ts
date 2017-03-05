import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';

import { AtticNotes } from '../../providers/attic-notes';
import { NoteExtraMin, NoteSmart, NoteMin, NoteFull } from '../../models/notes';

/*
  Generated class for the Notes page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
  selector: 'page-notes',
  templateUrl: 'notes.html'
})
export class NotesPage {

  /*defining the result from the API.*/
  notes: NoteExtraMin[]; //any because

  constructor(public navCtrl: NavController, private atticNotes: AtticNotes) {
    atticNotes.loadFull()
      .then(result=>{
        this.notes=<NoteFull[]>result;
        console.log(this.notes);
      })
      .catch(error =>{
        console.log(error);
      })
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad NotesPage');
  }

}
