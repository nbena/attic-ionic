import { Component } from '@angular/core';
import { NavController, NavParams, PopoverController,/* ToastController, */Events,
  ViewController,Popover
  //,App
  } from 'ionic-angular';

import { AtticNotes } from '../../providers/attic-notes';
import {/* NoteExtraMin, /*NoteSmart, NoteMin/*, NoteFull*/NoteExtraMinWithDate } from '../../models/notes';

import { NoteDetailsPage } from '../note-details/note-details';
//import { CreateNotePage } from '../create-note/create-note';

import { FilterNs/*, Table*/, } from '../../public/const';
import { FormControl } from '@angular/forms';

// import { Db } from '../../providers/db';

import 'rxjs/add/operator/debounceTime';


//import { Synch } from '../../providers/synch';

import { TagAlmostMin } from '../../models/tags';

import { NotesPopoverPage } from '../notes-popover/notes-popover';

import { Utils } from '../../public/utils';
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
  private shownNotes: NoteExtraMinWithDate[] = null;
  private allNotes : NoteExtraMinWithDate[] = null;
  private currentFilter : FilterNs.Filter = FilterNs.Filter.None;
  private currentFilterValue: any = null;

  private searchCtrl: FormControl;
  private searchTerm: string ='';

  private isFull: boolean;

  private isRefreshing:boolean = false;

  private isRefreshingSet: boolean = false;

  private isThereSomethingToShow: boolean = false;

  private firstTime: boolean = true;

  /*post - deleting an angular error appears but I can figure out why, try catch on each method doesn't work.
  So I remove them.
  */

  //private refresher: any;
  //private hasLoadingNoteCompleted: boolean = false;
  //private hasLoadingTagCompleted: boolean = false;

  /*eventualNote: string = null;*/

  constructor(public navCtrl: NavController, private navParams: NavParams,
    private events: Events,
    private popoverCtrl: PopoverController,
    private atticNotes: AtticNotes,
    // private db: Db,
    // private toastCtrl: ToastController,
    //private synch: Synch,
    private graphicProvider:GraphicProvider,
    private viewCtrl: ViewController,
    // private app:App
  ) {

      // try{
      let filterType:any;
      let filterValue:any;
      //try{
        filterType = navParams.get('filterType');
        filterValue = navParams.get('filterValue');
      // }
      // catch(error){
      //   filterValue = null;
      //   /*the handled ahead...*/
      // }

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


      this.events.subscribe('change-tab', (tab, note)=>{
        //the note to add.
        console.log('change tab the note to add is');console.log(JSON.stringify(note));
        this.unshiftIfPossible(note);
      })


      this.events.subscribe('go-to-notes-and-remove', (note)=>{
        let noteToRemove:NoteExtraMinWithDate = note;
        // console.log('the note to remove');console.log(JSON.stringify(noteToRemove));
        this.removeIfPossible(noteToRemove);
      });

      this.events.subscribe('go-to-notes-and-replace', (oldnote, newnote)=>{
        let oldNote:NoteExtraMinWithDate = oldnote;
        let newNote:NoteExtraMinWithDate = newnote;

        // let ind1: number = Utils.binarySearch(this.shownNotes, oldNote, NoteExtraMinWithDate.descendingCompare);
        // let ind2: number = Utils.binarySearch(this.allNotes, oldnote, NoteExtraMinWithDate.descendingCompare);
        //
        // if(ind1!=-1){
        //   this.shownNotes.splice(ind1, 1);
        //   Utils.binaryArrayInsert(this.shownNotes, newNote, NoteExtraMinWithDate.descendingCompare);
        // }
        // if(ind2!=-1){
        //   this.allNotes.splice(ind2, 1);
        //   Utils.binaryArrayInsert(this.allNotes, newNote, NoteExtraMinWithDate.descendingCompare);
        // }
        this.removeAndAddIfPossible(oldNote, newNote);

      })

      /*
      When receive this message try to replace.
      This is used when note-details apply modification to a note,
      and we don't go back.
      */
      this.events.subscribe('notes-replace', (oldnote,newnote)=>{
        //console.log('received here is');console.log(JSON.stringify({old:oldnote, new:newnote}));
        let oldNote:NoteExtraMinWithDate = oldnote;
        let newNote:NoteExtraMinWithDate = newnote;
        this.removeAndAddIfPossible(oldNote, newNote);
      })

    // }catch(e){
    //    console.log('error is here');console.log(JSON.stringify(e));console.log(JSON.stringify(e.message));
    // }

    this.events.subscribe('go-to-notes-and-filter', (filterObj)=>{
      //console.log('filters: ');console.log(JSON.stringify(filterType, filterValue));
      this.currentFilter=filterObj.filterType;
      this.currentFilterValue=filterObj.filterValue;
      //console.log('filters post'); console.log(JSON.stringify(this.currentFilter));console.log(JSON.stringify(this.currentFilterValue));
      this.loadByFilter(false);
    })


  }


  // setGoBack(goback:boolean){
  //   console.log('going to set goback: '+goback);
  //   this.viewCtrl.showBackButton(goback);
  //   console.log('done');
  // }



  private showPopover(event){
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
  }

  //important to call this in that function if we do not want
  //any error to be thrown.
  ionViewWillEnter(){
      // console.log('will enter, the current filter is: '+FilterNs.toString(this.currentFilter));
      // if(/*this.currentFilter==null ||  */this.currentFilter==FilterNs.Filter.None){
      //   this.setGoBack(false);
      // }else{
      //   this.setGoBack(true); /*when arriving from note details this is doesn't work.*/
      // }
      // if(this.allNotes==null){
      //   this.loadByFilter(false);
      // }
      this.firstTime=true;
  }


  private displayNoteDetails(/*title: string, index:number*/note:NoteExtraMinWithDate){
    this.navCtrl.push(NoteDetailsPage, {note:note}).then(()=>{});
  }


  private unshiftIfPossible(note:NoteExtraMinWithDate){
    if(note!=null && this.allNotes!=null && this.shownNotes!=null){
      this.allNotes.unshift(note);
      this.shownNotes.unshift(note);
      this.setIsThereSomethingToShow();
    }
  }


