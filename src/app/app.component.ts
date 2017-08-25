import { Component, ViewChild } from '@angular/core';

import { Platform,/* MenuController,*/ Nav } from 'ionic-angular';

//import { StatusBar, Splashscreen } from 'ionic-native';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';

//mine
// import { NotesPage } from '../pages/notes/notes';
// import { TagsPage } from '../pages/tags/tags';

import { LoginPage } from '../pages/login/login';


@Component({
  templateUrl: 'app.html'
  // template: '<ion-nav [root]="rootPage"></ion-nav>'
})
export class MyApp {
  @ViewChild(Nav) nav: Nav;

  rootPage: any = LoginPage;
  // pages: Array<{title: string, component: any}>;

  constructor(
    public platform: Platform,
    statusBar: StatusBar, splashScreen: SplashScreen
  ) {
    // this.initializeApp();

    // // set our app's pages
    // this.pages = [
    // //   { title: 'Login', component: LoginPage },
    //   { title: 'Notes', component: NotesPage },
    //   { title: 'Tags', component: TagsPage }
    // ];
    statusBar.styleDefault();
    splashScreen.hide();

  }

  // initializeApp() {
  //   this.platform.ready().then(() => {
  //     // Okay, so the platform is ready and our plugins are available.
  //     // Here you can do any higher level native things you might need.
  //     StatusBar.styleDefault();
  //     Splashscreen.hide();
  //   });
  // }

  // openPage(page) {
  //   // close the menu when clicking a link from the menu
  //   this.menu.close();
  //   // navigate to the new page if it is not the current page
  //   this.nav.setRoot(page.component);
  // }
}
