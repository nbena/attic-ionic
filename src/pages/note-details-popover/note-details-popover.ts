import { Component } from '@angular/core';
import { NavController, NavParams, ViewController/*, ToastController, AlertController*/, App } from 'ionic-angular';
import { NoteFull } from '../../models/notes';
import { NoteEditTextPage } from '../note-edit-text/note-edit-text';
import { AtticNotes } from '../../providers/attic-notes';
import { Utils } from '../../public/utils';
import { NotesPage } from '../notes/notes';
import { GraphicProvider} from '../../providers/graphic'
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
    public viewCtrl: ViewController, /*public alertCtrl: AlertController,*/
    private app: App,
    /*public toastCtrl: ToastController*/ private atticNotes: AtticNotes,
    private graphicProvider: GraphicProvider
  ) {
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
      // let prompt = this.alertCtrl.create({
      //   title: 'New title',
      //   message: 'Enter a new title',
      //   inputs:[
      //     {
      //     name: 'title',
      //     /*placeholder: 'Title'*/
      //     value : this.note.title
      //     }
      //   ],
      //   buttons: [
      //     {
      //       text: 'Cancel',
      //       handler: data => {}
      //     },
      //     {
      //       text: 'Save',
      //       handler: data=>{
      //         this.changeTitleAPI(<string>data.title);
      //       }
      //     }
      //   ]
      // });
      // prompt.present();
      this.graphicProvider.genericAlert('New title', 'Enter a new title',
        [{name:'title', value:this.note.title}],
        'Save',
        (data)=>{this.changeTitleAPI(data.title as string)}
        )
  }

  /*
  Title and text are changed immediately.
  */

  changeTitleAPI(title: string){
    this.viewCtrl.dismiss()
    .then(()=>{
      return this.atticNotes.changeTitle(this.note, title)
    })
    .then(()=>{
      //return Utils.presentToast(this.toastCtrl, 'Title updated');
      return this.graphicProvider.presentToast('Title updated');
    })
    // this.atticNotes.changeTitle(this.note, title)
    //   .then(result=>{
    //     // this.note.title=title;
    //     return Utils.presentToast(this.toastCtrl, 'Title updated');
    //   })
    //   .then(()=>{
    //     this.viewCtrl.dismiss();
    //   })
      .catch(error=>{
        //Utils.showErrorAlert(this.alertCtrl, error);
        this.graphicProvider.showErrorAlert(error);
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
    // Utils.askConfirm(this.alertCtrl, 'Are you sure to delete note \''+this.note.title+'\'?',(_ : boolean)=>{
    //   if(_){
    //     this.deleteNoteAPI();
    //   }/*else{
    //     nothing to do.
    //   }*/
    // });
    this.graphicProvider.askConfirm('Are you sure to delete note \''+this.note.title+'\?',
      (res:boolean)=>{if(res){this.deleteNoteAPI();}}
    )
  }

  deleteNoteAPI(){
    // this.atticNotes.deleteNote(this.note)
    // .then(result=>{
    //   return Utils.presentToast(this.toastCtrl, 'Note deleted');
    // })
    // .then(()=>{
    //   return this.viewCtrl.dismiss()
    // })
    // .then(()=>{
    //   this.app.getRootNav().push(NotesPage);
    // })


    this.viewCtrl.dismiss()
    .then(()=>{
      return this.atticNotes.deleteNote(this.note)
    })
    .then(()=>{
      return this.app.getRootNav().push(NotesPage);
    })
    .then(()=>{
      //return Utils.presentToast(this.toastCtrl, 'Note deleted');
      return this.graphicProvider.presentToast('Note deleted');
    })
    .catch(error=>{
      console.log(JSON.stringify(error));
    })
  }

}
