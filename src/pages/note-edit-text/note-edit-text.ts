import { Component } from '@angular/core';
import { NavController, NavParams/*, ToastController*/ } from 'ionic-angular';

import { NoteFull } from '../../models/notes';
import { AtticNotes } from '../../providers/attic-notes';
import { Utils } from '../../public/utils';
import { GraphicProvider} from '../../providers/graphic'

/*
  Generated class for the NoteEditText page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
  selector: 'page-note-edit-text',
  templateUrl: 'note-edit-text.html'
})
export class NoteEditTextPage {

  note: NoteFull;
  text: string;


  constructor(public navCtrl: NavController, public navParams: NavParams,
    private atticNotes: AtticNotes,
    private graphicProvider:GraphicProvider
  ) {
      this.note=navParams.get('note');
      this.text=this.note.text;
    }

  ionViewDidLoad() {
    console.log('ionViewDidLoad NoteEditTextPage');
  }

  cancel(){
    this.navCtrl.pop();
  }


  changeText(){
    this.note.text = this.text;
    this.atticNotes.changeText(this.note)
      .then(result=>{
        console.log(result);
        this.graphicProvider.presentToast('Text updated');
        this.navCtrl.pop();
      })
      .catch(error=>{
        console.log(JSON.stringify(error));
      })
  }

}
