import { Component, OnDestroy, OnInit } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { OfflineUsers } from 'src/app/Models/OfflineUsers';
import { UsersService } from 'src/app/users.service';
import { GroupCreateComponent } from '../group-create/group-create.component';
import { PrivateChatsComponent } from '../private-chats/private-chats.component';
import { GroupChatComponent } from '../group-chat/group-chat.component';

@Component({
  selector: 'app-chatpage',
  templateUrl: './chatpage.component.html',
  styleUrls: ['./chatpage.component.css']
})
export class ChatpageComponent implements OnInit,OnDestroy {

  constructor(public service : UsersService,private modalService:NgbModal) { }
  
 ngOnDestroy(): void {
  alert('destroyed');
   this.service.stopChatConnection();
 }

  ngOnInit(): void {
    
    this.service.getAllUsers();
    this.service.getAllGroups(this.service.myName);
    this.service.createChatConnection();
  }
  sendMessage(content:string){
    this.service.sendMessage(content);
  }
  openPrivateChat(toUser:string){
   const modalRef=this.modalService.open(PrivateChatsComponent);
   modalRef.componentInstance.toUser=toUser;
 
   this.service.loadprivatechats(toUser);
  //  this.service.loadprivatechats(toUser, this.service.myName).subscribe({
  //   next: (data) => {
  //     this.service.privateMessages = data;
  //     console.log('the previous message', data);
  //   },
  //   error: (error) => {
  //     console.error('Error loading private chats', error);
  //   }
  // });

  }


  openGroupChat(GroupName:string){
    const modalRef=this.modalService.open(GroupChatComponent);
    modalRef.componentInstance.GroupName=GroupName;
  }

  openGroupModal(){
    const modalRef = this.modalService.open(GroupCreateComponent);
    modalRef.componentInstance;
  }


}
