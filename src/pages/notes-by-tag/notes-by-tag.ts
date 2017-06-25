import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { AtticTags } from '../../providers/attic-tags';
import { TagAlmostMin } from '../../models/tags';
import { FormControl } from '@angular/forms';

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

  searchCtrl: FormControl;
  searchTerm: string ='';

  constructor(public navCtrl: NavController, public navParams: NavParams,
    private atticTags: AtticTags
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
  }


  loadAlmostMin(force: boolean){
    this.atticTags.loadTagsMin(force)
      .then(result=>{
        console.log(JSON.stringify(result));
        this.allTags=result as TagAlmostMin[];
        this.shownTags = this.allTags.slice();
      })
      .catch(error=>{
        console.log(JSON.stringify(error));
      })
  }


  refresh(refresher){
    this.loadAlmostMin(true);
    //before it was this.loadFull();
    setTimeout(()=>{
      refresher.complete();
    },2000);
  }

}
