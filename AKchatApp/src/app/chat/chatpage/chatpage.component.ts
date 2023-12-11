import { Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
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
import { clippingParents } from '@popperjs/core';
import { MatDialog } from '@angular/material/dialog';
import { MutualFriendListComponent } from 'src/app/mutual-friend-list/mutual-friend-list.component';
import { UserDetailComponent } from 'src/app/user-detail/user-detail.component';

interface UserWithIcon extends OfflineUsers {
  iconClass: string;
  iconChanged: boolean;
}

@Component({
  selector: 'app-chatpage',
  templateUrl: './chatpage.component.html',
  styleUrls: ['./chatpage.component.css']
})
   
export class ChatpageComponent implements OnInit {
  userControl:FormControl<string[] | null> = new FormControl([]);
  userslist:string[]=[];
  userctrl = new FormControl('');
  searchctrl=new FormControl('');
  filteredlist:string[]=[];
  displayComponent: 'A' | 'B' = 'A';
  receiveddata: string = '';
  dataToSend: string = '';

  @ViewChild('childComponent', { static: true }) childComponent!: ElementRef;


  // userslist1: UserWithIcon[] = [];

  iconClass = 'bi bi-person-fill-add'; // Initial icon class
  iconChanged = false;



  grid = true;
  constructor(public service : UsersService,private modalService:NgbModal,private router:Router,public msgservice:MessageService,public dialog:MatDialog) {
    //var absUrl= $location.absUrl();
    console.log('ChatComponent constructor called');
    if(window.location.pathname === "/chat")
    {
      service.isButtonVisisble=false;
    }
  }

userDetail(username : any){
  // alert("called")
  // const dialogRef = this.dialog.open(UserDetailComponent, {
  //   width: '1500px',
  //   height: '750px',
  //   data: {username : username }
  // });
  this.dataToSend = username;
  this.displayComponent = 'B';
  // this.childComponent.nativeElement.someMethod(username);
  // this.service.sendButtonClick(username);
}

receiveDataFromChild(data: string) {
  this.receiveddata = data;
  if (this.receiveddata === 'A') {
    this.displayComponent = 'A';
  } else if (this.receiveddata === 'B') {
    this.displayComponent = 'B';
  }
}

  openDialog(name : any): void {
    console.log('got here');
    // alert(name);
    const filteredUsers = this.service.searchfilteredlist.filter(user => user.username === name);
    console.log("user data",filteredUsers);
    const imgArray = filteredUsers.map(user => user.mutualarr);
    const friendNamesArray = filteredUsers.map(user => user.mutualfriends);


    const dialogRef = this.dialog.open(MutualFriendListComponent, {
      width: '250px',
      height: '250px',
      data: { mutualarr: imgArray[0], mutualfriendnames: friendNamesArray[0] }
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
      // this.animal = result;
    });
  }


  onSearchInputChange1(){
   const searchterm=(this.searchctrl.value?? '').toLocaleLowerCase();
  this.service.usernamelist=this.service.offlineUsers.filter(user=>user.username.toLowerCase().includes(searchterm));
  this.service.groupnamelist=this.service.groups.filter(grp=>grp.groupname.toLowerCase().includes(searchterm));
  }
  // onSearchInputChange(){

  //   const searchterm=(this.userctrl.value?? '').toLowerCase();
  //   this.filteredlist=this.userslist.filter(user=>user.toLowerCase().includes(searchterm));
  // }




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


// Function to show the third tab
// showThirdTab() {
//   this.selectedTabIndex = 1; // 2 is the index of the third tab (0-based index)
// }
  ngOnInit():void {

    this.service.myName = sessionStorage.getItem('myName') || '';
    this.service.imageUrl=sessionStorage.getItem('userimage') || '';
    this.service.getAllUsers().subscribe({
      next:(data)=>{
        this.service.offlineUsers=data;
        this.service.usernamelist=this.service.offlineUsers;
      }
    })
    this.service.getAllGroups(sessionStorage.getItem('myName') || '').subscribe({
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
        data.forEach(user=>{
          const imgAry = user.mutualimages ? user.mutualimages.split(',') : [];
          const friendsarr = user.mutualnames ? user.mutualnames.split(',') : [];
           const newUser={
             username:user.username,
             status:user.status,
             mutualimages:user.mutualimages,
             imgstr:user.imgstr,
             mutualarr:imgAry,
             mutualfriends:friendsarr
           }
           this.service.searchfilteredlist.push(newUser);
           this.service.searchuserlist.push(newUser);
        });
        console.log("the usermutual",this.service.searchfilteredlist);
        this.userslist=data.filter(user=>user.username!==this.service.myName).map(user=>user.username);

        this.filteredlist=this.userslist;
      }
    })

    if (this.service.myName) {
      console.log(this.service.myName);
    }

  }

  sendMessage(content:string){
    this.service.sendMessage(content);
  }

  // onSaveButtonClick()
  // {
  //   const categories = this.userControl.value as string[];
  //   const selectedNames = categories.join(',');
  //   if(selectedNames.length>0)
  //   {
  //      this.service.SelectedUsers(selectedNames).subscribe({
  //        next:(data)=>{
  //         this.service.requestnoti(selectedNames);
  //       //  this.service.getAllUsers();
  //        }
  //      })
  //   }
  // }
  // requestUser(username :any)
  // {
  //      this.service.SelectedUsers(username).subscribe({
  //        next:(data)=>{
  //         this.service.requestnoti(username);
  //         this.iconClass = 'bi bi-check';
  //         this.iconChanged = true;
  //       //  this.service.getAllUsers();
  //        }
  //      })
  // }


  requestUser(username: string) {
    
      console.log()
      this.service.SelectedUsers(username).subscribe({
        next: (data) => {
          // alert(data);
          this.service.requestnoti(username);
        //   user.iconClass = 'bi bi-check';
        //   user.iconChanged = true;
         }
      });
    // }
  }





  isUserAuthenticated(){
    return true;
  }

    openPrivateChat(toUser: string, image: string){
      this.service.loadprivatechats(toUser);
  this.service.isGroupChat=false;
  this.service.isgeneral=false;
  this.service.toUser=toUser;
  this.msgservice.messageDiv1Visibility={};
  this.msgservice.messageDiv2Visibility={};
   const modalRef=this.modalService.open(PrivateChatsComponent);
   modalRef.componentInstance.toUser=toUser;
   modalRef.componentInstance.image=image;
  }


  openGroupChat(GroupName:string){
    this.service.loadgrpchats(GroupName);
    this.service.isgeneral=false;
    this.service.isGroupChat=true;
    this.service.globalgpname=GroupName;
    const modalRef=this.modalService.open(GroupChatComponent);
    this.msgservice.messageDiv1Visibility={};
    this.msgservice.messageDiv2Visibility={};
    modalRef.componentInstance.GroupName=GroupName;

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
