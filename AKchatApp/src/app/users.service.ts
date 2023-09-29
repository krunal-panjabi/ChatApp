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
import { GalleryData } from './Models/galleryData';
import { AllStories } from './Models/allStories';
import { MessageService } from './message.service';
import { notimsg } from './Models/NotiMsg';
import { StoryView } from './Models/storyView';

@Injectable(
  // providedIn: 'root'
)
export class UsersService {
  isgeneral: boolean = false;
  isGroupChat: boolean = false;
  countmsg:number=0;
  isTyping: boolean = false;
  count:any;
  username: string = '';
  toUser: string = '';    
  myName: string = '';      
  typename: string = '';
  imageUrl: string = "https://www.google.com/url?sa=i&url=https%3A%2F%2Fwww.vecteezy.com%2Ffree-vector%2Fprofile-icon&psig=AOvVaw1YXgufaK25e4kCD3jshBmw&ust=1692781344078000&source=images&cd=vfe&opi=89978449&ved=0CBAQjRxqFwoTCOCPlfvz74ADFQAAAAAdAAAAABAJ";
  onlineUsers: string[] = [];
  offlineUsers: OfflineUsers[] = [];
  allStories: AllStories[] = [];
  singleuser!: profile;
  grpmembers: OfflineUsers[] = [];
  likemembers: OfflineUsers[] = [];
  groups: groupname[] = [];
  messages: Message[] = [];
  notimsgs:notimsg[]=[];
  grpmessages: Message[] = [];
  private chatConnection?: HubConnection;
  privateMessages: Message[] = [];
  privateMessageInitiated = false;
  privatetypeintiate = false;
  readonly url = "https://localhost:7239/"
  constructor(private http: HttpClient, private modalService: NgbModal, public msgservice: MessageService) { }

  public postData(User: user): Observable<any> {
    return this.http.post(`${environment.apiUrl}User/Register`, User);
  }

  
  createGroup(grpname: string, members: string): Observable<any> {
    const group = { groupName: grpname, members: members }
    return this.http.post<Message[]>(`${environment.apiUrl}User/CreateGroup`, group);
  }

  uploadGalleryData(caption: string, imgstr: string, uploadedUser: string): Observable<any> {
    const galleryData = { caption: caption, imgstr: imgstr, uploadedUser: uploadedUser }
    return this.http.post<Message[]>(`${environment.apiUrl}User/UploadGalleryData`, galleryData);
  }

  
  getGalleryData(myName :string): Observable<GalleryData[]> {
    return this.http.get<GalleryData[]>(`${environment.apiUrl}User/GetGallery?myName=`+myName);
  }
  
  uploadStoryData(caption: string, imgstr: string, uploadedUser: string): Observable<any> {
    const storyData = { caption: caption, imgstr: imgstr, uploadedUser: uploadedUser }
    return this.http.post(`${environment.apiUrl}User/UploadStoryData`, storyData);
  }

  getStoryData(): Observable<StoryView[]> {
    return this.http.get<StoryView[]>(`${environment.apiUrl}User/GetStory`);
    // .subscribe({
    //     next: (data) => {
    //       this.allStories = data;
    //     },
    //   });
  }
  
  // storyOfUser(userId: any): Observable<any> {
  //   const data = {
  //     userId: userId,
    
  //   };
  //   return this.http.post(`${environment.apiUrl}User/StoryOfUser`,data);
  // }

