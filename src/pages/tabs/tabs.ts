import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';

import { NotesPage } from '../notes/notes';
import { TagsPage } from '../tags/tags';
import { CreateNotePage } from '../create-note/create-note';

/*
  Generated class for the Tabs page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
  selector: 'page-tabs',
  templateUrl: 'tabs.html'
})
export class TabsPage {

  tab1Root = NotesPage;
  tab2Root = CreateNotePage;
  tab3Root = TagsPage;

  constructor(/*public navCtrl: NavController, public navParams: NavParams*/) {}

  ionViewDidLoad() {
    console.log('ionViewDidLoad TabsPage');
  }

}
