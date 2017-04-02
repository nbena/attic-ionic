import { Component } from '@angular/core';
import { NavController, NavParams, PopoverController, AlertController } from 'ionic-angular';

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
  _id : string;
  title: string;
  // creationDateString: string;
  // lastModificationDateString: string;

  mainTags: TagExtraMin[];
  otherTags: TagExtraMin[];

  links: string[];
  submitChangeEnabled: boolean = false;
  isDone: boolean= false;

  mainTagsChanged: boolean = false;
  otherTagsChanged: boolean = false;
  linksChanged: boolean = false;
  isDoneChanged: boolean = false; /*don't really need this.*/

  availableOtherTags: TagExtraMin[];
  availableMainTags: TagExtraMin[];

  availableTags: TagExtraMin[];
  areTagsAvailable: boolean = false;

  reallyAvailableTags: TagExtraMin[];



  constructor(public navCtrl: NavController, public navParams: NavParams,
    public popoverCtrl: PopoverController, public alertCtrl: AlertController,
    private atticNotes: AtticNotes, private atticTags: AtticTags) {
    this._id=navParams.get('_id');
    this.title=navParams.get('title');
    this.noteById();
    this.loadTags();
  }

  noteById(){
    this.atticNotes.noteById(this._id)
      .then(result=>{
        this.note=<NoteFull>result;
        // this.lastModificationDateString=this.note.lastModificationDate.toDateString();
        // this.creationDateString=this.note.creationDate.toDateString();
        // this._mainTags=this.note.mainTags;
        // this._otherTags=this.note.otherTags;
        // this._links=this.note.links;
        this.mainTags=<TagExtraMin[]>this.note.mainTags;
        this.otherTags=<TagExtraMin[]>this.note.otherTags;
        this.links=this.note.links;
        this.submitChangeEnabled=false;
        this.isDone=this.note.isDone;

        this.mainTagsChanged = false;
        this.otherTagsChanged = false;
        this.linksChanged = false;
        this.isDoneChanged = false;

        // let a= [1,2,3,4];
        // let b=[3,4];
        // console.log(JSON.stringify(Utils.arrayDiff3(a,b)));

      })
      .catch(err=>{
        console.log(err);
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

    console.log("tags length");
    console.log(this.reallyAvailableTags.length.toString());

    this.reallyAvailableTags = Utils.arrayDiff3(this.reallyAvailableTags, this.mainTags.concat(this.otherTags));
    console.log("maintags + othertags length: ");
    console.log((this.mainTags.length+this.otherTags.length).toString());
    console.log("tags length");
    console.log(this.reallyAvailableTags.length.toString());
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad NoteDetailsPage');
    // this.refresh()
  }

  displayTagDetails(_id: string, title: string){
    this.navCtrl.push(TagDetailsPage, {_id, title})
  }

  refresh(refresher){
    this.noteById();
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
  addMainTags(){
    let alert = this.alertCtrl.create();
    alert.setTitle("Add main tags");

    for(let i=0;i<this.reallyAvailableTags.length;i++){
      alert.addInput({
        type: 'checkbox',
        label: this.reallyAvailableTags[i].title,
        value:  JSON.stringify(this.reallyAvailableTags[i])
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
    console.log("maintags: ");
    console.log(JSON.stringify(tags));
    Utils.pushAllJSON(this.mainTags,tags);
  }

  addOtherTags(){
    let alert = this.alertCtrl.create();
    alert.setTitle("Add main tags");

    for(let i=0;i<this.reallyAvailableTags.length;i++){
      alert.addInput({
        type: 'checkbox',
        label: this.reallyAvailableTags[i].title,
        value: JSON.stringify(this.reallyAvailableTags[i])
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
    console.log("ohertags: ");
    console.log(JSON.stringify(tags));
    Utils.pushAllJSON(this.otherTags, tags);
  }

  addLinks(){

  }

  deleteMainTags(event, i: number){
    event.stopPropagation();
     this.mainTags.splice(i, 1);
     this.submitChangeEnabled = true;
     this.mainTagsChanged = true;
  }

  deleteOtherTags(event, i: number){
    event.stopPropagation();
    this.otherTags.splice(i, 1);
    this.submitChangeEnabled = true;
    this.otherTagsChanged = true;
  }

  deleteLinks(event, i: number){
    event.stopPropagation();
    this.links.splice(i, 1);
    this. submitChangeEnabled = true;
    this.linksChanged = true;
  }

  isDoneChanges(){
    this.submitChangeEnabled = true;
    this.isDoneChanged = true;
  }

  submit(){

  }

}
