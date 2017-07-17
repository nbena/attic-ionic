export class UserSummary{
  userid: string;
  data: {
    notescount: number;
    tagscount: number;
    logscount: number;
    isfree: boolean;
    availablenotes?: number;
    availabletags?: number;
  }
}
