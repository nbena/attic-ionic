import { TagFull } from './tags';
/*
Defining interface for note API.
Here's the interface for the note API.
*/


/*the basically-iest API*/
export class NoteExtraMin{
  _id: string;
  title: string;
}

export class NoteBarebon extends NoteExtraMin{
  text: string;
  private _userId: string;
  isDone: boolean;
  links: string[];
  creationDate: Date;
  lastModificationDate: Date;

  // constructor(title: string, text: string){
  //   super();
  //   this.title=title;
  //   this.text=text;
  // }

}

export class NoteSmart extends NoteBarebon{
  mainTags: any;
  otherTags: any;
}

export class NoteMin extends NoteBarebon{
  mainTags: string[];
  otherTags: string[];

}

export class NoteFull extends NoteBarebon{
  mainTags: TagFull[];
  otherTags: TagFull[];
}
