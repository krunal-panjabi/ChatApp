import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { user } from './Models/users';
import { environment } from 'src/environments/environment';
import { HubConnection } from '@microsoft/signalr';
import { HubConnectionBuilder } from '@microsoft/signalr/dist/esm/HubConnectionBuilder';
import { HttpTransportType } from '@microsoft/signalr/dist/esm/ITransport';
import { OfflineUsers } from './Models/OfflineUsers';
import { Message } from './Models/message';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { PrivateChatsComponent } from './chat/private-chats/private-chats.component';

@Injectable(
  // providedIn: 'root'
)
export class UsersService {
  myName:string ='';
  onlineUsers:string[]=[];
  offlineUsers:OfflineUsers[]=[];
  messages:Message[]=[];
  private chatConnection?:HubConnection;
  privateMessages: Message[]=[];
  privateMessageInitiated=false;
  readonly url = "https://localhost:7239/"
  constructor(private http:HttpClient,private modalService:NgbModal) { }

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
   
  getAllUsers() {
    return this.http
      .get<OfflineUsers[]>(
        `${environment.apiUrl}User/GetOfflineUsers`
      )
      .subscribe({
        next: (data) => {
          this.offlineUsers = data;
          console.log('offlineUser');

          console.log(this.offlineUsers);
        },
      });
  }

  createChatConnection(){

    this.chatConnection=new HubConnectionBuilder()
    .withUrl(`https://localhost:7239/hubs/chat`,{
      skipNegotiation:true,
      transport:HttpTransportType.WebSockets,
    }).withAutomaticReconnect().build();

    this.chatConnection.start().catch(error=>{
     
      console.log(error);
    });

    this.chatConnection.on('UserConnected',()=>{
      this.addUserConnectionId();
    });
    this.chatConnection.on('OnlineUsers',(onlineUsers)=>{
      this.onlineUsers=[...onlineUsers];
    });
    this.chatConnection.on('NewMessage',(newMessage:Message)=>{
    this.messages=[...this.messages,newMessage];
    });

    this.chatConnection.on('OpenPrivateChat',(newMessage:Message)=>{
      this.privateMessages=[...this.privateMessages,newMessage];
      this.privateMessageInitiated=true;
      const modalRef=this.modalService.open(PrivateChatsComponent);
      modalRef.componentInstance.toUser=newMessage.from;
    });

      this.chatConnection.on('NewPrivateMessage',(newMessage:Message)=>{
        this.privateMessages=[...this.privateMessages,newMessage];
        });

        this.chatConnection.on('ClosePrivateChat',()=>{
         this.privateMessageInitiated=false;
         this.privateMessages=[];
         this.modalService.dismissAll();
          });
  }
  stopChatConnection(){
    this.chatConnection?.stop().catch(error=>console.log(error));
  }
  async addUserConnectionId(){
    return this.chatConnection?.invoke('AddUserConnectionId',this.myName)
    .catch(error=>console.log(error));
    
  }
  async sendMessage(content:string){
    console.log("send message called");
    const message:Message={
      from:this.myName,
      content:content
    };

    return this.chatConnection?.invoke('ReceiveMessage',message)
    .catch(error=>console.log(error));
    
  }
  async sendPrivateMessage(to:string,content:string){
    const message:Message={
      from:this.myName,
      content:content,
      to:to
    };
    if(!this.privateMessageInitiated){
      this.privateMessageInitiated=true; //if they have started talking with each other
      return this.chatConnection?.invoke('CreatePrivateChat',message).then(()=>{
        this.privateMessages=[...this.privateMessages,message];
      })
      .catch(error=>console.log(error));
    }else{
      return this.chatConnection?.invoke('ReceivePrivateMessage',message)
      .catch(error=>console.log(error));
    }
  }
  async closePrivateChatMesage(otherUser:string){
    return this.chatConnection?.invoke('RemovePrivateChat',this.myName,otherUser)
    .catch(error=>console.log(error));
  }
  // public CheckName(username:string):Observable<any>{
  //   return this.http.post(`${environment.apiUrl}User/CheckForName`,username)
  // }    const headers = new HttpHeaders({ 'content-type': 'application/json' });
    // const params = new HttpParams().set("email", email);
    // return this.http.get(`${environment.apiUrl}Account/ValidateEmail`,{ 'headers': headers, 'params': params })
}
