import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { UsersService } from '../users.service';
 // Import your Userservice here

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  constructor(public service: UsersService, private router: Router) {}

  canActivate(): boolean {
    if (this.service.isLoggedIn()) {
      return true;
    } else {
      this.router.navigateByUrl('/login');
      return false;
    }
  }
}
