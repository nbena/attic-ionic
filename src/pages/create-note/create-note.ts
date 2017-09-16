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
import { isWebUri } from 'valid-url';
//import { Utils } from '../../public/utils';
import { AtticError } from '../../public/errors'

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


  private createNotePageForm: FormGroup;

//  oldNote: NoteFull;
  private newNote: NoteFull;

  private tags: TagAlmostMin[];
  private mainTags: TagAlmostMin[] = [];
  private otherTags: TagAlmostMin[]  = [];
  // isDone: boolean;
  private links: string[];

  private tryingToSubmit = false;

  // mainTagsString: string[];
  // otherTagsString: string[];
  private isLinkValid: boolean = true;

  private showSpinner: boolean = false;


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
        isDone:[false]
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


  private load(force:boolean, refresher?:any):void{
    if(refresher==null){
      this.showSpinner=true;
    }
    this.loadMinTags(force)
    .then(()=>{
      if(refresher!=null){
        refresher.complete();
      }else{
        this.showSpinner=false;
      }
    }).catch(error=>{
      if(refresher!=null){
        refresher.complete();
      }else{
        this.showSpinner=false;
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

  private loadMinTags(force:boolean){
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


  private refresh(refresher){
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


  private getNote2():void{
    // this.newNote = new NoteFull(this.createNotePageForm.value.title);
    // // this.newNote.title=this.createNotePageForm.value.title;
    // this.newNote.text=this.createNotePageForm.value.text;
    // this.newNote.maintags=this.createNotePageForm.value.mainTags;
    // this.newNote.othertags=this.createNotePageForm.value.otherTags;
    // this.newNote.isdone=this.createNotePageForm.value.isDone;
    // this.newNote.creationdate = new Date();
    // this.newNote.lastmodificationdate = this.newNote.creationdate;
    // this.newNote.links = this.links;
    let date = new Date();
    this.newNote = new NoteFull({
      title:this.createNotePageForm.value.title.trim(),
      text:this.createNotePageForm.value.text,
      maintags:this.createNotePageForm.value.mainTags,
      othertags:this.createNotePageForm.value.otherTags,
      isdone:this.createNotePageForm.value.isDone,
      creationdate:date,
      lastmodificationdate: date,
      links:this.links
    })
    console.log('the new note is:');
    console.log(JSON.stringify(this.newNote));
  }

  // private validateTags():boolean{
  //   let diff1Length:number = Utils.arrayDiff(this.createNotePageForm.value.mainTags,
  //     this.createNotePageForm.value.otherTags,
  //     TagExtraMin.ascendingCompare
  //   ).length;
  //
  //   let diff2Length:number = Utils.arrayDiff(this.createNotePageForm.value.otherTags,
  //     this.createNotePageForm.value.mainTags,
  //     TagExtraMin.ascendingCompare
  //   ).length;
  //
  //   return diff1Length==0 && diff2Length==0
  // }


  private createNote(){
    this.tryingToSubmit=true;
    if(AtticNotes.verifyMainTagsOtherTagsValid(this.createNotePageForm.value.mainTags,
      this.createNotePageForm.value.otherTags)==false){
        this.graphicProvider.showErrorAlert(AtticError.getDuplicateTagsError());
        //console.log('not valid');
        this.makeTagsEmpty();
    }
    else{
      //console.log('valid')
      if(this.createNotePageForm.valid){
        this.getNote2();
        this.atticNotes.createNote2(this.newNote/*, this.mainTags.concat(this.otherTags)*/)
          .then(result=>{
            let title:string = this.newNote.title;

            this.graphicProvider.presentToast('Note created');

            this.makeCompletelyEmpty();
            this.tryingToSubmit=false;

            this.events.publish('change-tab',0, this.newNote.forceCastToNoteExtraMinWithDate());
            if(this.newNote.hasSomeTag()){
              this.events.publish('invalidate-tags');
            }
          })
          .catch(error=>{
            console.log(JSON.stringify(error));console.log(JSON.stringify(error.message));
            this.graphicProvider.showErrorAlert(error);
          })
        }
      }
    //else{
    //   console.log('is not valid');
    // }
  }

  private deleteLinks(event, i:number){
    event.stopPropagation();
    this.links.splice(i,1);
  }


  //it's important to pass a default value to avoid null value.
  private makeCompletelyEmpty(){
    this.createNotePageForm.reset({
      title:'',
      text:'',
      mainTags:[],
      otherTags:[],
      isDone: false
    });
    this.links=[];
  }

  private makeTagsEmpty(){
    this.createNotePageForm.reset({
      title: this.createNotePageForm.value.title,
      text: this.createNotePageForm.value.text,
      mainTags:[],
      otherTags:[],
      isDone: this.createNotePageForm.value.isDone
    })
  }

  /*
  No need to check duplicates on links because it is already done by the server.
  */

  private pushLink(){

    //Utils.pushLink(this.alertCtrl, (data)=>{this.links.push(data.link)}/*function(data: string){this.links.push(data.link)}*/);
    this.graphicProvider.genericAlert('New link', 'Insert the new link',
      [
        {
          name:'link',
          placeholder:'link'
        }
      ],
      'Add',
      (data)=>{
        if(isWebUri(data.link)){
          this.links.push(data.link);
          this.isLinkValid=true;
        }else{
          this.isLinkValid=false;
          setTimeout(()=>{
            this.isLinkValid=true;
          },3000)
        }
      }
    )

  }


}
