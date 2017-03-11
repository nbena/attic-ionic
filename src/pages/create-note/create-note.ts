import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { AtticNotes } from '../../providers/attic-notes';
import { AtticTags } from '../../providers/attic-tags';
import { NoteFull, NoteSmart, NoteMin, NoteExtraMin } from '../../models/notes';
import { TagExtraMin } from '../../models/tags';

/*
  Generated class for the CreateNote page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
  selector: 'page-create-note',
  templateUrl: 'create-note.html'
})
export class CreateNotePage {

  oldNote: NoteFull;
  newNote: NoteFull;
  tags: TagExtraMin[];
  mainTags: TagExtraMin[];
  otherTags: TagExtraMin[];

  constructor(public navCtrl: NavController, public navParams: NavParams,
    private atticNotes: AtticNotes,
    private atticTags: AtticTags) {
      //
      this.loadMinTags();
    }

  ionViewDidLoad() {
    console.log('ionViewDidLoad CreateNotePage');
  }


  loadMinTags(){
    this.atticTags.loadTagsMin()
      .then(result=>{
        this.tags=<TagExtraMin[]>result;
      })
      .catch(error=>{
        console.log(error);
      })
  }



}
