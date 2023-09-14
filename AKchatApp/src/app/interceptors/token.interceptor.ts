import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor
} from '@angular/common/http';
import { Observable } from 'rxjs';
import { UsersService } from '../users.service';

@Injectable()
export class TokenInterceptor implements HttpInterceptor {

  constructor(public service:UsersService) {}

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    const token=this.service.getToken();

    if(token){
      request=request.clone({
        setHeaders:{Authorization:`Bearer ${token}`}
      })
    }
   
    return next.handle(request);
  }
}
