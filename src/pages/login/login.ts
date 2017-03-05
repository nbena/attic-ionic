import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';

import { LoadingController } from 'ionic-angular';

import { User } from '../../models/user';
import { Auth } from '../../providers/auth';
import { NotesPage } from '../notes/notes';
import { RegisterPage } from '../register/register';

/*
  Generated class for the Login page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
  selector: 'page-login',
  templateUrl: 'login.html'
})
export class LoginPage {

  user: User;
  e_mail: string;
  password: string;
  loading: any;

  // constructor(public navCtrl: NavController, public navParams: NavParams) {}
  constructor(public navCtrl: NavController, public auth: Auth,
    public loadingCtrl: LoadingController){}



  ionViewDidLoad() {
    console.log('ionViewDidLoad LoginPage');

    this.loader();

    if(this.auth.checkAuthentication()){
      // console.log("already auth");
      this.loading.dismiss();
      this.navCtrl.setRoot(NotesPage);
    }else{
      // console.log("not auth");
      this.loading.dismiss();
    }

  }

  //shows a kinf of popup while the request is made.
  loader(){
    this.loading = this.loadingCtrl.create({
      content: 'Authenticating'
    });
    this.loading.present();
  }

//called from the page
  login(){
    this.loader();

    var user = new User(
      this.e_mail,
      this.password
    );


    this.auth.login(user).then((result)=>{
      this.loading.dismiss();
      this.navCtrl.setRoot(NotesPage);
    }, (err)=>{
      this.loading.dismiss();
      console.log(err);
    });

  }


  //called from the page
  register(){
    this.navCtrl.push(RegisterPage);
  }

}
