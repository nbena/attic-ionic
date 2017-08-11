import { Component, Directive } from '@angular/core';
import { NavController, NavParams/*, ToastController*/ } from 'ionic-angular';

import { NoteFull } from '../../models/notes';
import { AtticNotes } from '../../providers/attic-notes';
// import { Utils } from '../../public/utils';
import { GraphicProvider} from '../../providers/graphic'
import { FormBuilder, FormGroup, Validators } from '@angular/forms'


/*
  Generated class for the NoteEditText page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
  selector: 'page-note-edit-text',
  templateUrl: 'note-edit-text.html',
})
export class NoteEditTextPage {

  note: NoteFull;
  // text: string;

  editTextPageForm: FormGroup;


  constructor(public navCtrl: NavController, public navParams: NavParams,
    private atticNotes: AtticNotes,
    private graphicProvider:GraphicProvider,
    private formBuilder: FormBuilder
  ) {
      this.note=navParams.get('note');
      // this.text=this.note.text;

      this.editTextPageForm=this.formBuilder.group({
        text:[this.note.text, Validators.compose([Validators.required, Validators.minLength(2)])]
      })

    }

  ionViewDidLoad() {
    console.log('ionViewDidLoad NoteEditTextPage');
  }

  cancel(){
    this.navCtrl.pop();
  }


  changeText(){
    // this.note.text = this.text;
    if(this.editTextPageForm.valid){
      this.note.text = this.editTextPageForm.value.text;
      this.atticNotes.changeText(this.note)
        .then(result=>{
          console.log(result);
          this.graphicProvider.presentToast('Text updated');
          this.navCtrl.pop();
        })
        .catch(error=>{
          console.log(JSON.stringify('change text error: '+error));
          this.graphicProvider.showErrorAlert(error);
        })
    }
  }

}
