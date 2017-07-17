import { Component } from '@angular/core';
// import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { AtticUserProvider } from '../../providers/attic-user';
import { Synch } from '../../providers/synch';
import { UserSummary } from '../../models/user_summary';
import { Const } from '../../public/const';

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

   constructor(/*public navCtrl: NavController, public navParams: NavParams*/
     private atticUser: AtticUserProvider,
     private synch: Synch
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
    this.atticUser.getUserSummary(force)
    .then(summary=>{
      this.summary = summary;
      // console.log('summary is:');
      // console.log(JSON.stringify(summary));

      this.profileType = (this.summary.data.isfree) ? 'Free' : 'Premium';
      this.availableNotes = (this.summary.data.isfree) ? this.summary.data.availablenotes.toString() : 'Unlimited';
      this.availableTags = (this.summary.data.isfree) ? this.summary.data.availabletags.toString() : 'Unlimited';

      if(this.synch.isSynching()){
        this.synchState = Const.CURRENTLY_SYNCHING;
      }else{
        this.synchState = Const.CURRENTLY_NOT_SYNCHING;
      }
    })
    .catch(error=>{
      console.log('summary error');
      console.log(JSON.stringify(error));
    })
  }


  refresh(refresher){
    this.load(true);
    setTimeout(()=>{
      refresher.complete();
    },2000);
  }

}
