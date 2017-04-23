import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';


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



  constructor(public navCtrl: NavController, private navParams: NavParams) {


        // this.oldNotes=this.notes;


        //insert if needed.
        //just a test.
        // console.log('counting notes: ');
        // this.db.count(Table.Notes)
        // .then(count=>{
        //   console.log(count);
        // })
        // .catch(error=>{
        //   console.log(JSON.stringify(error));
        // })

  }



  ionViewDidLoad() {
    console.log('ionViewDidLoad NotesPopoverPage');
  }

  filterByText(){

  }

  filterByTagsNoRole(){

  }

  filterByTagsWithRole(){
    
  }



}
