import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpErrorResponse
} from '@angular/common/http';
import { catchError, Observable, throwError } from 'rxjs';
import { UsersService } from '../users.service';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';

@Injectable()
export class TokenInterceptor implements HttpInterceptor {

  constructor(public service:UsersService,private router:Router, private toastr: ToastrService) {}

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    const token=this.service.getToken();

    if(token){
      request=request.clone({
        setHeaders:{Authorization:`Bearer ${token}`}
      })
    }
   
    return next.handle(request).pipe(
     catchError((err:any)=>{
      if(err instanceof HttpErrorResponse){
        if(err.status === 401){
          this.toastr.error("Error","Your token is not found",{
            disableTimeOut:false,
            closeButton:true,
            progressBar:true
          });
          this.router.navigateByUrl('/login')
        
        }
      }
      return throwError(()=> err)
     })
    );
  }
}