  storyOfUser(userId: any): Observable<AllStories> {
    const headers = new HttpHeaders({ 'content-type': 'application/json' });
    const params = new HttpParams().set("userId", userId);
    
    return this.http.get<AllStories>(`${environment.apiUrl}User/StoryOfUser`, { 'headers': headers, 'params': params })
  }








  
  CheckName(username: string): Observable<any> {
    const headers = new HttpHeaders({ 'content-type': 'application/json' });
    const params = new HttpParams().set("username", username);
    
    return this.http.get(`${environment.apiUrl}User/CheckForName`, { 'headers': headers, 'params': params })
  }
  dislikemessage(mesaageId: any, name: string): Observable<any> {
    const likeentry = {
      msgid: mesaageId,
      name: name,
      
    }
    return this.http.post(`${environment.apiUrl}User/DisLikemsgbyId`, likeentry)
  }
  dislikemessageGrp(mesaageId: any, name: string) {
    const likeentry = {
      msgid: mesaageId,
      name: name
    }
    return this.http.post(`${environment.apiUrl}User/DisLikemsgbyIdGrp`, likeentry)
  }
  likemessage(mesaageId: any, name: string): Observable<any> {
    console.log('messageid in service', mesaageId);
    const likeentry = {
      msgid: mesaageId,
      name: name,
      toname:this.toUser
    }
    // const headers = new HttpHeaders({ 'content-type': 'application/json' });
    // const params = new HttpParams().set("msgid", mesaageId);
    // const params = new HttpParams().set("msgid", mesaageId);
    return this.http.post(`${environment.apiUrl}User/LikemsgbyId`, likeentry)
  }
  likemessageGrp(mesaageId: any, name: string): Observable<any> {
    const likeentry = {
      msgid: mesaageId,
      name: name
    }
    return this.http.post(`${environment.apiUrl}User/LikemsgbyIdGrp`, likeentry)
  }

  public LoginData(User: user): Observable<any> {

    return this.http.post(`${environment.apiUrl}User/UserLogin`, User);
  }
  public postFile(profiledata: profile): Observable<any> {
    profiledata.username = this.myName;
    return this.http.post(`${environment.apiUrl}User/ProfileData`, profiledata);
  }
  public uploadfile(fileToUpload: File, name: string) {
    const endpoint = `${environment.apiUrl}User/uploadphoto`;
    const formData: FormData = new FormData();
    formData.append('Image', fileToUpload, fileToUpload.name);
    formData.append('name', name);
    return this.http
      .post(endpoint, formData);
  }
  getLikeMembersGrp(msgid: any) {
    const headers = new HttpHeaders({ 'content-type': 'application/json' });
    const params = new HttpParams().set("msgid", msgid);
    return this.http.get<OfflineUsers[]>(`${environment.apiUrl}User/GetLikeMembersGrp`, { 'headers': headers, 'params': params });
  }
  getLikeMembers(msgid: any) {
    const headers = new HttpHeaders({ 'content-type': 'application/json' });
    const params = new HttpParams().set("msgid", msgid);
    return this.http.get<OfflineUsers[]>(`${environment.apiUrl}User/GetLikeMembers`, { 'headers': headers, 'params': params });
  }
  deletenotimsg(msgid:any){
      const headers = new HttpHeaders({ 'content-type': 'application/json' });
    const params = new HttpParams().set("msgid", msgid);
    return this.http.get(`${environment.apiUrl}User/DeleteNotiMsg`, { 'headers': headers, 'params': params });
  }

  getNotificationMsg(){
    const headers = new HttpHeaders({ 'content-type': 'application/json' });
    const params = new HttpParams().set("username", this.myName);
    return this.http.get<notimsg[]>(`${environment.apiUrl}User/GetNotiMsg`, { 'headers': headers, 'params': params });
  }
  getAllUsers() {
    const headers = new HttpHeaders({ 'content-type': 'application/json' });
    const params = new HttpParams().set("username", this.myName);
    return this.http.get<OfflineUsers[]>(`${environment.apiUrl}User/GetOfflineUsers`, { 'headers': headers, 'params': params }).subscribe({
        next: (data) => {
          this.offlineUsers = data;
          console.log(this.offlineUsers);
        },
      });
  }

  getAllUserNames()
  {
    return this.http
      .get<OfflineUsers[]>(`${environment.apiUrl}User/GetAllOfflineUsers`)
    
  }

