import { AfterViewChecked, Component, Input } from '@angular/core';
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
export class MessagesComponent implements AfterViewChecked {
  @Input() messages: Message[] = [];
  @Input() username: string | undefined;
  @Input() scrollautomatic: any;
  // messageDivVisibility: { [key: number]: boolean } = {}; //for options div
  // messageDiv1Visibility: { [key: number]: boolean } = {}; //for heart
  // ngOnInit() {
  //   // Retrieve the messageIdToHighlight from the route state
  //   const messageIdToHighlight = this.route.snapshot.state.messageIdToHighlight;
  //   if (messageIdToHighlight) {
  //     // Scroll to the message with the given ID and highlight it
  //     const messageElement = document.getElementById(messageIdToHighlight);
  //     if (messageElement) {
  //       messageElement.classList.add('highlighted-message'); // Apply your CSS class for highlighting
  //       messageElement.scrollIntoView({
  //         behavior: 'smooth',
  //         block: 'start',
  //         inline: 'nearest'
  //       });
  //     }
  //   }
  // }
  // messageDiv2Visibility: { [key: number]: boolean } = {}; // for members
  constructor(public service: UsersService, private matdialog: MatDialog, public msgservice: MessageService) {
  }
  ngOnInit(): void {

  }
  ngAfterViewChecked() {
   
      const messageIdToHighlight = this.username;

      if (messageIdToHighlight) {
        const spanClass = '.targetmsg-' + messageIdToHighlight;
        const selectedSpan = document.querySelector(spanClass) as HTMLElement;

        if (selectedSpan) {
          selectedSpan.classList.add('highlighted-message');
          selectedSpan.scrollIntoView({
            behavior: 'smooth',
            block: 'start',
            inline: 'nearest'
          });
         // this.scrollautomatic=false;
        }
      }
    
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
    if (this.service.isGroupChat) {
      this.service.getLikeMembersGrp(megid).subscribe({
        next: (data) => {
          this.service.likemembers = data;
          this.matdialog.open(DialogBodyComponent, {
            width: '350px',
            position: { top: '600px',left:'200px' },
          })
        },
        error: (error) => {
        }
      });
    }
    else {
      this.service.getLikeMembers(megid).subscribe({
        next: (data) => {
          this.service.likemembers = data;
          this.matdialog.open(DialogBodyComponent, {
            width: '350px',
            position: {
              top: '100px',
              left: '500px'
            },
          })
        },
        error: (error) => {
          if (error.status === 400) {
            console.error("By refreshing the page you got disconnected");
          }
        }
      });
      console.log("enter name");
      console.log("enter the name");
      console.log("enter hire name");
    }


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


  LikeMsg(messageid: any, msgid: any, indexid: any) {
    debugger;
    if (this.service.isGroupChat) {
      let newValue: any;
      if (this.msgservice.messageDiv1Visibility[msgid]) {// fro dislike purpose
        this.msgservice.messageDiv1Visibility[msgid] = false;
        const spanClass = '.count-' + messageid;
        const selectedSpan = document.querySelector(spanClass) as HTMLElement;
        const divClass = '.logodiv-' + messageid;
        const selecteddiv = document.querySelector(divClass) as HTMLElement;

        let likename = selectedSpan.getAttribute('likename');
        if (selectedSpan) {
          const currentValue = parseInt(selectedSpan.innerText);
          if (currentValue === 1 && likename === this.service.myName) {
            newValue = currentValue - 1;
            selectedSpan.innerText = newValue.toString();
            selecteddiv.classList.add('d-none');
            this.msgservice.messageDiv2Visibility[msgid] = false;
          } else {
            newValue = currentValue - 1;
            selectedSpan.innerText = newValue.toString();
          }
        }

        //  this.msgservice.messageDiv2Visibility[msgid]=false;
        this.service.dislikemessageGrp(messageid, this.service.myName).subscribe({
          next: (response) => {

          },
          error: (error) => {
            console.error('Error loading private chats', error);

          }
        })
      }
      else if (msgid === 0) {//when reaction is already done in chats
        const spanClass = '.heart-' + messageid;
        const selectedSpan = document.querySelector(spanClass) as HTMLElement;

        const spanClasscount = '.count-' + messageid;
        const selectedSpancount = document.querySelector(spanClasscount) as HTMLElement;
        const currentValue = parseInt(selectedSpancount.innerText);

        const divClass = '.logodiv-' + messageid;
        const selecteddiv = document.querySelector(divClass) as HTMLElement;

        if (selectedSpancount.getAttribute('likename') === this.service.myName) //for disliking on same name
        {
          const value = currentValue - 1;
          selectedSpancount.innerText = value.toString();
          this.msgservice.messageDiv1Visibility[indexid] = !this.msgservice.messageDiv1Visibility[indexid];
          if (parseInt(selectedSpancount.innerText) === 0) {
            selecteddiv.classList.add('d-none');
            selectedSpan.classList.add('d-none');
          }
          selectedSpancount.setAttribute('likename', 'anonym');
          this.service.dislikemessageGrp(messageid, this.service.myName).subscribe({
            next: (response) => {

            },
            error: (error) => {
              console.error('Error loading private chats', error);
            }
          })
        }
        else {
          if (selectedSpancount.getAttribute('likename') !== this.service.myName) {
            selecteddiv.classList.remove('d-none');
            this.msgservice.messageDiv1Visibility[indexid] = !this.msgservice.messageDiv1Visibility[indexid];
            selectedSpancount.setAttribute('likename', this.service.myName);
          }
          const value = currentValue + 1;
          selectedSpancount.innerText = value.toString();
          selectedSpan.classList.remove('d-none');
          this.service.likemessageGrp(messageid, this.service.myName).subscribe({
            next: (response) => {
              this.service.SendLikeResGrp();
            },
            error: (error) => {
              console.error('Error loading private chats', error);
            }
          })
        }

      }
      else { //here when there is no recation intially and for like purpose
        const spanClass = '.count-' + messageid;
        const selectedSpan = document.querySelector(spanClass) as HTMLElement;
        const divClass = '.logodiv-' + messageid;
        const selecteddiv = document.querySelector(divClass) as HTMLElement;
        selecteddiv.classList.remove('d-none');
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

        this.service.likemessageGrp(messageid, this.service.myName).subscribe({
          next: (response) => {
            this.service.SendLikeResGrp();
          },
          error: (error) => {
            console.error('Error loading private chats', error);

          }
        })
      }
    }


    else {
      let newValue: any;
      if (this.msgservice.messageDiv1Visibility[msgid]) { //Here it will come only when there is no reaction from this user or from myName at time of only dislike
        this.msgservice.messageDiv1Visibility[msgid] = false;
        const spanClass = '.count-' + messageid;
        const selectedSpan = document.querySelector(spanClass) as HTMLElement;
        let likename = selectedSpan.getAttribute('likename');
        const divClass = '.logodiv-' + messageid;
        const selecteddiv = document.querySelector(divClass) as HTMLElement;
        if (selectedSpan) {
          const currentValue = parseInt(selectedSpan.innerText);
          if (currentValue === 1 && likename === this.service.myName) {
            newValue = currentValue - 1;
            selectedSpan.innerText = newValue.toString();
            this.msgservice.messageDiv2Visibility[msgid] = false;
            selecteddiv.classList.add('d-none');
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

        const divClass = '.logodiv-' + messageid;
        const selecteddiv = document.querySelector(divClass) as HTMLElement;


        const currentValue = parseInt(selectedSpancount.innerText);

        if (selectedSpancount.getAttribute('likename') === this.service.myName) //for disliking on same name
        {
          const value = currentValue - 1;
          selectedSpancount.innerText = value.toString();
          this.msgservice.messageDiv1Visibility[indexid] = !this.msgservice.messageDiv1Visibility[indexid];
          if (parseInt(selectedSpancount.innerText) === 0) {
            selecteddiv.classList.add('d-none');
            selectedSpan.classList.add('d-none');
          }
          selectedSpancount.setAttribute('likename', 'anonym');
          this.service.dislikemessage(messageid, this.service.myName).subscribe({
            next: (response) => {
              this.service.SendLikeResBymsgid(messageid, 0);
            },
            error: (error) => {
              console.error('Error loading private chats', error);
            }
          })
        }
        else {
          if (selectedSpancount.getAttribute('likename') !== this.service.myName) {
            selecteddiv.classList.remove('d-none');
            this.msgservice.messageDiv1Visibility[indexid] = !this.msgservice.messageDiv1Visibility[indexid];
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

        const divClass = '.logodiv-' + messageid;
        const selecteddiv = document.querySelector(divClass) as HTMLElement;

        selecteddiv.classList.remove('d-none');
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

}

//for new chatApp