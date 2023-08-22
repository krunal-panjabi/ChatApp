import { Component, EventEmitter, Output } from '@angular/core';
import { UsersService } from 'src/app/users.service';
import { debounceTime } from 'rxjs/operators';
import { Subject } from 'rxjs';
@Component({
  selector: 'app-chat-input',
  templateUrl: './chat-input.component.html',
  styleUrls: ['./chat-input.component.css']
})
export class ChatInputComponent {
content :string='';
@Output() contentemitter = new EventEmitter();
content1: string = '';

@Output() contentemitter1 = new EventEmitter<string>();
constructor(public service:UsersService){

}
onTyping() {
   console.log('read content');
  if(this.content.trim()!="")
  {
    const recipientId = 'recipientUserId';
    this.service.startTyping(this.service.toUser);
  }
  else{
    console.log('else block');
    this.service.closeTyping(this.service.toUser);
  }
}
// onTyping() { 
//   const recipientId = 'recipientUserId'; 
//   if (this.typingTimeout) 
//   { clearTimeout(this.typingTimeout); } 
//   this.typingTimeout = setTimeout(() => { this.service.startTyping(this.service.toUser); }, 3000); // 3000 milliseconds = 3 seconds }
// }

  sendMessage(){
  this.service.isTyping=false;
  if(this.content.trim()!=="")
  {
    console.log('teh message',this.content);
    this.contentemitter.emit(this.content);
  }
  this.content="";
}

}
