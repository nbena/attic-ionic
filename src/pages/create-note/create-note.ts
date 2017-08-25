import { Component } from '@angular/core';
import { NavController, NavParams, /*AlertController,*/ Events
  //, ViewController,

 } from 'ionic-angular';

import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms'

import { AtticNotes } from '../../providers/attic-notes';
import { AtticTags } from '../../providers/attic-tags';
import { NoteFull/*, NoteSmart, NoteMin, NoteExtraMin*/ } from '../../models/notes';
import { /*TagExtraMin, TagFull,*/ TagAlmostMin } from '../../models/tags';
// import { Utils } from '../../public/utils'
import {GraphicProvider} from '../../providers/graphic';
//import { Utils } from '../../public/utils';

//import {FORM_DIRECTIVES, FormBuilder,  ControlGroup, Validators, AbstractControl} from '@angular/common';

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


  createNotePageForm: FormGroup;

//  oldNote: NoteFull;
  newNote: NoteFull;

  tags: TagAlmostMin[];
  mainTags: TagAlmostMin[] = [];
  otherTags: TagAlmostMin[]  = [];
  // isDone: boolean;
  links: string[];

  tryingToSubmit = false;

  // mainTagsString: string[];
  // otherTagsString: string[];



  constructor(public navCtrl: NavController, public navParams: NavParams,
    // private alertCtrl: AlertController,
    private atticNotes: AtticNotes,
    private atticTags: AtticTags,
    private events: Events,
    private graphicProvider:GraphicProvider,
    // private viewCtrl: ViewController,
    private formBuilder: FormBuilder
  ) {


    //try{
      this.createNotePageForm = this.formBuilder.group({
        title:['', Validators.compose([Validators.required, Validators.minLength(2), Validators.maxLength(64)])],
        text: ['', Validators.compose([Validators.required, Validators.minLength(2)])],
        mainTags:[[], AtticNotes.areMainTagsArrayValid],
        otherTags:[[],AtticNotes.areOtherTagsArrayValid],
        isDone:[]
      })
    //}catch(e){console.log(JSON.stringify(e));console.log(JSON.stringify(e.message));console.log(JSON.stringify(e.stack))}


      this.newNote = new NoteFull();
      this.newNote.isdone = false;
      //
      //this.loadMinTags(false);
      this.load(false);
      this.links = [];
      //this.oldNote =  new NoteFull();
      //this.oldNote.isdone = false;
      // this.mainTagsString = [];
      // this.otherTagsString = [];

    }

  ionViewDidLoad() {
    console.log('ionViewDidLoad CreateNotePage');
  }


  load(force:boolean, refresher?:any):void{
    this.loadMinTags(force)
    .then(()=>{
      if(refresher!=null){
        refresher.complete();
      }
    }).catch(error=>{
      if(refresher!=null){
        refresher.complete();
      }
      console.log(JSON.stringify(error.message));
      this.graphicProvider.showErrorAlert(error, ' and so I cannot load/update tags');
    })
  }



  // loadMinTags(){
  //   /*before it was true.*/
  //   if(this.tags==null){
  //     this.atticTags.loadTagsMin(false)
  //       .then(result=>{
  //         this.tags=<TagAlmostMin[]>result;
  //       })
  //       .catch(error=>{
  //         console.log('load min tags error');
  //         console.log(error);
  //         this.graphicProvider.showErrorAlert(error,
  //           ' and so I cannot load tags');
  //       })
  //   }
  // }

  loadMinTags(force:boolean){
      // if(this.tags==null){
      return new Promise<void>((resolve, reject)=>{
        this.atticTags.loadTagsMin(force)
          .then(result=>{
            this.tags=result;
            resolve();
          })
          .catch(error=>{
          //   console.log('load min tags error');
          //   console.log(error);
          //   this.graphicProvider.showErrorAlert(error,
          //     ' and so I cannot load tags');
          reject(error);
           })
      })
      //}
  }


  refresh(refresher){
    this.load(true, refresher);
  }

  // getNote(){
  //   this.newNote.maintags = [];
  //   this.newNote.othertags = [];
  //
  //   this.newNote.maintags = this.mainTags;
  //   this.newNote.othertags = this.otherTags;
  //   // this.newNote.maintags.forEach((tag)=>{tag.no})
  //
  //   this.newNote.creationdate = new Date();
  //   this.newNote.lastmodificationdate = this.newNote.creationdate;
  //
  //
  //   this.newNote.links = this.links;
  //
  //   console.log('the new note is:');
  //   console.log(JSON.stringify(this.newNote));
  // }


  getNote2():void{
    this.newNote = new NoteFull();
    this.newNote.title=this.createNotePageForm.value.title;
    this.newNote.text=this.createNotePageForm.value.text;
    this.newNote.maintags=this.createNotePageForm.value.mainTags;
    this.newNote.othertags=this.createNotePageForm.value.otherTags;
    this.newNote.isdone=this.createNotePageForm.value.isDone;
    this.newNote.creationdate = new Date();
    this.newNote.lastmodificationdate = this.newNote.creationdate;
    this.newNote.links = this.links;
    console.log('the new note is:');
    console.log(JSON.stringify(this.newNote));
  }


  createNote(){
    this.tryingToSubmit=true;
    // console.log('is it valid?');
    // console.log(JSON.stringify(this.createNotePageForm.valid));
    if(this.createNotePageForm.valid){
      this.getNote2();
      //
      // //no because it's already done by the db when he update them.
      // // this.mainTags.forEach((tag)=>{tag.noteslength++});
      // // this.otherTags.forEach((tag)=>{tag.noteslength++});
      //
      this.atticNotes.createNote2(this.newNote/*, this.mainTags.concat(this.otherTags)*/)
        .then(result=>{
          //console.log(result);
          let title:string = this.newNote.title;

          this.makeEmpty3();
          this.tryingToSubmit=false;

          this.events.publish('change-tab',0, title);
        })
        .catch(error=>{
          this.graphicProvider.showErrorAlert(error);
        })
      console.log(JSON.stringify(this.createNotePageForm.value));
    }else{
      console.log('is not valid');
    }
  }

  deleteLinks(event, i:number){
    event.stopPropagation();
    this.links.splice(i,1);
  }

  // makeAllNull(){
  //   this.newNote.title="";
  //   this.newNote = null;
  //   //just this, keep tags loaded.
  // }

  // makeEmpty(){
  //   this.newNote.text='';
  //   this.newNote.title='';
  //   this.links=[];
  //   this.mainTags=[];
  //   this.otherTags=[];
  //   this.newNote.isdone=false;
  // }
  //
  //
  // makeEmpty2(){
  //   this.createNotePageForm.value.title='';
  //   this.createNotePageForm.value.text='';
  //   this.links=[]
  //   this.createNotePageForm.value.mainTags=[];
  //   this.createNotePageForm.value.otherTags=[];
  //   this.createNotePageForm.value.isDone=false;
  // }

  makeEmpty3(){
    this.createNotePageForm.reset();
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
