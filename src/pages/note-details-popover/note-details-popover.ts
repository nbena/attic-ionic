import { Component } from '@angular/core';
import { /*NavController, */NavParams, ViewController/*, ToastController, AlertController*/
  , App
  ,Events, Loading } from 'ionic-angular';
import { NoteFull, NoteExtraMinWithDate/*, NoteExtraMin*/ } from '../../models/notes';
import { NoteEditTextPage } from '../note-edit-text/note-edit-text';
import { AtticNotesProvider } from '../../providers/attic-notes';
// import { Utils } from '../../public/utils';
//import { NotesPage } from '../notes/notes';
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

  //private done: string;
  private note: NoteFull = null;
  // title:string;

  // index:number=-1;

  private btnChangeTextEnabled:boolean = false;
  private btnChangeTitleEnabled:boolean = false;

  private lastmod: Date;

  private loading: Loading;


  //private oldTitle:string;

  constructor(/*public navCtrl: NavController, */public navParams: NavParams,
    public viewCtrl: ViewController, /*public alertCtrl: AlertController,*/
    // private app: App,
    private events:Events,
    /*public toastCtrl: ToastController*/ private atticNotes: AtticNotesProvider,
    private graphicProvider: GraphicProvider,
    private app:App
  ) {
      // this.title =navParams.get('title');
      // this.note=navParams.get('note');
      // if(this.note!=null){
      //   console.log('this note is not null');
      //   this.btnChangeTextEnabled = true;
      //   this.btnChangeTitleEnabled = true;
      // }
      // this.title =this.navParams.get('title');


      this.note=this.navParams.get('note');
      // let ind=this.navParams.get('index');s
      // if(ind!=-1 && ind!=null){
      //   this.index=ind;
      // }
      if(this.note!=null){
        // console.log('this note is not null');
        this.btnChangeTextEnabled = true;
        this.btnChangeTitleEnabled = true;

        this.lastmod = this.note.lastmodificationdate;
        // console.log(this.btnChangeTitleEnabled);
        // console.log(this.btnChangeTextEnabled);
        //this.oldTitle=this.note.title;
      }

    }

    ionViewDidLoad() {
      // this.title =this.navParams.get('title');
      // this.note=this.navParams.get('note');
      // if(this.note!=null){
      //   // console.log('this note is not null');
      //   this.btnChangeTextEnabled = true;
      //   this.btnChangeTitleEnabled = true;
      //   // console.log(this.btnChangeTitleEnabled);
      //   // console.log(this.btnChangeTextEnabled);
      // }
      console.log('ionViewDidLoad NotesPopoverPage');
    }



  private changeText(){
    this.viewCtrl.dismiss();
    //this.navCtrl.push(NoteEditTextPage, {note: this.note})
    this.app.getActiveNav().push(NoteEditTextPage, {note:this.note});
    // .then(()=>{
    //   this.viewCtrl.dismiss();
    // })
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

  private changeTitle(){
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

  private changeTitleAPI(title: string){
    title = title.trim();
    let oldNote:NoteExtraMinWithDate = new NoteExtraMinWithDate({title:this.note.title, lastmodificationdate:this.lastmod});
    //oldNote.lastmodificationdate = this.lastmod;
    let date = new Date();
    let newNote:NoteExtraMinWithDate = new NoteExtraMinWithDate({title:title, lastmodificationdate:date});
    this.note.lastmodificationdate=newNote.lastmodificationdate;
    //newNote.lastmodificationdate = new Date();
    //this.note.lastmodificationdate = newNote.lastmodificationdate;

    this.viewCtrl.dismiss()
    .then(()=>{
      //this.graphicProvider.presentToast('Changing title...',1200);
      this.loading = this.graphicProvider.showLoading();
      return this.atticNotes.changeTitle(this.note, title, this.lastmod);
    })
    .then(()=>{
      //return Utils.presentToast(this.toastCtrl, 'Title updated');
      //this.events.publish('invalidate-full-tag', new NoteExtraMin(this.oldTitle));

      //this.events.publish('go-to-notes-and-replace', oldNote, newNote);
      //we try to do the best as possible to make user not refresh

      this.events.publish('notes-replace', oldNote, newNote);
      this.graphicProvider.dismissLoading(this.loading);

      /*return */this.graphicProvider.presentToast('Title updated');
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
        this.note.lastmodificationdate=this.lastmod;
        this.graphicProvider.dismissLoading(this.loading);
        this.graphicProvider.showErrorAlert(error);
        console.log('change title error: '+JSON.stringify(error));console.log(JSON.stringify(error.message))
      });
  }

  // close(){
  //   this.viewCtrl.dismiss();
  // }


  private deleteNote(){
    // Utils.askConfirm(this.alertCtrl, 'Are you sure to delete note \''+this.note.title+'\'?',(_ : boolean)=>{
    //   if(_){
    //     this.deleteNoteAPI();
    //   }/*else{
    //     nothing to do.
    //   }*/
    // });
    this.graphicProvider.askConfirm('Question','Are you sure to delete note \''+this.note.title+'\'?',
      (res:boolean)=>{if(res){this.deleteNoteAPI();}}
    )
  }

  private deleteNoteAPI(){
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
      //need to use change-tab
      //this.viewCtrl.dismiss();
      //this.navCtrl.getViews().forEach(obj=>{if(obj.)})
      //return this.app.getRootNav().push(NotesPage, {refresh:false, toRemove:this.note as NoteExtraMinWithDate})
      // return this.app.getRootNav().popToRoot();
      this.events.publish('invalidate-tags');
      //this.events.publish('invalidate-full-tag', this.note.forceCastToNoteExtraMin());
      this.events.publish('go-to-notes-and-remove', this.note); //method to change tab.
      this.graphicProvider.presentToast('Note deleted');
    })
    // .then(()=>{
    //   return this.viewCtrl.dismiss();
    // })
    // .then(()=>{
    //   //return Utils.presentToast(this.toastCtrl, 'Note deleted');
    //   return this.graphicProvider.presentToast('Note deleted');
    // })
    .catch(error=>{
      console.log('delete error: ');console.log(JSON.stringify(error));console.log(JSON.stringify(error.message));
      this.graphicProvider.showErrorAlert(error);
    })
  }

}
