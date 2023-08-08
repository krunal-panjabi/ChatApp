import { Component, Input } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { UsersService } from 'src/app/users.service';

@Component({
  selector: 'app-group-chat',
  templateUrl: './group-chat.component.html',
  styleUrls: ['./group-chat.component.css']
})
export class GroupChatComponent {
  @Input() GroupName='';
  constructor(public activeModal:NgbActiveModal,public service:UsersService){}

  ngOnDestroy(): void {
    // this.service.closePrivateChatMesage(this.toUser);
  }
  
  sendMessage(content:string){
 
    this.service.sendGrpMessage(content,this.GroupName);
    // this.service.sendPrivateMessage(this.toUser,content);
  }
}
