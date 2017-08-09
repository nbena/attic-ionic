import { Component } from '@angular/core';
import { NavController, NavParams, ViewController } from 'ionic-angular';
import { AtticTags } from '../../providers/attic-tags';
import { TagAlmostMin, TagExtraMin } from '../../models/tags';
import { FormControl } from '@angular/forms';
import { NotesPage } from '../notes/notes';
import { Filter } from '../../public/const';
import {GraphicProvider} from '../../providers/graphic';

/*
  Generated class for the NotesByTag page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
  selector: 'page-notes-by-tag',
  templateUrl: 'notes-by-tag.html'
})
export class NotesByTagPage {

  private shownTags: TagAlmostMin[] = null;
  private allTags: TagAlmostMin[] = null;

  private isChecked: boolean[] = [];

  searchCtrl: FormControl;
  searchTerm: string ='';

  btnEnabled: boolean = false;
  checkedCount: number = 0;

  constructor(public navCtrl: NavController, public navParams: NavParams,
    private atticTags: AtticTags,
    private viewCtrl: ViewController,
    private graphicProvider:GraphicProvider
  ) {
    if(this.allTags==null){
      this.loadAlmostMin(false);
    }
    this.searchCtrl = new FormControl();
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad NotesByTagPage');

    this.searchCtrl.valueChanges.debounceTime(700).subscribe(event=>{
      if(this.searchTerm.trim()===''){
        this.shownTags = this.allTags/*.slice()*/;
      }else{
        // this.loadByTitle(this.searchTerm);
        this.loadByTitle(this.searchTerm);
      }
    });
  }

  loadByTitle(title: string){
    this.shownTags = this.atticTags.filterTagByTitle(this.shownTags, title);
    this.mkIsChecked();
  }

  mkIsChecked(){
    for(let i=0;i<this.shownTags.length;i++){
      this.isChecked[i]=false;
    }
  }


  loadAlmostMin(force: boolean){
    this.atticTags.loadTagsMin(force)
      .then(result=>{
        this.allTags=result as TagAlmostMin[];
        this.shownTags = this.allTags.slice();

        this.mkIsChecked();
      })
      .catch(error=>{
        console.log('load tags error: '+JSON.stringify(error));
        this.graphicProvider.showErrorAlert(error);
      })
  }


  refresh(refresher){
    this.loadAlmostMin(true);
    //before it was this.loadFull();
    setTimeout(()=>{
      refresher.complete();
    },2000);
  }

  // clickItem(e:any, itemIndex:number){
  //   console.log(JSON.stringify(e));
  //   console.log('click');
  //   if(e.checked){
  //     this.isChecked[itemIndex]=true;
  //   }else{
  //     this.isChecked[itemIndex]=false;
  //   }
  // }

  dataChanged2(e:any, itemIndex:number){
    console.log('changed');
    if(e.checked){
      this.isChecked[itemIndex]=true;
      this.btnEnabled = true;
      this.checkedCount++;
    }else{
      this.isChecked[itemIndex]=false;
      this.checkedCount--;
      if(this.checkedCount==0){
        this.btnEnabled = false;
      }
    }
  }

  //no longer needed as long as I use ion-checkbox.
  //if use canonical input type="checkbox" then there's need to $event.stopPropagation()
  //
  // dataChanged(e:any, itemIndex:number){
  //   console.log('changed');
  //   if(e.target.checked){
  //     this.isChecked[itemIndex]=true;
  //     this.btnEnabled = true;
  //     this.checkedCount++;
  //   }else{
  //     this.isChecked[itemIndex]=false;
  //     this.checkedCount--;
  //     if(this.checkedCount==0){
  //       this.btnEnabled = false;
  //     }
  //   }
  // }


  searchNotesByTags(){
    // console.log('clicked');
    let passed:TagExtraMin[]=[];
    for(let i=0;i<this.shownTags.length;i++){
      if(this.isChecked[i]){
        passed.push(this.shownTags[i]);
      }
    }
    // console.log('passed:');
    // console.log(JSON.stringify(passed));
    if(passed.length>0){
      this.navCtrl.push(NotesPage, {filterType: Filter.Tags, filterValue: passed})
      //see if works.
      .then(()=>{
        this.viewCtrl.dismiss();
      })
    }
  }

}
