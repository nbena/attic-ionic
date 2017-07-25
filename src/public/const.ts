export enum Filter{
  Tags,
  // MainTags,
  // OtherTags,
  Text,
  Title,
  None
}

export enum Table{
  Notes,
  Tags,
  NotesToSave,
  TagsToSave
}

// export enum Action{
//
//   CreateNote,
//   CreateTag,
//
//   ChangeNoteTitle,
//   ChangeText,
//   AddMainTags,
//   AddOtherTags,
//   RemoveMainTags,
//   RemoveOtherTags,
//   AddLinks,
//   RemoveLinks,
//   SetDone,
//
//   DeleteNote,
//   DeleteTag,
//
//   ChangeTagTitle
//
//
// }


export namespace DbAction {
  export function asDbActionToString(action: DbAction){
    let res: string = '';
    switch(action){
      case DbAction.add_tag:
        res = 'add-tag';
      case DbAction.change_text:
        res = 'change-text';
      case DbAction.remove_tag:
        res = 'remove-tag';
      case DbAction.set_done:
        res = 'set-done';
      case DbAction.set_link:
        res = 'set-link';
      default:
        res = DbAction[action];
    }
  }

  export function asDbActionFromString(action: string){
    let res: DbAction;
    if(action == 'add-tag'){
      res = DbAction.add_tag;
    }
    else if(action == 'change-text'){
      res = DbAction.change_text;
    }
    else if (action == 'remove-tag'){
      res = DbAction.remove_tag;
    }
    else if (action == 'set-done'){
      res = DbAction.set_done;
    }
    else if (action =='set-link'){
      res = DbAction.set_link;
    }
    else{
      res = DbAction[action];
    }
    return res;
  }

  /*
  add tag and remove tag are problems.
  delete will never be a problem because it's always ok.
  change title is done only directly.
  set done, set link are not big problems.
  for that, we just remove it from the logs.
  */
  export enum DbAction{
    create,
    delete,
    change_title,
    change_text,
    set_done,
    set_link,
    add_tag,
    remove_tag
  }
}

export enum TagType{
  MAIN,
  OTHER
}

export class IndexTagType{
  index:number;
  type:TagType
}



export enum WhichField{
  Notes,
  NotesToSave,
  Tags,
  TagsToSave
}

export class Const{
  public static readonly API_URI = 'https://nb-attic.herokuapp.com';
//   /*public static */static enum NoteFilter {
//   TAGS, MAIN_TAGS, OTHER_TAGS
// }

  public static readonly ERR_NOTE_NOT_FOUND = 'Note not found';
  public static readonly ERR_TAG_NOT_FOUND = 'Tag not found';
  public static readonly ERR_MISMATCH = 'terrible error';
  public static readonly ERR_NO_NOTE_TO_PUBLISH = 'no note to publish';
  public static readonly ERR_NO_TAG_TO_PUBLISH = 'no tag to publish';
  public static readonly ERR_NO_LOG = 'no things to do';
  public static readonly ERR_NOTE_NOT_FULL ='The note is not full';
  public static readonly ERR_TOKEN_NOT_FOUND = 'token not found';

  // public static readonly UNIQUE_FAILED = 'UNIQUE constraint failed';
  public static readonly SERVER_ERROR = 'server error';

  public static readonly NOTES_LIMIT = 50;
  public static readonly TAGS_LIMIT = 50;

  public static readonly CURRENTLY_SYNCHING = 'Synching is in progress';
  public static readonly CURRENTLY_NOT_SYNCHING = 'No synching now';
}

export class PostgresError{
  public static readonly DUPLICATE_KEY_NOTES:string = 'DbError another note with the same title';
  public static readonly DUPLICATE_KEY_TAGS:string = 'DbError another tag with the same title';
  public static readonly DUPLICATE_KEY_NOTES_TAGS:string = 'DbError the tag is already with this note';
  public static readonly USER_REACHED_MAX_NOTES:string = 'DbError a free user cannot have more than 50 notes';
  public static readonly USER_REACHED_MAX_TAGS:string = 'DbError a free user cannot have more than 50 tags';
  public static readonly MAINTAGS_LIMIT:string = 'DbError maintags cannot be more than 3';
  public static readonly OTHERTAGS_LIMIT:string = 'DbError othetags cannot be more than 15';
  public static readonly FINAL_TAGS_FKEY:string = 'DbError tags not found';
}

export class SqliteError{
  //public static readonly DUPLICATE_KEY_NOTES:string = 'UNIQUE constraint failed: notes.title, notes.userid, notes.mustbedeleted';
  public static readonly DUPLICATE_KEY_NOTES:string ='a statement error callback did not return false: sqlite3_step failure: UNIQUE constraint failed: notes.title, notes.userid, notes.mustbedeleted';
  //a statement error callback did not return false: sqlite3_step failure: UNIQUE constraint failed: tags.title, tags.userid, tags.mustbedeleted
  public static readonly DUPLICATE_KEY_TAGS:string = 'a statement error callback did not return false: sqlite3_step failure: UNIQUE constraint failed: tags.title, tags.userid, tags.mustbedeleted';
  //public static readonly DUPLICATE_KEY_TAGS:string = 'UNIQUE constraint failed: tags.title, tags.userid, tags.mustbedeleted';
  public static readonly DUPLICATE_KEY_AUTH:string = 'UNIQUE constraint failed: auth.userid';

  public static readonly FINAL_DUPLICATE_KEY_NOTES:string='Another note with the same title already exists';
  public static readonly FINAL_DUPLICATE_KEY_TAGS:string='Another tag with the same title already exists';
  public static readonly FINAL_DUPLICATE_KEY_AUTH:string='User is already here';

  public static getBetterSqliteError(error:string):string{
    let returnedError:string = error;
    switch(error){
      case SqliteError.DUPLICATE_KEY_AUTH:
       returnedError=SqliteError.FINAL_DUPLICATE_KEY_AUTH; break;
     case SqliteError.DUPLICATE_KEY_TAGS:
       returnedError=SqliteError.FINAL_DUPLICATE_KEY_TAGS; break;
     case SqliteError.DUPLICATE_KEY_NOTES:
       returnedError=SqliteError.FINAL_DUPLICATE_KEY_NOTES;break;
    }
    return returnedError;
  }


}
