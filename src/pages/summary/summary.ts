import { Component } from '@angular/core';
// import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { AtticUserProvider } from '../../providers/attic-user';
import { Synch } from '../../providers/synch';
import { UserSummary } from '../../models/user_summary';

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

  summary: UserSummary = null;

  synchingMode: string = 'nothing to synch';

   constructor(/*public navCtrl: NavController, public navParams: NavParams*/
     private atticUser: AtticUserProvider,
     private synch: Synch
   ) {
     this.load();
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad SummaryPage');
    if(this.summary==null){
      this.load();
    }
  }

  load(){
    this.atticUser.getUserSummary(false)
    .then(summary=>{
      this.summary = summary;
      console.log('summary is:');
      console.log(JSON.stringify(summary));
    })
    .catch(error=>{
      console.log('summary error');
      console.log(JSON.stringify(error));
    })
  }

}
