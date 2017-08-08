import { Injectable } from '@angular/core';
import { Http, Headers } from '@angular/http';
/* importing auth because I need the token. */
// import { Auth } from '../providers/auth';
import { Const,/* PostgresError, SqliteError,*/ DbAction } from '../public/const';
import { NoteBarebon, NoteFull, NoteMin, NoteExtraMin } from '../models/notes';
import { TagExtraMin, TagFull, TagSQLite } from '../models/tags';
import { ToastController, AlertController } from 'ionic-angular';



export class Utils{


static shouldUseDb(newtorkAvailable:boolean, itemAvailable:boolean, force:boolean/*, isSynching:boolean*/):boolean{
  let res:boolean = true;
  if(force){
    /*if I'm forced to use the network not use DB*/
    res = false;
  }
  if (!itemAvailable){
    /*if there aren't item in the DB, I'm not going to use it.*/
    res = false;
  }

  // else{
  //   res = true;
  // }

  /*else is not needed.*/
  if (!newtorkAvailable){
    /*but if there is no network I'm force to use the DB.*/
    res = true;
  }
  // if(isSynching){
  //   res = true;
  // }else{
  //   res = false;
  // }
  return res;
}





public static arrayDiff<T>(arg0:T[], arg1:T[], cmp:(a:T, b:T)=>number):T[]{
  return arg0.filter(item=>{
    return Utils.indexOfCmp(arg1, item, cmp);
  })
}

public static indexOfCmp<T>(arg0:T[], b:T, cmp:(a:T, b:T)=>number):number{
  let index:number = -1;
  if(arg0!=null){
    for(let i=0;i<arg0.length;i++){
      if(cmp(arg0[i], b)==0){
        index=i;
        i=arg0.length;
      }
    }
  }
  return index;
}

public static binaryArrayDiff<T>(arg0:T[], arg1:T[], cmp:(a:T, b:T)=>number):T[]{
  return arg0.filter(item=>{return Utils.binarySearch(arg1, item, cmp)});
}

// static arrayDiff(arg0: any[], arg1: any[]){
//   return arg0.filter(function(el){
//       return arg1.indexOf(el)<0;
//     })
//   }
//
//   static arrayDiff2(arg0: TagExtraMin[], arg1: TagExtraMin[]){
//     return arg0.filter(function(el){
//         return arg1.indexOf(el)<0;
//       })
//   }
//
//   static arrayDiff3(arg0: TagExtraMin[], arg1: TagExtraMin[]){
//     // let k=0;
//     let array: TagExtraMin[];
//     // for(let i=0;i<arg0.length;i++){
//     //   for(let j=0;j<arg1.length;j++){
//     //     console.log("matching: "+arg0[i]._id+" and "+arg1[j]._id, "? "+arg0[i]._id!=arg1[j]._id);
//     //     if(arg0[i]._id!=arg1[j]._id){
//     //       array.push(arg0[i]);
//     //
//     //     }
//
// console.log("arg0 length is "+arg0.length);
// console.log("arg1 length is "+arg1.length);
// for(let i=0;i<arg0.length;i++){
//   console.log(i);
//   //console.log(j);
//         let obj = arg0[i];
//         let bool = true;
//         for(let j=0;j<arg1.length;j++){
//                 if(obj.title==arg1[j].title){
//                         bool=false;
//                 }
//         }
//         if(bool){
//                 array.push(obj);
//                 bool = false;
//         }
// }
// console.log("the result is: ");
// console.log(array.length.toString());
// return array;
//       }
    //}
    // return array;

    // console.log(JSON.stringify(arg0)+"\n"+JSON.stringify(arg1));
    // return arg0.filter(x => arg1.indexOf(x) == -1);
  //}

// static pushAll(arg0: TagExtraMin[], arg1: TagExtraMin[]){
//   for(let i of arg1){
//     arg0.push(i);
//   }
//
// }
//
static pushAllJSON(arg0: TagExtraMin[], arg1: string[]){
  for(let i of arg1){
    arg0.push(JSON.parse(i));
  }
}

//TODO delete this and use the one in notes.
static myIndexOf(arg0: TagExtraMin[], arg1: TagExtraMin): number{
  // console.log('the first string is');
  // console.log(JSON.stringify(arg0));
  let i = -1;
  for(let j=0;j<arg0.length;j++){
    if(arg0[j].title.localeCompare(arg1.title)==0){
      i=j;
      j=arg0.length;
    }
  }
  return i;
}

// static assign(arg0: TagExtraMin[], arg1: TagExtraMin[]){
//   for(let tag of arg0){
//     tag
//   }
// }

static fromTagsToString(tags: TagExtraMin[]):string[]{
  let result:string[]=tags.map((currentValue: TagExtraMin):string=>{
    return currentValue.title;
  })
  return result;
}




//generic utility method for a smart insert into a generic array.
//surely we assume array is already sorted.
 public static binaryArrayInsert<T>(array: T[], item: T, cmp: ((a,b)=>number)):T[]{
     let returned: T[];
     let start: number, end: number, current:number, cmpValue;
     start = 0;
     end = array.length;
     current = Math.floor((start+end)/2);
     while(end>start){
       cmpValue = cmp(item, array[current]);
       if(cmpValue<0){
         end = current;
       }else{
         start = current+1;
       }
       current = Math.floor((start+end)/2);
   }
   array.splice(current, 0, item);
   return array;
 }