//test this.
  private removeIfPossible(note:NoteExtraMinWithDate){
    // try{
      // if(index!=-1 && this.allNotes!=null && this.shownNotes!=null){
      //   this.allNotes.splice(index,1);
      //   this.shownNotes.splice(index,1);
      //   this.setIsThereSomethingToShow();
      // }
    // }catch(e){console.log('error in remove if possible');console.log(JSON.stringify(e));console.log(JSON.stringify(e.message))}
    let ind1:number =-1;
    let ind2:number =-1;

    // console.log('shown notes');console.log(JSON.stringify(this.shownNotes));
    // console.log('all notes');console.log(JSON.stringify(this.allNotes));

    if(this.shownNotes!=null && note!=null){
      ind1 = Utils.binarySearch(this.shownNotes, note, NoteExtraMinWithDate.descendingCompare);
    }
    if(this.allNotes!=null && note!=null){
      ind2 = Utils.binarySearch(this.allNotes, note, NoteExtraMinWithDate.descendingCompare);
    }

    if(ind1!=-1){
      this.shownNotes.splice(ind1, 1);
    }
    if(ind2!=2){
      this.allNotes.splice(ind2, 1);
    }
    this.setIsThereSomethingToShow();
  }


  private removeAndAddIfPossible(oldNote:NoteExtraMinWithDate, newNote:NoteExtraMinWithDate):void{
    let ind1:number =-1;
    let ind2:number =-1;

    // console.log('here we have');console.log(JSON.stringify({old:oldNote, new:newNote}));
    // console.log('shown notes');console.log(JSON.stringify(this.shownNotes));
    // console.log('all notes');console.log(JSON.stringify(this.allNotes));

    if(this.shownNotes!=null && oldNote!=null && newNote!=null){
      ind1=Utils.binarySearch(this.shownNotes, oldNote, NoteExtraMinWithDate.descendingCompare);
    }
    if(this.allNotes!=null && oldNote!=null && newNote!=null){
      ind2= Utils.binarySearch(this.allNotes, oldNote, NoteExtraMinWithDate.descendingCompare);
    }

    if(ind1!=-1){
      // console.log('remove and add 1');
      this.shownNotes.splice(ind1, 1);
      Utils.binaryArrayInsert(this.shownNotes, newNote, NoteExtraMinWithDate.descendingCompare);
    }
    if(ind2!=-1){
      // console.log('remove and add 2');
      this.allNotes.splice(ind2, 1);
      Utils.binaryArrayInsert(this.allNotes, newNote, NoteExtraMinWithDate.descendingCompare);
    }
    this.setIsThereSomethingToShow();
    // console.log('shown notes');console.log(JSON.stringify(this.shownNotes));
    // console.log('all notes');console.log(JSON.stringify(this.allNotes));
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad NotesPage');

    this.searchCtrl.valueChanges.debounceTime(700).subscribe(event=>{
      // console.log('allnotes');console.log(JSON.stringify(this.allNotes));
      // console.log('shownnotes');console.log(JSON.stringify(this.shownNotes));
      this.currentFilterValue=this.searchTerm;
      this.currentFilter=FilterNs.Filter.Title;
      if(this.searchTerm.trim()===''){
        this.shownNotes=this.allNotes.slice();
        // console.log('is blank');
        // console.log('allnotes');console.log(JSON.stringify(this.allNotes));
        // console.log('shownnotes');console.log(JSON.stringify(this.shownNotes));
        this.setIsThereSomethingToShow();
      }else{
        this.loadByTitle(this.searchTerm);
      }
    });

  }


  private refresh(refresher:any){
    //this.refresher = refresher;
    this.loadByFilter(!this.firstTime, refresher);
    this.firstTime=false;
  }

  private createNewNote(){
    //this.navCtrl.push(CreateNotePage);
    // try{
      this.events.publish('change-tab', 1);
    // }catch(e){console.log(JSON.stringify(e));console.log(JSON.stringify(e.error))}

  }

  private loadByFilter(/*firsTime:boolean*/force: boolean, refresher?:any){
    console.log('im going to set');
    let p:Promise<void>
    switch(this.currentFilter){
      case FilterNs.Filter.Tags:
        p=this.loadByTags(this.currentFilterValue.tags as TagAlmostMin[], this.currentFilterValue.and/*, firstTime*/, force);break;
      case FilterNs.Filter.IsDone:
        p=this.loadByIsDone(this.currentFilterValue as boolean, force);break;
      case FilterNs.Filter.Text:
        p=this.loadByText(this.currentFilterValue as string/*, firstTime*/, force);break;
      case FilterNs.Filter.Title:
        p=this.loadByTitle(this.currentFilterValue as string);break;
      default:
        p=this.loadMin(force);break;
    }
    p.then(()=>{
      this.setIsThereSomethingToShow();
      if(refresher!=null){
          refresher.complete();
      }
    })
    .catch(error=>{
      if(refresher!=null){
        refresher.complete();
      }
      this.setIsThereSomethingToShow();
      console.log('load error');console.log(JSON.stringify(error.message));console.log(JSON.stringify(error));
      this.graphicProvider.showErrorAlert(error);
    })
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

  // loadMin(force: boolean){
  //   this.atticNotes.loadNotesMin(force)
  //     .then(result=>{
  //       this.allNotes=result as NoteExtraMinWithDate[];
  //       this.shownNotes=this.allNotes.slice();
  //       //console.log('the received note are: '+JSON.stringify(result));
  //       this.setIsThereSomethingToShow();
  //     })
  //     .catch(error=>{
  //       // console.log('load min error');
  //       console.log('load min error: ');console.log(JSON.stringify(error));
  //       this.graphicProvider.showErrorAlert(error);
  //       this.setIsThereSomethingToShow();
  //     })
  // }
  private loadMin(force: boolean):Promise<void>{
     return new Promise<void>((resolve, reject)=>{
      this.atticNotes.loadNotesMin(force)
        .then(result=>{
          this.allNotes=result as NoteExtraMinWithDate[];
          this.shownNotes=this.allNotes.slice();
          // this.setIsThereSomethingToShow();
          resolve();
        })
        .catch(error=>{
          // console.log('load min error');
          // console.log('load min error: ');console.log(JSON.stringify(error));
          // this.graphicProvider.showErrorAlert(error);
          // this.setIsThereSomethingToShow();
          reject(error);
        })
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

  // loadByTags(tags: TagAlmostMin[], and:boolean, force: boolean){
  // //  if(this.allNotes!=null
  //     /*doing the filter on the note that I have.*/
  // //  }
  //   this.atticNotes.notesByTag2(tags, and, force)
  //   .then(result=>{
  //     // console.log('result here is');
  //     // console.log(JSON.stringify(result));
  //     if(this.allNotes==null){
  //       this.allNotes = result as NoteExtraMinWithDate[];
  //       this.shownNotes = this.allNotes.slice();
  //     }else{
  //       this.shownNotes = result as NoteExtraMinWithDate[];
  //     }
  //
  //     this.setIsThereSomethingToShow();
  //
  //   })
  //   .catch(error=>{
  //     // console.log('load by tags error');
  //     console.log('load by tags error: ');console.log(JSON.stringify(error));
  //     this.graphicProvider.showErrorAlert(error);
  //     this.setIsThereSomethingToShow();
  //   })
  // }

  private loadByTags(tags: TagAlmostMin[], and:boolean, force: boolean):Promise<void>{
  //  if(this.allNotes!=null
      /*doing the filter on the note that I have.*/
  //  }
  return new Promise<void>((resolve, reject)=>{
    this.atticNotes.notesByTag2(tags, and, force)
    .then(result=>{
      // console.log('result here is');
      // console.log(JSON.stringify(result));
      if(this.allNotes==null){
        this.allNotes = result as NoteExtraMinWithDate[];
        this.shownNotes = this.allNotes.slice();
      }else{
        this.shownNotes = result as NoteExtraMinWithDate[];
      }
      resolve();
    })
    .catch(error=>{
      // console.log('load by tags error: ');console.log(JSON.stringify(error));
      // this.graphicProvider.showErrorAlert(error);
      // this.setIsThereSomethingToShow();
      reject(error);
    })
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

  private setIsThereSomethingToShow(){
    // try{
      if(this.shownNotes==null || this.shownNotes.length<=0){
        this.isThereSomethingToShow=false;
      }else{
        this.isThereSomethingToShow=true;
      }
    // }catch(e){console.log('error in set something');console.log(JSON.stringify(e));console.log(JSON.stringify(e.message))}
    //this.isThereSomethingToShow = (this.shownNotes.length>0) ? true : false;
  }

  /*
  Title searching is always done on what is shown.
  */
  // loadByTitle(title: string){
  //   // this.atticNotes.notesByTitle(title)
  //   //   .then(result=>{
  //   //     this.notes=<NoteMin[]>result;
  //   //   })
  //   //   .catch(error=>{
  //   //     console.log(JSON.stringify(error));
  //   //   })
  //   this.shownNotes = this.atticNotes.filterNotesByTitle(this.shownNotes, this.searchTerm);
  //   this.setIsThereSomethingToShow();
  // }

  private loadByTitle(title: string):Promise<void>{
    // this.atticNotes.notesByTitle(title)
    //   .then(result=>{
    //     this.notes=<NoteMin[]>result;
    //   })
    //   .catch(error=>{
    //     console.log(JSON.stringify(error));
    //   })
    this.shownNotes = this.atticNotes.filterNotesByTitle(this.shownNotes, this.searchTerm);
    // this.setIsThereSomethingToShow();
    return Promise.resolve();
  }

  // loadByText(text: string/*, firstTime: boolean*/, force: boolean){
  //   this.atticNotes.notesByText(text, force)
  //     .then(result=>{
  //       if(this.allNotes==null){
  //         this.allNotes=result as NoteExtraMinWithDate[];
  //         this.shownNotes = this.allNotes.slice();
  //       }else{
  //         this.shownNotes = result as NoteExtraMinWithDate[];
  //       }
  //       //}
  //       this.setIsThereSomethingToShow();
  //     })
  //     .catch(error=>{
  //       // console.log('load by text error: ');
  //       console.log('load by text error: ');console.log(JSON.stringify(error));
  //       this.graphicProvider.showErrorAlert(error);
  //       this.setIsThereSomethingToShow();
  //
  //     })
  // }
  private loadByText(text: string/*, firstTime: boolean*/, force: boolean):Promise<void>{
    return new Promise<void>((resolve, reject)=>{
      this.atticNotes.notesByText(text, force)
        .then(result=>{
          if(this.allNotes==null){
            this.allNotes=result as NoteExtraMinWithDate[];
            this.shownNotes = this.allNotes.slice();
          }else{
            this.shownNotes = result as NoteExtraMinWithDate[];
          }
          resolve();
        })
        .catch(error=>{
          // // console.log('load by text error: ');
          // console.log('load by text error: ');console.log(JSON.stringify(error));
          // this.graphicProvider.showErrorAlert(error);
          // this.setIsThereSomethingToShow();
          reject(error);
        })
    })
  }

  // loadByIsDone(isdone: boolean/*, firstTime: boolean*/, force: boolean){
  //   this.atticNotes.notesByIsDone(isdone, force)
  //     .then(result=>{
  //       if(this.allNotes==null){
  //         this.allNotes=result as NoteExtraMinWithDate[]; //ugly but needed.
  //         this.shownNotes = this.allNotes.slice();
  //       }else{
  //         this.shownNotes = result as NoteExtraMinWithDate[];
  //       }
  //         this.setIsThereSomethingToShow();
  //       //}
  //     })
  //     .catch(error=>{
  //       // console.log('load by text error: ');
  //       console.log('load by is done error: ');console.log(JSON.stringify(error));
  //       this.graphicProvider.showErrorAlert(error);
  //       this.setIsThereSomethingToShow();
  //
  //     })
  // }

  loadByIsDone(isdone: boolean/*, firstTime: boolean*/, force: boolean):Promise<void>{
    return new Promise<void>((resolve, reject)=>{
      this.atticNotes.notesByIsDone(isdone, force)
        .then(result=>{
          if(this.allNotes==null){
            this.allNotes=result as NoteExtraMinWithDate[]; //ugly but needed.
            this.shownNotes = this.allNotes.slice();
          }else{
            this.shownNotes = result as NoteExtraMinWithDate[];
          }
            // this.setIsThereSomethingToShow();
            resolve();
        })
        .catch(error=>{
          // console.log('load by is done error: ');console.log(JSON.stringify(error));
          // this.graphicProvider.showErrorAlert(error);
          // this.setIsThereSomethingToShow();
          reject(error);
        })
    })
  }

  // deleteNote(title: string){
  //   console.log('deleting note: '+title);
  // }

}
