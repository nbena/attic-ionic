import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';

import { LoadingController, ToastController } from 'ionic-angular';

import { User } from '../../models/user';
import { Auth } from '../../providers/auth';
import { NotesPage } from '../notes/notes';
import { RegisterPage } from '../register/register';

import { Filter } from '../../public/const';
import { Utils } from '../../public/utils';

import { Db } from '../../providers/db'

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
  userId: string = 'omni@pollo.com'; /*test user*/
  password: string;
  loading: any;

  // constructor(public navCtrl: NavController, public navParams: NavParams) {}
  constructor(public navCtrl: NavController, private toastCtrl: ToastController,
    private auth: Auth,
    public loadingCtrl: LoadingController, private db: Db){}



  ionViewDidLoad() {
    console.log('ionViewDidLoad LoginPage');

    this.loader();
    console.log('is auth?');
    // console.log(this.auth.checkAuthentication());

    this.auth.checkAuthentication()
    .then(isAuth=>{
      if(isAuth){
        console.log('true');
        this.loading.dismiss();
        this.navCtrl.setRoot(NotesPage, this.getParams());
      }else{
        console.log('false');
        this.loading.dismiss();
      }
    });

    // if(this.auth.checkAuthentication()){
    //   // console.log("already auth");
    //   this.loading.dismiss();
    //   this.navCtrl.setRoot(NotesPage, this.getParams());
    // }else{
    //   // console.log("not auth");
    //   this.loading.dismiss();
    // }

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
      this.userId,
      this.password
    );


    this.auth.login(user)
    .then(result=>{
      this.loading.dismiss();
      // console.log("ok auth");
      this.navCtrl.setRoot(NotesPage, this.getParams());
    })
    .catch(error=>{
      console.log('auth error');
      console.log(JSON.stringify(error));
      Utils.presentToast(this.toastCtrl, 'error during the authentication', true);
      this.loading.dismiss();
    });

  }


  //called from the page
  register(){
    this.navCtrl.push(RegisterPage);
  }

  getParams(){
    return {filterType: Filter.None, filterValue: null};
  }

}
