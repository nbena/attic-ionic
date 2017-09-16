import { Component } from '@angular/core';
import { NavController, NavParams,/*ViewController, */Events } from 'ionic-angular';
import { AtticTagsProvider } from '../../providers/attic-tags';
import { TagAlmostMin, TagExtraMin } from '../../models/tags';
// import { NotesPage } from '../notes/notes';
import { FilterNs } from '../../public/const';
import {GraphicProvider} from '../../providers/graphic';
import { /*FormBuilder, FormGroup, Validators,*/ FormControl/*, FormArray*/ } from '@angular/forms'


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

  private searchCtrl: FormControl;
  private searchTerm: string ='';

  private btnEnabled: boolean = false;
  private checkedCount: number = 0;

  private isThereSomethingToShow: boolean = false;

  // searchPageForm: FormGroup;

  // array:any[];

  private searchOption:string='and';

  private firstTime:boolean = true;

  private showSpinner: boolean = false;

  constructor(public navCtrl: NavController, public navParams: NavParams,
    private atticTags: AtticTagsProvider,
    //private viewCtrl: ViewController,
    private graphicProvider:GraphicProvider,
    private events:Events
    // private formBuilder: FormBuilder
  ) {
    if(this.allTags==null){
      //this.loadAlmostMin(false);
      this.load(false);
    }
    this.searchCtrl = new FormControl();

    // this.searchPageForm = this.formBuilder.group({
    //   tags: this.formBuilder.array([, Validators.minLength(1)]),
    //   searchOption: []
    // })


  }

  private setIsThereSomethingToShow():void{
    this.isThereSomethingToShow = (this.shownTags.length>0) ? true : false;
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad NotesByTagPage');

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

  private loadByTitle(title: string):void{
    this.shownTags = this.atticTags.filterTagByTitle(this.shownTags, title);
    this.mkIsChecked();
    this.setIsThereSomethingToShow();
  }

  private mkIsChecked():void{
    for(let i=0;i<this.shownTags.length;i++){
      this.isChecked[i]=false;
    }
  }

  private load(force:boolean, refresher?:any):void{
    if(refresher==null){
      this.showSpinner=true;
    }
    this.loadAlmostMin(force)
    .then(()=>{
      if(refresher!=null){
        refresher.complete();
      }else{
        this.showSpinner=false;
      }
      this.setIsThereSomethingToShow();
    }).catch(error=>{
      if(refresher!=null){
        refresher.complete();
      }else{
        this.showSpinner=false;
      }
      console.log('load tags error: '+JSON.stringify(error.message));
      this.graphicProvider.showErrorAlert(error);
    })
  }


  private loadAlmostMin(force: boolean):Promise<void>{
    return new Promise<void>((resolve, reject)=>{
      this.atticTags.loadTagsMin(force)
        .then(result=>{
          this.allTags=result as TagAlmostMin[];
          this.shownTags = this.allTags.slice();
          //this.setIsThereSomethingToShow();
          this.mkIsChecked();
          resolve();
        })
        .catch(error=>{
          // console.log('load tags error: '+JSON.stringify(error.message));
          // this.graphicProvider.showErrorAlert(error);
          reject(error);
        })
    })
  }


  private refresh(refresher){
    // this.loadAlmostMin(true);
    // //before it was this.loadFull();
    // setTimeout(()=>{
    //   refresher.complete();
    // },2000);
    this.load(!this.firstTime, refresher);
    this.firstTime=false;
  }

  ionViewWillEnter(){
    this.firstTime=true;
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

  private dataChanged2(e:any, itemIndex:number):void{
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


  private searchNotesByTags():void{
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
      let and:boolean = this.searchOption=='and' ? true : false;
      // this.navCtrl.push(NotesPage, {filterType: FilterNs.Filter.Tags, filterValue: {tags:passed, and:and}})
      // .then(()=>{
      //   this.viewCtrl.dismiss();
      // })

      this.navCtrl.pop()
      .then(()=>{
        this.events.publish('go-to-notes-and-filter', {filterType:FilterNs.Filter.Tags,
          filterValue:{tags:passed, and:and}
          })
      })

      // console.log(this.searchOption);
    }
  }

  // search(){
  //   let passed:TagExtraMin[]=[];
  //   // for(let i=0;i<this.shownTags.length;i++){
  //   //   if(this.isChecked[i]){
  //   //     passed.push(this.shownTags[i]);
  //   //   }
  //   // }
  //   console.log(JSON.stringify(this.searchPageForm.value));
  //   passed = this.searchPageForm.value.tags.map(obj=>{return TagExtraMin.NewTag(obj.title)});
  //   // console.log('passed:');
  //   // console.log(JSON.stringify(passed));
  //   //if(passed.length>0){
  //   let and:boolean = this.searchPageForm.value.searchOption=='and' ? true : false;
  //     this.navCtrl.push(NotesPage, {filterType: FilterNs.Filter.Tags, filterValue: {tags:passed, and:false}})
  //     //see if works.
  //     .then(()=>{
  //       this.viewCtrl.dismiss();
  //     })
  //   //}
  // }

}
