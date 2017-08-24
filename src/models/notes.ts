import { /*TagFull, */TagExtraMin } from './tags';
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

  // public static NewNoteExtraMin(title:string):NoteExtraMin{
  //   let returned:NoteExtraMin = new NoteExtraMin();
  //   returned.title = title;
  //   return returned;
  // }

  constructor(title?:string){
    if(title!=null){
      this.title=title;
    }
  }


  public static safeNewNoteFromJsonString(json:string):NoteExtraMin{
    return NoteExtraMin.safeNewNoteFromJsObject(JSON.parse(json));
  }

  public static safeNewNoteFromJsObject(jsonNote:any):NoteExtraMin{
    let note:NoteExtraMin=new NoteExtraMin(jsonNote.title);
    // note.title = jsonNote.title;
    return note;
  }

}

export class NoteExtraMinWithDate extends NoteExtraMin{
  lastmodificationdate: Date;
  constructor(title?:string){
    super(title);
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

  // public static getNoteExtraMinWithDate(input:any):NoteExtraMinWithDate{
  //   let note:NoteExtraMinWithDate=new NoteExtraMinWithDate();
  //   note.title=input.title;
  //   note.lastmodificationdate = new Date(input.lastmodificationdate);
  //   return note;
  // }

  public static safeNewNoteFromJsObject(jsonNote:any):NoteExtraMinWithDate{
    let note:NoteExtraMinWithDate=new NoteExtraMinWithDate(jsonNote.title);
    // note.title=jsonNote.title;
    note.lastmodificationdate = new Date(jsonNote.lastmodificationdate);
    return note;
  }

  public static safeNewNoteFromJsonString(json:string):NoteExtraMinWithDate{
    return NoteExtraMinWithDate.safeNewNoteFromJsObject(JSON.parse(json));
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

  constructor(title?:string){
    super(title);
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
    array=arrayStr.map(obj=>{return new TagExtraMin(obj)})
    return array;
  }

  public static safeNewTagFullFromJsonString(json:string):NoteMin{
    return NoteMin.safeNewNoteFromJsObject(JSON.parse(json));
  }

  public static safeNewNoteFromJsObject(obj:any):NoteMin{
    let note:NoteMin = new NoteMin();
    note.title=obj.title;
    note.text=obj.text;
    note.creationdate=obj.creationdate;
    note.lastmodificationdate=obj.lastmodificationdate;
    note.isdone=obj.isdone;
    note.maintags=obj.maintags;
    note.othertags=obj.othertags;
    return note;
  }

  public getNoteExtraMin():NoteExtraMin{
    return new NoteExtraMin(this.title);
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
  constructor(title?:string){
    super(title);
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


  public removeTag(ind:IndexTagType|TagExtraMin):void{
    let iTag:IndexTagType = new IndexTagType();
    if(ind instanceof IndexTagType){
      if(ind.type==TagType.MAIN){
        iTag.type = TagType.MAIN;
      }else{
        iTag.type==TagType.OTHER;
      }
      iTag.index = ind.index;
    }else{
      iTag = this.getTagIndex(ind);
    }

    if(iTag.index>=0){
      if(iTag.type==TagType.MAIN){
        this.maintags.splice(iTag.index,1);
      }else{
        this.othertags.splice(iTag.index, 1);
      }
    }
  }


  // public removeTag(ind:IndexTagType | TagExtraMin):void{
  //   if(ind instanceof IndexTagType){
  //     if(ind.type==TagType.MAIN){
  //       this.maintags=this.maintags.splice(ind.index, 1);
  //     }else{
  //       this.othertags=this.othertags.splice(ind.index, 1);
  //     }
  //   }else{
  //     let index = this.getTagIndex(ind);
  //     this.removeTag(index);
  //   }
  // }

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
      if(type==TagType.OTHER || (result.index==-1)){
        result = this.getOtherTagsIndex(tag);
      }
    }
    return result;
  }



  //for misterious reason it doesn't work.
  // public getNoteExtraMin():NoteExtraMin{
  //   return NoteExtraMin.NewNoteExtraMin(this.title);
  // }

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
    let maintags:TagExtraMin[]=tmpNote.maintags.map(obj=>{return new TagExtraMin(obj.title)});
    let othertags:TagExtraMin[]=tmpNote.othertags.map(obj=>{return new TagExtraMin(obj.title)});
    tmpNote.maintags=maintags;
    tmpNote.othertags=othertags;
    return tmpNote;
  }


  public clone():NoteFull{
    let tmpNote:NoteFull = new NoteFull(this.title);
    // tmpNote.title=this.title;
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
    let note:NoteExtraMinWithDate = new NoteExtraMinWithDate(this.title);
    // note.title=this.title;
    note.lastmodificationdate=this.lastmodificationdate;
    return note;
  }

  public forceCastToNoteExtraMin():NoteExtraMin{
    let note:NoteExtraMin = new NoteExtraMin(this.title);
    // note.title=this.title;
    return note;
  }


  public static safeNewNoteFromJsonString(json: string):NoteFull{
    // let tmpNote:NoteFull=new NoteFull();
    // let jsonNote:any = JSON.parse(json);
    // tmpNote.title=jsonNote.title;
    // tmpNote.text=jsonNote.text;
    // tmpNote.maintags = jsonNote.maintags;
    // tmpNote.othertags = jsonNote.othertags;
    // tmpNote.isdone = jsonNote.isdone;
    // tmpNote.creationdate = jsonNote.creationdate;
    // tmpNote.lastmodificationdate = jsonNote.lastmodificationdate;
    // tmpNote.links = jsonNote.links;
    return NoteFull.safeNewNoteFromJsObject(JSON.parse(json));

  }


  public static safeNewNoteFromJsObject(jsonNote:any):NoteFull{
    let tmpNote:NoteFull=new NoteFull(jsonNote.title);
    // tmpNote.title=jsonNote.title;
    tmpNote.text=jsonNote.text;
    tmpNote.maintags = jsonNote.maintags;
    tmpNote.othertags = jsonNote.othertags;
    tmpNote.isdone = jsonNote.isdone;
    tmpNote.creationdate = jsonNote.creationdate;
    //here is the point.
    tmpNote.lastmodificationdate = new Date(jsonNote.lastmodificationdate);
    tmpNote.links = jsonNote.links;
    return tmpNote;
  }


  public hasTags():boolean{
    let ret:boolean = false;
    if(this.maintags.length>0 && this.othertags.length>0){
      ret=true;
    }
    return ret;
  }


}
// export class NoteSQLite extends NoteFull{
//   mainTagsToAdd: TagFull[];
//   otherTagsToAdd: TagFull[];
//   mainTagsToRemove: TagFull[];
//   otherTagsToRemove: TagFull[];
// }
