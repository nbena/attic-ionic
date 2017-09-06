import { Component } from '@angular/core';
// import { /*IonicPage, NavController, NavParams*/ToastController, AlertController } from 'ionic-angular';
import { AtticUserProvider } from '../../providers/attic-user';
import { Synch } from '../../providers/synch';
import { UserSummary } from '../../models/user_summary';
import { Const } from '../../public/const';
import { GraphicProvider} from '../../providers/graphic'
import { NavController,ViewController, App } from 'ionic-angular';
import { LoginPage } from '../login/login';
import { Auth } from '../../providers/auth';

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

  private summary: UserSummary=null;

  private synchState: string;

  private profileType: string;

  private availableNotes: string;
  private availableTags: string;

  private synchingEnabled: boolean = false;

  private firstTime: boolean = true;

   constructor(
     public navCtrl: NavController,
     private viewCtrl: ViewController,
     /*public navParams: NavParams*/
    //  private toastCtrl: ToastController,
    //  private alertCtrl: AlertController,
      private app: App,
     private atticUser: AtticUserProvider,
     private synch: Synch,
     private graphicProvider:GraphicProvider,
     private auth: Auth
   ) {

      // this.load(false);
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad SummaryPage');
    if(this.summary==null){
      this.load(false);
    }
  }

  private loadData(force: boolean):Promise<void>{
    return new Promise<void>((resolve, reject)=>{
      this.atticUser.getUserSummary(force)
      .then(summary=>{
        this.summary = summary;

        this.profileType = (this.summary.data.isfree) ? 'Free' : 'Premium';
        this.availableNotes = (this.summary.data.isfree) ? this.summary.data.availablenotes.toString() : 'Unlimited';
        this.availableTags = (this.summary.data.isfree) ? this.summary.data.availabletags.toString() : 'Unlimited';

        this.setSynchState();
        resolve();

      })
      .catch(error=>{
        // console.log('summary error: ');
        console.log('summary error: '+JSON.stringify(error));
        reject(error);
      })
    })
  }

  private load(force:boolean, refresher?:any){
    this.loadData(force)
    .then(()=>{
      if(refresher!=null){
        refresher.complete();
      }
    })
    .catch(error=>{
      if(refresher!=null){
        refresher.complete();
      }
      this.graphicProvider.showErrorAlert(error);
    })
  }

  ionViewWillEnter(){
    this.firstTime=true;
  }


  private refresh(refresher){
    this.load(!this.firstTime, refresher);
    this.firstTime=false;
  }

  private setSynchingEnabled(){
    if(!this.synch.isSynching() && this.summary.data.logscount > 0){
      this.synchingEnabled = true;
    }
  }

  private setSynchState(){
    this.setSynchingEnabled();
    if(this.synch.isSynching()){
      // console.log('is synching');
      this.synchState = Const.CURRENTLY_SYNCHING;
    }else{
      // console.log('is not synching');
      this.synchState = Const.CURRENTLY_NOT_SYNCHING;
      console.log(this.synchState); //not refreshed...
    }
    // console.log('is enabled?');console.log(this.synchingEnabled);
  }

  private startSynching(){

    // try{
      if(this.synchingEnabled){ //even if it's
      //not necessary let's keep it here.
        //Utils.presentToast(this.toastCtrl, 'synching...');
        this.graphicProvider.presentToast('synchronizing...');
        this.synch.synch()
        .then(synched=>{
          console.log('Synchronization done');
          this.graphicProvider.presentToast('Synchronization done');
          try{
            //this.setSynchState();
            this.synchingEnabled = false; //the user will do a refresh, will be
            //enabled if there are items to synch.
            this.synchState = Const.CURRENTLY_NOT_SYNCHING;
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

  private empty(){
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

private emptyAPI(){
    this.atticUser.deleteEverything()
    .then(()=>{
      // console.log('ok everything deleted');
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


  private logout(){
    this.graphicProvider.askConfirm('Question', 'Do you really want to logout?',
      (confirmed:boolean)=>{
        if(confirmed){
          this.logoutAPI();
        }
      }
    )
  }

  private logoutAPI(){
    this.auth.logout()
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
