import { Injectable } from '@angular/core';
// import { Http } from '@angular/http';
// import 'rxjs/add/operator/map';
import {NoteFull, NoteExtraMin} from '../models/notes';
import {TagFull, TagExtraMin, TagAlmostMin} from '../models/tags';


/*
  Generated class for the AtticCacheProvider provider.

  See https://angular.io/docs/ts/latest/guide/dependency-injection.html
  for more info on providers and Angular DI.
*/
@Injectable()
export class AtticCache {

  cachedExtraMinNotes: NoteExtraMin[] = null;
  cachedFullNotes: NoteFull[] = null;
  cachedAlmostMinTags:TagAlmostMin[]=null;
  cachedFullTags:TagFull[]=null;




  constructor(/*public http: Http*/) {
    console.log('Hello AtticCacheProvider Provider');
  }

}