  getAllGroups(username: string) {

    const headers = new HttpHeaders({ 'content-type': 'application/json' });
    const params = new HttpParams().set("username", username);
    return this.http.get<groupname[]>(`${environment.apiUrl}User/GetGroups`, { 'headers': headers, 'params': params }).subscribe({
      next: (data) => {
        console.log("groupnames", data);
        this.groups = data;
        console.log("group", this.groups);
      },
      error: (error) => {
        if (error.status === 400) {
          console.error("By refreshing the page you got disconnected");
        }
      }
    });
  }

  public getuserprofiledetail(): Observable<profile> {
    const headers = new HttpHeaders({ 'content-type': 'application/json' });
    const params = new HttpParams().set("username", this.myName);
    return this.http.get<profile>(`${environment.apiUrl}User/FetchUserDetail`, { 'headers': headers, 'params': params })
  }
  public getuserImage(name: string): Observable<profile> {
    const headers = new HttpHeaders({ 'content-type': 'application/json' });
    const params = new HttpParams().set("username", name);
    return this.http.get<profile>(`${environment.apiUrl}User/FetchUserDetail`, { 'headers': headers, 'params': params })
  }
  SelectedUsers(users:string){
    alert('called');
    const data={
      userlist:users,
      name:this.myName
    }
    return this.http.post(`${environment.apiUrl}User/SelectedUsers`,data);
  }
  intitializeloadprivatechats(toUser: string, fromUser: string): Observable<Message[]> {
    const headers = new HttpHeaders({ 'content-type': 'application/json' });
    let params = new HttpParams()
    params = params.append('toUser', toUser);
    params = params.append('fromUser', fromUser);
    return this.http.get<Message[]>(`${environment.apiUrl}User/LoadInitialPrivateChat`, { 'headers': headers, 'params': params });
  }

  loadprivatechats(toUser: string) {
    this.isGroupChat = false;
    this.isgeneral=false;
    this.intitializeloadprivatechats(toUser, this.myName).subscribe({
      next: (data) => {
        this.privateMessages = data;
      //  this.count=this.privateMessages.length;
        console.log("the count",this.count)
        console.log("chat", this.privateMessages)
      },
      error: (error) => {
        console.error('error loading private chats', error);
      }
    });
  }

  loadgrpmembers(gpname: string): Observable<OfflineUsers[]> {
    const headers = new HttpHeaders({ 'content-type': 'application/json' });
    let params = new HttpParams()
    params = params.append('grpname', gpname);
    return this.http.get<OfflineUsers[]>(`${environment.apiUrl}User/LoadGrpMembers`, { 'headers': headers, 'params': params });
  }

  intitializeloadgrpchats(name: string, gpname: string): Observable<Message[]> {
    const headers = new HttpHeaders({ 'content-type': 'application/json' });
    let params = new HttpParams()
    params = params.append('grpname', gpname);
    params = params.append('name', name);
    return this.http.get<Message[]>(`${environment.apiUrl}User/LoadInitialGroupChat`, { 'headers': headers, 'params': params });
  }

  loadgrpchats(gpname: string) {
    this.isGroupChat = true;
    this.isgeneral=false;
    this.intitializeloadgrpchats(this.myName, gpname).subscribe({
      next: (data) => {
        this.grpmessages = data;
        console.log("the grpmessages", this.grpmessages);
      },
      error: (error) => {
        console.error('error loading private chats', error);
      }
    });
  }

  storeToken(tokenValue:string){
  localStorage.setItem('token',tokenValue);
  }
  
  


  sendGalleryData(id: any, myName: string): Observable<any> {
    const data = {
      id: id,
      myName: myName
    };
    return this.http.post(`${environment.apiUrl}User/likePost`, data);
  }



  getToken(){
    return localStorage.getItem('token');
  }

