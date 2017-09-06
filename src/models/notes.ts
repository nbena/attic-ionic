import { /*TagFull, */TagExtraMin } from './tags';
import { IndexTagType, TagType } from '../public/const';
import { Utils } from '../public/utils';
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
  // constructor(title?:string){
  //   super(title);
  // }
  constructor(input?:{title?:string, lastmodificationdate?:Date}){
    if(input!=null){
      if(input.title!=null){
        super(input.title);
      }else{
        super();
      }
      if(input.lastmodificationdate!=null){
        this.lastmodificationdate=input.lastmodificationdate;
      }
    }else{
      super();
    }
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
    let note:NoteExtraMinWithDate=new NoteExtraMinWithDate({title:jsonNote.title});
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
  constructor(input?:{title?:string, text?:string, isdone?:boolean, linsk?:string, creationdate?:Date}){
    if(input!=null){
      if(input.title!=null){
        super({title:input.title});
      }else{
        super();
      }
      this.init(input);
    }else{
      super();
    }
  }

  protected init(input:{title?:string, text?:string, isdone?:boolean,
    links?:string[], lastmodificationdate?:Date, creationdate?:Date}):void{
      if(input.text!=null){
        this.text=input.text;
      }
      if(input.isdone!=null){
        this.isdone=input.isdone;
      }
      if(input.links!=null){
        this.links=input.links;
      }
      if(input.lastmodificationdate!=null){
        this.lastmodificationdate=input.lastmodificationdate;
      }
      if(input.creationdate!=null){
        this.creationdate=input.creationdate;
      }
  }

}

export class NoteSmart extends NoteBarebon{
  mainTags: any;
  otherTags: any;
}

export class NoteMin extends NoteBarebon{
  maintags: string[];
  othertags: string[];

  // constructor(title?:string){
  //   super(title);
  //   this.maintags = [];
  //   this.othertags = [];
  // }
  constructor(input?:{title?:string, text?:string, isdone?:boolean,
    links?:string[], lastmodificationdate?:Date, creationdate?:Date,
    maintags?:string[], othertags?:string[]}){
      if(input!=null){
        if(input.title!=null){
          super({title:input.title});
        }
        this.init(input);
      }else{
        super();
      }
  }

  protected init(input:{title?:string, text?:string, isdone?:boolean,
    links?:string[], lastmodificationdate?:Date, creationdate?:Date,
    maintags?:string[], othertags?:string[]}):void{
      // if(input.text!=null){
      //   this.text=input.text;
      // }
      // if(input.isdone!=null){
      //   this.isdone=input.isdone;
      // }
      // if(input.links!=null){
      //   this.links=input.links;
      // }
      // if(input.lastmodificationdate!=null){
      //   this.lastmodificationdate=input.lastmodificationdate;
      // }
      // if(input.creationdate!=null){
      //   this.creationdate=input.creationdate;
      // }
      super.init(input);
      if(input.maintags!=null){
        this.maintags=input.maintags;
      }
      if(input.othertags!=null){
        this.othertags=input.othertags;
      }
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
    let note:NoteMin = new NoteMin({
      title:obj.title,
      text:obj.text,
      creationdate: new Date(obj.creationdate),
      lastmodificationdate: new Date(obj.lastmodificationdate),
      isdone: obj.isdone,
      maintags: obj.maintags,
      othertags: obj.othertags
    });
    // note.title=obj.title;
    // note.text=obj.text;
    // note.creationdate=obj.creationdate;
    // note.lastmodificationdate=obj.lastmodificationdate;
    // note.isdone=obj.isdone;
    // note.maintags=obj.maintags;
    // note.othertags=obj.othertags;
    return note;
  }

  public getNoteExtraMin():NoteExtraMin{
    return new NoteExtraMin(this.title);
  }

  /**
  Return a NoteFull which is the clone of this object, but it obviously
  has maintags and othertags converted as TagExtraMin instead of string.
  */
  public upgrade():NoteFull{
    // let note:NoteFull = new NoteFull(this.title);
    // note.text=this.text;
    // note.creationdate=this.creationdate;
    // note.lastmodificationdate=this.lastmodificationdate;
    // note.isdone=this.isdone;
    // note.links=this.links;
    // note.maintags=this.maintags.map(title=>{return new TagExtraMin(title)});
    // note.othertags=this.othertags.map(title=>{return new TagExtraMin(title)});
    let note:NoteFull = new NoteFull({
      title:this.title,
      text: this.text,
      maintags:this.maintags.map(title=>{return new TagExtraMin(title)}),
      othertags:this.othertags.map(title=>{return new TagExtraMin(title)}),
      isdone: this.isdone,
      links: this.links,
      creationdate: new Date(this.creationdate),
      lastmodificationdate: new Date(this.lastmodificationdate)
    })
    return note;
  }

  public forceCastToNoteExtraMin():NoteExtraMin{
    return new NoteExtraMin(this.title);
  }

