import { Component } from '@angular/core';
import { NavController, NavParams, PopoverController,
  Events, Loading
/*AlertController, ToastController*/ } from 'ionic-angular';

import { /*NoteExtraMin, */NoteFull/*, NoteMin, NoteSmart*/, NoteExtraMinWithDate } from '../../models/notes';

import { AtticNotesProvider } from '../../providers/attic-notes';
import { AtticTagsProvider } from '../../providers/attic-tags';

import { TagExtraMin } from '../../models/tags';
import { TagDetailsPage } from '../tag-details/tag-details';
import { NoteDetailsPopoverPage } from '../note-details-popover/note-details-popover';

import { Utils } from '../../public/utils';
import {GraphicProvider} from '../../providers/graphic';
import { InAppBrowser, InAppBrowserObject } from '@ionic-native/in-app-browser';
import { isWebUri } from 'valid-url';

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

  private note: NoteFull = null;
  // _mainTags: TagExtraMin[];
  // _otherTags: TagExtraMin[];
  // _links: string[];
  // title: string;
  // creationDateString: string;
  // lastModificationDateString: string;

  /*note's data.*/

  private mainTags: TagExtraMin[] = [];
  private otherTags: TagExtraMin[] = [];
  private links: string[] = [];
  private isDone: boolean= false;

  private shownMainTags: TagExtraMin[]; /*what is really shown depends on what user chooses to do.*/
  private shownOtherTags:TagExtraMin[];
  private shownLinks: string[] = []; /*this is also used to track the links that will be (eventually) sent to the server */
  private shownIsDone: boolean = false;

  private mainTagsToAdd: TagExtraMin[] = [];
  private otherTagsToAdd: TagExtraMin[] = [];



  // mainTagsToRemove: TagExtraMin[] = [];
  // otherTagsToRemove: TagExtraMin[] = [];

  // newLinks: string[]=[];
  /*
  initially is blank, everytime a user delete a tag, if the tag is a part of the
  note, that tag is pushed here.
  */
  private tagsToRemove: TagExtraMin[]=[];


  private submitChangeEnabled: boolean = false;


  private haveToAddMainTags: boolean = false;
  private haveToAddOtherTags: boolean = false;
  // haveToRemoveMainTags: boolean = false;
  // haveToRemoveOtherTags: boolean = false;
  private haveToRemoveTags: boolean = false;
  private isDoneChanged: boolean = false; /*don't really need this.*/
  private haveToChangeLinks: boolean = false;

  private availableOtherTags: TagExtraMin[] =[];
  private availableMainTags: TagExtraMin[] = [];

  private availableTags: TagExtraMin[] = null; //before they were initialized.
  //areTagsAvailable: boolean = false;

  private reallyAvailableTags: TagExtraMin[] = null;

  // tmpLastmodificationdate: Date;


  private lastmod: Date;

  private addMainTagsEnabled: boolean = true;
  private addOtherTagsEnabled: boolean = true;

  //private isNoteLoaded: boolean = false;

  //these two are used in the HTML
  private isNoteReallyLoaded: boolean = false;

  private areTagsReallyLoaded: boolean = false;

  // index: number=-1;

  private basicNote: NoteExtraMinWithDate;

  // private oldNote:NoteFull=null;

  private firstTime:boolean = true;

  private isLinkValid:boolean = true;

  private showSpinner: boolean = false;

  private loading:Loading;



  constructor(public navCtrl: NavController, public navParams: NavParams,
    public popoverCtrl: PopoverController,
    private atticNotes: AtticNotesProvider, private atticTags: AtticTagsProvider,
    private graphicProvider:GraphicProvider,
    private iab: InAppBrowser,
    private events:Events
  ) {
    // let ind=navParams.get('index');
    // if(ind!=null && ind!=-1){
    //   this.index=ind;
    // }



    this.basicNote = navParams.get('note');
    if(this.basicNote!=null){
      this.note = new NoteFull({title:this.basicNote.title});
      // this.note.title=this.basicNote.title;
      this.note.lastmodificationdate=this.basicNote.lastmodificationdate;

    }

    if(this.note==null){
      let title = this.navParams.get('title');
      this.note = new NoteFull({title:title});
      // this.note.title=title;
    }


    // this.events.subscribe('invalidate-full-note', (tag)=>{
    //   console.log('invalidate-full-note');console.log(JSON.stringify(this.oldNote));console.log(JSON.stringify(tag));
    //   if(this.oldNote!=null){
    //     if(this.oldNote.hasTag(tag)){
    //       console.log('need to invalidate this note');
    //       this.navCtrl.pop();
    //     }
    //   }
    // })
    // console.log('received ');console.log(JSON.stringify(this.basicNote));
    // console.log('this.note');console.log(JSON.stringify(this.note));


    //this.init();
    this.load(false);
  }

  // init(){
  //   this.noteByTitle(false);
  //   this.loadTags(false);
  // }

  private makeAllFalse(){
    this.haveToAddMainTags = false;
    this.haveToAddOtherTags = false;
    this.haveToChangeLinks = false;
    // this.haveToRemoveMainTags = false;
    // this.haveToRemoveOtherTags = false;
    this.haveToRemoveTags = false;
    this.isDoneChanged = false;
  }

  // noteByTitle(force: boolean){
  //   this.atticNotes.noteByTitle(this.title, force)
  //     .then(result=>{
  //       this.note=result/* as NoteFull;*/;
  //       // console.log('I\'v received the result and the note is');console.log(JSON.stringify(result));
  //       // console.log('the note is:');
  //       // console.log(JSON.stringify(this.note));
  //       // this.lastModificationDateString=this.note.lastModificationDate.toDateString();
  //       // this.creationDateString=this.note.creationDate.toDateString();
  //       // this._mainTags=this.note.mainTags;
  //       // this._otherTags=this.note.otherTags;
  //       // this._links=this.note.links;
  //       //error is here.
  //       // try{
  //         this.mainTags=this.note.maintags as TagExtraMin[];
  //         this.otherTags=this.note.othertags as TagExtraMin[];
  //         //
  //         // console.log('the main tags:');
  //         // console.log(JSON.stringify(this.mainTags));
  //
  //         this.links=this.note.links;
  //         this.submitChangeEnabled=false;
  //         this.isDone=this.note.isdone;
  //
  //         this.makeAllFalse();
  //
  //         this.shownMainTags = this.mainTags.slice();
  //         this.shownOtherTags = this.otherTags.slice();
  //         this.shownLinks = this.links.slice();
  //         this.shownIsDone = this.isDone;
  //
  //         // this.tmpLastmodificationdate=this.note.lastmodificationdate;
  //
  //         this.lastmod = this.note.lastmodificationdate;
  //
  //       // }
  //       // catch(e){
  //       //   console.log('the real error');console.log(e.message);
  //       //   console.log(JSON.stringify(e));
  //       // }
  //
  //       this.isNoteLoaded = true;
  //       this.isNoteReallyLoaded = true;
  //
  //     })
  //     .catch(err=>{
  //       //this.note.title=this.title;
  //       this.note = null;
  //       console.log('load note error');console.log(JSON.stringify(err.messsage));console.log(JSON.stringify(err));
  //       this.graphicProvider.showErrorAlert(err);
  //       //console.log('set note loaded to true');
  //       this.isNoteLoaded = true;
  //       this.isNoteReallyLoaded = false;
  //       console.log(this.isNoteReallyLoaded);
  //     })
  // }

  private load(force:boolean, refresher?:any):void{
    if(refresher==null){
      this.showSpinner=true;
    }
    Promise.all([this.noteByTitle(force), this.loadTags(force)])
    .then(()=>{
      if(refresher!=null){
          refresher.complete();
        }else{
          this.showSpinner=false;
        }
    })
    .catch(error=>{
      if(refresher!=null){
          refresher.complete();
        }else{
          this.showSpinner=false;
        }
      this.graphicProvider.showErrorAlert(error);
    })
  }

  private noteByTitle(force: boolean){
    return new Promise<void>((resolve, reject)=>{
      this.atticNotes.noteByTitle(this.note.title, force)
        .then(result=>{
          this.note=result/* as NoteFull;*/;

            this.mainTags=this.note.maintags as TagExtraMin[];
            this.otherTags=this.note.othertags as TagExtraMin[];

            this.links=this.note.links;
            this.submitChangeEnabled=false;
            this.isDone=this.note.isdone;

            this.makeAllFalse();

            this.shownMainTags = this.mainTags.slice();
            this.shownOtherTags = this.otherTags.slice();
            this.shownLinks = this.links.slice();
            this.shownIsDone = this.isDone;

            this.lastmod = this.note.lastmodificationdate;

          //this.isNoteLoaded = true;
          this.isNoteReallyLoaded = true;

          console.log('the note is');console.log(JSON.stringify(this.note));
          //
          // this.oldNote=this.note.clone();
          // console.log('the note');console.log(JSON.stringify(this.note));
          // console.log('old note');console.log(JSON.stringify(this.oldNote));

          resolve();

        })
        .catch(error=>{

          //this.note = null;

          console.log('load note error');console.log(JSON.stringify(error.messsage));console.log(JSON.stringify(error));
          //console.log(error.toString());
          //console.log(error.toString());
          // this.graphicProvider.showErrorAlert(err);
          //console.log('set note loaded to true');
          //this.isNoteLoaded = true;
          // if(this.note==null){
          //   this.isNoteReallyLoaded = false;
          // }
          //this.isNoteReallyLoaded = (this.note==null) ? false : true;
          this.isNoteReallyLoaded=false;
          // console.log(this.isNoteReallyLoaded);
          reject(error);
        })
    })
  }

