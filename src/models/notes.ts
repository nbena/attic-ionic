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

  public static NewNoteExtraMin(title:string):NoteExtraMin{
    let returned:NoteExtraMin = new NoteExtraMin();
    returned.title = title;
    return returned;
  }

}

export class NoteExtraMinWithDate extends NoteExtraMin{
  lastmodificationdate: Date;
  constructor(){
    super();
  }

  public static ascendingCompare(a: NoteExtraMinWithDate, b: NoteExtraMinWithDate):number{
    let r:number;
    if(a.lastmodificationdate.getTime()!=b.lastmodificationdate.getTime()){
      r = ((a.lastmodificationdate>b.lastmodificationdate) ? 1: -1);
    }else{
      r = a.title.localeCompare(b.title);
    }
    return r;
  }


  public static descendingCompare(a: NoteExtraMinWithDate, b: NoteExtraMinWithDate):number{
    let r:number;
    if(a.lastmodificationdate.getTime()!=b.lastmodificationdate.getTime()){
      r = ((a.lastmodificationdate>b.lastmodificationdate) ? -1: 1);
    }else{
      r = a.title.localeCompare(b.title);
    }
    return r;
  }

  public static getNoteExtraMinWithDate(input:any):NoteExtraMinWithDate{
    let note:NoteExtraMinWithDate=new NoteExtraMinWithDate();
    note.title=input.title;
    note.lastmodificationdate = new Date(input.lastmodificationdate);
    return note;
  }



}

export class NoteBarebon extends NoteExtraMinWithDate{
  text: string;
  userid: string;
  isdone: boolean;
  links: string[];
  creationdate: Date;
  //lastmodificationdate: Date;

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

  public getTagsAsStringArray():string[]{
    let array:string[]=[];
    array = array.concat(this.maintags, this.othertags);
    return array;
  }

  public getTagsAsTagsExtraMinArray():TagExtraMin[]{
    let array:TagExtraMin[]=[];
    let arrayStr:string[]=this.getTagsAsStringArray();
    array=arrayStr.map(obj=>{return TagExtraMin.NewTag(obj)})
    return array;
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


  public removeTag(ind:IndexTagType | TagExtraMin):void{
    if(ind instanceof IndexTagType){
      if(ind.type==TagType.MAIN){
        this.maintags=this.maintags.splice(ind.index, 1);
      }else{
        this.othertags=this.othertags.splice(ind.index, 1);
      }
    }else{
      let index = this.getTagIndex(ind);
      this.removeTag(index);
    }
  }

  private getMainTagsIndex(tag:TagExtraMin):IndexTagType{
    let result:IndexTagType = new IndexTagType();
    result.type = TagType.MAIN;
    for(let i=0;i<this.maintags.length;i++){
      if(this.maintags[i].title==tag.title){
        result.index=i;
        i=this.maintags.length;
      }
    }
    return result;
  }

  private getOtherTagsIndex(tag:TagExtraMin):IndexTagType{
    let result:IndexTagType = new IndexTagType();
    result.type = TagType.OTHER;
    for(let i=0;i<this.othertags.length;i++){
      if(this.othertags[i].title==tag.title){
        result.index=i;
        i=this.othertags.length;
      }
    }
    return result;
  }


  public getTagIndex(tag:TagExtraMin, type?:TagType):IndexTagType{
    let result:IndexTagType = new IndexTagType();
    if(type==null || type==TagType.MAIN){
      result = this.getMainTagsIndex(tag);
      if(type==TagType.OTHER || (type==null && result.index==-1)){
        result = this.getOtherTagsIndex(tag);
      }
    }
    return result;
  }


  public getNoteExtraMin():NoteExtraMin{
    return NoteExtraMin.NewNoteExtraMin(this.title);
  }

  public getTagTypeAsArray(type:TagType):TagType[]{
    let array:TagType[]=[];
    if(type==TagType.MAIN){
      this.maintags.map(obj=>{return TagType.MAIN});
    }else{
      this.othertags.map(obj=>{return TagType.OTHER});
    }
    return array;
  }

  public getAllTagsType():TagType[]{
    return this.getTagTypeAsArray(TagType.MAIN).concat(this.getTagTypeAsArray(TagType.OTHER));
  }



  public getMinifiedVersionForCreation():NoteFull{
    let tmpNote:NoteFull = this.clone();
    let maintags:TagExtraMin[]=tmpNote.maintags.map(obj=>{return TagExtraMin.NewTag(obj.title)});
    let othertags:TagExtraMin[]=tmpNote.othertags.map(obj=>{return TagExtraMin.NewTag(obj.title)});
    tmpNote.maintags=maintags;
    tmpNote.othertags=othertags;
    return tmpNote;
  }


  public clone():NoteFull{
    let tmpNote:NoteFull = new NoteFull();
    tmpNote.title=this.title;
    tmpNote.text=this.text;
    tmpNote.maintags = this.maintags;
    tmpNote.othertags = this.othertags;
    tmpNote.isdone = this.isdone;
    tmpNote.creationdate = this.creationdate;
    tmpNote.lastmodificationdate = this.lastmodificationdate;
    tmpNote.links = this.links;
    return tmpNote;
  }


  public forceCastToNoteExtraMinWithDate():NoteExtraMinWithDate{
    let note:NoteExtraMinWithDate = new NoteExtraMinWithDate();
    note.title=this.title;
    note.lastmodificationdate=this.lastmodificationdate;
    return note;
  }

  public forceCastToNoteExtraMin():NoteExtraMin{
    let note:NoteExtraMin = new NoteExtraMin();
    note.title=this.title;
    return note;
  }



}
export class NoteSQLite extends NoteFull{
  mainTagsToAdd: TagFull[];
  otherTagsToAdd: TagFull[];
  mainTagsToRemove: TagFull[];
  otherTagsToRemove: TagFull[];
}
