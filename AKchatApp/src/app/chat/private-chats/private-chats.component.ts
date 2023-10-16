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
  @Input() msgid = '';
  @Input() scrollautomatic: any;
  divisionVisible: boolean = false;


  constructor(public activeModal: NgbActiveModal, public service: UsersService,private router:Router) { 
  }

  forimagediv()
  {
    this.service.preview=[];
    this.service.forimagetoggle=false;
  }
  ngOnInit(): void {

    console.log("User name",this.toUser);
    if (this.service.myName) {

      console.log("the name",this.service.myName);
      
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
    this.service.forimagetoggle=false;
    this.service.preview=[];
  }

  sendMessage(content: string) {

    this.service.sendPrivateMessage(this.toUser, content);
  }

  toggleDivision() {
    this.divisionVisible = !this.divisionVisible;
  }
  imageremove(){
    this.service.preview=[];
  }
}

