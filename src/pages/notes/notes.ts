import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';

import { AtticNotes } from '../../providers/attic-notes';
import { NoteExtraMin, NoteSmart, NoteMin, NoteFull } from '../../models/notes';

import { NoteDetailsPage } from '../note-details/note-details';

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
  notes: NoteExtraMin[] = null;

  constructor(public navCtrl: NavController, private atticNotes: AtticNotes) {
    if(this.notes==null){
      this.loadMin();
    }
  }

  loadFull(){
    //basically just a wrapper.
    this.atticNotes.loadFull()
      .then(result=>{
        this.notes=<NoteFull[]>result;
        // console.log(this.notes);
      })
      .catch(error =>{
        console.log(error);
      })
  }

  loadMin(){
    this.atticNotes.loadNotesMin()
      .then(result=>{
        this.notes=<NoteExtraMin[]>result;
      })
      .catch(error=>{
        console.log(error);
      })
  }

  //calling the new page, passing the _id.
  displayNoteDetails(_id: string, title: string){
    this.navCtrl.push(NoteDetailsPage, {_id, title});
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad NotesPage');
  }

}
