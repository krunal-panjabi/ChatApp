import { Component, Input } from '@angular/core';
import { Message } from 'src/app/Models/message';
import { UsersService } from 'src/app/users.service';

@Component({
  selector: 'app-messages',
  templateUrl: './messages.component.html',
  styleUrls: ['./messages.component.css']
})
export class MessagesComponent {
@Input() messages:Message[]=[];
showContextMenu = false;


constructor(public service:UsersService){
  
}

onDivRightClick(event: MouseEvent): void {
  event.preventDefault(); // Prevent the default browser context menu
  console.log("hello");
  this.showContextMenu = !this.showContextMenu;
  // Add your custom logic here
}

deleteChat(){
  alert("deleted");
}


openDialog(){
  alert("dialogue box");
}

}
