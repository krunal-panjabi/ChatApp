import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Observable, tap } from 'rxjs';
import { SessionstorageserviceService } from '../sessionstorageservice.service';
import { UsersService } from '../users.service';
 // Import your Userservice here

@Injectable({
  providedIn: 'root'
})
export class LoggedGuard implements CanActivate {

  constructor(public userservice: UsersService, public service:SessionstorageserviceService,private router: Router,private toastr: ToastrService) {}
 
  // canActivate(): boolean {
  //   if (this.userservice.isLoggedIn()) {
  //     this.router.navigateByUrl('/chat');
  //     return true;
  //   } else {
    
  //     this.router.navigateByUrl('/login');
  //     return false;
  //   }
  // }
  async canActivate(): Promise<boolean> {
    await this.service.isSessionStorageReady;

    if (this.userservice.isLoggedIn()) {
      this.router.navigateByUrl('/chat');
      return true;
    } else {
      this.router.navigateByUrl('/login');
      return false;
    }
  }
}
