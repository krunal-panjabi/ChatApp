import { Component, OnDestroy, OnInit } from '@angular/core';
import { OfflineUsers } from 'src/app/Models/OfflineUsers';
import { UsersService } from 'src/app/users.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { GroupCreateComponent } from '../group-create/group-create.component';

@Component({
  selector: 'app-chatpage',
  templateUrl: './chatpage.component.html',
  styleUrls: ['./chatpage.component.css']
})
export class ChatpageComponent implements OnInit,OnDestroy {

  constructor(public service : UsersService ,  private modalService: NgbModal) { }
  
 ngOnDestroy(): void {
  alert('destroyed');
   this.service.stopChatConnection();
 }

  ngOnInit(): void {
    alert("here hitted");
    this.service.getAllUsers();
    this.service.createChatConnection();
  }

  openGroupModal(){
    const modalRef = this.modalService.open(GroupCreateComponent);
    modalRef.componentInstance;
  }

 

}
