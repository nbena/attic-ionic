import { Component } from '@angular/core';
import { NavController/*, NavParams, AlertController*/,Events } from 'ionic-angular';


import { /*TagExtraMi, TagMin, */TagFull, TagAlmostMin } from '../../models/tags';
import { AtticTagsProvider } from '../../providers/attic-tags';
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


  private searchCtrl: FormControl;
  private searchTerm: string ='';

  private isThereSomethingToShow: boolean = false;

  private showSpinner: boolean = false;

  private firstTime: boolean = true;

  constructor(public navCtrl: NavController,
    // public alertCtrl: AlertController,
    private atticTags: AtticTagsProvider,
    private graphicProvider:GraphicProvider,
    private events:Events
  ) {
    // if(this.allTags==null){ --> because it's done in viewwillenter
    //   //this.loadAlmostMin(false);
    //   this.load(false);
    // }
    this.searchCtrl = new FormControl();

    // this.events.subscribe('go-to-tags', (index)=>{
    //   console.log('the index');console.log(index);
    //   this.removeIfPossible(index);
    // })

    this.events.subscribe('go-to-tags-and-remove', (tag)=>{
      let newTag:TagAlmostMin = tag;
      // console.log('i received too')
      this.removeIfPossible(newTag);
    });

    this.events.subscribe('invalidate-tags', ()=>{
      this.allTags=null;
      this.shownTags=null;
    })

    this.events.subscribe('tags-replace', (oldtag, newtag)=>{
      let oldTag:TagAlmostMin=oldtag;
      let newTag:TagAlmostMin=newtag;
      this.removeAndAddIfPossible(oldTag, newTag);
    })


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

  private removeAndAddIfPossible(oldTag:TagAlmostMin, newTag:TagAlmostMin):void{
    let ind1:number =-1;
    let ind2:number =-1;

    if(this.shownTags!=null && newTag!=null){
      ind1 = Utils.binarySearch(this.shownTags, oldTag, TagAlmostMin.descendingCompare);
    }
    if(this.allTags!=null && newTag!=null){
      ind2 = Utils.binarySearch(this.allTags, oldTag, TagAlmostMin.descendingCompare);
    }

    if(ind1!=-1){
      this.shownTags.splice(ind1, 1);
      this.shownTags=Utils.binaryArrayInsert(this.shownTags, newTag, TagAlmostMin.descendingCompare);
    }

    if(ind2!=-2){
      this.allTags.splice(ind2, 1);
      this.allTags=Utils.binaryArrayInsert(this.allTags, newTag, TagAlmostMin.descendingCompare);
    }
  }

  removeIfPossible(newTag:TagAlmostMin){
    // if(index!=-1 && this.allTags!=null && this.shownTags!=null){
    //   this.allTags.splice(index,1);
    //   this.shownTags.splice(index, 1);
    //   this.setIsThereSomethingToShow();
    // }
    let ind1:number =-1;
    let ind2:number =-1;

    if(this.shownTags!=null && newTag!=null){
      ind1 = Utils.binarySearch(this.shownTags, newTag, TagAlmostMin.descendingCompare);
    }
    if(this.allTags!=null && newTag!=null){
      ind2 = Utils.binarySearch(this.allTags, newTag, TagAlmostMin.descendingCompare);
    }

    if(ind1!=-1){
      console.log('ok removed');
      this.shownTags.splice(ind1, 1);
    }
    if(ind2!=2){
      this.allTags.splice(ind2, 1);
    }
    this.setIsThereSomethingToShow();
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

  private load(force:boolean, title?:string, refresher?:any):void{
    if(refresher==null){
      this.showSpinner=true;
    }
    let p:Promise<void>;
    if(title==null){
      p=this.loadAlmostMin(force);
    }else{
      p=this.loadByTitle(title);
    }
    p.then(()=>{
      this.setIsThereSomethingToShow();
      if(refresher!=null){
          refresher.complete();
      }else{
          this.showSpinner=false;
      }
    })
    .catch(error=>{
      if(refresher!=null){
        refresher.complete();
      }else{
        this.showSpinner=false;
      }
      this.setIsThereSomethingToShow();
      console.log('load error');console.log(JSON.stringify(error.message));
      this.graphicProvider.showErrorAlert(error);
    })
  }

  private setIsThereSomethingToShow(){
    //this.isThereSomethingToShow = (this.shownTags.length>0) ? true : false;
    if(this.shownTags==null || this.shownTags.length<=0){
      this.isThereSomethingToShow=false;
    }else{
      this.isThereSomethingToShow=true;
    }
  }

  // loadAlmostMin(force: boolean){
  //   this.atticTags.loadTagsMin(force)
  //     .then(result=>{
  //       // console.log(JSON.stringify(result));
  //       this.allTags=result.slice(); //here to avoid duplicates.
  //       this.shownTags=this.allTags.slice();
  //       this.setIsThereSomethingToShow();
  //     })
  //     .catch(error=>{
  //       console.log('load almost min error: '+JSON.stringify(error));
  //       this.graphicProvider.showErrorAlert(error);
  //       this.setIsThereSomethingToShow();
  //
  //     })
  // }
  loadAlmostMin(force: boolean):Promise<void>{
    return new Promise<void>((resolve, reject)=>{
      this.atticTags.loadTagsMin(force)
        .then(result=>{
          // console.log(JSON.stringify(result));
          this.allTags=result.slice(); //here to avoid duplicates. NECESSARY.
          this.shownTags=this.allTags.slice();
          // this.setIsThereSomethingToShow();
          resolve();
        })
        .catch(error=>{
          // console.log('load almost min error: '+JSON.stringify(error));
          // this.graphicProvider.showErrorAlert(error);
          // this.setIsThereSomethingToShow();
          reject(error);
        })
    })
  }

  loadByTitle(title: string):Promise<void>{
    // this.atticTags.tagsByTitle(this.searchTerm)
    //   .then(result=>{
    //     this.shownTags=<TagAlmostMin[]>result;
    //   })
    //   .catch(error=>{
    //     console.log(JSON.stringify(error));
    //   })
    this.shownTags = this.atticTags.filterTagByTitle(this.shownTags, title);
    // this.setIsThereSomethingToShow();
    return Promise.resolve();
  }


  displayTagDetails(tag:TagAlmostMin/*title: string, index:number*/){
    this.navCtrl.push(TagDetailsPage, /*{title:title, index:index}*/{tag:tag}).then(()=>{});
  }

  refresh(refresher){
    // this.loadAlmostMin(true);
    // //before it was this.loadFull();
    // setTimeout(()=>{
    //   refresher.complete();
    // },2000);
    this.load(!this.firstTime, null, refresher);
    this.firstTime=false;
  }

  ionViewWillEnter(){
    //console.log('will enter');

    this.firstTime=true;

    if(this.allTags==null){ //ok, because it exists the 'invalidate-tags' msg
      this.load(false);
    }
  }


  private createNewTag(){
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

  private createNewTagAPI(title: string){
    title = title.trim();
    let tag:TagFull = new TagFull({title:title});
    // tag.notes=[];
    // tag.noteslength=0;
    this.atticTags.createTag(tag)
      .then(result=>{
        //it needs to be done.

        this.allTags=Utils.makeArraySafe(this.allTags);
        this.shownTags=Utils.makeArraySafe(this.shownTags);

        Utils.binaryArrayInsert(this.allTags, tag, TagAlmostMin.descendingCompare);
        Utils.binaryArrayInsert(this.shownTags, tag, TagAlmostMin.descendingCompare);

        // this.allTags.push(<TagFull>tag);
        // this.shownTags.push(<TagFull>tag);
        this.setIsThereSomethingToShow();

        this.graphicProvider.presentToast('Tag created');

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
    //this.navCtrl.push(NotesPage, {filterType: filterType, filterValue: tags});
    this.events.publish('go-to-notes-and-filter',{filterType: FilterNs.Filter.Tags,
      filterValue: {tags:tags, and: false}});
  }


}
