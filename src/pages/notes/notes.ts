import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';

import { AtticNotes } from '../../providers/attic-notes';
import { NoteExtraMin, NoteSmart, NoteMin, NoteFull } from '../../models/notes';

import { NoteDetailsPage } from '../note-details/note-details';
import { CreateNotePage } from '../create-note/create-note';

import { Filter } from '../../public/const';
import { FormControl } from '@angular/forms';
import 'rxjs/add/operator/debounceTime';

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
  notes: NoteExtraMin[] = null;
  oldNotes : NoteExtraMin[] = null;
  currentFilter : Filter = Filter.None;
  currentFilterValue: any = null;

  searchCtrl: FormControl;
  searchTerm: string ='';

  isFull: boolean;

  constructor(public navCtrl: NavController,
    private navParams: NavParams,
    private atticNotes: AtticNotes) {

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

        if(this.notes==null){
          // this.loadMin();
          this.loadByFilter(true);
        }
        // this.oldNotes=this.notes;
  }



  //calling the new page, passing the _id.
  displayNoteDetails(_id: string, title: string){
    this.navCtrl.push(NoteDetailsPage, {_id, title});
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad NotesPage');

    this.searchCtrl.valueChanges.debounceTime(700).subscribe(event=>{
      this.currentFilterValue=this.searchTerm;
      this.currentFilter=Filter.Title;
      // console.log("'"+this.searchTerm+"'")
      if(this.searchTerm.trim()===''){
        // console.log("should trim");
        this.notes=this.oldNotes;
        // console.log("old notes: "+this.oldNotes);
      }else{
        this.loadByTitle(this.searchTerm);
      }
    });
  }

  refresh(refresher){
    this.loadMin();
    setTimeout(()=>{
      refresher.complete();
    },2000);
  }

  createNewNote(){
    this.navCtrl.push(CreateNotePage);
  }

  searchByTitle(event){
    let title = event.target.value;
    if(title.trim() === '' || title.trim().length<3){
      this.notes=this.oldNotes; /*cache*/
    }else{
      this.loadByTitle(title);
    }
  }

  loadByFilter(firstTime: boolean){
    /*
    Cast is not required by the compiler, but it's better to use it.
    */
    switch(this.currentFilter){
      case Filter.Tags:
        this.loadByTags(<string[]>this.currentFilterValue, firstTime);
      break;
      // case Filter.MainTags:
      //   this.loadByMainTags(<string[]>this.currentFilterValue);
      // break;
      // case Filter.OtherTags:
      //   this.loadByOtherTags(<string[]>this.currentFilterValue);
      // break;
      case Filter.Text:
        this.loadByText(<string>this.currentFilterValue, firstTime);
      break;
      case Filter.Title:
        this.loadByTitle(<string>this.currentFilterValue);
      break;
      default:
        this.loadMin();
      break;
    }
  }

  loadFull(){
    //basically just a wrapper.
    this.atticNotes.loadFull()
      .then(result=>{
        this.notes=<NoteFull[]>result;

        this.oldNotes=this.notes;

        // console.log(this.notes);
      })
      .catch(error =>{
        console.log(error);
      })
  }

  loadMin(){
    this.atticNotes.loadNotesMin()
      .then(result=>{
        this.notes=<NoteExtraMin[]>result;
        this.oldNotes=this.notes;
      })
      .catch(error=>{
        console.log(error);
      })
  }

  loadByTags(tags: string[], firstTime: boolean){
    console.log("called the load by tags with: "+tags );
    this.atticNotes.notesByTag(tags)
      .then(result=>{
        this.notes=<NoteMin[]>result;
        if(firstTime){
          this.oldNotes = this.notes;
        }
      })
      .catch(error=>{
        console.log("error");
        console.log(error.message);
      })
  }

  // loadByMainTags(tags: string[]){
  //   this.atticNotes.notesByMainTag(tags)
  //     .then(result=>{
  //       this.notes=<NoteMin[]>result;
  //     })
  //     .catch(error=>{
  //       console.log(error);
  //     })
  // }
  //
  // loadByOtherTags(tags: string[]){
  //   this.atticNotes.notesByOtherTag(tags)
  //     .then(result=>{
  //       this.notes=<NoteMin[]>result;
  //     })
  //     .catch(error=>{
  //       console.log(error);
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
    //     console.log(error);
    //   })
    this.notes = this.atticNotes.filterNotesByTitle(this.notes, this.searchTerm);
  }

  loadByText(text: string, firstTime: boolean){
    this.atticNotes.notesByText(text)
      .then(result=>{
        this.notes=<NoteMin[]>result;
        if(firstTime){
          this.oldNotes = this.notes;
        }
      })
      .catch(error=>{
        console.log(error);
      })
  }

}
