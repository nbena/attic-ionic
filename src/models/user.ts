/*
Very easy class that provides objects to deal with authentication.
*/
export class User{
  e_mail: string;
  password: string;

  constructor(e_mail: string, password: string){
    this.e_mail = e_mail;
    this.password = password;
  }


}
