export class UserSummary{
  userid: string;
  data: data;
  constructor(){
    this.data = new data();
  }
}

class data{
  notescount: number;
  tagscount: number;
  logscount: number;
  isfree: boolean;
  availablenotes?: number;
  availabletags?: number;
}
