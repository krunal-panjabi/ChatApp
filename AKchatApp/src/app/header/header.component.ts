import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { profile } from '../Models/profile';
import { UsersService } from '../users.service';
import { ActivatedRoute } from '@angular/router';


@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {
  imageUrl: string = "/assets/img/upload.png";
isChatRoute: boolean = false;
extractedWord :string = '' ;
  constructor(public service: UsersService, private router: Router, private route: ActivatedRoute) { }

  ngOnInit(): void {

    this.extractedWord = this.route.snapshot.paramMap.get('chat') as string;
    this.service.countmsg=2;
     if (this.service.myName) {

      // this.updateImageUrl(); // Update imageUrl if myName is available
      console.log(this.service.myName);
      
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
}
