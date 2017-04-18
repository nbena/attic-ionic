import { NoteFull } from './notes'
/*
Defining interfaces for the API.
Here's the interface for the tags.
*/

export class TagExtraMin {
  title: string;

  // static fromString(id: string):TagExtraMin{
  //   let tag = new TagExtraMin();
  //   tag._id=id;
  //   return tag;
  // }

  // toStringId(): string{
  //   return this._id;
  // }

}

export class TagAlmostMin extends TagExtraMin{
  noteslength: number;
}

export class TagMin extends TagAlmostMin{
  // _userId: string,
  notes: string[];

  // constructor(title: string){
  //   super();
  //   this.title=title;
  // }
  constructor(){
    super();
    this.notes =[];
  }
}


export class TagFull extends TagAlmostMin{

  notes: NoteFull[];
  // constructor(title: string){
  //   super();
  //   this.title=title;
  // }
}

export class TagSQLite extends TagFull {
  addedNotes: NoteFull[];
  removedNotes: NoteFull[];
}
