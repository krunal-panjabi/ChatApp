import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { UsersService } from '../users.service';
 // Import your Userservice here

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  constructor(public service: UsersService, private router: Router,private toastr: ToastrService) {}

  canActivate(): boolean {
    if (this.service.isLoggedIn()) {
      return true;
    } else {
      this.toastr.warning('Not LoggedIn', 'First Loggedin Not Authenticated',{
        disableTimeOut:false,
        closeButton:true,
        progressBar:true
      });
      this.router.navigateByUrl('/login');
      return false;
    }
  }
}