  public forceCastToNoteExtraMinWithDate():NoteExtraMinWithDate{
    // let note:NoteExtraMinWithDate=new NoteExtraMinWithDate(this.title);
    // note.lastmodificationdate=this.lastmodificationdate;
    // return note;
    return new NoteExtraMinWithDate({title:this.title, lastmodificationdate: this.lastmodificationdate});
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
  // constructor(title?:string){
  //   super(title);
  //   this.maintags = [];
  //   this.othertags = [];
  // }
  constructor(input?:{title?:string, text?:string, isdone?:boolean,
    links?:string[], lastmodificationdate?:Date, creationdate?:Date,
    maintags?:TagExtraMin[], othertags?:TagExtraMin[]}){
      if(input!=null){
        if(input.title!=null){
          super({title:input.title});
        }
        this.init(input);
      }else{
        super();
      }
  }

  protected init(input:{title?:string, text?:string, isdone?:boolean,
    links?:string[], lastmodificationdate?:Date, creationdate?:Date,
    maintags?:TagExtraMin[], othertags?:TagExtraMin[]}):void{
      // if(input.text!=null){
      //   this.text=input.text;
      // }
      // if(input.isdone!=null){
      //   this.isdone=input.isdone;
      // }
      // if(input.links!=null){
      //   this.links=input.links;
      // }
      // if(input.lastmodificationdate!=null){
      //   this.lastmodificationdate=input.lastmodificationdate;
      // }
      // if(input.creationdate!=null){
      //   this.creationdate=input.creationdate;
      // }
      super.init(input);
      if(input.maintags!=null){
        this.maintags=input.maintags;
      }
      if(input.othertags!=null){
        this.othertags=input.othertags;
      }
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

  public removeTag2(tag:TagExtraMin):void{
    let found:boolean = false;
    for(let i=0;i<this.maintags.length;i++){
      if(this.maintags[i].title==tag.title){
        this.maintags.splice(i,1);
        found = true;
      }
    }
    if(!found){
      for(let i=0;i<this.othertags.length;i++){
        if(this.othertags[i].title==tag.title){
          this.othertags.splice(i,1);
        }
      }
    }
  }


  // public removeTag(ind:IndexTagType|TagExtraMin):void{
  //   let iTag:IndexTagType = new IndexTagType();
  //   if(ind instanceof IndexTagType){
  //     if(ind.type==TagType.MAIN){
  //       iTag.type = TagType.MAIN;
  //     }else{
  //       iTag.type==TagType.OTHER;
  //     }
  //     iTag.index = ind.index;
  //   }else{
  //     iTag = this.getTagIndex(ind);
  //   }
  //
  //   if(iTag.index>=0){
  //     if(iTag.type==TagType.MAIN){
  //       this.maintags.splice(iTag.index,1);
  //     }else{
  //       this.othertags.splice(iTag.index, 1);
  //     }
  //   }
  // }


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

  // private getMainTagsIndex(tag:TagExtraMin):IndexTagType{
  //   let result:IndexTagType = new IndexTagType();
  //   result.type = TagType.MAIN;
  //   for(let i=0;i<this.maintags.length;i++){
  //     if(this.maintags[i].title==tag.title){
  //       result.index=i;
  //       i=this.maintags.length;
  //     }
  //   }
  //   return result;
  // }
  //
  // private getOtherTagsIndex(tag:TagExtraMin):IndexTagType{
  //   let result:IndexTagType = new IndexTagType();
  //   result.type = TagType.OTHER;
  //   for(let i=0;i<this.othertags.length;i++){
  //     if(this.othertags[i].title==tag.title){
  //       result.index=i;
  //       i=this.othertags.length;
  //     }
  //   }
  //   return result;
  // }
  //
  //
  // public getTagIndex(tag:TagExtraMin, type?:TagType):IndexTagType{
  //   let result:IndexTagType = new IndexTagType();
  //   if(type==null || type==TagType.MAIN){
  //     result = this.getMainTagsIndex(tag);
  //     if(type==TagType.OTHER || (result.index==-1)){
  //       result = this.getOtherTagsIndex(tag);
  //     }
  //   }
  //   return result;
  // }



  //for misterious reason it doesn't work.
  // public getNoteExtraMin():NoteExtraMin{
  //   return NoteExtraMin.NewNoteExtraMin(this.title);
  // }

  // public getTagTypeAndRemove(tag:TagExtraMin):TagType{
  //   let tagType:TagType=null;
  //   let found:boolean = false;
  //   let ind=Utils.binarySearch(this.maintags, tag, TagExtraMin.ascendingCompare);
  //   if(ind!=-1){
  //     console.log('found in main');
  //     this.maintags.splice(ind,1);
  //     found=true;
  //     tagType=TagType.MAIN;
  //     console.log(tagType);
  //   }
  //   if(!found){
  //     ind=Utils.binarySearch(this.othertags, tag, TagExtraMin.ascendingCompare);
  //     if(ind!=-1){
  //       console.log('found in other');
  //       this.othertags.splice(ind,1);
  //       found=true;
  //       tagType=TagType.OTHER;
  //       console.log(tagType);
  //     }
  //   }
  //   return tagType;
  // }

  private getTagIndexType(tag:TagExtraMin):IndexTagType{
    let id:IndexTagType = null;
    for(let i=0;i<this.maintags.length;i++){
      if(this.maintags[i].title==tag.title){
        id=new IndexTagType();
        id.index=i;
        id.type=TagType.MAIN;
        i=3;
      }
    }
    if(id==null){
      for(let i=0;i<this.othertags.length;i++){
        if(this.othertags[i].title==tag.title){
          id=new IndexTagType();
          id.index=i;
          id.type=TagType.OTHER;
          i=10;
        }
      }
    }
    return id;
  }

  public replaceTag(oldTag:TagExtraMin, newTag:TagExtraMin):void{
    console.log('before');console.log(JSON.stringify(this));
    console.log('tags:');console.log(JSON.stringify({old:oldTag, new:newTag}));
    let index:IndexTagType = this.getTagIndexType(oldTag);
    if(index!=null){
      if(index.type==TagType.MAIN){
        this.maintags.splice(index.index, 1);
        this.maintags=Utils.binaryArrayInsert(this.maintags, newTag, TagExtraMin.ascendingCompare);
      }else{
        this.othertags.splice(index.index, 1);
        this.othertags=Utils.binaryArrayInsert(this.othertags, newTag, TagExtraMin.ascendingCompare);
      }
    }else{
      console.log('index is null');
    }
    console.log('after');console.log(JSON.stringify(this));
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
    let maintags:TagExtraMin[]=tmpNote.maintags.map(obj=>{return new TagExtraMin(obj.title)});
    let othertags:TagExtraMin[]=tmpNote.othertags.map(obj=>{return new TagExtraMin(obj.title)});
    tmpNote.maintags=maintags;
    tmpNote.othertags=othertags;
    return tmpNote;
  }


  public clone():NoteFull{
    // let tmpNote:NoteFull = new NoteFull(this.title);
    // // tmpNote.title=this.title;
    // tmpNote.text=this.text;
    // tmpNote.maintags = this.maintags;
    // tmpNote.othertags = this.othertags;
    // tmpNote.isdone = this.isdone;
    // tmpNote.creationdate = this.creationdate;
    // tmpNote.lastmodificationdate = this.lastmodificationdate;
    // tmpNote.links = this.links;
    let tmpNote = new NoteFull({
        title:this.title,
        text: this.text,
        maintags:this.maintags,
        othertags:this.othertags,
        isdone: this.isdone,
        links: this.links,
        creationdate: new Date(this.creationdate),
        lastmodificationdate: new Date(this.lastmodificationdate)
    })
    return tmpNote;
  }


  public forceCastToNoteExtraMinWithDate():NoteExtraMinWithDate{
    // let note:NoteExtraMinWithDate = new NoteExtraMinWithDate(this.title);
    // // note.title=this.title;
    // note.lastmodificationdate=this.lastmodificationdate;
    // return note;
    return new NoteExtraMinWithDate({title:this.title, lastmodificationdate:this.lastmodificationdate});
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
    let tmpNote:NoteFull=new NoteFull(
      {
        title:jsonNote.title,
        text: jsonNote.text,
        maintags:jsonNote.maintags,
        othertags:jsonNote.othertags,
        isdone: jsonNote.isdone,
        links: jsonNote.links,
        creationdate: new Date(jsonNote.creationdate),
        lastmodificationdate: new Date(jsonNote.lastmodificationdate)
      }
    );
    // tmpNote.text=jsonNote.text;
    // tmpNote.maintags = jsonNote.maintags;
    // tmpNote.othertags = jsonNote.othertags;
    // tmpNote.isdone = jsonNote.isdone;
    // tmpNote.creationdate = new Date(jsonNote.creationdate);
    // tmpNote.lastmodificationdate = new Date(jsonNote.lastmodificationdate);
    // tmpNote.links = jsonNote.links;
    return tmpNote;
  }


  public hasSomeTag():boolean{
    let ret:boolean = false;
    if(this.maintags.length>0 && this.othertags.length>0){
      ret=true;
    }
    return ret;
  }


  public hasTag(tag:TagExtraMin):boolean{
    let ret:boolean = false;
    let tags:TagExtraMin[]=this.getTagsAsTagsExtraMinArray();
    for(let i=0;i<tags.length;i++){
      if(tag.title==tags[i].title){
        ret = true;
        i = tags.length;
      }
    }
    return ret;
  }

  public addMainTags(tag:TagExtraMin):void{
    this.maintags=Utils.binaryArrayInsert(this.maintags, tag, TagExtraMin.ascendingCompare);
  }

  public addOtherTags(tag:TagExtraMin):void{
    this.othertags=Utils.binaryArrayInsert(this.othertags, tag, TagExtraMin.ascendingCompare);
  }


}
// export class NoteSQLite extends NoteFull{
//   mainTagsToAdd: TagFull[];
//   otherTagsToAdd: TagFull[];
//   mainTagsToRemove: TagFull[];
//   otherTagsToRemove: TagFull[];
// }
