import { Component, Input } from '@angular/core';
import { Message } from 'src/app/Models/message';
import { UsersService } from 'src/app/users.service';
import { DialogBodyComponent } from '../dialog-body/dialog-body.component';

@Component({
  selector: 'app-messages',
  templateUrl: './messages.component.html',
  styleUrls: ['./messages.component.css']
})
export class MessagesComponent {
@Input() messages:Message[]=[];
messageDivVisibility: { [key: number]: boolean } = {};
constructor(public service:UsersService){ 
}
closediv(mesaageId:number){
  this.messageDivVisibility[mesaageId] = false;
}
togglediv(mesaageId:number)
{
this.messageDivVisibility[mesaageId] = true;
Object.keys(this.messageDivVisibility).forEach(key=>{
  const numerickey=parseInt(key);
if(!isNaN(numerickey) && numerickey!==mesaageId){
  this.messageDivVisibility[numerickey]=false;
}
});
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
