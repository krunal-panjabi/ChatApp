import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { profile } from '../Models/profile';
import { UsersService } from '../users.service';
import { ActivatedRoute } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { NotificationComponent } from '../notification/notification.component';
import { FormControl } from '@angular/forms';
import { MatTabGroup } from '@angular/material/tabs';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {
  imageUrl: string = "/assets/img/upload.png";
isChatRoute: boolean = false;
extractedWord :string = '' ;
isGreenActive: boolean = true;
userctrl = new FormControl('');
filteredlist:string[]=[];
userlist:string[]=[];
// searchVisible: boolean = false;

isDropdownVisible = false;


  constructor(public service: UsersService, private router: Router, private route: ActivatedRoute,private matdialog: MatDialog) { }

  ngOnInit(): void {

    this.extractedWord = this.route.snapshot.paramMap.get('chat') as string;
    this.userlist=this.service.offlineUsers.filter(user=>user.username!==this.service.myName).map(user=>user.username);
    // alert(this.userlist);
    console.log("")
    this.filteredlist=this.userlist
  }


  toggleDivColors(color:any) {
    this.isGreenActive = !this.isGreenActive;
    this.service.toggletheme(color);
  }
  onUserSearch(){
    const userValue = this.userctrl.value;
    if (userValue && userValue.trim().length > 0) {
      this.service.isdivvalid = true;
      const searchterm = (userValue ?? '').toLowerCase();
      this.service.searchfilteredlist = this.service.searchuserlist.filter(user => user.username.toLowerCase().includes(searchterm));
    }
    else{
      this.service.isdivvalid=false;
    }
    }
  

  profile() {
    this.service.getuserprofiledetail().subscribe({
      next:(data:profile)=>{
        this.service.singleuser=data;

        this.router.navigateByUrl('/user-profile');
      },
      error: (error) => {
        console.error('Error loading private chats', error);
      }
    });
  }

  logout() {
    localStorage.clear();
    this.service.myName = '';
    this.router.navigateByUrl('/login');
  }
 




  search(){
    alert("fg")
  }

  toggleDropdown() {
    this.isDropdownVisible = !this.isDropdownVisible;
  }

  filterFunction() {
    const input = document.getElementById('myInput') as HTMLInputElement;
    const filter = input.value.toUpperCase();
    const dropdownContent = document.getElementById('myDropdown');
  
    if (dropdownContent) {
      const links = dropdownContent.getElementsByTagName('a');
  
      for (let i = 0; i < links.length; i++) {
        const txtValue = links[i].textContent || links[i].innerText;
        if (txtValue.toUpperCase().indexOf(filter) > -1) {
          links[i].style.display = '';
        } else {
          links[i].style.display = 'none';
        }
      }
    }
  }

  // filterFunction() {
  //   const input = document.getElementById('myInput') as HTMLInputElement;
  //   const filter = input.value.toUpperCase();
  //   const dropdownContent = document.getElementById('myDropdown');
  //   const links = dropdownContent.getElementsByTagName('a');
    
  //   for (let i = 0; i < links.length; i++) {
  //     const txtValue = links[i].textContent || links[i].innerText;
  //     if (txtValue.toUpperCase().indexOf(filter) > -1) {
  //       links[i].style.display = '';
  //     } else {
  //       links[i].style.display = 'none';
  //     }
  //   }
  // }









  
  openNotiDialogue(){
    this.service.countmsg=0;
    this.service.getNotificationMsg().subscribe({
      next:(data)=>{
      this.service.notimsgs=data;
      this.matdialog.open(NotificationComponent,{
        width:'350px',        
        position:{top:'48px',right:'50px', },
        panelClass: 'custom-dialog-container',
       })
      },
      error:(error)=>{
       if(error.status===400){
        console.error("By refreshing the page you got disconnected");
       }
      }
      
    })
   
  }
}
// this.service.getLikeMembers(megid).subscribe({
//   next: (data) => {
//     this.service.likemembers = data;
//     this.matdialog.open(DialogBodyComponent, {
//       width: '350px',
//       position: { top: '100px',
//       left:'500px' },
//     })
//   },
//   error: (error) => {
//     if (error.status === 400) {
//       console.error("By refreshing the page you got disconnected");
//     }
//   }
// });