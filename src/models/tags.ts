import { NoteFull } from './notes'
/*
Defining interfaces for the API.
Here's the interface for the tags.
*/

export class TagExtraMin {
  title: string;
  _id: string;

  static fromString(id: string):TagExtraMin{
    let tag = new TagExtraMin();
    tag._id=id;
    return tag;
  }

}

export class TagMin extends TagExtraMin{
  // _userId: string,
  notes: string[];

  // constructor(title: string){
  //   super();
  //   this.title=title;
  // }
}


export class TagFull extends TagExtraMin{

  notes: NoteFull[];
  // constructor(title: string){
  //   super();
  //   this.title=title;
  // }
}
