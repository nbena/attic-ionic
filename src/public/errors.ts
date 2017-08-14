import {DbActionNs} from './const';
export class AtticError{


  public static getSynchingError(action:DbActionNs.DbAction):string{
    let result:string = 'cannot ';
    result+=DbActionNs.getHumandReadableAction(action);
    result+='while there is synching in action';
    return result;
  }


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


  private static isSqliteError(error:string):boolean{
    let ret:boolean=false;
    if(error == AtticError.SQLITE_DUPLICATE_KEY_AUTH ||
      error == AtticError.SQLITE_DUPLICATE_KEY_TAGS ||
      error == AtticError.SQLITE_DUPLICATE_KEY_NOTES
    ){
      ret=true;
      // console.log('is sqlite error, and ret is');console.log(ret);
    }
    return ret;
  }

private  static getBetterSqliteError(error:any):any{
  let ret:any = error;
  if(error.message!=null){
    ret.message = AtticError.getBetterSqliteErrorString(error.message);
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
  // if(error.status!=null &&
  //   error.statusText!=null &&
  //   error.ok !=null
  //   // && error.headers!=null
  // ){
  //   console.log('matched error');
  //   if(error.status==0
  //     // && error.url==null
  //     && error.statusText=='' &&
  //     error.ok == false &&
  //     error.headers=={}
  //   ){
  //       isNetwork=true;
  //     }
  // }
  if(JSON.stringify(error) == AtticError.NETWORK_JSON_ERROR){
    isNetwork = true;
    // console.log('equals');
  }
  return isNetwork;
}

public static getBetterNetworkError(error:any):any{
  let ret:Error;
  if(AtticError.isNetworkError(error)){
    // ret.message=AtticError.NET_ERROR;
    ret = AtticError.getNewNetworkError();
  }
  return ret;
}

public static getNewNetworkError():Error{
  let ret:Error = new Error(AtticError.NET_ERROR);
  return ret;
}


private static readonly NETWORK_JSON_ERROR = '{"_body":{"isTrusted":true},"status":0,"ok":false,"statusText":"","headers":{},"type":3,"url":null}';


//directly taken from the server.
public static readonly POSTGRES_DUPLICATE_KEY_NOTES:string = 'DbError another note with the same title';
public static readonly POSTGRES_DUPLICATE_KEY_TAGS:string = 'DbError another tag with the same title';
public static readonly POSTGRES_DUPLICATE_KEY_NOTES_TAGS:string = 'DbError the tag is already with this note';
public static readonly POSTGRES_USER_REACHED_MAX_NOTES:string = 'DbError a free user cannot have more than 50 notes';
public static readonly POSTGRES_USER_REACHED_MAX_TAGS:string = 'DbError a free user cannot have more than 50 tags';
public static readonly POSTGRES_MAINTAGS_LIMIT:string = 'DbError maintags cannot be more than 3';
public static readonly POSTGRES_OTHERTAGS_LIMIT:string = 'DbError othetags cannot be more than 15';
public static readonly POSTGRES_FINAL_TAGS_FKEY:string = 'DbError tags not found'; /*whe trying to add a not-found tags*/



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


public static isDuplicateError(error:string):boolean{
  let ret:boolean = false;
  if(error==AtticError.POSTGRES_DUPLICATE_KEY_NOTES || error==AtticError.POSTGRES_DUPLICATE_KEY_NOTES_TAGS
    || error==AtticError.POSTGRES_DUPLICATE_KEY_TAGS){
      ret = true;
    }
  return ret;
}

public static isNotesTagsLimitError(error:string):boolean{
  let ret:boolean = false;
  if(error==AtticError.POSTGRES_MAINTAGS_LIMIT || error==AtticError.POSTGRES_OTHERTAGS_LIMIT){
    ret = true;
  }
  return ret;
}

public static isUserReachedMaxError(error:string):boolean{
  let ret:boolean = false;
  if(error==AtticError.POSTGRES_USER_REACHED_MAX_NOTES || error==AtticError.POSTGRES_USER_REACHED_MAX_TAGS){
    ret = true;
  }
  return ret;
}


public static isNotFoundError(error:string):boolean{
  let ret:boolean = false;
  if(error==AtticError.POSTGRES_FINAL_TAGS_FKEY){
    ret = true;
  }
  return ret;
}


public static getPostgresErrorArray(error:string):boolean[]{
  let ret:boolean[]=[];
  ret.push(AtticError.isDuplicateError(error));
  ret.push(AtticError.isNotesTagsLimitError(error));
  ret.push(AtticError.isUserReachedMaxError(error));
  ret.push(AtticError.isNotFoundError(error));
  return ret;
}


public static isDuplicateErrorFromArray(array:boolean[]):boolean{
  return array[0];
}

public static isNotesTagsLimitErrorFromArray(array:boolean[]):boolean{
  return array[1];
}

public static isUserReachedMaxErrorFromArray(array:boolean[]):boolean{
  return array[2];
}

public static isNotFoundErrorFromArray(array:boolean[]):boolean{
  return array[3];
}


// private static getError(error:any):any{
//   let ret:any = error;
//   if(error.message!=null){
//     if(AtticError.isSqliteError(error.message)){
//       ret=AtticError.getBetterSqliteError(error);
//       }
//   }
//   if(AtticError.isNetworkError(error)){
//     ret=AtticError.getBetterNetworkError(error)
//   }
//   return ret;
//   }


  public static getNewError(error:any):ErrData{
    let errorOut:ErrData;
    let errData:any;
    let isSpecific:boolean = false;
    if(error.message!=null){
      if(AtticError.isSqliteError(error.message)){
        // console.log('ok is specific sqlite error');
        errData=AtticError.getBetterSqliteError(error);
        // console.log('the better sqlite error is:');console.log(JSON.stringify(errData));
        isSpecific = true;
        // console.log('is specific sqlite error');
        }
    }
    if(!isSpecific){
      if(AtticError.isNetworkError(error)){
        errData=AtticError.getBetterNetworkError(error);
        isSpecific = true;
      }
    }
    errorOut = ErrData.NewErrData(errData, isSpecific);
    // console.log('the error out is:');console.log(JSON.stringify(errorOut));
    return errorOut;
  }

}


export class ErrData{

  isSpecific: boolean = false;
  error: any;


  public static NewErrData(errorIn:any, isSpecific:boolean):ErrData{
    let err:ErrData = new ErrData();
    err.error=errorIn;
    err.isSpecific = isSpecific;
    return err;
  }

}
