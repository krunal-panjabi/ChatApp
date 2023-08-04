import { Component, OnDestroy, OnInit } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { OfflineUsers } from 'src/app/Models/OfflineUsers';
import { UsersService } from 'src/app/users.service';
import { PrivateChatsComponent } from '../private-chats/private-chats.component';

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
    alert("here hitted");
    this.service.getAllUsers();
    this.service.createChatConnection();
  }
  sendMessage(content:string){
    this.service.sendMessage(content);
  }
  openPrivateChat(toUser:string){
   const modalRef=this.modalService.open(PrivateChatsComponent);
   modalRef.componentInstance.toUser=toUser;
  }
}