  isLoggedIn():boolean{
  return !!localStorage.getItem('token');
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

    this.chatConnection.on('CallForLoadGrpNames', () => {
      this.getAllGroups(this.myName);
    });

    this.chatConnection.on('NewMessage', (newMessage: Message) => {

      this.messages = [...this.messages, newMessage];
    });

    this.chatConnection.on('NewGrpMessage', (gpname: any) => {
      this.loadgrpchats(gpname);
      // this.grpmessages = [...this.grpmessages, newMessage];
    });

    this.chatConnection.on('NewPrivateChatMessage', (newMessage: Message) => {

      this.privateMessages = [...this.privateMessages, newMessage];
    });

    this.chatConnection.on('OpenPrivateChat', (newMessage: Message) => {
      this.loadprivatechats(newMessage.from);
      this.countmsg=this.countmsg+1;
      this.typename = newMessage.from;
      this.privateMessageInitiated = true;
      const modalRef = this.modalService.open(PrivateChatsComponent);
      modalRef.componentInstance.toUser = newMessage.from;
    });
    this.chatConnection.on('NotificationCount',(newMessage:Message)=>{
      this.countmsg=this.countmsg+1;
    });
   this.chatConnection.on('NotificationGrp',(name:string)=>{
    this.countmsg=this.countmsg+1;
   })
   this.chatConnection.on('SendLikeResGrp',(name:string)=>{
    this.countmsg=this.countmsg+1;
   })
    this.chatConnection.on('ReceiveTypingIndicator', (name: string) => {
      this.privatetypeintiate = true;
      this.isTyping = true;
      this.username = name;
      setTimeout(() => {
        this.isTyping = false;
      }, 4000);
    });

    this.chatConnection.on('ReceiveLikeRes', (msgid: any, like: any, messageid: any, count: any, name: any) => {
      
      if (like === 1) {
        this.countmsg=this.countmsg+1;
        this.typename = name;
        this.msgservice.messageDiv2Visibility[msgid] = true;
        const spanClasscount = '.count-' + messageid;
        const selectedSpancount = document.querySelector(spanClasscount) as HTMLElement;
        const spanClassdiv = '.logodiv-' + messageid;
        const selecteddiv = document.querySelector(spanClassdiv) as HTMLElement;
        selecteddiv.classList.remove('d-none');
        if (selectedSpancount) {
          const currentValue = parseInt(selectedSpancount.innerText);
          if (currentValue === 0) {
            selectedSpancount.innerText = '1';
          } else {
            const newValue = currentValue + 1;
            selectedSpancount.innerText = newValue.toString();
          }
        }
      }
      else {
        this.typename = name;
        const spanClassdiv = '.logodiv-' + messageid;
        const selecteddiv = document.querySelector(spanClassdiv) as HTMLElement;

        const spanClasscount = '.count-' + messageid;
        const selectedSpancount = document.querySelector(spanClasscount) as HTMLElement;
        if (selectedSpancount) {
          const currentValue = parseInt(selectedSpancount.innerText);
          const newValue = currentValue - 1;
          selectedSpancount.innerText = newValue.toString();
        }
        if (parseInt(selectedSpancount.innerText) === 0) {
          this.msgservice.messageDiv2Visibility[msgid] = false;
          selecteddiv.classList.add('d-none');
        }
      }
    });

    this.chatConnection.on('ReceiveLikeResById', (msgid: any, like: any, name: any) => {
      const spanClasscount = '.count-' + msgid;
      const selectedSpancount = document.querySelector(spanClasscount) as HTMLElement;
      const spanClassdiv = '.logodiv-' + msgid;
      const selecteddiv = document.querySelector(spanClassdiv) as HTMLElement;
      if (like === 0) {
        if (selectedSpancount) {
          const currentValue = parseInt(selectedSpancount.innerText);
          const newValue = currentValue - 1;
          selectedSpancount.innerText = newValue.toString();
        }
        this.typename = name;
        const spanClass = '.heart-' + msgid;
        const selectedSpan = document.querySelector(spanClass) as HTMLElement;
        if (parseInt(selectedSpancount.innerText) === 0) {
          selecteddiv.classList.add('d-none');
          selectedSpan.classList.add('d-none');
        }
      }

      else {
        if (selectedSpancount) {
          const currentValue = parseInt(selectedSpancount.innerText);
          const newValue = currentValue + 1;
          selectedSpancount.innerText = newValue.toString();
        }
        this.typename = name;
        const spanClass = '.heart-' + msgid;
        const selectedSpan = document.querySelector(spanClass) as HTMLElement;
        selectedSpan.classList.remove('d-none');
      }
    });

    this.chatConnection.on('ReceiveCloseTypingIndicator', (name: string) => {
      alert('close type');
      this.isTyping = false;
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
  async callbackend() {
    return this.chatConnection?.invoke('LoadGrpNames')
      .catch(error => console.log(error));
  }
  async SendLikeRes(msgid: any, like: any, messageid: any, newValue: any) {
    return this.chatConnection?.invoke('SendLikeRes', msgid, this.toUser, like, messageid, newValue, this.myName, this.typename)
      .catch(error => console.log(error));
  }
  async SendLikeResBymsgid(msgid: any, like: any) {
    return this.chatConnection?.invoke('SendLikeResById', msgid, this.toUser, like, this.myName, this.typename)
      .catch(error => console.log(error));
  }
  async SendLikeResGrp(){
    alert('hii');
    const userlist=this.grpmembers.filter(user=>user.username!==this.myName).map(user=>user.username).join(',');
    return this.chatConnection?.invoke('SendLikeResGrp',userlist)
    .catch(error => console.log(error));
    
  }
  startTyping(name: string) {
    if (!name || name.trim() === '') {
      name = this.typename;
    }
    if (!this.privatetypeintiate) {
      this.privatetypeintiate = true;
      return this.chatConnection?.invoke('SendTypingIndicator', name, this.myName)
        .catch(error => console.log(error));
    }
    else {
      return this.chatConnection?.invoke('SendTypingIndicator', name, this.myName)
        .catch(error => console.log(error));
    }
  }
  closeTyping(name: string) {
    return this.chatConnection?.invoke('SendClosingIndicator', name).
      catch(error => console.log(error));
  }
  async sendMessage(content: string) {
    this.isgeneral=true;
    console.log("send message called");
    const message: Message = {
      from: this.myName,
      content: content,
      count: 1
    };

    return this.chatConnection?.invoke('ReceiveMessage', message)
      .catch(error => console.log(error));
  }


  async sendGrpMessage(content: string, gname: string) {
    this.isGroupChat = true;
    this.isgeneral=false;
    const userList = this.grpmembers.filter(user=>user.username!==this.myName).map(user => user.username).join(',');
    const message: groupmodel = {
      from: this.myName,
      content: content,
      grpname: gname,
      userlist:userList
    };
    console.log("the list",userList);
    return this.chatConnection?.invoke('ReceiveGrpMessage', message)
      .catch(error => console.log(error));
  }

  async sendPrivateMessage(to: string, content: string) {
    this.isgeneral=false;
    this.isGroupChat = false;
    //const formattedTime = format(currentTime, 'MMM dd,HH:mm');
    const message: Message = {
      from: this.myName,
      content: content,
      to: to,
      count: 1
    };
    if (this.onlineUsers.includes(to)) {
      message.isdelievered = 1;
      message.isread = 0;
    }
    else {
      message.isdelievered = 0;
      message.isread = 0;
    }
    if (!this.privateMessageInitiated) {
      this.privateMessageInitiated = true; //if they have started talking with each other
      return this.chatConnection?.invoke('CreatePrivateChat', message).then(() => {
        this.loadprivatechats(to);

      })
        .catch(error => console.log(error));
    } else {
      return this.chatConnection?.invoke('ReceivePrivateMessage', message).then(() => {
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
