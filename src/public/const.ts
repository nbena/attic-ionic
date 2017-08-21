

export namespace FilterNs{
  export enum Filter{
    Tags,
    // MainTags,
    // OtherTags,
    Text,
    Title,
    None
  }
  export function toString(input:Filter):string{
    let res:string;
    switch(input){
      case Filter.None:
        res='None';break;
      case Filter.Text:
        res='Text';break;
      case Filter.Title:
        res='Title';break;
      case Filter.Tags:
        res='Tags';break;
    }
    return res;
  }
}

// export enum Table{
//   Notes,
//   Tags,
//   NotesToSave,
//   TagsToSave
// }

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


export namespace DbActionNs {
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

  export function getHumandReadableAction(action: DbAction):string{
    let result:string;
    switch (action){
      case DbAction.remove_tag:
        /*the note to delete are in the maintags of the note.*/
        result = 'remove tag ';
        break;
      case DbAction.add_tag:
        result= 'add tag';
        break;
      case DbAction.change_text:
        result='change text';
        break;
      case DbAction.set_done:
        result='change set-done';
        break;
      case DbAction.set_link:
        result='change links';
        break;
      case DbAction.create:
      result='create items'
        break;
      case DbAction.delete:
        result='delete items';
        break;
    }
    return result;
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



// export enum WhichField{
//   Notes,
//   NotesToSave,
//   Tags,
//   TagsToSave
// }
//



export class Const{
  public static readonly API_URI = 'https://nb-attic.herokuapp.com';
//   /*public static */static enum NoteFilter {
//   TAGS, MAIN_TAGS, OTHER_TAGS
// }



  public static readonly NOTES_LIMIT = 50;
  public static readonly TAGS_LIMIT = 50;

  public static readonly CURRENTLY_SYNCHING = 'Synchronization is in progress...';
  public static readonly CURRENTLY_NOT_SYNCHING = 'No synchronization now';
}
