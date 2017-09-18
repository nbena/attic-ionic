import {Const} from '../public/const';
export class UserSummary{
  userid: string;
  data: data;
  constructor(){
    this.data = new data();
  }

  public equals(other:UserSummary):boolean{
    return UserSummary.userEquals(this, other);
  }

  public static userEquals(arg0:UserSummary, arg1:UserSummary):boolean{
    let ret:boolean = true;
    if(arg0 == null || arg1 == null){ret=false};
    if(arg0.userid!=arg1.userid){ret=false;}
    if(ret){
      ret = data.dataEquals(arg0.data, arg1.data);
    }
    return ret;
  }

  public makeAvailable(){
    if(this.data.isfree){
      this.data.availablenotes = Const.NOTES_LIMIT-this.data.notescount;
      this.data.availabletags = Const.TAGS_LIMIT-this.data.tagscount;
    }else{
      this.data.availablenotes = Number.POSITIVE_INFINITY;
      this.data.availabletags = Number.POSITIVE_INFINITY;
    }
  }

}

class data{
  notescount: number;
  tagscount: number;
  logscount: number;
  isfree: boolean;
  availablenotes?: number;
  availabletags?: number;

  public equals(other:data):boolean{
    return data.dataEquals(this, other);
  }

  public static dataEquals(arg0:data, arg1:data):boolean{
    let ret:boolean = true;
    if(arg0.notescount!=arg1.notescount){ret=false;}
    if(arg0.tagscount!=arg1.tagscount){ret=false;}
    if(arg0.logscount!=arg1.logscount){ret=false;}
    if(arg0.isfree!=arg1.isfree){ret=false;}
    if((arg0.availabletags==null || arg1.availabletags!=null) ||
      (arg1.availabletags==null || arg0.availabletags!=null)
    ){ret=false;}
    if((arg0.availablenotes==null || arg1.availablenotes!=null) ||
      (arg1.availablenotes==null || arg0.availablenotes!=null)
    ){ret=false;}
    if(arg0.availabletags!=null && arg1.availabletags!=null &&
      arg0.availabletags!=arg1.availabletags){ret=false;}
    if(arg0.availablenotes!=null && arg1.availablenotes!=null &&
      arg0.availablenotes!=arg1.availablenotes){ret=false;}
    return ret;
  }
}
