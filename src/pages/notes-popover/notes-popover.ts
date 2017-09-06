import { Component } from '@angular/core';
import { NavController, NavParams/*, AlertController*/,ViewController, Events,App } from 'ionic-angular';
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

  private btnRemoveFilterEnabled:boolean = false;

  //for now they're alwasy set to true.
  private btnFilterByTextEnabled:boolean = true;
  private btnFilterByTagsEnabled:boolean = true;
  private btnFilterByIsDoneEnabled:boolean = true;


// private removeFilterEnabled: boolean = true;
//find a method, maybe, to check if there is some filter applied.

  constructor(public navCtrl: NavController, private navParams: NavParams,
    /*private alertCtrl: AlertController, */private viewCtrl: ViewController,
    private graphicProvider:GraphicProvider,
    private events:Events,
    private app:App

  ) {
    try{
      let enable:boolean = this.navParams.get('filterEnabled');
      if(enable==null){
        this.btnRemoveFilterEnabled=false;
      }else{
        this.btnRemoveFilterEnabled=enable;
      }
    }catch(e){
      this.btnRemoveFilterEnabled=false;
    }
  }


  ionViewDidLoad() {
    console.log('ionViewDidLoad NotesPopoverPage');
  }

  private filterByText(){
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


  private filterByTextAPI(value: string){
    // this.navCtrl.push(NotesPage, {filterType: FilterNs.Filter.Text, filterValue: value})
    // .then(()=>{
    //   this.viewCtrl.dismiss();
    // })
    this.viewCtrl.dismiss().then(()=>{
      this.events.publish('go-to-notes-and-filter',{filterType:FilterNs.Filter.Text,
        filterValue:value});
    })
  }

  private filterByTagsNoRole(){
    // this.close();
    // this.navCtrl.push(NotesByTagPage)
    // .then(()=>{
    //   this.viewCtrl.dismiss();
    // })
    this.app.getActiveNav().push(NotesByTagPage)
    .then(()=>{this.viewCtrl.dismiss()})
  }

  private filterByIsDone(){
    this.graphicProvider.genericAlertInput('Search by \'is done\'',
    [{type:'radio', label:'True', value:'true'},{type:'radio', label:'False', value:'false'}],
    (data:any)=>{
      this.filterByIsDoneAPI( data as string == 'true' ? true : false );}
  );
  }

  private filterByIsDoneAPI(isdone:boolean){
    // this.navCtrl.push(NotesPage, {filterType: FilterNs.Filter.IsDone, filterValue: isdone})
    // .then(()=>{
    //   this.viewCtrl.dismiss();
    // })
    this.viewCtrl.dismiss().then(()=>{
      this.events.publish('go-to-notes-and-filter', {filterType:FilterNs.Filter.IsDone,
        filterValue: isdone
        })
    })
  }

  private unfilter(){
    // this.navCtrl.push(NotesPage, {filterType: FilterNs.Filter.None})
    // .then(()=>{
    //   this.viewCtrl.dismiss();
    // })
    this.viewCtrl.dismiss().then(()=>{
      this.events.publish('go-to-notes-and-filter',{filterType:FilterNs.Filter.None, filterValue:null});
    })
  }

  // filterByTagsWithRole(){
  //
  // }



}
