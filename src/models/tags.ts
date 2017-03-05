import { NoteFull } from './notes'
/*
Defining interfaces for the API.
Here's the interface for the tags.
*/

export interface TagMin{
  title: string,
  _id: string,
  _userId: string,
  notes: string[]
}


export interface Tag{
  title: string,
  _userId: string,
  _id: string,
  notes: NoteFull[]
}
