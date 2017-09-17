import {DbActionNs} from './const';
export class AtticError{


  private static getSynchingErrorString(action:DbActionNs.DbAction):string{
    let result:string = 'cannot ';
    result+=DbActionNs.getHumandReadableAction(action);
    result+='while there is synching in action';
    return result;
  }

  public static getSynchingError(action:DbActionNs.DbAction):Error{
    let ret:Error = new Error(/*AtticError.getSynchingErrorString(action)*/);
    ret.message = AtticError.getSynchingErrorString(action);
    return ret;
  }


  //public static readonly DUPLICATE_KEY_NOTES:string = 'UNIQUE constraint failed: notes.title, notes.userid, notes.mustbedeleted';
  public static readonly SQLITE_DUPLICATE_KEY_NOTES:string ='a statement error callback did not return false: sqlite3_step failure: UNIQUE constraint failed: notes.title, notes.userid, notes.mustbedeleted';
  //a statement error callback did not return false: sqlite3_step failure: UNIQUE constraint failed: tags.title, tags.userid, tags.mustbedeleted
  public static readonly SQLITE_DUPLICATE_KEY_TAGS:string = 'a statement error callback did not return false: sqlite3_step failure: UNIQUE constraint failed: tags.title, tags.userid, tags.mustbedeleted';
  //public static readonly DUPLICATE_KEY_TAGS:string = 'UNIQUE constraint failed: tags.title, tags.userid, tags.mustbedeleted';
  public static readonly SQLITE_DUPLICATE_KEY_AUTH:string = 'sqlite3_step failure: UNIQUE constraint failed: auth.userid';

  public static readonly SQLITE_FINAL_DUPLICATE_KEY_NOTES:string='Another note with the same title already exists';
  public static readonly SQLITE_FINAL_DUPLICATE_KEY_TAGS:string='Another tag with the same title already exists';
  public static readonly SQLITE_FINAL_DUPLICATE_KEY_AUTH:string='User is already here';

