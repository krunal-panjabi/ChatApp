import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { UsersService } from 'src/app/users.service';
import { OfflineUsers } from 'src/app/Models/OfflineUsers';

@Component({
  selector: 'app-private-chats',
  templateUrl: './private-chats.component.html',
  styleUrls: ['./private-chats.component.css']
})
export class PrivateChatsComponent implements OnInit, OnDestroy {
  @Input() toUser = '';
  @Input() image='';
  divisionVisible: boolean = false;


  constructor(public activeModal: NgbActiveModal, public service: UsersService) { 
   // this.isOfflineUser = this.service.offlineUsers.some(user => user.username === this.toUser)
  }

  
  ngOnInit(): void {
    
  }
  ngOnDestroy(): void {
    this.service.closePrivateChatMesage(this.toUser);
  }

  sendMessage(content: string) {
    this.service.sendPrivateMessage(this.toUser, content);
  }

  toggleDivision() {
    this.divisionVisible = !this.divisionVisible;
  }

 
  


}

