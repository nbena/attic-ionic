import { Component } from '@angular/core';
// import { /*IonicPage, NavController, NavParams*/ToastController, AlertController } from 'ionic-angular';
import { AtticUserProvider } from '../../providers/attic-user';
import { Synch } from '../../providers/synch';
import { UserSummary } from '../../models/user_summary';
import { Const } from '../../public/const';
import { GraphicProvider} from '../../providers/graphic'
import { NavController,ViewController, App } from 'ionic-angular';
import { LoginPage } from '../login/login';

/**
 * Generated class for the SummaryPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */
// @IonicPage()
@Component({
  selector: 'page-summary',
  templateUrl: 'summary.html',
})
export class SummaryPage {

  summary: UserSummary=null;

  synchState: string;

  profileType: string;

  availableNotes: string;
  availableTags: string;

  synchingEnabled: boolean = false;

   constructor(
     public navCtrl: NavController,
     private viewCtrl: ViewController,
     /*public navParams: NavParams*/
    //  private toastCtrl: ToastController,
    //  private alertCtrl: AlertController,
      private app: App,
     private atticUser: AtticUserProvider,
     private synch: Synch,
     private graphicProvider:GraphicProvider
   ) {

      // this.load(false);
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad SummaryPage');
    if(this.summary==null){
      this.load(false);
    }
  }

  load(force: boolean){
    this.atticUser.getUserSummary2(force)
    .then(summary=>{
      this.summary = summary;
      console.log('summary is:');console.log(JSON.stringify(summary));

      this.profileType = (this.summary.data.isfree) ? 'Free' : 'Premium';
      this.availableNotes = (this.summary.data.isfree) ? this.summary.data.availablenotes.toString() : 'Unlimited';
      this.availableTags = (this.summary.data.isfree) ? this.summary.data.availabletags.toString() : 'Unlimited';

      // if(this.synch.isSynching()){
      //   this.synchState = Const.CURRENTLY_SYNCHING;
      // }else{
      //   this.synchState = Const.CURRENTLY_NOT_SYNCHING;
      // }
      // //
      // // if(!this.synch.isSynching() && this.summary.data.logscount > 0){
      // //   this.synchingEnabled = true;
      // // }
      // this.canISynch();
      this.setSynchState();

    })
    .catch(error=>{
      // console.log('summary error: ');
      console.log('summary error: '+JSON.stringify(error));
    })
  }


  refresh(refresher){
    this.load(true);
    setTimeout(()=>{
      refresher.complete();
    },2000);
  }

  setSynchingEnabled(){
    if(!this.synch.isSynching() && this.summary.data.logscount > 0){
      this.synchingEnabled = true;
    }
  }

  setSynchState(){
    this.setSynchingEnabled();
    if(this.synch.isSynching()){
      this.synchState = Const.CURRENTLY_SYNCHING;
    }else{
      this.synchState = Const.CURRENTLY_NOT_SYNCHING;
    }
  }

  startSynching(){

    // try{
      if(this.synchingEnabled){ //even if it's
      //not necessary let's keep it here.
        //Utils.presentToast(this.toastCtrl, 'synching...');
        this.graphicProvider.presentToast('synching...');
        this.synch.synch()
        .then(synched=>{
          console.log('synching done');
          this.graphicProvider.presentToast('synching done');
          try{
            this.setSynchState();
            this.summary.data.logscount=0;
          }catch(e){
            console.log('the post synch error');
            console.log(JSON.stringify(e));
            console.log(JSON.stringify(e.message))
          }

        })
        .catch(error=>{
          // console.log('error in synch');
          console.log('error in synch'+JSON.stringify(error));
          // this.synchingEnabled = true;
          // this.synchState = Const.CURRENTLY_NOT_SYNCHING;
          this.setSynchState();
          this.graphicProvider.showErrorAlert(error);
        })
        //please note that this is not done AFTER, but it's call when promise starts.
        this.synchState = Const.CURRENTLY_SYNCHING;
        this.synchingEnabled = false;
      }
    // }
    // catch(e){
    //   console.log('error here');
    //   console.log(JSON.stringify(e));
    // }
  }

  empty(){
    this.graphicProvider.askConfirm( 'Question','Be sure to have everything synched before, '+
    'if not you\'ll loose changes; consider that cache can speed up app\'s performance. '+
    'Are you sure?',(confirmed : boolean)=>{
      if(confirmed){
        this.emptyAPI();
      }/*else{
        nothing to do.
      }*/
    });
  }

  emptyAPI(){
    this.atticUser.deleteEverything()
    .then(()=>{
      console.log('ok everything deleted');
      //Utils.presentToast(this.toastCtrl, 'everything deleted');
      this.graphicProvider.presentToast('everything deleted');
    })
    .catch(error=>{
      // console.log('error in delete everything');
      console.log('error in delete everything'+JSON.stringify(error));
      this.graphicProvider.showErrorAlert(error);
    })
    // console.log('looooser');
  }


  logout(){
    this.graphicProvider.askConfirm('Question', 'Do you really want to logout?',
      (confirmed:boolean)=>{
        if(confirmed){
          this.logoutAPI();
        }
      }
    )
  }

  logoutAPI(){
    this.atticUser.logout()
    // .then(()=>{
    //   // this.navCtrl.popToRoot
    //   // let length:number =this.navCtrl.getViews().length;
    //   // return this.navCtrl.remove(1, length-2);
    //   return this.navCtrl.setRoot(LoginPage);
    // }).then(()=>{
    //   // return this.navCtrl.setRoot(LoginPage);
    //   return this.navCtrl.popToRoot();
    .then(()=>{
      return this.app.getRootNav().setRoot(LoginPage);
    }).then(()=>{
      this.viewCtrl.dismiss();
    }).catch(error=>{
      console.log('error in logout');console.log(JSON.stringify(error));
      this.graphicProvider.showErrorAlert(error);
    })
  }

}
