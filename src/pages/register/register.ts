import { Component } from '@angular/core';
import { NavController, NavParams, LoadingController  } from 'ionic-angular';

import { NotesPage } from '../notes/notes';

import { User } from '../../models/user';
import { Auth } from '../../providers/auth';

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

  e_mail: string;
  password: string;
  loading: any;

  // constructor(public navCtrl: NavController, public navParams: NavParams){}
    constructor(public navCtrl: NavController,
      public auth: Auth, public loadingCtrl:LoadingController) {}

  ionViewDidLoad() {
    console.log('ionViewDidLoad RegisterPage');
  }

  register(){
    this.loader();

    var user = new User(
      this.e_mail,
      this.password);

    this.auth.createAccount(user).then((result)=>{
      this.loading.dismiss();
      console.log(result);
      this.navCtrl.setRoot(NotesPage);
    }, (err) => {
      this.loading.dismiss();
    });
  }

  loader(){
    this.loading = this.loadingCtrl.create({
      content: 'Authenticating'
    });
    this.loading.present();
  }

}
