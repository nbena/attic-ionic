import { Component } from '@angular/core';
import { NavController, NavParams, PopoverController, ToastController, Events } from 'ionic-angular';

import { AtticNotes } from '../../providers/attic-notes';
import { NoteExtraMin, NoteSmart, NoteMin, NoteFull } from '../../models/notes';

import { NoteDetailsPage } from '../note-details/note-details';
import { CreateNotePage } from '../create-note/create-note';

import { Filter, Table } from '../../public/const';
import { FormControl } from '@angular/forms';

import { Db } from '../../providers/db';

import 'rxjs/add/operator/debounceTime';


import { Synch } from '../../providers/synch';

import { TagAlmostMin } from '../../models/tags';

import { NotesPopoverPage } from '../notes-popover/notes-popover';

import { Utils } from '../../public/utils';

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
  shownNotes: NoteExtraMin[] = null;
  allNotes : NoteExtraMin[] = null;
  currentFilter : Filter = Filter.None;
  currentFilterValue: any = null;

  searchCtrl: FormControl;
  searchTerm: string ='';

  isFull: boolean;

  /*eventualNote: string = null;*/

  constructor(public navCtrl: NavController, private navParams: NavParams,
    private events: Events,
    private popoverCtrl: PopoverController,
    private atticNotes: AtticNotes, private db: Db,
    private toastCtrl: ToastController,
    private synch: Synch) {

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
          this.currentFilter=Filter.None;
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
      if(this.currentFilter==Filter.None){
        try{
          this.synchingTask();
        }
        catch(e){
          console.log(e);
        }
      }

      let eventualNote:string=null

      eventualNote = this.navParams.get('note');
      console.log('the eventual note from navParams');
      console.log(JSON.stringify(eventualNote));
      this.unshiftIfPossible(eventualNote);

      this.events.subscribe('change-tab', (tab, note)=>{
        this.unshiftIfPossible(note);
      })


  }


  showPopover(event){
    let popover=this.popoverCtrl.create(NotesPopoverPage);
    popover.present({
      ev: event
    });
  }


  //calling the new page, passing the _id.
  displayNoteDetails(title: string){
    this.navCtrl.push(NoteDetailsPage, {title});
  }

  unshiftIfPossible(note:string){
    if(note!=null){
      let trueNote: NoteExtraMin = new NoteExtraMin();
      trueNote.title=note;
      this.allNotes.unshift(trueNote);  
    }
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad NotesPage');

    this.searchCtrl.valueChanges.debounceTime(700).subscribe(event=>{
      this.currentFilterValue=this.searchTerm;
      this.currentFilter=Filter.Title;
      if(this.searchTerm.trim()===''){
        this.shownNotes=this.allNotes;
      }else{
        this.loadByTitle(this.searchTerm);
      }
    });

  }

  private synchingTask(){
    let isThereSomething:boolean = false;
    this.synch.isThereSomethingToSynch()
    .then(isThere=>{
      if(isThere){
        isThereSomething = isThere;
        Utils.presentToast(this.toastCtrl, 'synching...');
        return this.synch.synch()
      }
    })
    .then(synched=>{
      if(isThereSomething){
        Utils.presentToast(this.toastCtrl, 'synching done');
      }
    })
    .catch(error=>{
      console.log('error in synch or in get things to synch');
      console.log(JSON.stringify(error));
    })

  }

  refresh(refresher){
    this.loadMinAndSynch(true);
    setTimeout(()=>{
      refresher.complete();
    },2000);
  }

  createNewNote(){
    this.navCtrl.push(CreateNotePage);
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
      case Filter.Tags:
        this.loadByTags(<TagAlmostMin[]>this.currentFilterValue/*, firstTime*/, force);
      break;
      // case Filter.MainTags:
      //   this.loadByMainTags(<string[]>this.currentFilterValue);
      // break;
      // case Filter.OtherTags:
      //   this.loadByOtherTags(<string[]>this.currentFilterValue);
      // break;
      case Filter.Text:
        this.loadByText(<string>this.currentFilterValue/*, firstTime*/, force);
      break;
      case Filter.Title:
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
        this.allNotes=result as NoteExtraMin[];
        this.shownNotes=this.allNotes;

      })
      .catch(error=>{
        console.log('load min error');
        console.log(JSON.stringify(error));
      })
  }

  loadMinAndSynch(force: boolean){
    this.atticNotes.loadNotesMin(force)
      .then(result=>{
        this.allNotes=result as NoteExtraMin[];
        this.shownNotes=this.allNotes;
        this.synchingTask();
      })
      .catch(error=>{
        console.log('load min error');
        console.log(JSON.stringify(error));
      })
  }

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
      console.log('result here is');
      console.log(JSON.stringify(result));
      if(this.allNotes==null){
        this.allNotes = result as NoteExtraMin[];
        this.shownNotes = this.allNotes.slice();
      }else{
        this.shownNotes = result as NoteExtraMin[];
      }
    })
    .catch(error=>{
      console.log('load tags 2 error');
      console.log(JSON.stringify(error));
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
        console.log('load by text error');
        console.log(JSON.stringify(error));
      })
  }

  deleteNote(title: string){
    console.log('deleting note: '+title);
  }

}
