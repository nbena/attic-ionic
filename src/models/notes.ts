import { Tag, TagMin } from './tags';
/*
Defining interface for note API.
Here's the interface for the note API.
*/


/*the basically-iest API*/
export interface NoteExtraMin{
  title: string,
  _id: string,
}

/*when /unpop just on id for the tags */
export interface NoteMin{
  title: string,
  _id: string,
  text: string,
  _userId: string,
  mainTags: string[],
  otherTags: string[],
  isDone: boolean,
  links: string[]
}

/* complete object. */
export interface Note{
  title: string,
  _id: string,
  text: string,
  _userId: string,
  mainTags: Tag[],
  otherTags: Tag[],
  isDone: boolean,
  links: string[]
}
