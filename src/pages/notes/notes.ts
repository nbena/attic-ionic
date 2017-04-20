import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';

import { AtticNotes } from '../../providers/attic-notes';
import { NoteExtraMin, NoteSmart, NoteMin, NoteFull } from '../../models/notes';

import { NoteDetailsPage } from '../note-details/note-details';
import { CreateNotePage } from '../create-note/create-note';

import { Filter, Table } from '../../public/const';
import { FormControl } from '@angular/forms';

import { Db } from '../../providers/db';

import 'rxjs/add/operator/debounceTime';


import { Synch } from '../../providers/synch';

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

  constructor(public navCtrl: NavController, private navParams: NavParams,
    private atticNotes: AtticNotes, private db: Db,
    private synch: Synch) {

      let filterType = navParams.get('filterType');
      let filterValue = navParams.get('filterValue');
      // let isFull = navParams.get('full');

      // console.log("the filter type is: "+filterType);
      // console.log("The filter value is "+filterValue);

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
        // this.oldNotes=this.notes;


        //insert if needed.
        //just a test.
        // console.log('counting notes: ');
        // this.db.count(Table.Notes)
        // .then(count=>{
        //   console.log(count);
        // })
        // .catch(error=>{
        //   console.log(JSON.stringify(error));
        // })

  }



  //calling the new page, passing the _id.
  displayNoteDetails(title: string){
    this.navCtrl.push(NoteDetailsPage, {title});
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

  refresh(refresher){
    this.loadMin(true);
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
        this.loadByTags(<string[]>this.currentFilterValue/*, firstTime*/);
      break;
      // case Filter.MainTags:
      //   this.loadByMainTags(<string[]>this.currentFilterValue);
      // break;
      // case Filter.OtherTags:
      //   this.loadByOtherTags(<string[]>this.currentFilterValue);
      // break;
      case Filter.Text:
        this.loadByText(<string>this.currentFilterValue/*, firstTime*/);
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
        this.allNotes=<NoteExtraMin[]>result;
        this.shownNotes=this.allNotes;

      })
      .catch(error=>{
        console.log(JSON.stringify(error));
      })
  }

  loadByTags(tags: string[]/*, firstTime: boolean*/){
    // console.log("called the load by tags with: "+tags );
    this.atticNotes.notesByTag(tags)
      .then(result=>{
        this.allNotes=<NoteMin[]>result;
        //if(firstTime){
          this.shownNotes = this.allNotes;
        //}
      })
      .catch(error=>{
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

  loadByText(text: string/*, firstTime: boolean*/){
    this.atticNotes.notesByText(text)
      .then(result=>{
        this.allNotes=<NoteMin[]>result;
        //if(firstTime){
          this.shownNotes = this.allNotes;
        //}
      })
      .catch(error=>{
        console.log(JSON.stringify(error));
      })
  }

  deleteNote(title: string){
    console.log('deleting note: '+title);
  }

}
