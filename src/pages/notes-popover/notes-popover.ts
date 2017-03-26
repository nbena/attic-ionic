import { Component } from '@angular/core';
import { NavController, NavParams, ViewController } from 'ionic-angular';
import { NoteFull } from '../../models/notes';

/*
  Generated class for the NotesPopover page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
  selector: 'page-notes-popover',
  templateUrl: 'notes-popover.html'
})
export class NotesPopoverPage {

  done: string;
  note: NoteFull;

  constructor(public navCtrl: NavController, public navParams: NavParams,
    public viewCtrl: ViewController) {
      this.note=navParams.get('note');
      if(this.note.isDone){
        this.done='Mark as \'undone\'';
      }else {
        this.done='Mark as \'done\'';
      }
    }


  changeTitle(){
    this.close();
  }

  changeText(){
    this.close();
  }

  changeMainTags(){
    this.close();
  }

  changeOtherTags(){
    this.close();
  }

  changeLinks(){
    this.close();
  }

  setDone(){
    this.close();
    console.log("should dismiss");
  }

  close(){
    this.viewCtrl.dismiss();
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad NotesPopoverPage');
  }

}
