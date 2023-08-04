import { Component, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'app-chat-input',
  templateUrl: './chat-input.component.html',
  styleUrls: ['./chat-input.component.css']
})
export class ChatInputComponent {
content :string='';
@Output() contentemitter = new EventEmitter();

sendMessage(){
  alert('hit sendmessage');
  if(this.content.trim()!=="")
  {
    console.log('teh message',this.content);
    this.contentemitter.emit(this.content);
  }
  this.content="";
}

}
