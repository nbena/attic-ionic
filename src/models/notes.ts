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
  userid: string;
  isdone: boolean;
  links: string[];
  creationdate: Date;
  lastmodificationdate: Date;

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
  maintags: string[];
  othertags: string[];

  constructor(){
    super();
    this.maintags = [];
    this.othertags = [];
  }

}

// export class NoteFull extends NoteBarebon{
//   mainTags: TagFull[];
//   otherTags: TagFull[];
// }
// export class NoteFull extends NoteBarebon{
//   maintags: TagAlmostMin[];
//   othertags: TagAlmostMin[];
// }
export class NoteFull extends NoteBarebon{
  maintags: TagExtraMin[];
  othertags: TagExtraMin[];
  constructor(){
    super();
    this.maintags = [];
    this.othertags = [];
  }
}
export class NoteSQLite extends NoteFull{
  mainTagsToAdd: TagFull[];
  otherTagsToAdd: TagFull[];
  mainTagsToRemove: TagFull[];
  otherTagsToRemove: TagFull[];
}
