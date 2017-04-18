import { TagFull, TagExtraMin } from './tags';
/*
Defining interface for note API.
Here's the interface for the note API.
*/


/*the basically-iest API*/
export class NoteExtraMin{
  title: string;
}

export class NoteBarebon extends NoteExtraMin{
  text: string;
  private userId: string;
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

// export class NoteFull extends NoteBarebon{
//   mainTags: TagFull[];
//   otherTags: TagFull[];
// }
export class NoteFull extends NoteBarebon{
  mainTags: TagExtraMin[];
  otherTags: TagExtraMin[];
}
export class NoteSQLite extends NoteFull{
  mainTagsToAdd: TagFull[];
  otherTagsToAdd: TagFull[];
  mainTagsToRemove: TagFull[];
  otherTagsToRemove: TagFull[];
}
