import { Component } from '@angular/core';
import { NavController/*, NavParams, AlertController*/ } from 'ionic-angular';


import { /*TagExtraMi, TagMin, */TagFull, TagAlmostMin } from '../../models/tags';
import { AtticTags } from '../../providers/attic-tags';
import { TagDetailsPage } from '../tag-details/tag-details';
import { NotesPage } from '../notes/notes';
import { FilterNs } from '../../public/const';
import { FormControl } from '@angular/forms';
import { Utils } from '../../public/utils';
import { GraphicProvider} from '../../providers/graphic'
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

  private shownTags: TagAlmostMin[] = null;
  private allTags: TagAlmostMin[] = null;


  searchCtrl: FormControl;
  searchTerm: string ='';

  private isThereSomethingToShow: boolean = false;

  constructor(public navCtrl: NavController,
    // public alertCtrl: AlertController,
    private atticTags: AtticTags,
    private graphicProvider:GraphicProvider
  ) {
    if(this.allTags==null){
      this.loadAlmostMin(false);
    }
    this.searchCtrl = new FormControl();
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad TagsPage');

    this.searchCtrl.valueChanges.debounceTime(700).subscribe(event=>{
      if(this.searchTerm.trim()===''){
        this.shownTags = this.allTags.slice();
        this.setIsThereSomethingToShow();
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

  private setIsThereSomethingToShow(){
    this.isThereSomethingToShow = (this.shownTags.length>0) ? true : false;
  }

  loadAlmostMin(force: boolean){
    this.atticTags.loadTagsMin(force)
      .then(result=>{
        // console.log(JSON.stringify(result));
        this.allTags=result.slice(); //here to avoid duplicates.
        this.shownTags=this.allTags.slice();
        this.setIsThereSomethingToShow();
      })
      .catch(error=>{
        console.log('load almost min error: '+JSON.stringify(error));
        this.graphicProvider.showErrorAlert(error);
        this.setIsThereSomethingToShow();

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
    this.setIsThereSomethingToShow();
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
    // let prompt = this.alertCtrl.create({
    //   title: 'New tag',
    //   message: 'Enter a name for the new tag',
    //   inputs:[
    //     {
    //     name: 'title',
    //     placeholder: 'Title'
    //     }
    //   ],
    //   buttons: [
    //     {
    //       text: 'Cancel',
    //       handler: data => {}
    //     },
    //     {
    //       text: 'Save',
    //       handler: data=>{
    //         this.createNewTagAPI(<string>data.title);
    //       }
    //     }
    //   ]
    // });
    // prompt.present();
    this.graphicProvider.genericAlert('New tag', 'Enter a name for the new tag',
      [{
        name:'title',
        placeholder:'Title'
      }],
      'Save',
      (data)=>{this.createNewTagAPI(data.title as string)}
    )
  }

  createNewTagAPI(title: string){
    let tag:TagFull = new TagFull();
    tag.title=title;
    // tag.noteslength=0;
    this.atticTags.createTag(tag)
      .then(result=>{
        //it needs to be done.

        Utils.binaryArrayInsert(this.allTags, tag, TagAlmostMin.descendingCompare);
        Utils.binaryArrayInsert(this.shownTags, tag, TagAlmostMin.descendingCompare);

        // this.allTags.push(<TagFull>tag);
        // this.shownTags.push(<TagFull>tag);
      })
      .catch(error=>{
        // console.log('create new tag error: ');
        console.log('create new tag error: '+JSON.stringify(error));
        // console.log(error);
        // console.log('better error');
        // let alert = this.alertCtrl.create({
        //   title: error,
        //   buttons: ['OK']
        // });
        // alert.present();
        //Utils.showErrorAlert(this.alertCtrl, error);
        this.graphicProvider.showErrorAlert(error);
      })
  }

  notesByTag(event, tag: TagAlmostMin){
    event.stopPropagation();
    let tags = [tag];
    let filterType = FilterNs.Filter.Tags;
    // console.log("proper event fired");
    // console.log("is array: "+(tags instanceof Array).toString());
    this.navCtrl.push(NotesPage, {filterType: filterType, filterValue: tags});
  }


}
