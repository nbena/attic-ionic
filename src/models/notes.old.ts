import { Tag, TagMin } from './tags';
/* complete object. */
export class Note{
  title: string;
  _id: string;
  text: string;
  _userId: string;
  mainTags: Tag[];
  otherTags: Tag[];
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
  return this.mainTags;
}

getOtherTags(){
  return this.otherTags;
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

setMainTags(mainTags: Tag[]){
  this.mainTags=mainTags;
}

setOtherTags(otherTags: Tag[]){
  this.otherTags=otherTags;
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
  private mainTags: string[];
  private otherTags: string[];
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

  getMainTags(){
    return this.mainTags;
  }

  getOtherTags(){
    return this.otherTags;
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
    this.mainTags=mainTags;
  }

  setOtherTags(otherTags: string[]){
    this.otherTags=otherTags;
  }

  setDone(done: boolean){
    this.isDone=done;
  }

  setLinks(links: string[]){
    this.links=links;
  }


};
