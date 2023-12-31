import { Component, ElementRef, OnInit, OnDestroy,ViewChild } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { profile } from '../Models/profile';
import { UsersService } from '../users.service';
import { ActivatedRoute } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { NotificationComponent } from '../notification/notification.component';
import { FormControl } from '@angular/forms';
import { MatTabGroup } from '@angular/material/tabs';
import { Subscription, filter } from 'rxjs';
import { GalleryService } from '../gallery.service';

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
shouldShowDiv: boolean = true;
private routerSubscription: Subscription;
// searchVisible: boolean = false;

isDropdownVisible = false;


  constructor(public service: UsersService,public galleryservice:GalleryService ,private router: Router, private route: ActivatedRoute,private matdialog: MatDialog) { 
    this.routerSubscription = this.router.events
    .pipe(filter((event) => event instanceof NavigationEnd))
    .subscribe(() => {
      this.checkURL();
    });
  }

  checkURL() {
    const currentUrl = this.router.url;

    if (currentUrl.includes('chat')) {
      console.log('This is the chatpage!');
      this.shouldShowDiv = true;
      // Perform actions specific to the chatpage
    }
    else {
      console.log('This is not the chatpage.');
      this.userctrl.setValue(null);
      this.onUserSearch();
      this.service.reintialized();
      this.shouldShowDiv = false;
    }
  }

  ngOnDestroy() {
    if (this.routerSubscription) {
      this.routerSubscription.unsubscribe();
    }
  }

  ngOnInit(): void {
    this.extractedWord = this.route.snapshot.paramMap.get('chat') as string;
    this.userlist=this.service.offlineUsers.filter(user=>user.username!==this.service.myName).map(user=>user.username);
    this.service.myName = sessionStorage.getItem('myName') || '';
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
    this.router.navigateByUrl('/user-profile');
    // this.service.getuserprofiledetail().subscribe({
    //   next:(data:profile)=>{
    //     this.service.singleuser=data;
    //     this.router.navigateByUrl('/user-profile');
    //   },
    //   error: (error) => {
    //     console.error('Error loading private chats', error);
    //   }
    // });
  }

  logout() {
    this.service.disconnectedasync(this.service.myName);
    sessionStorage.clear();
    this.service.myName = '';
    this.service.reintialized();
    this.service.notifyOtherTabs();
    this.userctrl.setValue(null);
    this.galleryservice.filterAlert=false;
    this.galleryservice.galleryData=[];
    this.galleryservice.filtergalleryData=[];
    this.router.navigateByUrl('/login');
  }
 
  search(){
    // alert("fg")
  }

  toggleDropdown() {
    // this.myInput.nativeElement.value = '';
    this.userctrl.setValue(null);
    this.onUserSearch();
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