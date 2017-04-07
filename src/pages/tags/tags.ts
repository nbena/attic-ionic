import { Component } from '@angular/core';
import { NavController, NavParams, AlertController } from 'ionic-angular';


import { TagExtraMin, TagMin, TagFull, TagAlmostMin } from '../../models/tags';
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

  shownTags: TagExtraMin[] = null;
  allTags: TagExtraMin[] = null;


  searchCtrl: FormControl;
  searchTerm: string ='';

  constructor(public navCtrl: NavController,
    public alertCtrl: AlertController,
    private atticTags: AtticTags) {
    if(this.allTags==null){
      this.loadAlmostMin();
    }
    this.searchCtrl = new FormControl();
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad TagsPage');

    this.searchCtrl.valueChanges.debounceTime(700).subscribe(event=>{
      if(this.searchTerm.trim()===''){
        this.shownTags = this.allTags.slice();
      }else{
        // this.loadByTitle(this.searchTerm);
        this.searchByTitle(this.searchTerm);
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

  loadAlmostMin(){
    this.atticTags.loadTagsMinWithNotesLength()
      .then(result=>{
        this.allTags=<TagAlmostMin[]>result;
        this.shownTags=this.allTags.slice();
      })
      .catch(error=>{
        console.log(JSON.stringify(error));
      })
  }

  searchByTitle(title: string){
    this.atticTags.tagsByTitle(this.searchTerm)
      .then(result=>{
        this.shownTags=<TagAlmostMin[]>result;
      })
      .catch(error=>{
        console.log(JSON.stringify(error));
      })
  }


  displayTagDetails(_id: string, title: string){
    this.navCtrl.push(TagDetailsPage, {_id, title});
  }

  refresh(refresher){
    this.loadAlmostMin();
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

    this.atticTags.createTag(title)
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

  notesByTag(event, _id: string){
    event.stopPropagation();
    let tags = [_id];
    let filterType = Filter.Tags;
    // console.log("proper event fired");
    // console.log("is array: "+(tags instanceof Array).toString());
    this.navCtrl.push(NotesPage, {filterType: filterType, filterValue: tags});
  }


}
