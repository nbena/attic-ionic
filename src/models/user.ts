/*
Very easy class that provides objects to deal with authentication.
*/
export class User{
  userId: string;
  password: string;

  constructor(userId: string, password: string){
    this.userId = userId;
    this.password = password;
  }


}
