import { Component } from '@angular/core';
import { NavController, NavParams, PopoverController,
  AlertController, ToastController } from 'ionic-angular';

import { NoteExtraMin, NoteFull, NoteMin, NoteSmart } from '../../models/notes';

import { AtticNotes } from '../../providers/attic-notes';
import { AtticTags } from '../../providers/attic-tags';

import { TagExtraMin } from '../../models/tags';
import { TagDetailsPage } from '../tag-details/tag-details';
import { NotesPopoverPage } from '../notes-popover/notes-popover';

import { Utils } from '../../public/utils';

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
  shownLinks: string[] = [];
  shownIsDone: boolean = false;

  mainTagsToAdd: TagExtraMin[] = [];
  otherTagsToAdd: TagExtraMin[] = [];
  linksToAdd: string[] = [];

  mainTagsToRemove: TagExtraMin[] = [];
  otherTagsToRemove: TagExtraMin[] = [];
  linksToRemove: string[] = [];


  submitChangeEnabled: boolean = false;


  haveToAddMainTags: boolean = false;
  haveToAddOtherTags: boolean = false;
  haveToRemoveMainTags: boolean = false;
  haveToRemoveOtherTags: boolean = false;
  haveToAddLinks: boolean = false;
  haveToRemoveLinks: boolean = false;
  isDoneChanged: boolean = false; /*don't really need this.*/

  availableOtherTags: TagExtraMin[] =[];
  availableMainTags: TagExtraMin[] = [];

  availableTags: TagExtraMin[] = [];
  areTagsAvailable: boolean = false;

  reallyAvailableTags: TagExtraMin[] = [];



  constructor(public navCtrl: NavController, public navParams: NavParams,
    public popoverCtrl: PopoverController, public alertCtrl: AlertController,
    public toastCtrl: ToastController,
    private atticNotes: AtticNotes, private atticTags: AtticTags) {
    this.title=navParams.get('title');
    this.noteByTitle();
    this.loadTags();
  }

  makeAllFalse(){
    this.haveToAddMainTags = false;
    this.haveToAddOtherTags = false;
    this.haveToAddLinks = false;
    this.haveToRemoveMainTags = false;
    this.haveToRemoveOtherTags = false;
    this.haveToRemoveLinks = false;
    this.isDoneChanged = false;
  }

  noteByTitle(){
    this.atticNotes.noteByTitle(this.title)
      .then(result=>{
        this.note=<NoteFull>result;
        // this.lastModificationDateString=this.note.lastModificationDate.toDateString();
        // this.creationDateString=this.note.creationDate.toDateString();
        // this._mainTags=this.note.mainTags;
        // this._otherTags=this.note.otherTags;
        // this._links=this.note.links;
        this.mainTags=<TagExtraMin[]>this.note.maintags;
        this.otherTags=<TagExtraMin[]>this.note.othertags;
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


        // let a= [1,2,3,4];
        // let b=[3,4];
        // console.log(JSON.stringify(Utils.arrayDiff3(a,b)));

      })
      .catch(err=>{
        console.log(JSON.stringify(err));
      })
  }


  loadTags(){
    this.atticTags.loadTagsMin()
      .then(result=>{
        this.availableTags=<TagExtraMin[]>result;
        this.areTagsAvailable=true;
        this.makeReallyAvailable();

        // console.log(JSON.stringify(this.reallyAvailableTags));

      })
      .catch(error=>{
        console.log(JSON.stringify(error));
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

  displayTagDetails(_id: string, title: string){
    this.navCtrl.push(TagDetailsPage, {_id, title})
  }

  refresh(refresher){
    this.noteByTitle();
    setTimeout(()=>{
      refresher.complete();
    },2000);
  }

  showPopover(event){
    let popover=this.popoverCtrl.create(NotesPopoverPage, {note: this.note});
    popover.present({
      ev: event
    });
  }

  /*
  Use an alert instead of a select because I can have more control on
  what it is selected (and removed, with ion-chip).
  */
  addMainTags(){
    let alert = this.alertCtrl.create();
    alert.setTitle("Add main tags");

    for(let i=0;i<this.reallyAvailableTags.length;i++){
      alert.addInput({
        type: 'checkbox',
        label: this.reallyAvailableTags[i].title,
        value:  JSON.stringify(this.reallyAvailableTags[i]) /*it doesn't accept objects.*/
      })
    }
    alert.addButton('Cancel');
    alert.addButton({
      text: 'Ok',
      handler: data => {
        // console.log(JSON.stringify(data));
        this.addMainTagsUI(<string[]>data);
      }
    })
    alert.present();
  }

  /*
  Using string[] because it is required by the API.
  */
  addMainTagsUI(tags: string[]){
    // console.log("maintags: ");
    // console.log(JSON.stringify(tags));
    Utils.pushAllJSON(this.shownMainTags,tags);
    Utils.pushAllJSON(this.mainTagsToAdd, tags);
    this.haveToAddMainTags = true;
    this.submitChangeEnabled = true;
  }

  addOtherTags(){
    let alert = this.alertCtrl.create();
    alert.setTitle("Add main tags");

    for(let i=0;i<this.reallyAvailableTags.length;i++){
      alert.addInput({
        type: 'checkbox',
        label: this.reallyAvailableTags[i].title,
        value: JSON.stringify(this.reallyAvailableTags[i]) /*it doesn't accept objects.*/
      })
    }
    alert.addButton('Cancel');
    alert.addButton({
      text: 'Ok',
      handler: data => {
        // console.log(JSON.stringify(data));
        this.addOtherTagsUI(<string[]>data);
      }
    })
    alert.present();
  }

  addOtherTagsUI(tags: string[]){
    // console.log("ohertags: ");
    // console.log(JSON.stringify(tags));
    Utils.pushAllJSON(this.shownOtherTags, tags);
    Utils.pushAllJSON(this.otherTagsToAdd, tags);
    this.haveToAddOtherTags = true;
    this.submitChangeEnabled = true;

  }

  /*
  callback to pass.
  */
  addLinks(data){
    this.shownLinks.push(data.link);
    this.haveToAddLinks = true;
    this.submitChangeEnabled = true;
    this.linksToAdd.push(data.link);
  }

  pushLinks(){
    // Utils.pushLink(this.alertCtrl, (data)=>{this.shownLinks.push(data.link)});
    // this.haveToAddLinks = true;
    // this.submitChangeEnabled = true;
    // console.log('the length is');
    // console.log(this.shownLinks.length);
    // this.linksToAdd.push(this.shownLinks[this.shownLinks.length-1]);
    Utils.pushLink(this.alertCtrl, (data)=>{this.addLinks(data)});
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
       this.mainTagsToRemove.push(this.mainTags[index]);
       this.haveToRemoveMainTags = true;
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
      this.otherTagsToRemove.push(this.otherTags[index]);
      this.haveToRemoveOtherTags = true;
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
    console.log('index to remove:');
    console.log(index);
    if(index!=-1){
      this.linksToRemove.push(this.links[index]);
      this.haveToRemoveLinks = true;
      /*
      delete from this.links: it will be done when the call to the API will
      will be done.
      */
      /*enable changes.*/
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

  /*
  defining real APIs
  */
  addMainTagsAPI(){
    return this.atticNotes.addMainTags(this.note.title, Utils.fromTagsToString(this.mainTagsToAdd));
  }

  addOtherTagsAPI(){
    return this.atticNotes.addOtherTags(this.note.title, Utils.fromTagsToString(this.otherTagsToAdd));
  }

  removeMainTagsAPI(){
    return this.atticNotes.removeMainTags(this.note.title, Utils.fromTagsToString(this.mainTagsToRemove));
  }

  removeOtherTagsAPI(){
    return this.atticNotes.removeOtherTags(this.note.title, Utils.fromTagsToString(this.otherTagsToRemove));
  }

  addLinksAPI(){
    return this.atticNotes.addLinks(this.note.title, this.linksToAdd);
  }

  removeLinksAPI(){
    return this.atticNotes.removeLinks(this.note.title, this.linksToRemove);
  }

  setDoneAPI(){
    return this.atticNotes.setDone(this.note.title, this.shownIsDone);
  }


  submit(){
    /*decide which actions must be taken.*/
    if(this.haveToRemoveMainTags){
      this.removeMainTagsAPI()
        .then(result=>{
          Utils.presentToast(this.toastCtrl, 'tags removed');
          this.haveToRemoveMainTags = false;
        })
        .catch(error=>{
          console.log(JSON.stringify(error));
        })
    }

    if(this.haveToRemoveOtherTags){
      this.removeOtherTagsAPI()
        .then(result=>{
          Utils.presentToast(this.toastCtrl, 'tags removed');
          this.haveToRemoveOtherTags = false;
        })
        .catch(error=>{
          console.log(JSON.stringify(error));
        })
    }

    if(this.haveToAddMainTags){
      this.addMainTagsAPI()
        .then(result=>{
          Utils.presentToast(this.toastCtrl, 'tags added');
          this.haveToAddMainTags = false;
        })
        .catch(error=>{
          console.log(JSON.stringify(error));
        })
    }

    if(this.haveToAddOtherTags){
      this.addOtherTagsAPI()
        .then(result=>{
          Utils.presentToast(this.toastCtrl, 'tags added');
          this.haveToAddOtherTags = false;
        })
        .catch(error=>{
          console.log(JSON.stringify(error));
        })
    }

    if(this.haveToRemoveLinks){
      this.removeLinksAPI()
        .then(result=>{
          Utils.presentToast(this.toastCtrl, 'links removed');
          this.haveToRemoveLinks = false;
        })
        .catch(error=>{
          console.log(JSON.stringify(error));
        })
    }

    if(this.haveToAddLinks){
      this.addLinksAPI()
        .then(result=>{
          Utils.presentToast(this.toastCtrl, 'links added');
          this.haveToAddLinks = false;
        })
        .catch(error=>{
          console.log(JSON.stringify(error));
        })
    }

    if(this.isDoneChanged){
      this.setDoneAPI()
        .then(result=>{
          Utils.presentToast(this.toastCtrl, '\'done\' modified');
          this.isDoneChanged =  false;
        })
        .catch(error=>{
          console.log(JSON.stringify(error));
        })
    }
    if(this.allFalse()){
      this.submitChangeEnabled = false;
    }
  }

  allFalse():boolean{
    return this.haveToAddLinks == false && this.haveToAddMainTags == false
      && this.haveToRemoveLinks == false && this.haveToAddOtherTags == false
      && this.haveToRemoveMainTags == false && this.haveToRemoveOtherTags &&
      this.isDoneChanged == false;
  }

}
