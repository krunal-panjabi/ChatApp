export interface Message {
    content: string;
    to?: string;
    from: string;
    time?:string;
    isdelievered?:number;
    isread?:number;
    isgrpread?:number;
    messageid?:number;
    messageLike?:number;
    count:number;
    likename?:string;
    type?:number;
 //   grpname?:string;
  }