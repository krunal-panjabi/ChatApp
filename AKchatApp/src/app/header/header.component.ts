import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { profile } from '../Models/profile';
import { UsersService } from '../users.service';
import { ActivatedRoute } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { NotificationComponent } from '../notification/notification.component';

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

  constructor(public service: UsersService, private router: Router, private route: ActivatedRoute,private matdialog: MatDialog) { }

  ngOnInit(): void {

  }
  
  toggleDivColors(color:any) {
    this.isGreenActive = !this.isGreenActive;
    this.service.toggletheme(color);
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