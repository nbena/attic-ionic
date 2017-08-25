/*
Very easy class that provides objects to deal with authentication.
*/

/**
basic class with:
  <pre>
  userid:string;
  password:string;
  </pre>
*/
export class User{
  userid: string;
  password: string;

  constructor(userId: string, password: string){
    this.userid = userId;
    this.password = password;
  }


}