 public static binaryArrayInsertNoDuplicate<T>(array: T[], item: T, cmp: ((a,b)=>number)):T[]{
     let returned: T[];
     let start: number, end: number, current:number, cmpValue;
     let found:boolean = false;
     start = 0;
     end = array.length;
     current = Math.floor((start+end)/2);
     while(end>start){
       cmpValue = cmp(item, array[current]);
       if(cmpValue<0){
         end = current;
       }
       else if (cmpValue==0){
         found = true;
         break;
       }
       else{
         start = current+1;
       }
       current = Math.floor((start+end)/2);
   }
   if(!found){
     console.log('not found');
     array.splice(current, 0, item);
   }
   else{console.log('found');}
   return array;
 }

 public static binarySearch<T>(array: T[], item: T, cmp: ((a:T,b:T)=>number)):number{
   let returned:number=-1;
   let start:number, end:number, current:number, cmpValue;
   start = 0;
   end = array.length;
   current = Math.floor((start+end)/2);
   while(end>start){
     cmpValue=cmp(item, array[current]);
     if(cmpValue==0){
       returned = current;
       start = end+1;
     }else if(cmpValue<0){
       end=current;
     }else{
       start = current+1;
     }
     current = Math.floor((start+end)/2);
   }
   return returned;
 }



 // public static binarySearch<T>(array: T[], item: T, cmp: ((a,b)=>number)):number{
 //     let returned: T[];
 //     let start: number, end: number, current:number, cmpValue;
 //     start = 0;
 //     end = array.length;
 //     current = Math.floor((start+end)/2);
 //     while(end>start){
 //       cmpValue = cmp(item, array[current]);
 //       if(cmpValue<0){
 //         end = current;
 //       }else if(cmpValue>0){
 //         start = current+1;
 //       }else{
 //         break;
 //       }
 //       current = Math.floor((start+end)/2);
 //   }
 //   if(end<start || start>end){
 //     return -1;
 //   }
 //   return current;
 // }



 public static getSynchingError(action:DbAction.DbAction):string{
   let result:string = 'cannot ';
   result+=DbAction.getHumandReadableAction(action);
   result+='while there is synching in action';
   return result;
 }

 public static getFullObjectNote(arg0:NoteFull[], arg1:NoteExtraMin[]):NoteFull[]{
   let array:NoteFull[]=[];
   if(arg0!=null){
     array=arg1.map(obj=>{
       let index:number;
       index=Utils.indexOfCmp(arg0, obj, NoteExtraMin.ascendingCompare);
       return arg0[index];
     })
   }
   return array;
 }

 public static getFullObjectTag(arg0:TagFull[], arg1:NoteExtraMin[]):TagFull[]{
   let array:TagFull[]=[];
   if(arg0!=null){
     array=arg1.map(obj=>{
       let index:number;
       index=Utils.indexOfCmp(arg0, obj, TagExtraMin.ascendingCompare);
       return arg0[index];
     })
   }
   return array;
 }



 public static binaryGetFullObjectNote(arg0:NoteFull[], arg1:NoteExtraMin[]):NoteFull[]{
   let array:NoteFull[]=[];
   if(arg0!=null){
     array=arg1.map(obj=>{
       let index:number;
       index=Utils.binarySearch(arg0, obj, NoteExtraMin.ascendingCompare);
       return arg0[index];
     })
   }
   return array;
 }

 public static binaryGetFullObjectTag(arg0:TagFull[], arg1:NoteExtraMin[]):TagFull[]{
   let array:TagFull[]=[];
   if(arg0!=null){
     array=arg1.map(obj=>{
       let index:number;
       index=Utils.binarySearch(arg0, obj, TagExtraMin.ascendingCompare);
       return arg0[index];
     })
   }
   return array;
 }







}
