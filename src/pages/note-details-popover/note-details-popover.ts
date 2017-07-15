import { Component } from '@angular/core';
import { NavController, NavParams, ViewController, ToastController, AlertController, App } from 'ionic-angular';
import { NoteFull } from '../../models/notes';
import { NoteEditTextPage } from '../note-edit-text/note-edit-text';
import { AtticNotes } from '../../providers/attic-notes';
import { Utils } from '../../public/utils';
import { NotesPage } from '../notes/notes';
/*
  Generated class for the NotesPopover page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
  selector: 'page-note-details-popover',
  templateUrl: 'note-details-popover.html'
})
export class NoteDetailsPopoverPage {

  done: string;
  note: NoteFull;

  constructor(public navCtrl: NavController, public navParams: NavParams,
    public viewCtrl: ViewController, public alertCtrl: AlertController,
    private app: App,
    public toastCtrl: ToastController, private atticNotes: AtticNotes) {
      this.note=navParams.get('note');
      // if(this.note.isDone){
      //   this.done='Mark as \'undone\'';
      // }else {
      //   this.done='Mark as \'done\'';
      // }
    }


  changeText(){
    // this.close();
    this.navCtrl.push(NoteEditTextPage, {note: this.note})
    .then(()=>{
      this.viewCtrl.dismiss();
    })
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
          /*placeholder: 'Title'*/
          value : this.note.title
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
    // this.close();
  //  this.navCtrl.popTo()
  }

  /*
  Title and text are changed immediately.
  */

  changeTitleAPI(title: string){
    this.atticNotes.changeTitle(this.note, title)
      .then(result=>{
        // this.note.title=title;
        return Utils.presentToast(this.toastCtrl, 'Title updated');
      })
      .then(()=>{
        this.viewCtrl.dismiss();
      })
      .catch(error=>{
        console.log(JSON.stringify(error));
      });
  }

  // close(){
  //   this.viewCtrl.dismiss();
  // }

  ionViewDidLoad() {
    console.log('ionViewDidLoad NotesPopoverPage');
  }

  deleteNote(){
    Utils.askConfirm(this.alertCtrl, 'Are you sure to delete note \''+this.note.title+'\'?',(_ : boolean)=>{
      if(_){
        this.deleteNoteAPI();
      }/*else{
        nothing to do.
      }*/
    });
  }

  deleteNoteAPI(){
    this.atticNotes.deleteNote(this.note)
    .then(result=>{
      return Utils.presentToast(this.toastCtrl, 'Note deleted');
    })
    .then(()=>{
      return this.viewCtrl.dismiss()
    })
    .then(()=>{
      this.app.getRootNav().push(NotesPage);
    })
    .catch(error=>{
      console.log(JSON.stringify(error));
    })
  }

}
