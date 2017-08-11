import { Component } from '@angular/core';
import { NavController/*, NavParams, LoadingController*/,Loading  } from 'ionic-angular';

import { NotesPage } from '../notes/notes';

import { User } from '../../models/user';
import { Auth } from '../../providers/auth';

import { GraphicProvider} from '../../providers/graphic'

import { FormBuilder, FormGroup, Validators } from '@angular/forms'

/*
  Generated class for the Register page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
  selector: 'page-register',
  templateUrl: 'register.html'
})
export class RegisterPage {

  // e_mail: string;
  // password: string;
  // loading: any;

  tryingToSubmit = false;

  registerPageForm: FormGroup;

  private loading: Loading;

  // constructor(public navCtrl: NavController, public navParams: NavParams){}
    constructor(public navCtrl: NavController,
      public auth: Auth,
      // public loadingCtrl:LoadingController
      private graphicProvider:GraphicProvider,
      private formBuilder:FormBuilder
    ) {
      this.registerPageForm = this.formBuilder.group({
        email:['', Validators.compose([Validators.required, Validators.email, Validators.maxLength(64)])],
        password:['', Validators.compose([Validators.required/*, Validators.pattern('')*/])]
      })
    }

  ionViewDidLoad() {
    console.log('ionViewDidLoad RegisterPage');
  }

  register(){
    //this.loader();
    if(this.registerPageForm.valid){
      this.loading=this.graphicProvider.showLoading('Authenticating'); //maybe I'll remove it.

      var user = new User(
        // this.e_mail,
        // this.password
        this.registerPageForm.value.email,
        this.registerPageForm.value.password
      );

      this.auth.createAccount(user)
        .then(result=>{
        // this.loading.dismiss();
        this.graphicProvider.dismissLoading(this.loading);
        console.log(result);
        this.navCtrl.setRoot(NotesPage);
      })
      .catch(error=>{
        console.log('auth error');console.log(JSON.stringify(error));
        this.graphicProvider.dismissLoading(this.loading)
        .then(()=>{
          this.graphicProvider.showErrorAlert('error while creating account')
        })
      })  
    }
  }


  makeEmpty(){
    this.registerPageForm.reset();
  }

  // loader(){
  //   this.loading = this.loadingCtrl.create({
  //     content: 'Authenticating'
  //   });
  //   this.loading.present();
  // }

}
