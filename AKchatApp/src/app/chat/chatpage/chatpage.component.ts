import { Component, OnDestroy, OnInit } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { OfflineUsers } from 'src/app/Models/OfflineUsers';
import { UsersService } from 'src/app/users.service';
import { GroupCreateComponent } from '../group-create/group-create.component';
import { PrivateChatsComponent } from '../private-chats/private-chats.component';
import { GroupChatComponent } from '../group-chat/group-chat.component';
import { Router } from '@angular/router';

@Component({
  selector: 'app-chatpage',
  templateUrl: './chatpage.component.html',
  styleUrls: ['./chatpage.component.css']
})
export class ChatpageComponent implements OnInit,OnDestroy {

  constructor(public service : UsersService,private modalService:NgbModal,private router:Router) { }
  
 ngOnDestroy(): void{
   this.service.stopChatConnection();
 }

  ngOnInit():void{
    this.service.getAllUsers();
    this.service.getAllGroups(this.service.myName);
    this.service.createChatConnection();

    if (this.service.myName) {

      // this.updateImageUrl(); // Update imageUrl if myName is available
      console.log(this.service.myName);
      
    }
    else{
     setTimeout(() => {
       this.router.navigateByUrl('/no-connection');
       setTimeout(() => {
         this.router.navigateByUrl('/login');
       }, 3000);
     }, 0);
    }
  }
  sendMessage(content:string){
    this.service.sendMessage(content);
  }
  isUserAuthenticated(){
    return true;
  }
    openPrivateChat(toUser: string, image: string){
    this.service.toUser=toUser;
    console.log("to user",this.service.toUser); 
   const modalRef=this.modalService.open(PrivateChatsComponent);
   modalRef.componentInstance.toUser=toUser;
   modalRef.componentInstance.image=image;
   this.service.loadprivatechats(toUser);
  }

  logout(){
    this.service.myName='';
    this.service.isTyping=false;
    this.router.navigateByUrl('/login');
  }
  openGroupChat(GroupName:string){
    const modalRef=this.modalService.open(GroupChatComponent);
    modalRef.componentInstance.GroupName=GroupName;
    this.service.loadgrpchats(GroupName);
    this.service.loadgrpmembers(GroupName).subscribe({
      next:(data)=>{
        this.service.grpmembers=data;
      },
      error:(error)=>{
        console.error('Error loading members chats', error);
      }
    });
  }

  openGroupModal(){
    const modalRef = this.modalService.open(GroupCreateComponent);
    modalRef.componentInstance;
  }


  // customSort(userA: any, userB: any): number {
  //   if (userA.username === this.service.myName) {
  //     return -1; // userA comes first
  //   } else if (userB.username === this.service.myName) {
  //     return 1; // userB comes first
  //   } else {
  //     // Compare other users based on your criteria, if needed
  //     // For example, you can compare usernames alphabetically
  //     return userA.username.localeCompare(userB.username);
  //   }
  // }



}
