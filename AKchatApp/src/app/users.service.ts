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
import { profile } from './Models/profile';

@Injectable(
  // providedIn: 'root'
)
export class UsersService {
  isGroupChat:boolean=false;
  isTyping :boolean=false;
  username:string='';
  toUser:string='';
  myName: string = '';
  typename:string='';
  imageUrl : string = "/assets/img/upload.png";
  onlineUsers: string[] = [];
  offlineUsers: OfflineUsers[] = [];
  singleuser!:profile;
  grpmembers: OfflineUsers[]=[];
  groups : groupname[]=[];
  messages: Message[] = [];
  grpmessages: Message[] = [];
  private chatConnection?: HubConnection;
  privateMessages: Message[] = [];
  privateMessageInitiated = false;
  privatetypeintiate=false;
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
  public postFile(profiledata:profile):Observable<any> {
   profiledata.username=this.myName;
    return this.http.post(`${environment.apiUrl}User/ProfileData`, profiledata);
  }
  public uploadfile(fileToUpload: File,name:string) {
    const endpoint = `${environment.apiUrl}User/uploadphoto`;
    const formData: FormData = new FormData();
    formData.append('Image', fileToUpload, fileToUpload.name);
    formData.append('name',name);
    return this.http
      .post(endpoint, formData);
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
      error: (error) => {
        if (error.status === 400) {
          console.error("By refreshing the page you got disconnected");
        }
      }
    });
  }

  public getuserprofiledetail():Observable<profile>{
    const headers = new HttpHeaders({ 'content-type': 'application/json' });
    const params = new HttpParams().set("username", this.myName);
    return this.http.get<profile>(`${environment.apiUrl}User/FetchUserDetail`, { 'headers': headers, 'params': params })
  }
  public getuserImage(name:string):Observable<profile>{
    const headers = new HttpHeaders({ 'content-type': 'application/json' });
    const params = new HttpParams().set("username", name);
    return this.http.get<profile>(`${environment.apiUrl}User/FetchUserDetail`, { 'headers': headers, 'params': params })
  }

  // getuserprofiledata(){
  //   this.getuserprofiledetail().subscribe({
  //   next:(data: profile)=>{
  //     alert('uservalue assign');
  //    this.singleuser=data;
  //    console.log('data',this.singleuser);
  //   },
  //   error: (error) => {
  //     console.error('error loading private chats', error);
  //   }
  //   });
  // }

  intitializeloadprivatechats(toUser: string, fromUser: string): Observable<Message[]> {
    const headers = new HttpHeaders({ 'content-type': 'application/json' });
    let params = new HttpParams()
    params = params.append('toUser', toUser);
    params = params.append('fromUser', fromUser);
    return this.http.get<Message[]>(`${environment.apiUrl}User/LoadInitialPrivateChat`, { 'headers': headers, 'params': params });
  }

  loadprivatechats(toUser: string) {
    this.isGroupChat=false;
    this.intitializeloadprivatechats(toUser, this.myName).subscribe({
      next: (data) => {
        this.privateMessages = data;
        console.log("chat",this.privateMessages)
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

  intitializeloadgrpchats(name:string,gpname: string): Observable<Message[]> {
    const headers = new HttpHeaders({ 'content-type': 'application/json' });
    let params = new HttpParams()
    params = params.append('grpname', gpname);
    params = params.append('name', name);
    return this.http.get<Message[]>(`${environment.apiUrl}User/LoadInitialGroupChat`, { 'headers': headers, 'params': params });
  }

  loadgrpchats(gpname: string) {
    this.isGroupChat=true;
    this.intitializeloadgrpchats(this.myName,gpname).subscribe({
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
        this.getAllGroups(this.myName);
    });

    this.chatConnection.on('NewMessage',(newMessage:Message)=>{
      
    this.messages=[...this.messages,newMessage];
    });

    this.chatConnection.on('NewGrpMessage', (newMessage: Message) => {
    //  this.loadgrpchats(newMessage.grpname);
      this.grpmessages = [...this.grpmessages, newMessage];
    });
  
    this.chatConnection.on('NewPrivateChatMessage',(newMessage:Message)=>{
       this.privateMessages=[...this.privateMessages,newMessage];     
    });
    
    this.chatConnection.on('OpenPrivateChat', (newMessage: Message) => {
    this.loadprivatechats(newMessage.from);
    this.typename=newMessage.from;
  //    this.privateMessages = [...this.privateMessages, newMessage];
      this.privateMessageInitiated = true;
      const modalRef = this.modalService.open(PrivateChatsComponent);
      modalRef.componentInstance.toUser = newMessage.from;
    });

     this.chatConnection.on('ReceiveTypingIndicator',(name:string)=>{
      this.privatetypeintiate=true;
      this.isTyping=true;
      this.username=name;
      setTimeout(()=>{
        this.isTyping=false;
      },4000);
     });
     this.chatConnection.on('ReceiveCloseTypingIndicator',(name:string)=>{
      alert('close type');
      this.isTyping=false;
     });
   //receiveTypingIndicator(callback: (connectionId: string) => void)
   //{ this.chatConnection.on('ReceiveTypingIndicator', callback); }

    
    this.chatConnection.on('NewPrivateMessage', (newMessage: Message) => {
     // this.loadprivatechats(newMessage.from);
     
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
  {
    return this.chatConnection?.invoke('LoadGrpNames')
    .catch(error => console.log(error));
  }

  startTyping(name:string)
  {
    if(!name || name.trim()==='')
    {
      name=this.typename;
    }
    if(!this.privatetypeintiate)
    {
      this.privatetypeintiate=true;
      return this.chatConnection?.invoke('SendTypingIndicator',name,this.myName)
      .catch(error => console.log(error));
    }
    else{
      return this.chatConnection?.invoke('SendTypingIndicator',name,this.myName)
      .catch(error => console.log(error));
    }
  }
  closeTyping(name:string)
  {
    return this.chatConnection?.invoke('SendClosingIndicator',name).
   catch(error => console.log(error));
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
    this.isGroupChat=true;
  //  const usernames:string []=this.grpmembers.map(member=>member.username);
    const message: groupmodel = {
      from: this.myName,
      content: content,
      grpname:gname,
   //  username:usernames
    };

    return this.chatConnection?.invoke('ReceiveGrpMessage', message)
      .catch(error => console.log(error));
  }



  async sendPrivateMessage(to: string, content: string) {
    
    this.isGroupChat=false;
    //const formattedTime = format(currentTime, 'MMM dd,HH:mm');
    const message: Message = {
      from: this.myName,
      content: content,
      to: to,
    };
    if(this.onlineUsers.includes(to)){
      message.isdelievered=1;
      message.isread=0;
    }
    else{
      message.isdelievered=0;
      message.isread=0;
    }
    if (!this.privateMessageInitiated) {
      this.privateMessageInitiated = true; //if they have started talking with each other
      return this.chatConnection?.invoke('CreatePrivateChat', message).then(() => {
        this.loadprivatechats(to);
    
      })
        .catch(error => console.log(error));
    } else {
   //   this.privateMessages = [...this.privateMessages, message];
      return this.chatConnection?.invoke('ReceivePrivateMessage', message).then(()=>{
        this.loadprivatechats(to);
      })
        .catch(error => console.log(error));
    }
  }
  async closePrivateChatMesage(otherUser: string) {
    return this.chatConnection?.invoke('RemovePrivateChat', this.myName, otherUser)
    .catch(error => console.log(error));
  }

}
