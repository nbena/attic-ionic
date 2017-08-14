import { Component } from '@angular/core';
import { NavController/*, NavParams */,Loading} from 'ionic-angular';

//import { LoadingController/*, ToastController*/ } from 'ionic-angular';

import { User } from '../../models/user';
import { Auth } from '../../providers/auth';
// import { NotesPage } from '../notes/notes';
import { RegisterPage } from '../register/register';

import { TabsPage } from '../tabs/tabs';

// import { FilterNs } from '../../public/const';

import { GraphicProvider} from '../../providers/graphic'

import { FormBuilder, FormGroup, Validators } from '@angular/forms'

// import { Db } from '../../providers/db'

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

  // user: User;
  // userId: string = 'omni@pollo.com'; /*test user*/
  // password: string;
  // loading: any;
  tryingToSubmit = false;

  loginPageForm: FormGroup;

  private loading: Loading;

  // constructor(public navCtrl: NavController, public navParams: NavParams) {}
  constructor(public navCtrl: NavController,/* private toastCtrl: ToastController,*/
    private auth: Auth,
    //public loadingCtrl: LoadingController/*, private db: Db,*/,
    private graphicProvider:GraphicProvider,
    private formBuilder:FormBuilder
  ){

      this.loginPageForm = this.formBuilder.group({
        email:['', Validators.compose([Validators.required, Validators.email, Validators.maxLength(64)])],
        password:['', Validators.compose([Validators.required/*, Validators.pattern('')*/])]
      })

  }



  ionViewDidLoad() {
    console.log('ionViewDidLoad LoginPage');

    this.loading=this.graphicProvider.showLoading('Authenticating'); //maybe I'll remove it.

    console.log('is auth?');
    // console.log(this.auth.checkAuthentication());

    this.auth.checkAuthentication()
    .then(isAuth=>{
      if(isAuth){
        console.log('true');
        // try{
          this.graphicProvider.dismissLoading(this.loading);
        // }catch(e){console.log('the error');console.log(JSON.stringify(e));console.log(JSON.stringify(e.message))}

        //this.navCtrl.setRoot(NotesPage, this.getParams());
        this.navCtrl.setRoot(TabsPage);
      }else{
        console.log('false');
        // this.loading.dismiss();
        this.graphicProvider.dismissLoading(this.loading);
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

  // //shows a kinf of popup while the request is made.
  // loader(){
  //   this.loading = this.loadingCtrl.create({
  //     content: 'Authenticating'
  //   });
  //   this.loading.present();
  // }

//called from the page
  login(){
    if(this.loginPageForm.valid){
      this.loading=this.graphicProvider.showLoading('Authenticating'); //maybe I'll remove it.

      var user = new User(
        this.loginPageForm.value.email,
        this.loginPageForm.value.password
      );

      this.tryingToSubmit = true;

      this.auth.login(user)
      .then(result=>{
        //this.loading.dismiss();
        this.graphicProvider.dismissLoading(this.loading);
        // console.log("ok auth");
        //this.navCtrl.setRoot(NotesPage, this.getParams());
        this.navCtrl.setRoot(TabsPage);
      })
      .catch(error=>{
        console.log('auth error');console.log(JSON.stringify(error));
        this.graphicProvider.dismissLoading(this.loading)
        .then(()=>{
          this.graphicProvider.showErrorAlert('error during the authentication')
        })
      });
    }
  }


  //called from the page
  register(){
    this.navCtrl.push(RegisterPage);
  }

  makeEmpty(){
    let tmp:string = this.loginPageForm.value.email;
    this.loginPageForm.reset({
      email: tmp,
      password: ''
    })
  };

  // getParams(){
  //   return {filterType: Filter.None, filterValue: null};
  // }

}
