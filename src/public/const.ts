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

export enum Action{

  CreateNote,
  CreateTag,

  ChangeNoteTitle,
  ChangeText,
  AddMainTags,
  AddOtherTags,
  RemoveMainTags,
  RemoveOtherTags,

  ChangeTagTitle

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


}
