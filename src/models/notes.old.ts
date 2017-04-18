import { TagFull, TagMin } from './tags';
/* complete object. */
export class Note{
  title: string;
  _id: string;
  text: string;
  _userId: string;
  maintags: TagFull[];
  othertags: TagFull[];
  isDone: boolean;
  links: string[];



//access-modifiers are copied from the definition of the class.
constructor(title: string, text: string){
  this.title=title;
  this.text=text;
  this.isDone=false;
}


getTitle(){
  return this.title;
}

getId(){
  return this._id;
}

getText(){
  return this.text;
}

getMainTags(){
  return this.maintags;
}

getOtherTags(){
  return this.othertags;
}

getLinks(){
  return this.links;
}

done(){
  return this.isDone;
}

setText(text: string){
  this.text=text;
}

setTitle(title: string){
  this.title=title;
}

setMainTags(mainTags: TagFull[]){
  this.maintags=mainTags;
}

setOtherTags(otherTags: TagFull[]){
  this.othertags=otherTags;
}

setDone(done: boolean){
  this.isDone=done;
}

setLinks(links: string[]){
  this.links=links;
}


};


/*when /unpop just on id for the tags */
export class NoteMin{
  private title: string;
  private _id: string;
  private text: string;
  private _userId: string;
  private maintags: string[];
  private othertags: string[];
  private isDone: boolean;
  private links: string[];

  //access-modifiers are copied from the definition of the class.
  constructor(title: string, text: string){
    this.title=title;
    this.text=text;
    this.isDone=false;
  }


  getTitle(){
    return this.title;
  }

  getId(){
    return this._id;
  }

  getText(){
    return this.text;
  }

  getMaintags(){
    return this.maintags;
  }

  getOtherTags(){
    return this.othertags;
  }

  getLinks(){
    return this.links;
  }

  done(){
    return this.isDone;
  }

  setText(text: string){
    this.text=text;
  }

  setTitle(title: string){
    this.title=title;
  }

  setMainTags(mainTags: string[]){
    this.maintags=mainTags;
  }

  setOtherTags(otherTags: string[]){
    this.othertags=otherTags;
  }

  setDone(done: boolean){
    this.isDone=done;
  }

  setLinks(links: string[]){
    this.links=links;
  }


};
