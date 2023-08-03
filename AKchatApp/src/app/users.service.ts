import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { user } from './Models/users';
import { environment } from 'src/environments/environment';
import { HubConnection } from '@microsoft/signalr';
import { HubConnectionBuilder } from '@microsoft/signalr/dist/esm/HubConnectionBuilder';
import { HttpTransportType } from '@microsoft/signalr/dist/esm/ITransport';

@Injectable(
  // providedIn: 'root'
)
export class UsersService {
  myName:string ='';
  private chatConnection?:HubConnection;
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
   
  createChatConnection(){
    alert('chatco hitted');
    this.chatConnection=new HubConnectionBuilder()
    .withUrl(`${environment.apiUrl}hubs/chat`,{
      skipNegotiation:true,
      transport:HttpTransportType.WebSockets,
    }).withAutomaticReconnect().build();

    this.chatConnection.start().catch(error=>{
      alert('start conn hitted');
      console.log(error);
    });
  }
  stopChatConnection(){
    this.chatConnection?.stop().catch(error=>console.log(error));
  }
  // public CheckName(username:string):Observable<any>{
  //   return this.http.post(`${environment.apiUrl}User/CheckForName`,username)
  // }    const headers = new HttpHeaders({ 'content-type': 'application/json' });
    // const params = new HttpParams().set("email", email);
    // return this.http.get(`${environment.apiUrl}Account/ValidateEmail`,{ 'headers': headers, 'params': params })
}
