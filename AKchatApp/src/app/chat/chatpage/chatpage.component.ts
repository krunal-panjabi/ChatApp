import { Component, OnDestroy, OnInit } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { OfflineUsers } from 'src/app/Models/OfflineUsers';
import { UsersService } from 'src/app/users.service';
import { GroupCreateComponent } from '../group-create/group-create.component';
import { PrivateChatsComponent } from '../private-chats/private-chats.component';
import { GroupChatComponent } from '../group-chat/group-chat.component';
import { Router } from '@angular/router';
import { MessageService } from 'src/app/message.service';
import { FormControl } from '@angular/forms';
import { startWith } from 'rxjs';
import { groupname } from 'src/app/Models/groupname';

@Component({
  selector: 'app-chatpage',
  templateUrl: './chatpage.component.html',
  styleUrls: ['./chatpage.component.css']
})
export class ChatpageComponent implements OnInit,OnDestroy {
  userControl:FormControl<string[] | null> = new FormControl([]);
  userslist:string[]=[];
  userctrl = new FormControl('');
  searchctrl=new FormControl('');
  filteredlist:string[]=[];
  
  
  constructor(public service : UsersService,private modalService:NgbModal,private router:Router,public msgservice:MessageService) { 
    // this.userctrl.valueChanges.pi((searchText: string) => {
    //   // Filter the userslist based on the searchText
    //   this.userslist = this.userslist.filter((user) =>
    //     user.toLowerCase().includes(searchText.toLowerCase())
    //   );
    // });

    // this.filteredFruits = this.fruitCtrl.valueChanges.pipe(
    //   startWith(null),
    //   map((fruit: string | null) => (fruit ? this._filter(fruit) : this.allFruits.slice())),
    // );
  }
  onSearchInputChange1(){
   const searchterm=(this.searchctrl.value?? '').toLocaleLowerCase();
  this.service.usernamelist=this.service.offlineUsers.filter(user=>user.username.toLowerCase().includes(searchterm));
  this.service.groupnamelist=this.service.groups.filter(grp=>grp.groupname.toLowerCase().includes(searchterm));
  }
  onSearchInputChange(){
  
    const searchterm=(this.userctrl.value?? '').toLowerCase();
    this.filteredlist=this.userslist.filter(user=>user.toLowerCase().includes(searchterm));
  }
 ngOnDestroy(): void{
   this.service.stopChatConnection();
 }
 onCatRemoved(cat: string) {
  const categories = this.userControl.value as string[];
  this.removeFirst(categories, cat);
  this.userControl.setValue(categories); // To trigger change detection
}
private removeFirst(array: string[], toRemove: string): void {

  const index = array.indexOf(toRemove);
  if (index !== -1) {
    array.splice(index, 1);
  }
}
  ngOnInit():void{
    this.service.getAllUsers().subscribe({
      next:(data)=>{
        this.service.offlineUsers=data;
        this.service.usernamelist=this.service.offlineUsers;
      }
    })
    this.service.getAllGroups(this.service.myName).subscribe({
      next: (data) => {
        this.service.groups = data;
        this.service.groupnamelist=this.service.groups;
      },
      error: (error) => {
        if (error.status === 400) {
          console.error("By refreshing the page you got disconnected");
        }
      }
    });
    this.service.createChatConnection();
    
    this.service.getAllUserNames().subscribe({
      next:(data)=>{
        this.userslist=data.filter(user=>user.username!==this.service.myName).map(user=>user.username);
        this.filteredlist=this.userslist;
        this.service.searchuserlist=  data;
        this.service.searchfilteredlist=data;
      }
    })
    if (this.service.myName) {
      console.log(this.service.myName);
    }
    // else{
    //  setTimeout(() => {
    //    this.router.navigateByUrl('/no-connection');
    //    setTimeout(() => {
    //      this.router.navigateByUrl('/login');
    //    }, 3000);
    //  }, 0);
    // }
    // this.userslist=this.service.offlineUsers.filter(user=>user.username!==this.service.myName).map(user=>user.username);
    // console.log("users for search list",this.userslist);
  }
  
  sendMessage(content:string){
    this.service.sendMessage(content);
  }
  onSaveButtonClick()
  {
    const categories = this.userControl.value as string[];
    const selectedNames = categories.join(',');
    if(selectedNames.length>0)
    {
       this.service.SelectedUsers(selectedNames).subscribe({
         next:(data)=>{
          this.service.requestnoti(selectedNames);
        //  this.service.getAllUsers();
         }
       })
    }
  
  }
  isUserAuthenticated(){
    return true;
  }

    openPrivateChat(toUser: string, image: string){
  this.service.isGroupChat=false;
  this.service.isgeneral=false;
  this.service.toUser=toUser;
  this.msgservice.messageDiv1Visibility={};
  this.msgservice.messageDiv2Visibility={};
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
    this.service.isgeneral=false;
    this.service.isGroupChat=true;
    this.service.globalgpname=GroupName;
    const modalRef=this.modalService.open(GroupChatComponent);
    this.msgservice.messageDiv1Visibility={};
    this.msgservice.messageDiv2Visibility={};
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




}
