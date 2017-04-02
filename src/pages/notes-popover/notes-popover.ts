import { Component } from '@angular/core';
import { NavController, NavParams, ViewController, ToastController, AlertController } from 'ionic-angular';
import { NoteFull } from '../../models/notes';
import { NoteEditTextPage } from '../note-edit-text/note-edit-text';
import { AtticNotes } from '../../providers/attic-notes';
import { Utils } from '../../public/utils';
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
    public viewCtrl: ViewController, public alertCtrl: AlertController,
    public toastCtrl: ToastController, private atticNotes: AtticNotes) {
      this.note=navParams.get('note');
      // if(this.note.isDone){
      //   this.done='Mark as \'undone\'';
      // }else {
      //   this.done='Mark as \'done\'';
      // }
    }


  changeText(){
    this.close();
    this.navCtrl.push(NoteEditTextPage, {note: this.note});
  }

  // changeMainTags(){
  //   this.close();
  // }
  //
  // changeOtherTags(){
  //   this.close();
  // }
  //
  // changeLinks(){
  //   this.close();
  // }
  //
  // setDone(){
  //   this.close();
  //   if(this.note.isDone){
  //     this.note.isDone=false;
  //   }else{
  //     this.note.isDone=true;
  //   }
  // }

  changeTitle(){
      let prompt = this.alertCtrl.create({
        title: 'New title',
        message: 'Enter a new title',
        inputs:[
          {
          name: 'title',
          placeholder: 'Title'
          }
        ],
        buttons: [
          {
            text: 'Cancel',
            handler: data => {}
          },
          {
            text: 'Save',
            handler: data=>{
              this.changeTitleAPI(<string>data.title);
            }
          }
        ]
      });
      prompt.present();
    this.close();
  }

  /*
  Title and text are changed immediately.
  */

  changeTitleAPI(title: string){
    this.atticNotes.updateTitle(this.note._id, title)
      .then(result=>{
        this.note.title=title;
        Utils.presentToast(this.toastCtrl, 'Title updated');
      })
      .catch(error=>{
        console.log(JSON.stringify(error));
      });
  }

  close(){
    this.viewCtrl.dismiss();
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad NotesPopoverPage');
  }

}
