import { NoteExtraMin, NoteFull } from './notes'
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

  public static ascendingCompare(a:TagAlmostMin, b: TagAlmostMin):number{
    let r:number;
    if(a.noteslength != b.noteslength){
      r = ((a.noteslength>b.noteslength) ? 1 : -1);
    }else{
      r = a.title.localeCompare(b.title);
    }
    return r;
  }

  public static descendingCompare(a:TagAlmostMin, b:TagAlmostMin):number{
    let r:number;
    if(a.noteslength != b.noteslength){
      r = ((a.noteslength>b.noteslength) ? -1 : 1);
    }else{
      r = b.title.localeCompare(a.title);
    }
    return r;
  }
}

// export class TagMin extends TagAlmostMin{
//   // _userId: string,
//   notes: NoteExtraMin[];
//
//   // constructor(title: string){
//   //   super();
//   //   this.title=title;
//   // }
//   constructor(){
//     super();
//     this.notes =[];
//   }
// }




// export class TagFull extends TagAlmostMin{
//
//   notes: NoteFull[];
//   // constructor(title: string){
//   //   super();
//   //   this.title=title;
//   // }
//   constructor(){
//     super();
//     this.notes =[];
//   }
// }

export class TagFull extends TagAlmostMin{

  notes: TagExtraMin[];
  // constructor(title: string){
  //   super();
  //   this.title=title;
  // }
  constructor(){
    super();
    this.notes =[];
  }
  userid: string;
}

export class TagSQLite extends TagFull {
  addedNotes: NoteFull[];
  removedNotes: NoteFull[];
}
