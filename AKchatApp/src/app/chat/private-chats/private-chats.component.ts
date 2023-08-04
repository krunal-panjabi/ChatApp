import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { UsersService } from 'src/app/users.service';

@Component({
  selector: 'app-private-chats',
  templateUrl: './private-chats.component.html',
  styleUrls: ['./private-chats.component.css']
})
export class PrivateChatsComponent implements OnInit,OnDestroy {
  @Input() toUser='';
  constructor(public activeModal:NgbActiveModal,public service:UsersService){}
  ngOnInit(): void {
    
  }
ngOnDestroy(): void {
  this.service.closePrivateChatMesage(this.toUser);
}

sendMessage(content:string){
  this.service.sendPrivateMessage(this.toUser,content);
}
}
