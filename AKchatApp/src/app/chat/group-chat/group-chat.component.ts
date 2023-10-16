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
  @Input() msgid = '';
  divisionVisible: boolean = false;
  constructor(public activeModal:NgbActiveModal,public service:UsersService){}

  ngOnDestroy(): void {
    this.service.forimagetoggle=false;
    this.service.preview=[];
    // this.service.closePrivateChatMesage(this.toUser);
  }
  forimagediv()
  {
    this.service.preview=[];
    this.service.forimagetoggle=false;
  }
  sendMessage(content:string){
 
    this.service.sendGrpMessage(content,this.GroupName);
    // this.service.sendPrivateMessage(this.toUser,content);
  }
  toggleDivision() {
    this.divisionVisible = !this.divisionVisible;
  }
  imageremove(){
    this.service.preview=[];
  }
}
