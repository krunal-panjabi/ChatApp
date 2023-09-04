import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { profile } from '../Models/profile';
import { UsersService } from '../users.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {
  imageUrl: string = "/assets/img/upload.png";
  
  constructor(public service: UsersService, private router: Router) { }

  ngOnInit(): void {
    alert('header change');
     if (this.service.myName) {

      // this.updateImageUrl(); // Update imageUrl if myName is available
      console.log(this.service.myName);
      
    }
  }

  // updateImageUrl() {
  //   this.service.getuserprofiledetail().subscribe({
  //     next: (data: profile) => {
  //     console.log(this.service.imageUrl),
  //     alert("sfdsajg");

  //       this.service.singleuser = data;
  //       this.imageUrl = data.imgstr;
  //     },
  //     error: (error) => {
  //       console.error('Error loading private chats', error);
  //     }
  //   });
  // }

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
    this.service.myName = '';
    this.router.navigateByUrl('/login');
  }
}
