import { Component } from '@angular/core';
import { NavController, NavParams, /*AlertController,*/ Events } from 'ionic-angular';
import { AtticNotes } from '../../providers/attic-notes';
import { AtticTags } from '../../providers/attic-tags';
import { NoteFull/*, NoteSmart, NoteMin, NoteExtraMin*/ } from '../../models/notes';
import { /*TagExtraMin, TagFull,*/ TagAlmostMin } from '../../models/tags';
// import { Utils } from '../../public/utils'
import {GraphicProvider} from '../../providers/graphic';

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
    // private alertCtrl: AlertController,
    private atticNotes: AtticNotes,
    private atticTags: AtticTags,
    private events: Events,
    private graphicProvider:GraphicProvider
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
    if(this.tags==null){
      this.atticTags.loadTagsMin(false)
        .then(result=>{
          this.tags=<TagAlmostMin[]>result;
        })
        .catch(error=>{
          console.log('load min tags error');
          console.log(error);
        })
    }
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
    this.atticNotes.createNote2(this.newNote/*, this.mainTags.concat(this.otherTags)*/)
      .then(result=>{
        console.log(result);
        // this.navCtrl.parent.select(0);
        let title:string = this.newNote.title;
        this.makeAllNull();
        /*it doesn't work.*/
        this.events.publish('change-tab',0, title);
        //error here...
      })
      .catch(error=>{
        console.log('error create new note');
        console.log(JSON.stringify(error));
        // console.log(error);
        // console.log('better error');
        // let alert = this.alertCtrl.create({
        //   title: error,
        //   buttons: ['OK']
        // });
        // alert.present();
        this.graphicProvider.showErrorAlert(error);
      })
  }

  deleteLinks(event, i:number){
    event.stopPropagation();
    this.links.splice(i,1);
  }

  makeAllNull(){
    this.newNote.title="";
    this.newNote = null;
    //just this, keep tags loaded.
  }

  /*
  No need to check duplicates on links because it is already done by the server.
  */

  pushLink(){

    //Utils.pushLink(this.alertCtrl, (data)=>{this.links.push(data.link)}/*function(data: string){this.links.push(data.link)}*/);
    this.graphicProvider.genericAlert('New link', 'Insert the new link',
      [
        {
          name:'link',
          placeholder:'link'
        }
      ],
      'Add',
      (data)=>{this.links.push(data.link)}
    )
  }


}
