import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { UsersService } from 'src/app/users.service';
import { OfflineUsers } from 'src/app/Models/OfflineUsers';
import { Router } from '@angular/router';


@Component({
  selector: 'app-private-chats',
  templateUrl: './private-chats.component.html',
  styleUrls: ['./private-chats.component.css']
})
export class PrivateChatsComponent implements OnInit, OnDestroy {
  @Input() toUser = '';
  @Input() image='';
  divisionVisible: boolean = false;


  constructor(public activeModal: NgbActiveModal, public service: UsersService,private router:Router) { 
   // this.isOfflineUser = this.service.offlineUsers.some(user => user.username === this.toUser)
  }

  
  ngOnInit(): void {
    if (this.service.myName) {

      // this.updateImageUrl(); // Update imageUrl if myName is available
      console.log(this.service.myName);
      
    }
    else{
     setTimeout(() => {
       this.router.navigateByUrl('/no-connection');
       setTimeout(() => {
         this.router.navigateByUrl('/login');
       }, 3000);
     }, 0);
    }
    
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

