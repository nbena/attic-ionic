import { Component, ViewChild } from '@angular/core';
import { /*NavController, NavParams,*/ Events, Tabs } from 'ionic-angular';

import { NotesPage } from '../notes/notes';
import { TagsPage } from '../tags/tags';
import { CreateNotePage } from '../create-note/create-note';
import { SummaryPage } from '../summary/summary';

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

@ViewChild(Tabs) tabs: Tabs;

  tab1Root = NotesPage;
  tab2Root = CreateNotePage;
  tab3Root = TagsPage;
  tab4Root = SummaryPage;

  notesParams = {};
  tagsParams = {};

  constructor(/*public navCtrl: NavController, public navParams: NavParams*/
    /*private navCtrl: NavController,*/
    private events: Events
  ) {

    this.events.subscribe('change-tab', (tab, note) => {
      this.notesParams = note;
      this.tabs.select(tab);
      });

    this.events.subscribe('go-to-notes-and-remove', ()=>{
      // this.notesParams = index as number;
      this.tabs.select(0);
    });

    this.events.subscribe('go-to-tags', ()=>{
      //this.tagsParams = index as number;
      this.tabs.select(2);
    });

    this.events.subscribe('go-to-notes-and-replace', ()=>{
      // this.notesParams = {newnote, oldnote};
      this.tabs.select(0);
    });

    this.events.subscribe('go-to-tags-and-remove', ()=>{
      // console.log('I received the noticeeeeee');
      // console.log('ok go to tags and remove');
      this.tabs.select(2);
    });


    this.events.subscribe('go-to-notes-and-filter', ()=>{
      this.tabs.select(0);
    })

  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad TabsPage');
  }

}
