import { Component } from '@angular/core';
import { NavController, NavParams, AlertController, Events } from 'ionic-angular';
import { AtticNotes } from '../../providers/attic-notes';
import { AtticTags } from '../../providers/attic-tags';
import { NoteFull, NoteSmart, NoteMin, NoteExtraMin } from '../../models/notes';
import { TagExtraMin, TagFull, TagAlmostMin } from '../../models/tags';
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

//  oldNote: NoteFull;
  newNote: NoteFull;

  tags: TagAlmostMin[];
  mainTags: TagAlmostMin[] = [];
  otherTags: TagAlmostMin[]  = [];
  // isDone: boolean;
  links: string[];

  // mainTagsString: string[];
  // otherTagsString: string[];



  constructor(public navCtrl: NavController, public navParams: NavParams,
    private alertCtrl: AlertController,
    private atticNotes: AtticNotes,
    private atticTags: AtticTags,
    private events: Events
  ) {

      this.newNote = new NoteFull();
      this.newNote.isdone = false;
      //
      this.loadMinTags();
      this.links = [];
      //this.oldNote =  new NoteFull();
      //this.oldNote.isdone = false;
      // this.mainTagsString = [];
      // this.otherTagsString = [];

    }

  ionViewDidLoad() {
    console.log('ionViewDidLoad CreateNotePage');
  }


  loadMinTags(){
    /*before it was true.*/
    this.atticTags.loadTagsMin(false)
      .then(result=>{
        this.tags=<TagAlmostMin[]>result;
      })
      .catch(error=>{
        console.log('load min tags error');
        console.log(error);
      })
  }

  getNote(){


    // this.newNote.title=this.oldNote.title;
    // this.newNote.text=this.oldNote.text;
    this.newNote.links=this.links;

    this.newNote.maintags = [];
    this.newNote.othertags = [];


    // this.newNote.maintags = this.mainTagsString.map((tagTitle):TagExtraMin=>{
    //   let tag = new TagExtraMin();
    //   tag.title=tagTitle;
    //   return tag;
    // });
    //
    // this.newNote.othertags = this.otherTagsString.map((tagTitle):TagExtraMin=>{
    //   let tag = new TagExtraMin();
    //   tag.title=tagTitle;
    //   return tag;
    // });

    // this.newNote.maintags = this.mainTags.map((tag)=>{
    //   return tag;
    // });
    // this.newNote.othertags = this.otherTags.map((tag)=>{
    //   return tag;
    // });

    this.newNote.maintags = this.mainTags;
    this.newNote.othertags = this.otherTags;
    // this.newNote.maintags.forEach((tag)=>{tag.no})

    this.newNote.creationdate = new Date();
    this.newNote.lastmodificationdate = this.newNote.creationdate;

    // this.newNote.isdone = this.oldNote.isdone;

    this.newNote.links = this.links;

    // console.log(Utils.logNote(this.newNote));
    console.log('the new note is:');
    console.log(JSON.stringify(this.newNote));
  }


  createNote(){
    this.getNote();
    // console.log(JSON.stringify({note:this.newNote}));
    this.mainTags.forEach((tag)=>{tag.noteslength++});
    this.otherTags.forEach((tag)=>{tag.noteslength++});
    this.atticNotes.createNote2(this.newNote, this.mainTags.concat(this.otherTags))
      .then(result=>{
        console.log(result);
        // this.navCtrl.parent.select(0);
        this.events.publish('change-tab',0, this.newNote.title);
      })
      .catch(error=>{
        console.log('create note error');
        console.log(error);
      })
  }

  deleteLinks(event, i:number){
    event.stopPropagation();
    this.links.splice(i,1);
  }

  /*
  No need to check duplicates on links because it is already done by the server.
  */

  pushLink(){
    // let prompt=this.alertCtrl.create({
    //   title: 'New link',
    //   message: 'Insert the new link',
    //   inputs:[
    //     {
    //       name: 'link',
    //       placeholder: 'link'
    //     }
    //   ],
    //   buttons:[
    //     {
    //       text: 'Cancel',
    //       handler: data => {}
    //     },
    //     {
    //       text: 'Save',
    //       handler: data=>{
    //         this.links.push(data.link);
    //       }
    //     }
    //   ]
    // });
    // prompt.present();
    Utils.pushLink(this.alertCtrl, (data)=>{this.links.push(data.link)}/*function(data: string){this.links.push(data.link)}*/);
  }

}