  private static getBetterSqliteErrorString(errorIn:any):string{
    let error:string = (errorIn.message!=null) ? errorIn.message : errorIn;
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


  private static isSqliteError(errorIn:any):boolean{
    let error:string = (errorIn.message!=null) ? errorIn.message : errorIn;
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

private  static getBetterSqliteError(error:any):Error{
  // let ret:any = error;
  // if(error.message!=null){
  //   ret.message = AtticError.getBetterSqliteErrorString(error.message);
  // }
  // return ret;
  let ret:Error = new Error(/*AtticError.getBetterSqliteErrorString(error)*/);
  ret.message = AtticError.getBetterSqliteErrorString(error);
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
  let ret:Error = new Error(/*AtticError.NET_ERROR*/);
  ret.message = AtticError.NET_ERROR;
  return ret;
}


private static readonly NETWORK_JSON_ERROR = '{"_body":{"isTrusted":true},"status":0,"ok":false,"statusText":"","headers":{},"type":3,"url":null}';


//directly taken from the server.
public static readonly POSTGRES_DUPLICATE_KEY_NOTES:string = 'DbError another note with the same title';
public static readonly POSTGRES_DUPLICATE_KEY_TAGS:string = 'DbError another tag with the same title';
public static readonly POSTGRES_DUPLICATE_KEY_USERS:string = 'DbError another user with the same userid';
public static readonly POSTGRES_DUPLICATE_KEY_NOTES_TAGS:string = 'DbError the tag is already with this note';
public static readonly POSTGRES_USER_REACHED_MAX_NOTES:string = 'DbError a free user cannot have more than 50 notes';
public static readonly POSTGRES_USER_REACHED_MAX_TAGS:string = 'DbError a free user cannot have more than 50 tags';
public static readonly POSTGRES_MAINTAGS_LIMIT:string = 'DbError maintags cannot be more than 3';
public static readonly POSTGRES_OTHERTAGS_LIMIT:string = 'DbError othetags cannot be more than 15';
public static readonly POSTGRES_FINAL_TAGS_FKEY:string = 'DbError tags not found'; /*whe trying to add a not-found tags*/
public static readonly POSTGRES_FINAL_NOTES_FKEY:string = 'DbError notes not found';

public static readonly POSTGRES_NOTE_NOT_FOUND:string ='DbError note not found';
public static readonly POSTGRES_TAG_NOT_FOUND:string='DbError tag not found';
/*public static readonly POSTGRES_FINAL*/
/*
private  static getBetterSqliteError(error:any):any{
  let ret:any = error;
  if(error.message!=null){
    ret.message = AtticError.getBetterSqliteErrorString(error.message);
  }
  return ret;
}
*/

private static getBetterPostgresErrorString(errorIn:any):string{
  //let ret:any = errorIn;

  let error:string = (errorIn.message!=null) ? errorIn.message : errorIn;
  let ret=error;
  if(error!=null){

    if(error==AtticError.POSTGRES_NOTE_NOT_FOUND){
      ret = 'Note not found: please try to reload your notes list';
    }else if(error==AtticError.POSTGRES_TAG_NOT_FOUND){
      ret = 'Tag not founf: please try to reload your tags list';
    }else{
      ret = ret.replace('DbError ','');
    }
  }
  // let ret:string = error;
  // ret=ret.replace('DbError ','');
  // console.log('the ret: ');console.log(JSON.stringify(ret));console.log(JSON.stringify(ret.message));
  return ret;
}

private static getBetterPostgresError(errorIn:any):Error{
  //let ret:any = errorIn;
  // let ret:Error = new Error();
  // let error:string = (errorIn.message!=null) ? errorIn.message : errorIn;
  // if(error!=null){
  //   ret.message = error;
  //   ret.message = ret.message.replace('DbError ','');
  // }
  let ret:Error = new Error(/*AtticError.getBetterPostgresString(errorIn)*/);
  ret.message = AtticError.getBetterPostgresErrorString(errorIn);
  // let ret:string = error;
  // ret=ret.replace('DbError ','');
  console.log('the ret: ');console.log(JSON.stringify(ret));console.log(JSON.stringify(ret.message));
  return ret;
}

public static isPostgresError(errorIn:any):boolean{
  let error:string = (errorIn.message!=null) ? errorIn.message : errorIn;
  let ret:boolean = false;
  if(error==AtticError.POSTGRES_DUPLICATE_KEY_NOTES || error==AtticError.POSTGRES_DUPLICATE_KEY_NOTES_TAGS
    || error==AtticError.POSTGRES_DUPLICATE_KEY_TAGS || error==AtticError.POSTGRES_FINAL_TAGS_FKEY
    || error==AtticError.POSTGRES_MAINTAGS_LIMIT || error==AtticError.POSTGRES_OTHERTAGS_LIMIT
    || error==AtticError.POSTGRES_USER_REACHED_MAX_NOTES || error==AtticError.POSTGRES_USER_REACHED_MAX_TAGS
    || error==AtticError.POSTGRES_DUPLICATE_KEY_USERS || error==AtticError.POSTGRES_FINAL_NOTES_FKEY
    //|| error.startsWith('JsonError') no thins because is a paramter that should NEVER happen.
  ){
    ret=true;
  }
  return ret;
}

public static isPostgresErrorAdvanced(errorIn:any):boolean{
  let ret:boolean = false;
  let error:string = (errorIn.message!=null) ? errorIn.message : errorIn;
  if(error==AtticError.POSTGRES_DUPLICATE_KEY_NOTES || error==AtticError.POSTGRES_DUPLICATE_KEY_NOTES_TAGS
    || error==AtticError.POSTGRES_DUPLICATE_KEY_TAGS || error==AtticError.POSTGRES_FINAL_TAGS_FKEY
    || error==AtticError.POSTGRES_MAINTAGS_LIMIT || error==AtticError.POSTGRES_OTHERTAGS_LIMIT
    || error==AtticError.POSTGRES_USER_REACHED_MAX_NOTES || error==AtticError.POSTGRES_USER_REACHED_MAX_TAGS
    || error==AtticError.POSTGRES_DUPLICATE_KEY_USERS || error==AtticError.POSTGRES_FINAL_NOTES_FKEY
    //|| error.startsWith('JsonError') no thins because is a paramter that should NEVER happen.
    || error==AtticError.POSTGRES_NOTE_NOT_FOUND || error==AtticError.POSTGRES_TAG_NOT_FOUND
  ){
    ret=true;
  }
  return ret;
}


/**
check if the input message is a duplicate message. It will search for
notes, tags and notes_tags, not user.
*/
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


public static isTagNotFoundError(error:string):boolean{
  let ret:boolean = false;
  if(error==AtticError.POSTGRES_FINAL_TAGS_FKEY){
    ret = true;
  }
  return ret;
}

public static isNoteNotFoundError(error:string):boolean{
  let ret:boolean = false;
  if(error==AtticError.POSTGRES_FINAL_NOTES_FKEY){
    ret = true;
  }
  return ret;
}



public static getPostgresErrorArray(error:string):boolean[]{
  let ret:boolean[]=[];
  ret.push(AtticError.isDuplicateError(error));
  ret.push(AtticError.isNotesTagsLimitError(error));
  ret.push(AtticError.isUserReachedMaxError(error));
  ret.push(AtticError.isTagNotFoundError(error));
  ret.push(AtticError.isNoteNotFoundError(error));
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

public static isTagNotFoundErrorFromArray(array:boolean[]):boolean{
  return array[3];
}

public static isNoteNotFoundErrorFromArray(array:boolean[]):boolean{
  return array[4];
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
private static DUPLICATE_TAGS_ERROR='Please check that the maintags and othertags have different values';

public static getDuplicateTagsError():Error{
  return new Error(AtticError.DUPLICATE_TAGS_ERROR);
}

private static isDuplicateTagsError(errorIn:any):boolean{
  let error:string = (errorIn.message!=null) ? errorIn.message : errorIn;
  return error==AtticError.DUPLICATE_TAGS_ERROR;
}

public static getNewError(error:any):ErrData{
  let basic = (error.message!=null) ? error.message : error;
  let errorOut:ErrData;
  let errData:any;
  let isSpecific:boolean = false;

    if(AtticError.isSqliteError(basic)){
      errData=AtticError.getBetterSqliteError(error);
      isSpecific = true;
    }else if(AtticError.isPostgresErrorAdvanced(error)){
      errData = AtticError.getBetterPostgresError(error);
      isSpecific = true;
    }else if(AtticError.isDuplicateTagsError(error)){
      errData = error;
      isSpecific=true;
    }
    else if(AtticError.isNetworkError(error)){
      errData=AtticError.getBetterNetworkError(error);
      isSpecific = true;
    }
  //}
  errorOut = new ErrData({errorIn:errData, isSpecific:isSpecific});
  return errorOut;
}


  public static getNewError2(error:any):ErrData{
    console.log('error in is'+JSON.stringify(error));
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
      }else if(AtticError.isPostgresErrorAdvanced(error.message)){
        errData = AtticError.getBetterPostgresError(error);
        isSpecific = true;
        //console.log('is postgres');
      }else if(AtticError.isDuplicateTagsError(error.message)){
        errData = error;
        isSpecific=true;
      }
    }
    if(!isSpecific){
      if(AtticError.isNetworkError(error)){
        errData=AtticError.getBetterNetworkError(error);
        isSpecific = true;
      }
    }
    //////
    // if(!isSpecific){
    //   if(AtticError.isPostgresError(error)){
    //     errData = AtticError.getBetterPostgresError(error.message);
    //     isSpecific = true;
    //     console.log('is postgres');
    //   }
    //}
    errorOut = new ErrData({errorIn:errData, isSpecific:isSpecific});
    // console.log('the error out is:');console.log(JSON.stringify(errorOut));
    return errorOut;
  }

}


export class ErrData{

  isSpecific: boolean = false;
  error: any;

  constructor(param:{errorIn:any, isSpecific:boolean}){
    this.error=param.errorIn;
    this.isSpecific=param.isSpecific;
  }


  // public static NewErrData(errorIn:any, isSpecific:boolean):ErrData{
  //   let err:ErrData = new ErrData();
  //   err.error=errorIn;
  //   err.isSpecific = isSpecific;
  //   return err;
  // }

}
