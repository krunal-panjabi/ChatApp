import { Component } from '@angular/core';
import { Router } from '@angular/router';
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
  logout(){
    alert('log otu called');
    this.service.myName='';
    this.router.navigateByUrl('/login');
  }
}
