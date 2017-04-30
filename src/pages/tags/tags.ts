import { Component } from '@angular/core';
import { NavController, NavParams, AlertController } from 'ionic-angular';


import { TagExtraMin,/* TagMin, */TagFull, TagAlmostMin } from '../../models/tags';
import { AtticTags } from '../../providers/attic-tags';
import { TagDetailsPage } from '../tag-details/tag-details';
import { NotesPage } from '../notes/notes';
import { Filter } from '../../public/const';
import { FormControl } from '@angular/forms';
/*
  Generated class for the Tags page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
  selector: 'page-tags',
  templateUrl: 'tags.html'
})
export class TagsPage {

  shownTags: TagAlmostMin[] = null;
  allTags: TagAlmostMin[] = null;


  searchCtrl: FormControl;
  searchTerm: string ='';

  constructor(public navCtrl: NavController,
    public alertCtrl: AlertController,
    private atticTags: AtticTags) {
    if(this.allTags==null){
      this.loadAlmostMin(false);
    }
    this.searchCtrl = new FormControl();
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad TagsPage');

    this.searchCtrl.valueChanges.debounceTime(700).subscribe(event=>{
      if(this.searchTerm.trim()===''){
        this.shownTags = this.allTags/*.slice()*/;
      }else{
        // this.loadByTitle(this.searchTerm);
        this.loadByTitle(this.searchTerm);
      }
    });
  }

  // loadFull(){
  //   //basically just a wrapper.
  //   this.atticTags.loadFull()
  //     .then(result=>{
  //       this.allTags=<TagFull[]>result;
  //       // console.log(this.notes);
  //     })
  //     .catch(error =>{
  //       console.log(error);
  //     })
  // }
  //
  // loadMin(){
  //   this.atticTags.loadTagsMin()
  //     .then(result=>{
  //       this.allTags=<TagExtraMin[]>result;
  //     })
  //     .catch(error=>{
  //       console.log(error);
  //     })
  // }

  loadAlmostMin(force: boolean){
    this.atticTags.loadTagsMin(force)
      .then(result=>{
        console.log(JSON.stringify(result));
        this.allTags=result as TagAlmostMin[];
        this.shownTags=this.allTags.slice();
      })
      .catch(error=>{
        console.log(JSON.stringify(error));
      })
  }

  loadByTitle(title: string){
    // this.atticTags.tagsByTitle(this.searchTerm)
    //   .then(result=>{
    //     this.shownTags=<TagAlmostMin[]>result;
    //   })
    //   .catch(error=>{
    //     console.log(JSON.stringify(error));
    //   })
    this.shownTags = this.atticTags.filterTagByTitle(this.shownTags, title);
  }


  displayTagDetails(title: string){
    this.navCtrl.push(TagDetailsPage, {title});
  }

  refresh(refresher){
    this.loadAlmostMin(true);
    //before it was this.loadFull();
    setTimeout(()=>{
      refresher.complete();
    },2000);
  }


  createNewTag(){
    let prompt = this.alertCtrl.create({
      title: 'New tag',
      message: 'Enter a name for the new tag',
      inputs:[
        {
        name: 'title',
        placeholder: 'Title'
        }
      ],
      buttons: [
        {
          text: 'Cancel',
          handler: data => {}
        },
        {
          text: 'Save',
          handler: data=>{
            this.createNewTagAPI(<string>data.title);
          }
        }
      ]
    });
    prompt.present();
  }

  createNewTagAPI(title: string){
    let tag:TagExtraMin = new TagExtraMin();
    tag.title=title;
    this.atticTags.createTag(tag)
      .then(result=>{
        this.allTags.push(<TagFull>result);
        this.shownTags.push(<TagFull>result);
      })
      .catch(error=>{
        let alert = this.alertCtrl.create({
          title: error,
          buttons: ['OK']
        });
        alert.present();
      })
  }

  notesByTag(event, tag: TagAlmostMin){
    event.stopPropagation();
    let tags = [tag];
    let filterType = Filter.Tags;
    // console.log("proper event fired");
    // console.log("is array: "+(tags instanceof Array).toString());
    this.navCtrl.push(NotesPage, {filterType: filterType, filterValue: tags});
  }


}
