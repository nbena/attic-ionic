import { Component } from '@angular/core';
import { NavController, NavParams, PopoverController,/* ToastController, */Events,
  ViewController,Popover
  //,App
  } from 'ionic-angular';

import { AtticNotes } from '../../providers/attic-notes';
import {/* NoteExtraMin, /*NoteSmart, */NoteMin/*, NoteFull*/,NoteExtraMinWithDate } from '../../models/notes';

import { NoteDetailsPage } from '../note-details/note-details';
//import { CreateNotePage } from '../create-note/create-note';

import { FilterNs/*, Table*/, } from '../../public/const';
import { FormControl } from '@angular/forms';

// import { Db } from '../../providers/db';

import 'rxjs/add/operator/debounceTime';


import { Synch } from '../../providers/synch';

import { TagAlmostMin } from '../../models/tags';

import { NotesPopoverPage } from '../notes-popover/notes-popover';

//import { Utils } from '../../public/utils';
import { GraphicProvider} from '../../providers/graphic'

/*
  Generated class for the Notes page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/

// enum Filter{
//   Tags,
//   MainTags,
//   OtherTags,
//   None
// }


@Component({
  selector: 'page-notes',
  templateUrl: 'notes.html'
})
export class NotesPage {

  /*defining the result from the API.*/
  shownNotes: NoteExtraMinWithDate[] = null;
  allNotes : NoteExtraMinWithDate[] = null;
  currentFilter : FilterNs.Filter = FilterNs.Filter.None;
  currentFilterValue: any = null;

  searchCtrl: FormControl;
  searchTerm: string ='';

  isFull: boolean;

  isRefreshing:boolean = false;

  isRefreshingSet: boolean = false;

  /*eventualNote: string = null;*/

  constructor(public navCtrl: NavController, private navParams: NavParams,
    private events: Events,
    private popoverCtrl: PopoverController,
    private atticNotes: AtticNotes,
    // private db: Db,
    // private toastCtrl: ToastController,
    private synch: Synch,
    private graphicProvider:GraphicProvider,
    private viewCtrl: ViewController,
    // private app:App
  ) {

      //try{
      let filterType:any;
      let filterValue:any;
      try{
        filterType = navParams.get('filterType');
        filterValue = navParams.get('filterValue');
      }
      catch(error){
        filterValue = null;
        /*the handled ahead...*/
      }

        this.searchCtrl = new FormControl();

        this.currentFilter = filterType;
        this.currentFilterValue = filterValue;

        if(filterValue==null){
          this.currentFilter=FilterNs.Filter.None;
        }

          if(this.allNotes==null){
            // this.loadMin();
            this.loadByFilter(/*true,*/false);
          }
      // }
      // catch(e){
      //   console.log('error');
      //   console.log(JSON.stringify(e));
      // }

      /*execute first time (?)*/
      // if(this.currentFilter==Filter.None){
      //   // try{
      //     this.synchingTask();
      //   // }
      //   // catch(e){
      //   //   console.log(e);
      //   // }
      // }



      let eventualNote:NoteExtraMinWithDate=null

      eventualNote = this.navParams.get('note');
      // console.log('the eventual note from navParams');
      // console.log(JSON.stringify(eventualNote));
      this.unshiftIfPossible(eventualNote);

      this.events.subscribe('change-tab', (tab, note)=>{
        // this.unshiftIfPossible(note);
      })


      this.events.subscribe('go-to-notes', (refresh)=>{
        this.isRefreshingSet = true;
        this.refreshIfNecessary(refresh);
      })


      if(!this.isRefreshingSet){
        this.refreshIfNecessary(true);
      }

  }


  setGoBack(goback:boolean){
    console.log('going to set goback: '+goback);
    this.viewCtrl.showBackButton(goback);
    console.log('done');
  }

  refreshIfNecessary(r:boolean){
    // let defaultRefresh:boolean = true;
    // let refresh = this.navParams.get('refresh');
    // if(refresh!=null){
    //   if(!refresh){
    //     r = false;
    //   }
    // }
    // console.log('refresh?: '+r);
    if(r){
      this.isRefreshing = true;
      this.synchingTask();
    }
  }


  showPopover(event){
    // try{
      let popover:Popover;
      if(this.currentFilter==FilterNs.Filter.None/*|| this.currentFilter==null*/){
        popover=this.popoverCtrl.create(NotesPopoverPage, {filterEnabled:false});
      }else{
        popover=this.popoverCtrl.create(NotesPopoverPage, {filterEnabled:true});
      }
      popover.present({
        ev: event
      });
    // }catch(e){
    //   console.log('error:');console.log(JSON.stringify(e));console.log(JSON.stringify(e.message));
    // }
  }

  //important to call this in that function if we do not want
  //any error to be thrown.
  ionViewWillEnter(){
    console.log('will enter, the current filter is: '+FilterNs.toString(this.currentFilter));
    if(/*this.currentFilter==null ||  */this.currentFilter==FilterNs.Filter.None){
      this.setGoBack(false);
    }else{
      this.setGoBack(true); /*when arriving from note details this is doesn't work.*/
    }
    // this.viewCtrl.showBackButton(false);
    // console.log('so I\'m here');
  }


  //calling the new page, passing the _id.
  displayNoteDetails(title: string){
    this.navCtrl.push(NoteDetailsPage, {title}).then(()=>{});
  }

  // unshiftIfPossible(note:string){
  //   if(note!=null){
  //     let trueNote: NoteExtraMin = new NoteExtraMin();
  //     trueNote.title=note;
  //     this.allNotes.unshift(trueNote);
  //   }
  // }

  unshiftIfPossible(note:NoteExtraMinWithDate){
    if(note!=null){
      this.allNotes.unshift(note);
    }
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad NotesPage');

    this.searchCtrl.valueChanges.debounceTime(700).subscribe(event=>{
      this.currentFilterValue=this.searchTerm;
      this.currentFilter=FilterNs.Filter.Title;
      if(this.searchTerm.trim()===''){
        this.shownNotes=this.allNotes;
      }else{
        this.loadByTitle(this.searchTerm);
      }
    });

  }

  private synchingTask(){
    // let isThereSomething:boolean = false;
    // this.synch.isThereSomethingToSynch()
    // .then(isThere=>{
    //   if(isThere){
    //     isThereSomething = isThere;
    //     this.graphicProvider.presentToast('synching...');
    //     return this.synch.synch();
    //   }
    // })
    // .then(synched=>{
    //   if(isThereSomething){
    //     this.graphicProvider.presentToast('synching done');
    //   }
    // })

    if(!this.isRefreshing){
      this.isRefreshing=true;
      this.graphicProvider.presentToast('synching...');
      this.synch.synch()
      .then(()=>{
        console.log('synching done');
        this.graphicProvider.presentToast('synching done');
      })
      .catch(error=>{
        // console.log('error in synch or in get things to synch');
        console.log('error in synch or in get things to synch:  '+JSON.stringify(error));
        this.graphicProvider.showErrorAlert(error);
      })
      this.isRefreshing=false;
    }
  }

  refresh(refresher){
    // this.loadMinAndSynch(true);
    this.loadMin(true)
    setTimeout(()=>{
      refresher.complete();
    },2000);
  }

  createNewNote(){
    //this.navCtrl.push(CreateNotePage);
    try{
      this.events.publish('change-tab', 1);
    }catch(e){console.log(JSON.stringify(e));console.log(JSON.stringify(e.error))}

  }

  //deprecated
  // searchByTitle(event){
  //   let title = event.target.value;
  //   if(title.trim() === '' || title.trim().length<3){
  //     this.shownNotes=this.allNotes; /*cache*/
  //   }else{
  //     this.loadByTitle(title);
  //   }
  // }

  loadByFilter(/*firstTime: boolean, */force: boolean){
    /*
    Cast is not required by the compiler, but it's better to use it.
    */
    switch(this.currentFilter){
      case FilterNs.Filter.Tags:
        this.loadByTags(<TagAlmostMin[]>this.currentFilterValue/*, firstTime*/, force);
      break;
      // case Filter.MainTags:
      //   this.loadByMainTags(<string[]>this.currentFilterValue);
      // break;
      // case Filter.OtherTags:
      //   this.loadByOtherTags(<string[]>this.currentFilterValue);
      // break;
      case FilterNs.Filter.Text:
        this.loadByText(<string>this.currentFilterValue/*, firstTime*/, force);
      break;
      case FilterNs.Filter.Title:
        this.loadByTitle(<string>this.currentFilterValue);
      break;
      default:
        this.loadMin(force);
      break;
    }
  }

  // loadFull(){
  //   //basically just a wrapper.
  //   this.atticNotes.loadFull()
  //     .then(result=>{
  //       this.allNotes=<NoteFull[]>result;
  //
  //       this.shownNotes=this.allNotes;
  //
  //       // console.log(this.notes);
  //     })
  //     .catch(error =>{
  //       console.log(JSON.stringify(error));
  //     })
  // }

  loadMin(force: boolean){
    this.atticNotes.loadNotesMin(force)
      .then(result=>{
        this.allNotes=result as NoteExtraMinWithDate[];
        this.shownNotes=this.allNotes;
        //console.log('the received note are: '+JSON.stringify(result));
      })
      .catch(error=>{
        // console.log('load min error');
        console.log('load min error: ');console.log(JSON.stringify(error));
        this.graphicProvider.showErrorAlert(error);
      })
  }

  // loadMinAndSynch(force: boolean){
  //   this.atticNotes.loadNotesMin(force)
  //     .then(result=>{
  //       this.allNotes=result as NoteExtraMin[];
  //       this.shownNotes=this.allNotes;
  //       this.synchingTask();
  //     })
  //     .catch(error=>{
  //       console.log('load min error');
  //       console.log(JSON.stringify(error));
  //     })
  // }

  // loadByTags(tags: string[]/*, firstTime: boolean*/){
  //   // console.log("called the load by tags with: "+tags );
  //   this.atticNotes.notesByTag(tags)
  //     .then(result=>{
  //       this.allNotes=<NoteMin[]>result;
  //       //if(firstTime){
  //         this.shownNotes = this.allNotes;
  //       //}
  //     })
  //     .catch(error=>{
  //       console.log(JSON.stringify(error));
  //     })
  // }

  loadByTags(tags: TagAlmostMin[], force: boolean){
  //  if(this.allNotes!=null){
      /*doing the filter on the note that I have.*/
  //  }
    this.atticNotes.notesByTag2(tags, force)
    .then(result=>{
      // console.log('result here is');
      // console.log(JSON.stringify(result));
      if(this.allNotes==null){
        this.allNotes = result as NoteExtraMinWithDate[];
        this.shownNotes = this.allNotes.slice();
      }else{
        this.shownNotes = result as NoteExtraMinWithDate[];
      }
    })
    .catch(error=>{
      // console.log('load by tags error');
      console.log('load by tags error: ');console.log(JSON.stringify(error));
      this.graphicProvider.showErrorAlert(error);
    })
  }

  // loadByMainTags(tags: string[]){
  //   this.atticNotes.notesByMainTag(tags)
  //     .then(result=>{
  //       this.notes=<NoteMin[]>result;
  //     })
  //     .catch(error=>{
  //       console.log(JSON.stringify(error));
  //     })
  // }
  //
  // loadByOtherTags(tags: string[]){
  //   this.atticNotes.notesByOtherTag(tags)
  //     .then(result=>{
  //       this.notes=<NoteMin[]>result;
  //     })
  //     .catch(error=>{
  //       console.log(JSON.stringify(error));
  //     })
  // }

  /*
  Title searching is always done on what is shown.
  */
  loadByTitle(title: string){
    // this.atticNotes.notesByTitle(title)
    //   .then(result=>{
    //     this.notes=<NoteMin[]>result;
    //   })
    //   .catch(error=>{
    //     console.log(JSON.stringify(error));
    //   })
    this.shownNotes = this.atticNotes.filterNotesByTitle(this.allNotes, this.searchTerm);
  }

  loadByText(text: string/*, firstTime: boolean*/, force: boolean){
    this.atticNotes.notesByText(text, force)
      .then(result=>{
        this.allNotes=<NoteMin[]>result;
        //if(firstTime){
          this.shownNotes = this.allNotes;
        //}
      })
      .catch(error=>{
        // console.log('load by text error: ');
        console.log('load by text error: ');console.log(JSON.stringify(error));
        this.graphicProvider.showErrorAlert(error);
      })
  }

  deleteNote(title: string){
    console.log('deleting note: '+title);
  }

}
