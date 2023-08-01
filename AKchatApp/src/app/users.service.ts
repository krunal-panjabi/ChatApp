import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { user } from './Models/users';
import { environment } from 'src/environments/environment';

@Injectable(
  // providedIn: 'root'
)
export class UsersService {
  readonly url = "https://localhost:7239/"
  constructor(private http:HttpClient) { }

  public postData(User: user): Observable<any> {
    return this.http.post(`${environment.apiUrl}User/Register`, User );
  }
}
