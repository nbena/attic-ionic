import { Component } from '@angular/core';
import { NavController/*, NavParams */,Loading} from 'ionic-angular';

//import { LoadingController/*, ToastController*/ } from 'ionic-angular';

import { User } from '../../models/user';
import { AuthProvider } from '../../providers/auth';
// import { NotesPage } from '../notes/notes';
// import { RegisterPage } from '../register/register';

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
  private tryingToSubmit = false;

  private loginPageForm: FormGroup;

  private loading: Loading;

  private showSpinner: boolean = false;

  // constructor(public navCtrl: NavController, public navParams: NavParams) {}
  constructor(public navCtrl: NavController,/* private toastCtrl: ToastController,*/
    private auth: AuthProvider,
    //public loadingCtrl: LoadingController/*, private db: Db,*/,
    private graphicProvider:GraphicProvider,
    private formBuilder:FormBuilder
  ){

      this.loginPageForm = this.formBuilder.group({
        email:['', Validators.compose([Validators.required, Validators.email, Validators.maxLength(64)])],
        password:['', Validators.compose([Validators.required, Validators.minLength(8)  /*, Validators.pattern('')*/])]
      })

  }



  ionViewDidLoad() {
    console.log('ionViewDidLoad LoginPage');

    // this.loading=this.graphicProvider.showLoading('Authenticating'); //maybe I'll remove it.
    //
    // console.log('is auth?');
    // // console.log(this.auth.checkAuthentication());
    //
    // this.auth.checkAuthentication()
    // .then(isAuth=>{
    //   if(isAuth){
    //     console.log('true');
    //     // try{
    //       this.graphicProvider.dismissLoading(this.loading);
    //     // }catch(e){console.log('the error');console.log(JSON.stringify(e));console.log(JSON.stringify(e.message))}
    //
    //     //this.navCtrl.setRoot(NotesPage, this.getParams());
    //     this.navCtrl.setRoot(TabsPage);
    //   }else{
    //     console.log('false');
    //     // this.loading.dismiss();
    //     this.graphicProvider.dismissLoading(this.loading);
    //   }
    // });
    this.loading = this.graphicProvider.showLoading('Authenticating');
    let auth:boolean;
    this.auth.checkAuthentication()
    .then(isAuth=>{
      auth=isAuth;
      return this.graphicProvider.dismissLoading(this.loading);
    })
    .then(()=>{
      if(auth){
        this.navCtrl.setRoot(TabsPage);
      }else{

      }
    })
    .catch(error=>{
      console.log('error in check auth');console.log(JSON.stringify(error.message));
      this.graphicProvider.dismissLoading(this.loading).then(()=>{
        this.graphicProvider.showErrorAlert(error);
      })
    })


  }

  // //shows a kinf of popup while the request is made.
  // loader(){
  //   this.loading = this.loadingCtrl.create({
  //     content: 'Authenticating'
  //   });
  //   this.loading.present();
  // }

//called from the page
  private login(){
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
        this.makeEmptyJustUserid();
        this.graphicProvider.dismissLoading(this.loading)
        .then(()=>{
          this.graphicProvider.showErrorAlert(error/*'error during the authentication'}*/, ' please check your userid/password')
        })
      });
    }
  }


  //called from the page
  private registerUser(){
    // try{
    //   //this.navCtrl.push(RegisterPage);
    //   console.log('click');
    //   this.navCtrl.setRoot(RegisterPage);
    // }catch(e){
    //   console.log('there was the error');
    //   console.log(JSON.stringify(e));console.log(JSON.stringify(e.message));
    // }
    this.registerAPI();
  }

  //correct error msg if user already exists.
  private registerAPI(){
    if(this.loginPageForm.valid){
      this.loading=this.graphicProvider.showLoading('Authenticating'); //maybe I'll remove it.

      var user = new User(
        // this.e_mail,
        // this.password
        this.loginPageForm.value.email,
        this.loginPageForm.value.password
      );

      this.auth.createAccount(user)
        .then(result=>{
        // this.loading.dismiss();
        this.graphicProvider.dismissLoading(this.loading);
        // console.log(result);
        this.navCtrl.setRoot(TabsPage);
      })
      .catch(error=>{
        console.log('auth error');console.log(JSON.stringify(error.message));console.log(JSON.stringify(error));
        if(error.message.search('same')>=0){
          this.makeEmptyAll();
        }else{
          this.makeEmptyJustUserid();
        }
        this.graphicProvider.dismissLoading(this.loading)
        .then(()=>{
          this.graphicProvider.showErrorAlert(/*'error while creating account'*/error)
        })
      })
    }
  }

  private makeEmptyAll(){
    this.loginPageForm.reset({
      email: '',
      password: ''
    })
  };


  private makeEmptyJustUserid(){
    let temp:string = this.loginPageForm.value.email;
    this.loginPageForm.reset({
      email:temp,
      password:''
    })
  }

  // getParams(){
  //   return {filterType: Filter.None, filterValue: null};
  // }

}
