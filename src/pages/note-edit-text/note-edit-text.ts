import { Component/*, Directive */} from '@angular/core';
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

  tmpLastmodificationdate: Date;

  lastmod: Date;


  constructor(public navCtrl: NavController, public navParams: NavParams,
    private atticNotes: AtticNotes,
    private graphicProvider:GraphicProvider,
    private formBuilder: FormBuilder
  ) {
      this.note=navParams.get('note');
      // this.text=this.note.text;
      this.tmpLastmodificationdate=this.note.lastmodificationdate;

      this.lastmod = this.note.lastmodificationdate;

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
      this.note.lastmodificationdate = new Date();
      console.log('the note i\'m going to change tetx');console.log(JSON.stringify(this.note));
      this.atticNotes.changeText(this.note, this.lastmod)
        .then(result=>{
          // console.log(result);
          this.graphicProvider.presentToast('Text updated');
          this.navCtrl.pop();
        })
        .catch(error=>{
          this.note.lastmodificationdate=this.tmpLastmodificationdate;
          console.log('change text error: ');console.log(JSON.stringify(error));console.log(JSON.stringify(error.message));console.log(JSON.stringify(error.toString()));
          this.graphicProvider.showErrorAlert(error);
        })
    }
  }

}
