import { Component } from '@angular/core';
import { NavController, NavParams, PopoverController,
/*AlertController, ToastController*/ } from 'ionic-angular';

import { /*NoteExtraMin, */NoteFull/*, NoteMin, NoteSmart*/ } from '../../models/notes';

import { AtticNotes } from '../../providers/attic-notes';
import { AtticTags } from '../../providers/attic-tags';

import { TagExtraMin } from '../../models/tags';
import { TagDetailsPage } from '../tag-details/tag-details';
import { NoteDetailsPopoverPage } from '../note-details-popover/note-details-popover';

import { Utils } from '../../public/utils';
import {GraphicProvider} from '../../providers/graphic';

/*
  Generated class for the NoteDetails page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
  selector: 'page-note-details',
  templateUrl: 'note-details.html'
})


export class NoteDetailsPage {

  note: NoteFull;
  // _mainTags: TagExtraMin[];
  // _otherTags: TagExtraMin[];
  // _links: string[];
  title: string;
  // creationDateString: string;
  // lastModificationDateString: string;

  /*note's data.*/

  mainTags: TagExtraMin[] = [];
  otherTags: TagExtraMin[] = [];
  links: string[] = [];
  isDone: boolean= false;

  shownMainTags: TagExtraMin[]; /*what is really shown depends on what user chooses to do.*/
  shownOtherTags: TagExtraMin[];
  shownLinks: string[] = []; /*this is also used to track the links that will be (eventually) sent to the server */
  shownIsDone: boolean = false;

  mainTagsToAdd: TagExtraMin[] = [];
  otherTagsToAdd: TagExtraMin[] = [];



  // mainTagsToRemove: TagExtraMin[] = [];
  // otherTagsToRemove: TagExtraMin[] = [];

  // newLinks: string[]=[];
  /*
  initially is blank, everytime a user delete a tag, if the tag is a part of the
  note, that tag is pushed here.
  */
  tagsToRemove: TagExtraMin[]=[];


  submitChangeEnabled: boolean = false;


  haveToAddMainTags: boolean = false;
  haveToAddOtherTags: boolean = false;
  // haveToRemoveMainTags: boolean = false;
  // haveToRemoveOtherTags: boolean = false;
  haveToRemoveTags: boolean = false;
  isDoneChanged: boolean = false; /*don't really need this.*/
  haveToChangeLinks: boolean = false;

  availableOtherTags: TagExtraMin[] =[];
  availableMainTags: TagExtraMin[] = [];

  availableTags: TagExtraMin[] = [];
  areTagsAvailable: boolean = false;

  reallyAvailableTags: TagExtraMin[] = [];



  constructor(public navCtrl: NavController, public navParams: NavParams,
    public popoverCtrl: PopoverController,
    private atticNotes: AtticNotes, private atticTags: AtticTags,
    private graphicProvider:GraphicProvider
  ) {
    this.title=navParams.get('title');
    this.note = new NoteFull();
    this.note.title=this.title;
    this.init();
  }

  init(){
    this.noteByTitle(false);
    this.loadTags(false);
  }

  makeAllFalse(){
    this.haveToAddMainTags = false;
    this.haveToAddOtherTags = false;
    this.haveToChangeLinks = false;
    // this.haveToRemoveMainTags = false;
    // this.haveToRemoveOtherTags = false;
    this.haveToRemoveTags = false;
    this.isDoneChanged = false;
  }

  noteByTitle(force: boolean){
    this.atticNotes.noteByTitle(this.title, force)
      .then(result=>{
        this.note=result as NoteFull;
        // console.log('the note is:');
        // console.log(JSON.stringify(this.note));
        // this.lastModificationDateString=this.note.lastModificationDate.toDateString();
        // this.creationDateString=this.note.creationDate.toDateString();
        // this._mainTags=this.note.mainTags;
        // this._otherTags=this.note.otherTags;
        // this._links=this.note.links;
        this.mainTags=this.note.maintags as TagExtraMin[];
        this.otherTags=this.note.othertags as TagExtraMin[];
        //
        // console.log('the main tags:');
        // console.log(JSON.stringify(this.mainTags));

        this.links=this.note.links;
        this.submitChangeEnabled=false;
        this.isDone=this.note.isdone;

        this.makeAllFalse();

        this.shownMainTags = this.mainTags.slice();
        this.shownOtherTags = this.otherTags.slice();
        this.shownLinks = this.links.slice();
        this.shownIsDone = this.isDone;


      })
      .catch(err=>{
        this.note.title=this.title;
        console.log('load note error');console.log(JSON.stringify(err.messsage));
        console.log(JSON.stringify(err));
        this.graphicProvider.showErrorAlert(err);
      })
  }


  loadTags(force: boolean){
    this.atticTags.loadTagsMin(force)
      .then(result=>{
        // console.log('the tags:');
        // console.log(JSON.stringify(result));
        this.availableTags=result as TagExtraMin[];
        this.areTagsAvailable=true;
        this.makeReallyAvailable();

        // console.log(JSON.stringify(this.reallyAvailableTags));

      })
      .catch(error=>{
        console.log('load tags error: '+JSON.stringify(error));
        this.graphicProvider.showErrorAlert(error);
      })
  }

  makeFilter(filter: any[]){
    // this.reallyAvailableTags=Utils.arrayDiff3(this.reallyAvailableTags, filter);
  }

  makeReallyAvailable(){
    this.reallyAvailableTags=this.availableTags;
    // console.log("the really available tags: \n");
    // console.log(JSON.stringify(this.reallyAvailableTags));
    // console.log("the main tags: \n");
    // console.log(JSON.stringify(<TagExtraMin[]>this.mainTags));
    // console.log("the other tags: \n");
    // console.log(JSON.stringify(<TagExtraMin[]>this.otherTags));
    // console.log("going to call");
    //
    //
    // this.makeFilter(this.mainTags.concat(this.otherTags));
    // // this.makeFilter(this.otherTags);
    // console.log("filetring called");
    // console.log("=========the filtering:=========");
    // console.log(JSON.stringify(this.reallyAvailableTags));

    // console.log("tags length");
    // console.log(this.reallyAvailableTags.length.toString());
    //
    // this.reallyAvailableTags = Utils.arrayDiff3(this.reallyAvailableTags, this.mainTags.concat(this.otherTags));
    // console.log("maintags + othertags length: ");
    // console.log((this.mainTags.length+this.otherTags.length).toString());
    // console.log("tags length");
    // console.log(this.reallyAvailableTags.length.toString());
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad NoteDetailsPage');
    // this.refresh()
  }

  displayTagDetails(title: string){
    this.navCtrl.push(TagDetailsPage, {title})
  }

  refresh(refresher){
    // this.noteByTitle(true);
    // this.loadTags(true);
    Promise.all([this.noteByTitle(true), this.loadTags(true)])
    setTimeout(()=>{
      refresher.complete();
    },2000);
  }

  showPopover(event){
    let popover=this.popoverCtrl.create(NoteDetailsPopoverPage, {note: this.note});
    popover.present({
      ev: event
    });
  }

  /*
  Use an alert instead of a select because I can have more control on
  what it is selected (and removed, with ion-chip).
  */
  addMainTags(){
    // let alert = this.alertCtrl.create();
    // alert.setTitle("Add main tags");
    //
    // for(let i=0;i<this.reallyAvailableTags.length;i++){
    //   alert.addInput({
    //     type: 'checkbox',
    //     label: this.reallyAvailableTags[i].title,
    //     value:  JSON.stringify(this.reallyAvailableTags[i]) /*it doesn't accept objects.*/
    //   })
    // }
    // alert.addButton('Cancel');
    // alert.addButton({
    //   text: 'Ok',
    //   handler: data => {
    //     // console.log(JSON.stringify(data));
    //     this.addMainTagsUI(<string[]>data);
    //   }
    // })
    // alert.present();
    this.graphicProvider.genericAlertInput('Add main tags', this.reallyAvailableTags.map(obj=>{
      return {type:'checkbox',
        label:obj.title,
        value:obj.title
        }
    }), (data)=>{
      let tagsStr:string[]=data;
      let tags:TagExtraMin[]=tagsStr.map(obj=>{return TagExtraMin.NewTag(obj)});
      this.effectivelyAddMainTags(tags);
    });
  }

  effectivelyAddMainTags(tags:TagExtraMin[]){
    this.shownMainTags=this.shownMainTags.concat(tags);
    this.mainTagsToAdd=this.mainTagsToAdd.concat(tags);
    this.haveToAddMainTags = true;
    this.submitChangeEnabled = true;
    this.note.maintags=this.note.maintags.concat(this.mainTagsToAdd);
  }

  // /*
  // Using string[] because it is required by the API.
  // */
  // addMainTagsUI(tags: string[]){
  //   // console.log("maintags: ");
  //   // console.log(JSON.stringify(tags));
  //   Utils.pushAllJSON(this.shownMainTags,tags);
  //   Utils.pushAllJSON(this.mainTagsToAdd, tags);
  //   this.haveToAddMainTags = true;
  //   this.submitChangeEnabled = true;
  //   this.note.maintags=this.note.maintags.concat(this.mainTagsToAdd);
  // }

  addOtherTags(){
    // let alert = this.alertCtrl.create();
    // alert.setTitle("Add other tags");
    //
    // for(let i=0;i<this.reallyAvailableTags.length;i++){
    //   alert.addInput({
    //     type: 'checkbox',
    //     label: this.reallyAvailableTags[i].title,
    //     value: JSON.stringify(this.reallyAvailableTags[i]) /*it doesn't accept objects.*/
    //   })
    // }
    // alert.addButton('Cancel');
    // alert.addButton({
    //   text: 'Ok',
    //   handler: data => {
    //     // console.log(JSON.stringify(data));
    //     this.addOtherTagsUI(<string[]>data);
    //   }
    // })
    // alert.present();
    this.graphicProvider.genericAlertInput('Add other tags', this.reallyAvailableTags.map(obj=>{
      return {type:'checkbox',
        label:obj.title,
        value:obj.title
        }
    }), (data)=>{
      let tagsStr:string[]=data;
      let tags:TagExtraMin[]=tagsStr.map(obj=>{return TagExtraMin.NewTag(obj)});
      this.effectivelyAddOtherTags(tags);
    });
  }


  effectivelyAddOtherTags(tags:TagExtraMin[]){
    this.shownOtherTags=this.shownOtherTags.concat(tags);
    this.otherTagsToAdd=this.otherTagsToAdd.concat(tags);
    this.haveToAddOtherTags = true;
    this.submitChangeEnabled = true;
    this.note.othertags=this.note.othertags.concat(this.otherTagsToAdd);
  }

  // addOtherTagsUI(tags: string[]){
  //   // console.log("ohertags: ");
  //   // console.log(JSON.stringify(tags));
  //   Utils.pushAllJSON(this.shownOtherTags, tags);
  //   Utils.pushAllJSON(this.otherTagsToAdd, tags);
  //   this.haveToAddOtherTags = true;
  //   this.submitChangeEnabled = true;
  //   this.note.othertags=this.note.othertags.concat(this.otherTagsToAdd);
  //
  // }

  /*
  callback to pass.
  */
  addLinks(data: any){
    this.shownLinks.push(data.link);
    this.haveToChangeLinks = true;
    this.submitChangeEnabled = true;
    // this.newLinks.push(data.link);
  }

  pushLinks(){

    //Utils.pushLink(this.alertCtrl, (data)=>{this.addLinks(data)});
    this.graphicProvider.genericAlert('New link', 'Insert the new link',
      [
        {
          name:'link',
          placeholder:'link'
        }
      ],
      'Add',
      (data)=>{this.addLinks(data)}
    )
  }

  deleteMainTags(event, i: number, title: string){
     event.stopPropagation();
     /*remove from the shown.*/
     this.shownMainTags.splice(i, 1);
     /*detect if there is the need to remove from mainTags.*/
     /*(user can remove a links added by him that not really exists)*/
     let obj = new TagExtraMin();
     obj.title=title;
     let index = Utils.myIndexOf(this.mainTags,obj);
     if(index!=-1){
       this.tagsToRemove.push(this.mainTags[index]);
       this.haveToRemoveTags = true;
       /*
       delete from this.mainTags: it will be done when the call to the API will
       will be done.
       */
       /*enable changes.*/
       this.submitChangeEnabled = true;
      //  console.log('enable changes');
     }
    //  this.haveToRemoveMainTags = true;
  }

  deleteOtherTags(event, i: number,title: string){
    event.stopPropagation();
    /*remove from the shown.*/
    this.shownOtherTags.splice(i, 1);
    /*detect if there is the need to remove from otherTags.*/
    let obj = new TagExtraMin();
    obj.title=title;
    let index = Utils.myIndexOf(this.otherTags,obj);
    if(index!=-1){
      this.tagsToRemove.push(this.otherTags[index]);
      this.haveToRemoveTags = true;
      /*
      delete from this.otherTags: it will be done when the call to the API will
      will be done.
      */
      /*enable changes.*/
      this.submitChangeEnabled = true;
     //  console.log('enable changes');
    }
   //  this.haveToRemoveOtherTags = true;
  }

  deleteLinks(event, i: number, link: string){
    event.stopPropagation();
    /*remove from the shown.*/
    this.shownLinks.splice(i, 1);
    /*detect if there is the need to remove from links.*/
    let index = this.links.indexOf(link);
    // console.log('index to remove:');
    // console.log(index);

    if(index!=-1){

      /*if the link to be removed is in the note's links we'll remove it.*/
      /*
      delete from this.links: it will be done when the call to the API will
      will be done.
      */
      /*enable changes.*/
      this.haveToChangeLinks = true;
      this.submitChangeEnabled = true;
    }
    // this.haveToRemoveLinks = true;
  }

  isDoneChanges(){
    /*
    keep this enabled even if there aren't chages on isDone,
    because there can be other changes in other fields.
    */
    this.submitChangeEnabled = true;
    if(this.shownIsDone != this.isDone){
      this.isDoneChanged = true;
    }else{
      this.isDoneChanged = false;
    }
  }

  addTagsAPI(){
    return this.atticNotes.addTags(this.note, this.mainTagsToAdd, this.otherTagsToAdd);
  }

  /*
  defining real APIs
  */
  addMainTagsAPI(){
    try{
      return this.atticNotes.addMainTags(this.note, this.mainTagsToAdd);
    }catch(e){
      console.log('errorss here:');console.log(JSON.stringify(e));console.log(JSON.stringify(e.message));
    }
  }

  addOtherTagsAPI(){
    return this.atticNotes.addOtherTags(this.note, this.otherTagsToAdd);
  }

  removeMainTagsAPI(){
    // return this.atticNotes.removeMainTags(this.note.title, Utils.fromTagsToString(this.mainTagsToRemove));
  }

  removeOtherTagsAPI(){
    // return this.atticNotes.removeOtherTags(this.note.title, Utils.fromTagsToString(this.otherTagsToRemove));
  }

  changeLinksAPI(){
    // return this.atticNotes.changeLinks(this.note.title, this.shownLinks);
    this.note.links = this.shownLinks;
    return this.atticNotes.changeLinks(this.note);
  }

  changeDoneAPI(){
    //  return this.atticNotes.changeDone(this.note.title, this.shownIsDone);
    this.note.isdone = this.shownIsDone;
    return this.atticNotes.changeDone(this.note);
  }

  removeTagsAPI(){
    return this.atticNotes.removeTags(this.note, this.tagsToRemove);
  }


  submit(){
    /*decide which actions must be taken.*/
    console.log('now I try');
    try{
      this.note.forceCastToNoteExtraMin();
    }catch(e){console.log('the fucking error is here');console.log(JSON.stringify(e.message))}

    if(this.haveToRemoveTags){
      this.removeTagsAPI()
      .then(result=>{
        //Utils.presentToast(this.toastCtrl, 'tags removed');
        this.graphicProvider.presentToast('tags removed');
        this.haveToRemoveTags = false;
      })
      .catch(error=>{
        console.log('remove tags error: '+JSON.stringify(error));
        this.graphicProvider.showErrorAlert(error);
      })
    }

    if(this.haveToAddMainTags && this.haveToAddOtherTags){
      /*if both, resolve with one call.*/
      this.addTagsAPI()
      .then(result=>{
        this.graphicProvider.presentToast('tags added');
        this.haveToAddMainTags = false;
        this.haveToAddOtherTags = false;
      })
      .catch(error=>{
        console.log('add tags error: '+JSON.stringify(error.message));
        this.graphicProvider.showErrorAlert(error);
      })
    }

    else if(this.haveToAddMainTags){
      this.addMainTagsAPI()
        .then(result=>{
          this.graphicProvider.presentToast('tags added');
          this.haveToAddMainTags = false;
        })
        .catch(error=>{
          console.log('add tags error: '+JSON.stringify(error.message));
          this.graphicProvider.showErrorAlert(error);
        })
    }

    else if(this.haveToAddOtherTags){
      this.addOtherTagsAPI()
        .then(result=>{
          this.graphicProvider.presentToast('tags added');
          this.haveToAddOtherTags = false;
        })
        .catch(error=>{
          console.log('add tags error: '+JSON.stringify(error.message));
          this.graphicProvider.showErrorAlert(error);
        })
    }

  if(this.haveToChangeLinks){
    this.changeLinksAPI()
    .then(result=>{
      this.graphicProvider.presentToast('links changed');
      this.haveToChangeLinks = false;
    })
    .catch(error=>{
      console.log('change links error: '+JSON.stringify(error.message));
      this.graphicProvider.showErrorAlert(error);
    })
  }

    if(this.isDoneChanged){
      this.changeDoneAPI()
        .then(result=>{
          this.graphicProvider.presentToast('\'done\' modified');
          this.isDoneChanged =  false;
        })
        .catch(error=>{
          console.log('set done error: '+JSON.stringify(error.message));
          this.graphicProvider.showErrorAlert(error);
        })
    }
    if(this.allFalse()){
      this.submitChangeEnabled = false;
    }
  }

  allFalse():boolean{
    return this.haveToChangeLinks == false && this.haveToAddMainTags == false
      && this.haveToAddOtherTags == false && this.haveToRemoveTags &&
      this.isDoneChanged == false;
  }

}

/*when we change the title and we go back need to refresh. Is it possible?*/
/*when create a new note too.*/
