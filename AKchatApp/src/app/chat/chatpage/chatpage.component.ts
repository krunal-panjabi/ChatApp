import { Component, OnInit } from '@angular/core';
import { UsersService } from 'src/app/users.service';

@Component({
  selector: 'app-chatpage',
  templateUrl: './chatpage.component.html',
  styleUrls: ['./chatpage.component.css']
})
export class ChatpageComponent implements OnInit {

  constructor(public service : UsersService) { }
  
  ngOnInit(): void {
    alert("here hitted");
    this.service.createChatConnection();
  }

}
