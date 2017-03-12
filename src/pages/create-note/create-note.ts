import { Component } from '@angular/core';
import { NavController, NavParams, AlertController } from 'ionic-angular';
import { AtticNotes } from '../../providers/attic-notes';
import { AtticTags } from '../../providers/attic-tags';
import { NoteFull, NoteSmart, NoteMin, NoteExtraMin } from '../../models/notes';
import { TagExtraMin, TagFull } from '../../models/tags';
import { Utils } from '../../public/utils'

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
  newNote: NoteMin;

  tags: TagExtraMin[];
  mainTags: TagExtraMin[];
  otherTags: TagExtraMin[];
  // isDone: boolean;
  links: string[];

  mainTagsString: string[];
  otherTagsString: string[];

  constructor(public navCtrl: NavController, public navParams: NavParams,
    private alertCtrl: AlertController,
    private atticNotes: AtticNotes,
    private atticTags: AtticTags) {
      //
      this.loadMinTags();
      this.links = [];
      this.oldNote =  new NoteFull();
      this.mainTagsString = [];
      this.otherTagsString = [];
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

  getNote(){
    this.newNote = new NoteMin();

    this.newNote.title=this.oldNote.title;
    this.newNote.text=this.oldNote.text;
    this.newNote.links=this.links;

    this.newNote.mainTags = [];
    this.newNote.otherTags = [];

    for(let i=0;i<this.mainTagsString.length;i++){
      this.newNote.mainTags.push(this.mainTagsString[i]);
    }

    for(let i=0;i<this.otherTagsString.length;i++){
      this.newNote.otherTags.push(this.otherTagsString[i]);
    }

    // console.log(Utils.logNote(this.newNote));
  }


  createNote(){
    this.getNote();
    console.log(JSON.stringify({note:this.newNote}));
    this.atticNotes.createNote(this.newNote)
      .then(result=>{
        console.log(result);
        this.navCtrl.pop();
      })
      .catch(error=>{
        console.log(error);
      })
  }

  /*
  No need to check duplicates on links because it is already done by the server.
  */

  pushLink(){
    let prompt=this.alertCtrl.create({
      title: 'New link',
      message: 'Insert the new link',
      inputs:[
        {
          name: 'link',
          placeholder: 'link'
        }
      ],
      buttons:[
        {
          text: 'Cancel',
          handler: data => {}
        },
        {
          text: 'Save',
          handler: data=>{
            this.links.push(data.link);
          }
        }
      ]
    });
    prompt.present();
  }

}
