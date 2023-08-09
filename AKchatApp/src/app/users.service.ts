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
import { group } from './Models/group';
import { groupname } from './Models/groupname';
import { groupmodel } from './Models/groupmodel';

@Injectable(
  // providedIn: 'root'
)
export class UsersService {
  myName: string = '';
  onlineUsers: string[] = [];
  offlineUsers: OfflineUsers[] = [];
  grpmembers: OfflineUsers[]=[];
  groups : groupname[]=[];
  messages: Message[] = [];
  grpmessages: Message[] = [];
  private chatConnection?: HubConnection;
  privateMessages: Message[] = [];
  privateMessageInitiated = false;
  readonly url = "https://localhost:7239/"
  constructor(private http: HttpClient, private modalService: NgbModal) { }

  public postData(User: user): Observable<any> {
    return this.http.post(`${environment.apiUrl}User/Register`, User);
  }


  // public createGroup(grpname: string, members: string[]): Observable<any> {
  //   const model = { grpname, members };
  //   console.log("ready to go to api");
  //   return this.http.post(`${environment.apiUrl}User/CreateGroup`, model );
  // }

  createGroup(grpname: string, members: string): Observable<any> {
    const group = { groupName: grpname, members: members }
    return this.http.post<Message[]>(`${environment.apiUrl}User/CreateGroup`, group);
   
  }
  
  CheckName(username: string): Observable<any> {
    const headers = new HttpHeaders({ 'content-type': 'application/json' });
    const params = new HttpParams().set("username", username);
    return this.http.get(`${environment.apiUrl}User/CheckForName`, { 'headers': headers, 'params': params })
  }

  public LoginData(User: user): Observable<any> {
    return this.http.post(`${environment.apiUrl}User/UserLogin`, User);
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

  getAllGroups(username: string) {
    const headers = new HttpHeaders({ 'content-type': 'application/json' });
    const params = new HttpParams().set("username", username);
    return this.http.get<groupname[]>(`${environment.apiUrl}User/GetGroups`, { 'headers': headers, 'params': params }).subscribe({
      next: (data) => {
        console.log("groupnames",data);
        this.groups = data;
        console.log("group",this.groups);
      },
    });
  }



  intitializeloadprivatechats(toUser: string, fromUser: string): Observable<Message[]> {
    const headers = new HttpHeaders({ 'content-type': 'application/json' });
    let params = new HttpParams()
    params = params.append('toUser', toUser);
    params = params.append('fromUser', fromUser);
    return this.http.get<Message[]>(`${environment.apiUrl}User/LoadInitialPrivateChat`, { 'headers': headers, 'params': params });
  }

  loadprivatechats(toUser: string) {
    this.intitializeloadprivatechats(toUser, this.myName).subscribe({
      next: (data) => {
        this.privateMessages = data;
      },
      error: (error) => {
        console.error('error loading private chats', error);
      }
    });
  }
  
  loadgrpmembers(gpname:string):Observable<OfflineUsers[]>{
    const headers = new HttpHeaders({ 'content-type': 'application/json' });
    let params = new HttpParams()
    params = params.append('grpname', gpname);
    return this.http.get<OfflineUsers[]>(`${environment.apiUrl}User/LoadGrpMembers`, { 'headers': headers, 'params': params });
  }

  intitializeloadgrpchats(gpname: string): Observable<Message[]> {
    const headers = new HttpHeaders({ 'content-type': 'application/json' });
    let params = new HttpParams()
    params = params.append('grpname', gpname);
    return this.http.get<Message[]>(`${environment.apiUrl}User/LoadInitialGroupChat`, { 'headers': headers, 'params': params });
  }

  loadgrpchats(gpname: string) {
    this.intitializeloadgrpchats(gpname).subscribe({
      next: (data) => {
        this.grpmessages = data;
        console.log("the grpmessages",this.grpmessages);
      },
      error: (error) => {
        console.error('error loading private chats', error);
      }
    });
  }
  createChatConnection() {
    this.chatConnection = new HubConnectionBuilder()
      .withUrl(`https://localhost:7239/hubs/chat`, {
        skipNegotiation: true,
        transport: HttpTransportType.WebSockets,
      }).withAutomaticReconnect().build();

    this.chatConnection.start().catch(error => {
      console.log(error);
    });

    this.chatConnection.on('UserConnected', () => {
      this.addUserConnectionId();
    });

    this.chatConnection.on('OnlineUsers', (onlineUsers) => {
      this.onlineUsers = [...onlineUsers];
    });

    this.chatConnection.on('CallForLoadGrpNames',()=>{
      alert('for grps called');
        this.getAllGroups(this.myName);
    });

    

    this.chatConnection.on('NewMessage',(newMessage:Message)=>{
    this.messages=[...this.messages,newMessage];
    });

    this.chatConnection.on('NewGrpMessage', (newMessage: Message) => {
    
      console.log('the person',newMessage.from);
      this.grpmessages = [...this.grpmessages, newMessage];
      console.log("this are message",this.grpmessages);
    });

    this.chatConnection.on('OpenPrivateChat', (newMessage: Message) => {

      this.privateMessages = [...this.privateMessages, newMessage];
      this.privateMessageInitiated = true;
      this.loadprivatechats(newMessage.from);
      const modalRef = this.modalService.open(PrivateChatsComponent);
      modalRef.componentInstance.toUser = newMessage.from;

    });


    this.chatConnection.on('NewPrivateMessage', (newMessage: Message) => {
      this.privateMessages = [...this.privateMessages, newMessage];
    });

    this.chatConnection.on('ClosePrivateChat', () => {
      this.privateMessageInitiated = false;
      this.privateMessages = [];
      this.modalService.dismissAll();
    });
  }
  stopChatConnection() {
    this.chatConnection?.stop().catch(error => console.log(error));
  }
  async addUserConnectionId() {
    return this.chatConnection?.invoke('AddUserConnectionId', this.myName)
      .catch(error => console.log(error));
  }

  async callbackend()
  {alert('backedn called');
    return this.chatConnection?.invoke('LoadGrpNames')
    .catch(error => console.log(error));
  }
  async sendMessage(content: string) {
    console.log("send message called");
    const message: Message = {
      from: this.myName,
      content: content
    };

    return this.chatConnection?.invoke('ReceiveMessage', message)
      .catch(error => console.log(error));
  }
  async sendGrpMessage(content: string,gname:string) {
   
    const message: groupmodel = {
      from: this.myName,
      content: content,
      grpname:gname
    };

    return this.chatConnection?.invoke('ReceiveGrpMessage', message)
      .catch(error => console.log(error));
  }

  async sendPrivateMessage(to: string, content: string) {
    const message: Message = {
      from: this.myName,
      content: content,
      to: to
    };
    if (!this.privateMessageInitiated) {
      alert('if hitted');
      this.loadprivatechats(to);
      this.privateMessageInitiated = true; //if they have started talking with each other
      return this.chatConnection?.invoke('CreatePrivateChat', message).then(() => {
        this.privateMessages = [...this.privateMessages, message];
      })
        .catch(error => console.log(error));
    } else {
      alert('else hitted');
      this.privateMessages = [...this.privateMessages, message];
      return this.chatConnection?.invoke('ReceivePrivateMessage', message)
        .catch(error => console.log(error));
    }
  }
  async closePrivateChatMesage(otherUser: string) {
    return this.chatConnection?.invoke('RemovePrivateChat', this.myName, otherUser)
      .catch(error => console.log(error));
  }





}
