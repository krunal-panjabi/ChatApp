import { Component } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { GroupChatComponent } from '../chat/group-chat/group-chat.component';
import { PrivateChatsComponent } from '../chat/private-chats/private-chats.component';
import { MessageService } from '../message.service';
import { UsersService } from '../users.service';

@Component({
  selector: 'app-notification',
  templateUrl: './notification.component.html',
  styleUrls: ['./notification.component.css']
})

export class NotificationComponent {
constructor(public service:UsersService,public msgservice:MessageService,private modalService:NgbModal, private router: Router,private dialogRef: MatDialogRef<NotificationComponent>){}
toggle(msg:any){
  const divClass = '.user-' + msg;
  const selecteddiv = document.querySelector(divClass) as HTMLElement;
  selecteddiv.classList.add('d-none');
  this.service.deletenotimsg(msg).subscribe({
    next:(data)=>{
      console.log("successful");
    }
  })
}

fortoggleprivatechat(name:string,msgid:any,userImage:any){
  this.router.navigateByUrl('/chat');
  this.service.isGroupChat=false;
  this.service.isgeneral=false;
  this.service.toUser=name;
  this.msgservice.messageDiv1Visibility={};
  this.msgservice.messageDiv2Visibility={};
  this.service.loadprivatechats(name);
  const modalRef=this.modalService.open(PrivateChatsComponent);
  modalRef.componentInstance.toUser=name;
  modalRef.componentInstance.msgid=msgid;
  modalRef.componentInstance.image=userImage;
  modalRef.componentInstance.scrollautomatic=true;
  this.dialogRef.close();
}
fortogglegrpchat(name:string,msgid:any){
  this.router.navigateByUrl('/chat');
  this.service.isgeneral=false;
  this.service.isGroupChat=true;
  this.service.loadgrpchats(name);
  this.service.loadgrpmembers(name).subscribe({
        next:(data)=>{
          this.service.grpmembers=data;
        },
        error:(error)=>{
          console.error('Error loading members chats', error);
        }
      });
  const modalRef=this.modalService.open(GroupChatComponent);
  this.msgservice.messageDiv1Visibility={};
  this.msgservice.messageDiv2Visibility={};
  modalRef.componentInstance.GroupName=name;
  modalRef.componentInstance.msgid=msgid;
  this.dialogRef.close();
}
AcceptReq(name:string,msgid:any)
{
  debugger;
  const divClass = '.notimessage-' + msgid;
  const selecteddiv = document.querySelector(divClass) as HTMLElement;

  const divClass1 = '.acceptmessage-' + msgid;
  const selecteddiv1 = document.querySelector(divClass1) as HTMLElement;
  
  selecteddiv.classList.add('d-none');
  selecteddiv1.classList.remove('d-none');

  this.service.Accepted(name,msgid).subscribe({
    next:(data)=>{
      this.service.acceptrequest(name);
      this.service.getAllUsers().subscribe({
        next:(data)=>{
          this.service.offlineUsers=data;
          this.service.usernamelist=data;
        }
     
      });
      
    }
  })
}
RejectReq(name:string,msgid:any)
{
  const divClass = '.notimessage-' + msgid;
  const selecteddiv = document.querySelector(divClass) as HTMLElement;

  const divClass1 = '.declinemessage-' + msgid;
  const selecteddiv1 = document.querySelector(divClass1) as HTMLElement;
  
  selecteddiv.classList.add('d-none');
  selecteddiv1.classList.remove('d-none');

  this.service.Declined(name,msgid).subscribe({
    next:(data)=>{
      this.service.declinerequest(name);
      this.service.getAllUsers().subscribe({
        next:(data)=>{
          this.service.offlineUsers=data;
          this.service.usernamelist=this.service.offlineUsers;
        }
      });
      
    }
  })
}
// openGroupChat(GroupName:string){
//   this.service.isgeneral=false;
//   this.service.isGroupChat=true;
//   const modalRef=this.modalService.open(GroupChatComponent);
//   this.msgservice.messageDiv1Visibility={};
//   this.msgservice.messageDiv2Visibility={};
//   modalRef.componentInstance.GroupName=GroupName;
//   this.service.loadgrpchats(GroupName);
//   this.service.loadgrpmembers(GroupName).subscribe({
//     next:(data)=>{
//       this.service.grpmembers=data;
//     },
//     error:(error)=>{
//       console.error('Error loading members chats', error);
//     }
//   });
// }

}
