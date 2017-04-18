/*
Very easy class that provides objects to deal with authentication.
*/
export class User{
  userid: string;
  password: string;

  constructor(userId: string, password: string){
    this.userid = userId;
    this.password = password;
  }


}
