import { NgModule, ErrorHandler } from '@angular/core';
import { IonicApp, IonicModule, IonicErrorHandler } from 'ionic-angular';
import { MyApp } from './app.component';
import { Storage } from '@ionic/storage';

//mine
import { NotesPage } from '../pages/notes/notes';
import { TagsPage } from '../pages/tags/tags';

//login
import { LoginPage } from '../pages/login/login';
import { RegisterPage } from '../pages/register/register';

//providers
import { AtticNotes } from '../providers/attic-notes';
import { AtticTags } from '../providers/attic-tags';
import { Auth } from '../providers/auth';

@NgModule({
  declarations: [
    MyApp,
    NotesPage,
    TagsPage,
    LoginPage,
    RegisterPage
  ],
  imports: [
    IonicModule.forRoot(MyApp)
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    NotesPage,
    TagsPage,
    LoginPage,
    RegisterPage
  ],
  providers: [
    {provide: ErrorHandler, useClass: IonicErrorHandler},
    Storage,
    AtticNotes,
    AtticTags,
    Auth
    ]
})
export class AppModule {}
