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

constructor(public service:UsersService){
  
}
}
