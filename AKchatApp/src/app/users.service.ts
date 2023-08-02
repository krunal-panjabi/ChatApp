import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
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

  CheckName(username: string): Observable<any> {
    const headers = new HttpHeaders({ 'content-type': 'application/json' });
    const params = new HttpParams().set("username", username);
    return this.http.get(`${environment.apiUrl}User/CheckForName`,{ 'headers': headers, 'params': params })
  }

  public LoginData(User: user): Observable<any> {
    return this.http.post(`${environment.apiUrl}User/UserLogin`, User );
  }

  // public CheckName(username:string):Observable<any>{
  //   return this.http.post(`${environment.apiUrl}User/CheckForName`,username)
  // }    const headers = new HttpHeaders({ 'content-type': 'application/json' });
    // const params = new HttpParams().set("email", email);
    // return this.http.get(`${environment.apiUrl}Account/ValidateEmail`,{ 'headers': headers, 'params': params })
}
