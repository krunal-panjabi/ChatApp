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
export class MessagesComponent {
  @Input() messages: Message[] = [];
  // messageDivVisibility: { [key: number]: boolean } = {}; //for options div
  // messageDiv1Visibility: { [key: number]: boolean } = {}; //for heart
  // messageDiv2Visibility: { [key: number]: boolean } = {}; // for members
  constructor(public service: UsersService, private matdialog: MatDialog, public msgservice: MessageService) {
  }
  closediv(mesaageId: number) {
    this.msgservice.messageDivVisibility[mesaageId] = false;
  }
  togglediv(mesaageId: number) {
    if (this.msgservice.messageDivVisibility[mesaageId]) { this.msgservice.messageDivVisibility[mesaageId] = false; return; }

    this.msgservice.messageDivVisibility[mesaageId] = true;
    Object.keys(this.msgservice.messageDivVisibility).forEach(key => {
      const numerickey = parseInt(key);
      if (!isNaN(numerickey) && numerickey !== mesaageId) {
        this.msgservice.messageDivVisibility[numerickey] = false;
      }
    });
  }
  openDialogue(megid: any) {
    this.service.getLikeMembers(megid).subscribe({
      next: (data) => {
        this.service.likemembers = data;
        this.matdialog.open(DialogBodyComponent, {
          width: '350px',
          position: { top: '400px' },
        })
      },
      error: (error) => {
        if (error.status === 400) {
          console.error("By refreshing the page you got disconnected");
        }
      }
    });

  }
  togglePdiv(mesaageId: number) {
    // this.messageDiv2Visibility[mesaageId]=!this.messageDiv2Visibility[mesaageId];
    // Object.keys(this.messageDiv2Visibility).forEach(key=>{
    //   const numerickey=parseInt(key);
    // if(!isNaN(numerickey) && numerickey!==mesaageId){
    //   this.messageDiv2Visibility[numerickey]=false;
    // }
    // });
  }
  closePdiv(mesaageId: number) {
    // this.messageDiv2Visibility[mesaageId]=false;
  }

  DeleteMsg(messageid: any) {
    console.log("for delete message");
  }
  Like1Msg(messageid: any, msgid: any) {
    if (this.msgservice.messageDivVisibility[msgid]) {
      this.msgservice.messageDivVisibility[msgid] = false;
      return;
    }
    this.msgservice.messageDivVisibility[msgid] = true;
  }


  LikeMsg(messageid: any, msgid: any,indexid:any) {
    debugger;
    let newValue: any;
    if (this.msgservice.messageDiv1Visibility[msgid]) { //Here it will come only when there is no reaction from this user or from myName at time of only dislike
      this.msgservice.messageDiv1Visibility[msgid] = false;
      const spanClass = '.count-' + messageid;
      const selectedSpan = document.querySelector(spanClass) as HTMLElement;
      let likename = selectedSpan.getAttribute('likename');
      if (selectedSpan) {
        const currentValue = parseInt(selectedSpan.innerText);
        if (currentValue === 1 && likename === this.service.myName) {
          newValue = currentValue - 1;
          selectedSpan.innerText = newValue.toString();
          this.msgservice.messageDiv2Visibility[msgid] = false;
        } else {
          newValue = currentValue - 1;
          selectedSpan.innerText = newValue.toString();
        }
      }

      //  this.msgservice.messageDiv2Visibility[msgid]=false;
      this.service.dislikemessage(messageid, this.service.myName).subscribe({
        next: (response) => {
          this.service.SendLikeRes(msgid, 0, messageid, newValue);
        },
        error: (error) => {
          console.error('Error loading private chats', error);

        }
      })
      return;
    }
    else if (msgid === 0) //here it will come when the reaction is already donme
    {
      const spanClass = '.heart-' + messageid;
      const selectedSpan = document.querySelector(spanClass) as HTMLElement; //if has d-none than like the message or else dislike the message

      const spanClasscount = '.count-' + messageid;
      const selectedSpancount = document.querySelector(spanClasscount) as HTMLElement;
      const currentValue = parseInt(selectedSpancount.innerText);
    
      if(selectedSpancount.getAttribute('likename')===this.service.myName) //for disliking on same name
      {
        const value = currentValue - 1;
        selectedSpancount.innerText = value.toString();
        this.msgservice.messageDiv1Visibility[indexid]=true;
        if(parseInt(selectedSpancount.innerText) === 0)
        {
          selectedSpan.classList.add('d-none');
        }
        selectedSpancount.setAttribute('likename', 'anonym');
        this.service.dislikemessage(messageid, this.service.myName).subscribe({
          next: (response) => {
            this.service.SendLikeResBymsgid(messageid,0);
          },
          error: (error) => {
            console.error('Error loading private chats', error);

          }
        })
      }
      else{
        if(selectedSpancount.getAttribute('likename')!==this.service.myName)
          {
           this.msgservice.messageDiv1Visibility[indexid]=true;
           selectedSpancount.setAttribute('likename', this.service.myName);
          }
          const value = currentValue + 1;
          selectedSpancount.innerText = value.toString();
          selectedSpan.classList.remove('d-none');
          this.service.likemessage(messageid, this.service.myName).subscribe({
            next: (response) => {
              this.service.SendLikeResBymsgid(messageid, 1);
            },
            error: (error) => {
              console.error('Error loading private chats', error);
            }
          })
      }

    }


    else {  //Here it will come only when there is no reaction from this user or from myName at time of only like
      const spanClass = '.count-' + messageid;
      const selectedSpan = document.querySelector(spanClass) as HTMLElement;
      if (selectedSpan) {
        const currentValue = parseInt(selectedSpan.innerText);
        if (currentValue === 0) {
          selectedSpan.innerText = '1';
          newValue = 1;
          selectedSpan.setAttribute('likename', this.service.myName);
        } else {
          newValue = currentValue + 1;
          selectedSpan.innerText = newValue.toString();
        }
      }

      this.msgservice.messageDiv1Visibility[msgid] = true;
      this.msgservice.messageDiv2Visibility[msgid] = true;
      // this.msgservice.messageDiv2Visibility[msgid]={count:0};

      this.service.likemessage(messageid, this.service.myName).subscribe({
        next: (response) => {
          this.service.SendLikeRes(msgid, 1, messageid, newValue);
        },
        error: (error) => {
          console.error('Error loading private chats', error);

        }
      })
    }
  }

}

//for new chatApp