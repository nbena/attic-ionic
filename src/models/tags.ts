import { NoteExtraMin, NoteFull } from './notes'
//import {TagType } from '../public/const';
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
  public static NewTag(title:string):TagExtraMin{
    let tag:TagExtraMin = new TagExtraMin();
    tag.title=title;
    return tag;
  }

  public static ascendingCompare(a:TagExtraMin, b:TagAlmostMin):number{
    return a.title.localeCompare(b.title);
  }

  public static descendingCompare(a:TagExtraMin, b:TagAlmostMin):number{
    return b.title.localeCompare(a.title);
  }


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
      r = a.title.localeCompare(b.title);
    }
    return r;
  }

  constructor(){
    super();
    this.noteslength=0;
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

  notes: NoteExtraMin[];
  // constructor(title: string){
  //   super();
  //   this.title=title;
  // }
  constructor(){
    super();
    this.notes =[];
  }
  userid: string;

  public getNoteIndex(note: NoteExtraMin):number{
    let result:number = -1;
    for(let i=0;i<this.notes.length;i++){
      if(this.notes[i].title == note.title){
        result = i;
        i=this.notes.length;
      }
    }
    return result;
  }

  public removeNote(ind:NoteExtraMin|Number){
    if(ind instanceof Number){
      this.notes.splice(ind as number, 1);
    }else{
      this.removeNote(this.getNoteIndex(ind));
    }
  }

}

export class TagSQLite extends TagFull {
  addedNotes: NoteFull[];
  removedNotes: NoteFull[];
}
