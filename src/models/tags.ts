import { NoteExtraMin/*, NoteFull*/ } from './notes'
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
  // public static NewTag(title:string):TagExtraMin{
  //   let tag:TagExtraMin = new TagExtraMin();
  //   tag.title=title;
  //   return tag;
  // }
  public constructor(title?:string){
    if(title!=null){
      this.title=title;
    }
  }

  public static ascendingCompare(a:TagExtraMin, b:TagAlmostMin):number{
    return a.title.localeCompare(b.title);
  }

  public static descendingCompare(a:TagExtraMin, b:TagAlmostMin):number{
    return b.title.localeCompare(a.title);
  }


  public static safeNewTagFromJsonString(json:string):TagExtraMin{
    return TagExtraMin.safeNewTagFromJsObject(JSON.parse(json));
  }

  public static safeNewTagFromJsObject(json:any):TagExtraMin{
    return new TagExtraMin(json.title);
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

  // constructor(title?:string){
  //   super(title);
  //   this.noteslength=0;
  // }

  constructor(input?:{title?:string, noteslength?:number}){
    if(input!=null){
      if(input.title!=null){
        super(input.title);
      }else{
        super();
      }
    }else{
      super();
    }
    if(input.noteslength!=null){
      this.noteslength=input.noteslength;
    }else{
      this.noteslength=0;
    }
  }


  public static safeNewTagFromJsObject(jsonTag:any):TagAlmostMin{
    let tag:TagAlmostMin= new TagAlmostMin({title:jsonTag.title, noteslength:jsonTag.noteslength});
    if(jsonTag.noteslength==null || tag.noteslength==null){
      tag.noteslength=0;
    }
    return tag;
  }

  public static safeNewTagFromJsonString(json:string):TagAlmostMin{
    return TagAlmostMin.safeNewTagFromJsObject(JSON.parse(json));
  }

  public clone():TagAlmostMin{
    /*let tag:TagAlmostMin =*/return new TagAlmostMin({title:this.title, noteslength:this.noteslength});
    // tag.noteslength=this.noteslength;
    // return tag;
  }

  public forceCastToTagExtraMin():TagExtraMin{
    return new TagExtraMin(this.title);
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
  // constructor(title?:string){
  //   super(title);
  //   this.notes =[];
  // }
  constructor(input?:{title?:string, noteslength?:number, notes?:NoteExtraMin[]}){
    super(input);
    if(input!=null && input.notes!=null){
      this.notes=input.notes;
    }else{
      this.notes=[];
    }
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
    let index:number=-1;
    if(ind instanceof Number){
      index = ind as number;
    }else{
      index = this.getNoteIndex(ind);
    }
    if(index>=0){
      this.notes.splice(index, 1);
      this.noteslength--;
    }
  }


  public forceCastToTagAlmostMin():TagAlmostMin{
    // let tag:TagAlmostMin = new TagAlmostMin(this.title);
    // // tag.title=this.title;
    // tag.noteslength=this.noteslength;
    // return tag;
    return new TagAlmostMin({title:this.title, noteslength:this.noteslength});
  }

  public static safeNewTagFromJsonString(json:string):TagFull{
    return TagFull.safeNewTagFromJsObject(JSON.parse(json));
  }

  public static safeNewTagFromJsObject(jsonTag:any):TagFull{
    let tag:TagFull = new TagFull({title:jsonTag.title});
    // // tag.title = jsonTag.title;
    // tag.notes =jsonTag.notes;
    // if(jsonTag.noteslength==null/* || tag.noteslength==null*/){
    //   tag.noteslength=0;
    // }
    // if(/*tag.notes==null ||*/ jsonTag.notes==null){
    //   tag.notes=[];
    // }
    if(jsonTag.noteslength!=null && jsonTag.noteslength!=0){
      tag.noteslength=jsonTag.noteslength;
    }
    if(jsonTag.notes!=null && jsonTag.notes.length>0){
      tag.notes=jsonTag.notes;
    }
    console.log('returning post is');console.log(JSON.stringify(tag));
    return tag;
  }


  public clone():TagFull{
    return new TagFull({title:this.title, noteslength:this.noteslength, notes:this.notes});
  }


  public hasNote(note:NoteExtraMin):boolean{
    let ret: boolean = false;
    if(this.notes!=null){
      for(let i=0;i<this.notes.length;i++){
        if(this.notes[i].title==note.title){
          ret=true;
          i = this.notes.length;
        }
      }
    }
    return ret;
  }

}

// export class TagSQLite extends TagFull {
//   addedNotes: NoteFull[];
//   removedNotes: NoteFull[];
// }