/*please notice that error.toString() modify the error itself.*/

  private loadTags(force: boolean){
    return new Promise<void>((resolve, reject)=>{
      this.atticTags.loadTagsMin(force)
        .then(result=>{
          this.availableTags=result as TagExtraMin[];
          //this.areTagsAvailable=true;
          this.makeReallyAvailable();
          this.areTagsReallyLoaded=true;
          resolve();
        })
        .catch(error=>{
          console.log('load tags error: '+JSON.stringify(error.message));
          //this.graphicProvider.showErrorAlert(error);

          this.areTagsReallyLoaded = (this.reallyAvailableTags==null) ? false : true;

          reject(error);
        })
    })
  }

  // makeFilter(filter: any[]){
  //   // this.reallyAvailableTags=Utils.arrayDiff3(this.reallyAvailableTags, filter);
  // }

  private makeReallyAvailable(){
    this.reallyAvailableTags = this.availableTags;
  }

  //makeReallyAvailable(){private
    //this.reallyAvailableTags=this.availableTags; --> the only one used.
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
  //}

  ionViewDidLoad() {
    console.log('ionViewDidLoad NoteDetailsPage');
    // this.refresh()
  }

  ionViewWillEnter(){
    console.log('will enter note-details');
    this.firstTime=true;
  }

  private displayTagDetails(title: string){
    this.navCtrl.push(TagDetailsPage, {title})
  }

  private refresh(refresher){
    // this.noteByTitle(true);
    // this.loadTags(true);
    // Promise.all([this.noteByTitle(true), this.loadTags(true)])
    // setTimeout(()=>{
    //   refresher.complete();
    // },2000);
    this.load(!this.firstTime, refresher);
    this.firstTime=false;
  }



  private showPopover(event){
    // console.log('click and');console.log(this.isNoteLoaded);
    // console.log('so this note is');console.log(JSON.stringify(this.note));
    if(this.isNoteReallyLoaded){
      let popover=this.popoverCtrl.create(NoteDetailsPopoverPage, {note: this.note});
      popover.present({
        ev: event
      });
    }else{
      this.graphicProvider.alertMessage('Error', 'You cannot activate this popover '+
        'when the note is not loaded');
    }
  }

  /*
  Use an alert instead of a select because I can have more control on
  what it is selected (and removed, with ion-chip).
  */
  private addMainTags(){
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
    //if(this.isNoteReallyLoaded){
      this.graphicProvider.genericAlertInput('Add main tags', this.reallyAvailableTags.map(obj=>{
        return {type:'checkbox',
          label:obj.title,
          value:obj.title
          }
      }), (data)=>{
        let tagsStr:string[]=data;
        if(tagsStr.length+this.note.maintags.length>3){
          this.graphicProvider.presentToast('You cannot have more than 3 main tags', 3000);
        }else{
          let tags:TagExtraMin[]=tagsStr.map(obj=>{return new TagExtraMin(obj)});
          this.effectivelyAddMainTags(tags);
        }
      });
    //}
  }

  private effectivelyAddMainTags(tags:TagExtraMin[]){
    this.shownMainTags=this.shownMainTags.concat(tags);
    this.mainTagsToAdd=this.mainTagsToAdd.concat(tags);
    this.haveToAddMainTags = true;
    this.submitChangeEnabled = true;
    //this.note.maintags=this.note.maintags.concat(this.mainTagsToAdd);
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

  private addOtherTags(){
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
    // if(this.isNoteReallyLoaded){
      this.graphicProvider.genericAlertInput('Add other tags', this.reallyAvailableTags.map(obj=>{
        return {type:'checkbox',
          label:obj.title,
          value:obj.title
          }
      }), (data)=>{
        let tagsStr:string[]=data;
        if(tagsStr.length+this.note.othertags.length>10){
          this.graphicProvider.presentToast('You cannot have more than 10 other tags', 3000);
        }else{
          let tags:TagExtraMin[]=tagsStr.map(obj=>{return new TagExtraMin(obj)});
          this.effectivelyAddOtherTags(tags);
        }
      });
    // }
  }


  private effectivelyAddOtherTags(tags:TagExtraMin[]){
    this.shownOtherTags=this.shownOtherTags.concat(tags);
    this.otherTagsToAdd=this.otherTagsToAdd.concat(tags);
    this.haveToAddOtherTags = true;
    this.submitChangeEnabled = true;
    //this.note.othertags=this.note.othertags.concat(this.otherTagsToAdd);
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
  private addLinks(link:string){
    this.shownLinks.push(link);
    this.haveToChangeLinks = true;
    this.submitChangeEnabled = true;
    // this.newLinks.push(data.link);
  }

  private pushLinks(){

    //Utils.pushLink(this.alertCtrl, (data)=>{this.addLinks(data)});
    // if(this.isNoteReallyLoaded){
      this.graphicProvider.genericAlert('New link', 'Insert the new link',
        [
          {
            name:'link',
            placeholder:'link'
          }
        ],
        'Add',
        (data)=>{
          //console.log(JSON.stringify(data));console.log(JSON.stringify(data.link))
          if(isWebUri(data.link)){
            //console.log('valid');
            //this.links.push(data.link);
            this.addLinks(data.link)
            this.isLinkValid=true;
          }else{
            //console.log('invalid');
            this.isLinkValid=false;
            setTimeout(()=>{
              this.isLinkValid=true;
            },3000)
          }
        }
      )
    // }
  }

  private deleteMainTags(event, i: number, tag:TagExtraMin){
     event.stopPropagation();
     /*remove from the shown.*/
     this.shownMainTags.splice(i, 1);
     /*detect if there is the need to remove from mainTags.*/
     /*(user can remove a links added by him that not really exists)*/
    //  let obj:TagExtraMin = TagExtraMin.NewTag(title);
    //  let index = Utils.myIndexOf(this.mainTags,obj);
    //  if(index!=-1){
    //    this.tagsToRemove.push(this.mainTags[index]);
    //    this.haveToRemoveTags = true;
    //    this.submitChangeEnabled = true;
    //  }
    // console.log('the maintags');console.log(JSON.stringify(this.mainTags));
    // console.log('the tags to remove');console.log(JSON.stringify(tag));
    let index = Utils.myIndexOf(this.mainTags, tag);
     if(index!=-1){ //so I avoid useless remotion.
       this.tagsToRemove.push(this.mainTags[index]);
      //  console.log('the tag pushed');console.log(JSON.stringify(this.mainTags[index]));
       this.haveToRemoveTags = true;
       this.submitChangeEnabled = true;
     }
  }

  private deleteOtherTags(event, i: number,tag:TagExtraMin){
    event.stopPropagation();
    /*remove from the shown.*/
    this.shownOtherTags.splice(i, 1);
    /*detect if there is the need to remove from otherTags.*/
    // let obj:TagExtraMin = TagExtraMin.NewTag(title);
    // let index = Utils.myIndexOf(this.otherTags,obj);
    // if(index!=-1){
    //   this.tagsToRemove.push(this.otherTags[index]);
    //   this.haveToRemoveTags = true;
    //   this.submitChangeEnabled = true;
    // }
    // console.log('tag:');console.log(tag);
    let index = Utils.myIndexOf(this.otherTags, tag);
    if(index!=-1){
      // console.log('index is not -1');
      this.tagsToRemove.push(this.otherTags[index]);
      // console.log('tgatoremove');console.log(JSON.stringify(this.tagsToRemove));
      this.haveToRemoveTags = true;
      this.submitChangeEnabled = true;
    }
  }

  private deleteLinks(event, i: number, link: string){
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

  private isDoneChanges(){
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

  private addTagsAPI():Promise<void>{
    // this.note.maintags = this.note.maintags.concat(this.mainTagsToAdd);
    // this.note.othertags = this.note.othertags.concat(this.otherTagsToAdd);
    return this.atticNotes.addTags(this.note, this.mainTagsToAdd, this.otherTagsToAdd/*, this.lastmod*/);
  }

  /*
  defining real APIs
  */
  private addMainTagsAPI():Promise<void>{
    //try{
      // this.note.maintags = this.note.maintags.concat(this.mainTagsToAdd);
      // done in the db.
      return this.atticNotes.addMainTags(this.note, this.mainTagsToAdd/*, this.lastmod*/);
    // }catch(e){
    //   console.log('errorss here:');console.log(JSON.stringify(e));console.log(JSON.stringify(e.message));
    // }
  }

  private addOtherTagsAPI():Promise<void>{
    // this.note.othertags = this.note.othertags.concat(this.otherTagsToAdd);
    // done in the db.
    return this.atticNotes.addOtherTags(this.note, this.otherTagsToAdd   /*, this.lastmod*/);
  }


  private changeLinksAPI():Promise<void>{
    // return this.atticNotes.changeLinks(this.note.title, this.shownLinks);
    this.note.links = this.shownLinks;
    return this.atticNotes.changeLinks(this.note/*, this.lastmod*/);
  }

  private changeDoneAPI():Promise<void>{
    //  return this.atticNotes.changeDone(this.note.title, this.shownIsDone);
    this.note.isdone = this.shownIsDone;
    return this.atticNotes.changeDone(this.note/*, this.lastmod*/);
  }

  private removeTagsAPI():Promise<void>{
    // console.log('the tags to remove');console.log(JSON.stringify(this.tagsToRemove));

    //this.tagsToRemove.forEach(obj=>{this.note.removeTag(obj)});

    // console.log('the new note');console.log(JSON.stringify(this.note));
    // return Promise.resolve();
    return this.atticNotes.removeTags(this.note, this.tagsToRemove/*, this.lastmod*/);
    // console.log('the tags to be removed');console.log(JSON.stringify(this.tagsToRemove));
    // return Promise.resolve();
  }


  private haveToDoSomething():boolean{
    return this.haveToRemoveTags || this.haveToAddMainTags || this.haveToChangeLinks
     || this.haveToAddOtherTags || this.isDoneChanged
  }

  private haveToTouchTags():boolean{
    return this.haveToRemoveTags || this.haveToAddMainTags  || this.haveToAddOtherTags;
  }

  private hideLoadingIfNecessary():void{
    if(!this.haveToDoSomething()){
      this.graphicProvider.dismissLoading(this.loading);
    }
  }


  private submit(){
    /*decide which actions must be taken.*/
    // console.log('now I try');
    // try{
      // this.note.forceCastToNoteExtraMin();
    // }catch(e){console.log('the fucking error is here');console.log(JSON.stringify(e.message))}

    if(this.haveToDoSomething()){ /*ok so this is important*/
      this.note.lastmodificationdate=new Date();
      this.events.publish('notes-replace',
        new NoteExtraMinWithDate({title:this.note.title, lastmodificationdate: this.lastmod}),
        this.note.forceCastToNoteExtraMinWithDate());
      this.loading = this.graphicProvider.showLoading();

      this.note=this.note.getMinifiedVersionForCreation();
    }
    //can't be done here, if so, the cache won't be able to find it.

    if(this.haveToTouchTags()){
      this.events.publish('invalidate-tags');
      //this.events.publish('invalidate-full-tag', this.note.forceCastToNoteExtraMin());
    }



    if(this.haveToRemoveTags){
      this.removeTagsAPI()
      .then(result=>{
        //Utils.presentToast(this.toastCtrl, 'tags removed');
        this.graphicProvider.presentToast('tags removed');
        this.haveToRemoveTags = false;
        this.submitChangeEnabled=false;
        this.hideLoadingIfNecessary();
      })
      .catch(error=>{
        this.revertToOldDate();
        console.log('remove tags error: '+JSON.stringify(error));
        //this.hideLoadingIfNecessary();
        this.graphicProvider.dismissLoading(this.loading);
        this.graphicProvider.showErrorAlert(error);
        this.submitChangeEnabled=true;
      })
    }

    if(this.haveToAddMainTags && this.haveToAddOtherTags){
      /*if both, resolve with one call.*/
      this.addTagsAPI()
      .then(result=>{
        this.graphicProvider.presentToast('tags added');
        this.haveToAddMainTags = false;
        this.haveToAddOtherTags = false;
        this.submitChangeEnabled=false;
        this.hideLoadingIfNecessary();
      })
      .catch(error=>{
        this.revertToOldDate();
        console.log('add tags error: '+JSON.stringify(error.message));
        //this.hideLoadingIfNecessary();
        this.graphicProvider.dismissLoading(this.loading);
        this.graphicProvider.showErrorAlert(error);
        this.submitChangeEnabled=true;
        // this.hideLoadingIfNecessary();
      })
    }

    else if(this.haveToAddMainTags){
      this.addMainTagsAPI()
        .then(result=>{
          this.graphicProvider.presentToast('tags added');
          this.haveToAddMainTags = false;
          this.submitChangeEnabled=false;
          this.hideLoadingIfNecessary();
        })
        .catch(error=>{
          this.revertToOldDate();
          console.log('add tags error: '+JSON.stringify(error.message));
          //this.hideLoadingIfNecessary();
          this.graphicProvider.dismissLoading(this.loading);
          this.graphicProvider.showErrorAlert(error);
          this.submitChangeEnabled=true;
          // this.hideLoadingIfNecessary();
        })
    }

    else if(this.haveToAddOtherTags){
      this.addOtherTagsAPI()
        .then(result=>{
          this.graphicProvider.presentToast('tags added');
          this.haveToAddOtherTags = false;
          this.submitChangeEnabled=false;
          this.hideLoadingIfNecessary();
        })
        .catch(error=>{
          this.revertToOldDate();
          console.log('add tags error: '+JSON.stringify(error.message));
          //this.hideLoadingIfNecessary();
          this.graphicProvider.dismissLoading(this.loading);
          this.graphicProvider.showErrorAlert(error);
          this.submitChangeEnabled=true;
          // this.hideLoadingIfNecessary();
        })
    }

  if(this.haveToChangeLinks){
    this.changeLinksAPI()
    .then(result=>{
      this.graphicProvider.presentToast('links changed');
      this.haveToChangeLinks = false;
      this.submitChangeEnabled=false;
      this.hideLoadingIfNecessary();
    })
    .catch(error=>{
      this.revertToOldDate();
      console.log('change links error: '+JSON.stringify(error.message));
      //this.hideLoadingIfNecessary();
      this.graphicProvider.dismissLoading(this.loading);
      this.graphicProvider.showErrorAlert(error);
      this.submitChangeEnabled=true;
      // this.hideLoadingIfNecessary();
    })
  }

    if(this.isDoneChanged){
      this.changeDoneAPI()
        .then(result=>{
          this.graphicProvider.presentToast('\'done\' modified');
          this.isDoneChanged =  false;
          this.submitChangeEnabled=false;
          this.hideLoadingIfNecessary();
        })
        .catch(error=>{
          this.revertToOldDate();
          console.log('set done error: '+JSON.stringify(error.message));
          //this.hideLoadingIfNecessary();
          this.graphicProvider.dismissLoading(this.loading);
          this.graphicProvider.showErrorAlert(error);
          this.submitChangeEnabled=true;
          // this.hideLoadingIfNecessary();
        })
    }
    // useless because it's synchronous.
    // if(this.allFalse()){
    //   this.submitChangeEnabled = false;
    // }

  }

  private allFalse():boolean{
    return this.haveToChangeLinks == false && this.haveToAddMainTags == false
      && this.haveToAddOtherTags == false && this.haveToRemoveTags &&
      this.isDoneChanged == false;
  }

  private revertToOldDate(){
    this.note.lastmodificationdate=this.lastmod
  }


  private browse(link:string){
    const browser:InAppBrowserObject = this.iab.create(link, '_system');
    //browser.show();
  }

}

/*when we change the title and we go back need to refresh. Is it possible?*/
/*when create a new note too.*/
