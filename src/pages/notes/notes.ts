import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';

import { AtticNotes } from '../../providers/attic-notes';
import { NoteExtraMin, NoteSmart, NoteMin, NoteFull } from '../../models/notes';

import { NoteDetailsPage } from '../note-details/note-details';
import { CreateNotePage } from '../create-note/create-note';

import { Filter } from '../../public/const';

/*
  Generated class for the Notes page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/

// enum Filter{
//   Tags,
//   MainTags,
//   OtherTags,
//   None
// }


@Component({
  selector: 'page-notes',
  templateUrl: 'notes.html'
})
export class NotesPage {

  /*defining the result from the API.*/
  notes: NoteExtraMin[] = null;
  currentFilter : Filter = Filter.None;
  currentFilterValue: any = null;

  constructor(public navCtrl: NavController,
    private navParams: NavParams,
    private atticNotes: AtticNotes) {

      let filterType = navParams.get('filterType');
      let filterValue = navParams.get('filterValue');

      this.currentFilter = filterType;
      this.currentFilterValue = filterValue;

      if(filterValue==null){
        this.currentFilter=Filter.None;
      }

        if(this.notes==null){
          // this.loadMin();
          this.loadByFilter();
        }
  }



  //calling the new page, passing the _id.
  displayNoteDetails(_id: string, title: string){
    this.navCtrl.push(NoteDetailsPage, {_id, title});
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad NotesPage');
  }

  refresh(refresher){
    this.loadMin();
    setTimeout(()=>{
      refresher.complete();
    },2000);
  }

  createNewNote(){
    this.navCtrl.push(CreateNotePage);
  }

  loadByFilter(){
    switch(this.currentFilter){
      case Filter.Tags:
        this.loadByTags(this.currentFilterValue);
      break;
      case Filter.MainTags:
        this.loadByMainTags(this.currentFilterValue);
      break;
      case Filter.OtherTags:
        this.loadByOtherTags(this.currentFilterValue);
      break;
      default:
        this.loadMin();
      break;
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

  loadByTags(tags: string[]){
    this.atticNotes.notesByTag(tags)
      .then(result=>{
        this.notes=<NoteMin[]>result;
      })
      .catch(error=>{
        console.log(error);
      })
  }

  loadByMainTags(tags: string[]){
    this.atticNotes.notesByMainTag(tags)
      .then(result=>{
        this.notes=<NoteMin[]>result;
      })
      .catch(error=>{
        console.log(error);
      })
  }

  loadByOtherTags(tags: string[]){
    this.atticNotes.notesByOtherTag(tags)
      .then(result=>{
        this.notes=<NoteMin[]>result;
      })
      .catch(error=>{
        console.log(error);
      })
  }

}
