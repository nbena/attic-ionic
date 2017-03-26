import { NgModule, ErrorHandler } from '@angular/core';
import { IonicApp, IonicModule, IonicErrorHandler } from 'ionic-angular';
import { MyApp } from './app.component';
import { Storage } from '@ionic/storage';

//mine
import { NotesPage } from '../pages/notes/notes';
import { TagsPage } from '../pages/tags/tags';
import { NoteDetailsPage } from '../pages/note-details/note-details';
import { TagDetailsPage } from '../pages/tag-details/tag-details';

import { CreateNotePage } from '../pages/create-note/create-note';
import { NotesPopoverPage } from '../pages/notes-popover/notes-popover';

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
    NoteDetailsPage,
    TagDetailsPage,
    LoginPage,
    RegisterPage,
    CreateNotePage,
    NotesPopoverPage
  ],
  imports: [
    IonicModule.forRoot(MyApp)
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    NotesPage,
    TagsPage,
    NoteDetailsPage,
    TagDetailsPage,
    LoginPage,
    RegisterPage,
    CreateNotePage,
    NotesPopoverPage
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
