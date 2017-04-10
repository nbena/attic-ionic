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
import { NoteEditTextPage } from '../pages/note-edit-text/note-edit-text';
import { NoteEditLinksPage } from '../pages/note-edit-links/note-edit-links';
import { NoteEditTagsPage } from '../pages/note-edit-tags/note-edit-tags';

//login
import { LoginPage } from '../pages/login/login';
import { RegisterPage } from '../pages/register/register';

//providers
import { AtticNotes } from '../providers/attic-notes';
import { AtticTags } from '../providers/attic-tags';
import { Db } from '../providers/db';
import { Synch } from '../providers/synch';
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
    NotesPopoverPage,
    NoteEditTextPage,
    NoteEditTagsPage,
    NoteEditLinksPage
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
    NotesPopoverPage,
    NoteEditTextPage,
    NoteEditTagsPage,
    NoteEditTagsPage
  ],
  providers: [
    {provide: ErrorHandler, useClass: IonicErrorHandler},
    Storage,
    AtticNotes,
    AtticTags,
    Auth,
    Db,
    Synch
    ]
})
export class AppModule {}
