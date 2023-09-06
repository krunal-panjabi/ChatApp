import { Component, Input , ElementRef, ViewChild, AfterViewInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MessageService } from 'src/app/message.service';
import { Message } from 'src/app/Models/message';
import { UsersService } from 'src/app/users.service';
import { DialogBodyComponent } from '../dialog-body/dialog-body.component';

@Component({
  selector: 'app-messages',
  templateUrl: './messages.component.html',
  styleUrls: ['./messages.component.css']
})
export class MessagesComponent implements AfterViewInit{
  @ViewChild('messageContainer') messageContainer!: ElementRef;
  private prevScrollHeight = 0;
@Input() messages:Message[]=[];


ngAfterViewInit() {
  this.scrollToBottom();
}

scrollToBottom() {
  const container = this.messageContainer.nativeElement;
  container.scrollTop = container.scrollHeight - this.prevScrollHeight;
  this.prevScrollHeight = container.scrollHeight;
}
// messageDivVisibility: { [key: number]: boolean } = {}; //for options div
// messageDiv1Visibility: { [key: number]: boolean } = {}; //for heart
// messageDiv2Visibility: { [key: number]: boolean } = {}; // for members
constructor(public service:UsersService,private matdialog:MatDialog,public msgservice:MessageService,){ 

 

}
closediv(mesaageId:number){
  this.msgservice.messageDivVisibility[mesaageId] = false;
}
togglediv(mesaageId:number)
{
  if (this.msgservice.messageDivVisibility[mesaageId]) 
  { this.msgservice.messageDivVisibility[mesaageId] = false; return; }

this.msgservice.messageDivVisibility[mesaageId] = true;
Object.keys(this.msgservice.messageDivVisibility).forEach(key=>{
  const numerickey=parseInt(key);
if(!isNaN(numerickey) && numerickey!==mesaageId){
  this.msgservice.messageDivVisibility[numerickey]=false;
}
});
}
openDialogue(megid:any)
{
  this.service.getLikeMembers(megid).subscribe({
    next: (data) => {
      this.service.likemembers = data;
      this.matdialog.open(DialogBodyComponent,{
        width:'350px',
        position:{top:'400px'},
      })
    },
    error: (error) => {
      if (error.status === 400) {
        console.error("By refreshing the page you got disconnected");
      }
    }
  });

}
togglePdiv(mesaageId:number)
{
  // this.messageDiv2Visibility[mesaageId]=!this.messageDiv2Visibility[mesaageId];
  // Object.keys(this.messageDiv2Visibility).forEach(key=>{
  //   const numerickey=parseInt(key);
  // if(!isNaN(numerickey) && numerickey!==mesaageId){
  //   this.messageDiv2Visibility[numerickey]=false;
  // }
  // });
}
closePdiv(mesaageId:number)
{
// this.messageDiv2Visibility[mesaageId]=false;
}

DeleteMsg(messageid:any)
{
  console.log("for delete message");
}
Like1Msg(messageid:any,msgid:any)
{
  if(this.msgservice.messageDivVisibility[msgid])
  {
    this.msgservice.messageDivVisibility[msgid]=false;
    return;
  }
  this.msgservice.messageDivVisibility[msgid]=true;
}


LikeMsg(messageid:any,msgid:any)
{ debugger;
 
  if(this.msgservice.messageDiv1Visibility[msgid]){ //when the heart is already there and no other message is send
  this.msgservice.messageDiv1Visibility[msgid]=false;
  this.service.dislikemessage(messageid,this.service.myName).subscribe({
    next:(response)=>{
      this.service.SendLikeRes(msgid,0);
    },
    error: (error) => {
      console.error('Error loading private chats', error);

    }
  })
  return;
}
else if(msgid===0)
{  
const spanClass = '.heart-' + messageid;
const selectedSpan = document.querySelector(spanClass) as HTMLElement; //if has d-none than like the message or else dislike the message

if (selectedSpan) {
  if (!selectedSpan.classList.contains('d-none')) {
    selectedSpan.classList.add('d-none');
    this.service.dislikemessage(messageid,this.service.myName).subscribe({
      next:(response)=>{
        this.service.SendLikeResBymsgid(messageid,0);
      },
      error: (error) => {
        console.error('Error loading private chats', error);
  
      }
    })
  } else {
    selectedSpan.classList.remove('d-none');
    this.service.likemessage(messageid,this.service.myName).subscribe({
      next:(response)=>{
        this.service.SendLikeResBymsgid(messageid,1);
      },
      error: (error) => {
        console.error('Error loading private chats', error);
      }
    })
  }
}
 
}
else{
  this.msgservice.messageDiv1Visibility[msgid]=true;
 // this.msgservice.messageDiv2Visibility[msgid]={count:0};

  this.service.likemessage(messageid,this.service.myName).subscribe({
    next:(response)=>{
      this.service.SendLikeRes(msgid,1);
    },
    error: (error) => {
      console.error('Error loading private chats', error);

    }
  })
}
}
 
}

//for new chatApp