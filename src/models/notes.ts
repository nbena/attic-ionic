import { TagFull, TagExtraMin } from './tags';
import { IndexTagType, TagType } from '../public/const';
/*
Defining interface for note API.
Here's the interface for the note API.
*/


/*the basically-iest API*/
export class NoteExtraMin{
  title: string;


  public static ascendingCompare(a: NoteExtraMin, b: NoteExtraMin):number{
    return a.title.localeCompare(b.title);
  }


  public static descendingCompare(a: NoteExtraMin, b: NoteExtraMin):number{
    return b.title.localeCompare(a.title);
}
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

  public static ascendingCompare(a: NoteFull, b: NoteFull):number{
    let r:number;
    if(a.lastmodificationdate.getTime()!=b.lastmodificationdate.getTime()){
      r = ((a.lastmodificationdate>b.lastmodificationdate) ? 1: -1);
    }else{
      r = a.title.localeCompare(b.title);
    }
    return r;
  }


  public static descendingCompare(a: NoteFull, b: NoteFull):number{
    let r:number;
    if(a.lastmodificationdate.getTime()!=b.lastmodificationdate.getTime()){
      r = ((a.lastmodificationdate>b.lastmodificationdate) ? -1: 1);
    }else{
      r = a.title.localeCompare(b.title);
    }
    return r;
  }

  public getTagsAsTagsExtraMinArray():TagExtraMin[]{
    return this.maintags.concat(this.othertags);
  }

  public getTagsAsStringArray():string[]{
    let str:string[]=[];
    this.getTagsAsTagsExtraMinArray().forEach(obj=>{
      str.push(obj.title);
    })
    return str;
  }

  public removeTag(ind:IndexTagType):void{
    if(ind.type==TagType.MAIN){
      this.maintags=this.maintags.splice(ind.index, 1);
    }else{
      this.othertags=this.othertags.splice(ind.index, 1);
    }
  }

  public getTagIndex(tag:TagExtraMin):IndexTagType{
    let result:IndexTagType = new IndexTagType();
    let index:number=-1;
    for(let i=0;i<this.maintags.length;i++){
      if(this.maintags[i].title==tag.title){
        index=i;
        i=this.maintags.length;
        result.type=TagType.MAIN;
      }
    }
    if(index==-1){
      for(let i=0;i<this.othertags.length;i++){
        if(this.othertags[i].title==tag.title){
          index=i;
          i=this.othertags.length;
          result.type=TagType.OTEHR;
        }
      }
    }
    result.index = index;
    return result;
  }


}
export class NoteSQLite extends NoteFull{
  mainTagsToAdd: TagFull[];
  otherTagsToAdd: TagFull[];
  mainTagsToRemove: TagFull[];
  otherTagsToRemove: TagFull[];
}
