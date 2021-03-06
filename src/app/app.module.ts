import { NgModule, ErrorHandler } from '@angular/core';
import { IonicApp, IonicModule, IonicErrorHandler } from 'ionic-angular';
import { MyApp } from './app.component';
import { IonicStorageModule } from '@ionic/storage';

import { BrowserModule } from '@angular/platform-browser';
import { HttpModule } from '@angular/http';

//mine
import { NotesPage } from '../pages/notes/notes';
import { TagsPage } from '../pages/tags/tags';
import { NoteDetailsPage } from '../pages/note-details/note-details';
import { TagDetailsPage } from '../pages/tag-details/tag-details';

import { CreateNotePage } from '../pages/create-note/create-note';
import { NoteDetailsPopoverPage } from '../pages/note-details-popover/note-details-popover';
import { TagDetailsPopoverPage } from '../pages/tag-details-popover/tag-details-popover';
import { NotesPopoverPage } from '../pages/notes-popover/notes-popover';
import { NoteEditTextPage } from '../pages/note-edit-text/note-edit-text';
import { NotesByTagPage } from '../pages/notes-by-tag/notes-by-tag';
import { SummaryPage } from '../pages/summary/summary';

//login
import { LoginPage } from '../pages/login/login';
// import { RegisterPage } from '../pages/register/register';

import { TabsPage } from '../pages/tabs/tabs';

//providers
import { AtticNotesProvider } from '../providers/attic-notes';
import { AtticTagsProvider } from '../providers/attic-tags';
import { DbProvider } from '../providers/db';
import { SynchProvider } from '../providers/synch';
import { AuthProvider } from '../providers/auth';
import { NetManagerProvider } from '../providers/net-manager';
import { AtticUserProvider } from '../providers/attic-user';

import { AtticCacheProvider } from '../providers/attic-cache';
import { HttpProvider } from '../providers/http';
import { GraphicProvider } from '../providers/graphic';

import { AutosizeDirective } from '../directives/autosize/autosize';

import { Network } from '@ionic-native/network';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { SQLite } from '@ionic-native/sqlite';
import { InAppBrowser } from '@ionic-native/in-app-browser';




@NgModule({
  declarations: [
    MyApp,
    NotesPage,
    TagsPage,
    NoteDetailsPage,
    TagDetailsPage,
    LoginPage,
    // RegisterPage,
    CreateNotePage,
    NoteDetailsPopoverPage,
    NoteEditTextPage,
    TagDetailsPopoverPage,
    NotesPopoverPage,
    NotesByTagPage,
    TabsPage,
    SummaryPage,
    AutosizeDirective
  ],
  imports: [
    IonicModule.forRoot(MyApp),
    BrowserModule,
    HttpModule,
    // IonicStorageModule.forRoot({
    //
    // })
    IonicStorageModule.forRoot()
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    NotesPage,
    TagsPage,
    NoteDetailsPage,
    TagDetailsPage,
    LoginPage,
    // RegisterPage,
    CreateNotePage,
    NoteDetailsPopoverPage,
    NoteEditTextPage,
    TagDetailsPopoverPage,
    NotesPopoverPage,
    //NoteEditTagsPage
    NotesByTagPage,
    TabsPage,
    SummaryPage
  ],
  providers: [
    {provide: ErrorHandler, useClass: IonicErrorHandler},
    /*Storage,*/
    Network,
    AtticNotesProvider,
    AtticTagsProvider,
    AuthProvider,
    DbProvider,
    SynchProvider,
    NetManagerProvider,
    AtticUserProvider,
    AtticCacheProvider,
    HttpProvider,
    GraphicProvider,
    SplashScreen,
    StatusBar,
    SQLite,
    InAppBrowser
    ]
})
export class AppModule {}
