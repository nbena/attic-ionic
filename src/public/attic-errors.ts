
export class AtticError{

  //public static readonly DUPLICATE_KEY_NOTES:string = 'UNIQUE constraint failed: notes.title, notes.userid, notes.mustbedeleted';
  public static readonly SQLITE_DUPLICATE_KEY_NOTES:string ='a statement error callback did not return false: sqlite3_step failure: UNIQUE constraint failed: notes.title, notes.userid, notes.mustbedeleted';
  //a statement error callback did not return false: sqlite3_step failure: UNIQUE constraint failed: tags.title, tags.userid, tags.mustbedeleted
  public static readonly SQLITE_DUPLICATE_KEY_TAGS:string = 'a statement error callback did not return false: sqlite3_step failure: UNIQUE constraint failed: tags.title, tags.userid, tags.mustbedeleted';
  //public static readonly DUPLICATE_KEY_TAGS:string = 'UNIQUE constraint failed: tags.title, tags.userid, tags.mustbedeleted';
  public static readonly SQLITE_DUPLICATE_KEY_AUTH:string = 'UNIQUE constraint failed: auth.userid';

  public static readonly SQLITE_FINAL_DUPLICATE_KEY_NOTES:string='Another note with the same title already exists';
  public static readonly SQLITE_FINAL_DUPLICATE_KEY_TAGS:string='Another tag with the same title already exists';
  public static readonly SQLITE_FINAL_DUPLICATE_KEY_AUTH:string='User is already here';

  private static getBetterSqliteErrorString(error:string):string{
    let returnedError:string = error;
    switch(error){
      case AtticError.SQLITE_DUPLICATE_KEY_AUTH:
       returnedError=AtticError.SQLITE_FINAL_DUPLICATE_KEY_AUTH; break;
     case AtticError.SQLITE_DUPLICATE_KEY_TAGS:
       returnedError=AtticError.SQLITE_FINAL_DUPLICATE_KEY_TAGS; break;
     case AtticError.SQLITE_DUPLICATE_KEY_NOTES:
       returnedError=AtticError.SQLITE_FINAL_DUPLICATE_KEY_NOTES;break;
    }
    return returnedError;
  }

public static getBetterSqliteError(error:any):any{
  let ret:any = error;
  if(error.message!=null){
    ret.message = AtticError.getBetterSqliteError(error);
  }
  return ret;
}

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
public static readonly TAG_TITLE_IMPOSSIBLE = AtticError.SQLITE_FINAL_DUPLICATE_KEY_TAGS;
public static readonly NOTE_TITLE_IMPOSSIBLE = AtticError.SQLITE_FINAL_DUPLICATE_KEY_NOTES;

public static readonly NET_ERROR = 'An error occured due to your network connection';

private static isNetworkError(error:any):boolean{
  let isNetwork:boolean = false;
  if(error.status!=null &&
    error.statusText!=null &&
    error.ok !=null &&
    error.headers!=null
    )
  if(error.status==0 &&
    error.url==null &&
    error.statusText=='' &&
    error.ok == false &&
    error.headers=={}
  ){
      isNetwork=true;
    }
  return isNetwork;
}

public static getBetterNetworkError(error:any):any{
  let ret:any;
  if(AtticError.isNetworkError(error)){
    ret.message=AtticError.NET_ERROR;
  }
  return ret;
}




public static readonly POSTGRES_DUPLICATE_KEY_NOTES:string = 'DbError another note with the same title';
public static readonly POSTGRES_DUPLICATE_KEY_TAGS:string = 'DbError another tag with the same title';
public static readonly POSTGRES_DUPLICATE_KEY_NOTES_TAGS:string = 'DbError the tag is already with this note';
public static readonly POSTGRES_USER_REACHED_MAX_NOTES:string = 'DbError a free user cannot have more than 50 notes';
public static readonly POSTGRES_USER_REACHED_MAX_TAGS:string = 'DbError a free user cannot have more than 50 tags';
public static readonly POSTGRES_MAINTAGS_LIMIT:string = 'DbError maintags cannot be more than 3';
public static readonly POSTGRES_OTHERTAGS_LIMIT:string = 'DbError othetags cannot be more than 15';
public static readonly POSTGRES_FINAL_TAGS_FKEY:string = 'DbError tags not found';



public static isPostgresError(error:string):boolean{
  let ret:boolean = false;
  if(error==AtticError.POSTGRES_DUPLICATE_KEY_NOTES || error==AtticError.POSTGRES_DUPLICATE_KEY_NOTES_TAGS
    || error==AtticError.POSTGRES_DUPLICATE_KEY_TAGS || error==AtticError.POSTGRES_FINAL_TAGS_FKEY
    || error==AtticError.POSTGRES_MAINTAGS_LIMIT || error==AtticError.POSTGRES_OTHERTAGS_LIMIT
    || error==AtticError.POSTGRES_USER_REACHED_MAX_NOTES || error==AtticError.POSTGRES_USER_REACHED_MAX_TAGS
    //|| error.startsWith('JsonError') no thins because is a paramter that should NEVER happen.
  ){
    ret=true;
  }
  return ret;
}



}
