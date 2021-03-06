import { Component } from '@angular/core';
import { NavController, NavParams, PopoverController/*,Events*/ } from 'ionic-angular';

import { /*TagFull, TagExtraMin, *//*TagMin*/TagFull,TagAlmostMin } from '../../models/tags';
import { AtticTagsProvider } from '../../providers/attic-tags';
import { NoteDetailsPage } from '../note-details/note-details';
import { TagDetailsPopoverPage } from '../tag-details-popover/tag-details-popover';
import {GraphicProvider} from '../../providers/graphic';

/*
  Generated class for the TagDetails page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
  selector: 'page-tag-details',
  templateUrl: 'tag-details.html'
})
export class TagDetailsPage {

  private tag: TagFull=null;
  // title: string;

  private isTagLoaded:boolean = false;
  private isComplete:boolean = false;
  // private index:number=-1;
  private basicTag: TagAlmostMin=null;

  // private oldTag:TagFull=null;

  private firstTime: boolean = true;

  private showSpinner: boolean = false;


  constructor(public navCtrl: NavController, public navParams: NavParams,
    private popoverCtrl: PopoverController,
    private atticTags: AtticTagsProvider,
    private graphicProvider:GraphicProvider,
    // private events:Events
  ) {


    this.basicTag = navParams.get('tag');
    // console.log('the basic tag');console.log(JSON.stringify(this.basicTag));
    if(this.basicTag!=null){
      this.tag = new TagFull({title:this.basicTag.title, noteslength:this.basicTag.noteslength});
      // console.log('the tag');console.log(JSON.stringify(this.tag));
      // this.tag.title=this.basicTag.title;
      // this.tag.noteslength=this.basicTag.noteslength;
      // this.oldTag=this.tag.clone();
    }

    if(this.tag==null){
      let title=navParams.get('title');
      this.tag=new TagFull({title:title});
    }

      // this.title=navParams.get('title');
      //this.tagByTitle(this.title, false);

      // let ind=navParams.get('index');
      // if(ind!=null && ind!=-1){
      //   this.index=ind;
      // }


      // this.events.subscribe('invalidate-full-tag', (note)=>{
      //   if(this.oldTag!=null){
      //     if(this.oldTag.hasNote(note)){
      //       console.log('need to invalidate this tag');
      //       this.navCtrl.pop();
      //     }
      //   }
      // });

      this.load(false);
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad TagDetailsPage');
  }

  ionViewWillEnter(){
    // console.log('will enter tag-details');
    if(this.tag!=null && this.tag.noteslength>0){
      this.isComplete=true;
    }else{
      this.isComplete=false;
    }
    this.firstTime=true;
  }

  // tagByTitle(title: string, force: boolean){
  //   this.atticTags.tagByTitle(this.title, force)
  //     .then(result=>{
  //
  //       // this.tag = new TagFull();
  //       // this.tag.title = result.tag.title;
  //       // this.tag.noteslength=result.tag.noteslength;
  //       // for(let i=0;i<result.tag.notes.length;i++){
  //       //   this.tag.notes.push(result.tag.notes[i].notetitle);
  //       // }
  //       this.tag=result;
  //       if(this.tag.noteslength>0){
  //         this.isComplete = true;
  //       }
  //       // console.log('the tag is:');
  //       // console.log(JSON.stringify(this.tag));
  //       this.isTagLoaded = true;
  //     })
  //     .catch(error=>{
  //       console.log('tag by title error:'+error);
  //       this.graphicProvider.showErrorAlert(error);
  //       this.isTagLoaded=true;
  //       this.tag = null;
  //     })
  // }
  private tagByTitle(force: boolean):Promise<void>{
    return new Promise<void>((resolve, reject)=>{
      this.atticTags.tagByTitle(this.tag.title, force)
        .then(result=>{
          // console.log('so the result is');console.log(JSON.stringify(result));
          this.tag=result;
          // console.log('so the tag is');console.log(JSON.stringify(this.tag));
          if(this.tag.noteslength>0){
            this.isComplete = true;
          }
          this.isTagLoaded = true;
          resolve();
        })
        .catch(error=>{
          console.log('tag by title error:');console.log(JSON.stringify(error));console.log(JSON.stringify(error.message));
          // this.graphicProvider.showErrorAlert(error);
          //this.isTagLoaded=true;
          this.isTagLoaded=false;
          //this.tag = null;
          reject(error);
        })
    })
  }

  private displayNoteDetails(title: string){
    this.navCtrl.push(NoteDetailsPage, {title});
  }

  private refresh(refresher){
    // this.tagByTitle(this.title, true);
    // setTimeout(()=>{
    //   refresher.complete();
    // },2000);
    this.load(!this.firstTime, refresher);
    this.firstTime=false;
  }

  private load(force:boolean, refresher?:any){
    if(refresher==null){
      this.showSpinner=true;
    }
    this.tagByTitle(force)
    .then(()=>{
      //console.log('ok tag by title');
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

  private showPopover(event){
    if(this.isTagLoaded){
      let popover=this.popoverCtrl.create(TagDetailsPopoverPage, {tag: this.tag});
      popover.present({
        ev:event
      });
    }else{
      this.graphicProvider.alertMessage('Error', 'You cannot activate this popover '+
        'when the tag is not loaded');
    }
  }

}
