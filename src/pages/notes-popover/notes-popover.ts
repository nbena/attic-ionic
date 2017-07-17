import { Component } from '@angular/core';
import { NavController, /*NavParams, */AlertController, ViewController } from 'ionic-angular';
import { NotesPage } from '../notes/notes';
import { NotesByTagPage } from '../notes-by-tag/notes-by-tag';
import { Filter} from '../../public/const';


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




  constructor(public navCtrl: NavController, /*private navParams: NavParams,*/
    private alertCtrl: AlertController, private viewCtrl: ViewController,
  ) {

  }


  ionViewDidLoad() {
    console.log('ionViewDidLoad NotesPopoverPage');
  }

  filterByText(){
      let prompt = this.alertCtrl.create({
        title: 'Search by text',
        message: 'Enter the text you want to search',
        inputs:[
          {
          name: 'title',
          placeholder: 'text'
          }
        ],
        buttons: [
          {
            text: 'Cancel',
            handler: data => {}
          },
          {
            text: 'Ok',
            handler: data=>{
              this.filterByTextAPI(<string>data.title);
            }
          }
        ]
      });
      prompt.present();
      // this.close();
  }
  // close(){
  //   this.viewCtrl.dismiss();
  // }


  filterByTextAPI(value: string){
    this.navCtrl.push(NotesPage, {filterType: Filter.Text, filterValue: value})
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

  // filterByTagsWithRole(){
  //
  // }



}
