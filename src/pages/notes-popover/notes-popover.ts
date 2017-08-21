import { Component } from '@angular/core';
import { NavController, NavParams/*, AlertController*/,ViewController } from 'ionic-angular';
import { NotesPage } from '../notes/notes';
import { NotesByTagPage } from '../notes-by-tag/notes-by-tag';
import { FilterNs} from '../../public/const';
import {GraphicProvider} from '../../providers/graphic';


/*
  Generated class for the Notes page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/


@Component({
  selector: 'page-notes-popover',
  templateUrl: 'notes-popover.html'
})
export class NotesPopoverPage {

  private removeFilterEnabled:boolean = false;


// private removeFilterEnabled: boolean = true;
//find a method, maybe, to check if there is some filter applied.

  constructor(public navCtrl: NavController, private navParams: NavParams,
    /*private alertCtrl: AlertController, */private viewCtrl: ViewController,
    private graphicProvider:GraphicProvider

  ) {
    try{
      let enable:boolean = this.navParams.get('filterEnabled');
      if(enable==null){
        this.removeFilterEnabled=false;
      }else{
        this.removeFilterEnabled=enable;
      }
    }catch(e){
      this.removeFilterEnabled=false;
    }
  }


  ionViewDidLoad() {
    console.log('ionViewDidLoad NotesPopoverPage');
  }

  filterByText(){
      // let prompt = this.alertCtrl.create({
      //   title: 'Search by text',
      //   message: 'Enter the text you want to search',
      //   inputs:[
      //     {
      //     name: 'title',
      //     placeholder: 'text'
      //     }
      //   ],
      //   buttons: [
      //     {
      //       text: 'Cancel',
      //       handler: data => {}
      //     },
      //     {
      //       text: 'Ok',
      //       handler: data=>{
      //         this.filterByTextAPI(<string>data.title);
      //       }
      //     }
      //   ]
      // });
      // prompt.present();
      this.graphicProvider.genericAlert('Search by text', 'Enter the text to search for',
        [{name:'title', placeholder:'text'}], 'Ok', (data:any)=>{this.filterByTextAPI(data.title as string);}

      );
      // this.close();
  }
  // close(){
  //   this.viewCtrl.dismiss();
  // }


  filterByTextAPI(value: string){
    this.navCtrl.push(NotesPage, {filterType: FilterNs.Filter.Text, filterValue: value})
    .then(()=>{
      this.viewCtrl.dismiss();
    })
  }

  filterByTagsNoRole(){
    //this.close();
    this.navCtrl.push(NotesByTagPage)
    .then(()=>{
      this.viewCtrl.dismiss();
    })
  }

  unfilter(){
    this.navCtrl.push(NotesPage, {filterType: FilterNs.Filter.None})
    .then(()=>{
      this.viewCtrl.dismiss();
    })
  }

  // filterByTagsWithRole(){
  //
  // }



}
