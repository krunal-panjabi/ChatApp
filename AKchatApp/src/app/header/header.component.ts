import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { profile } from '../Models/profile';
import { UsersService } from '../users.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent {

  constructor(public service:UsersService,private router:Router) { }

  ngOnInit(): void {
    
  }
  profile()
  {
    this.service.getuserprofiledetail().subscribe({
      next:(data:profile)=>{
        this.service.singleuser=data;
      },
      error: (error) => {
      console.error('error loading private chats', error);
    }
    });
     this.router.navigateByUrl('/user-profile');
  }
  logout(){
    this.service.myName='';
    this.router.navigateByUrl('/login');
  }
}
