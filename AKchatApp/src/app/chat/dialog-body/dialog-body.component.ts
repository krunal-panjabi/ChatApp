import { Component } from '@angular/core';
import { UsersService } from 'src/app/users.service';

@Component({
  selector: 'app-dialog-body',
  templateUrl: './dialog-body.component.html',
  styleUrls: ['./dialog-body.component.css']
})
export class DialogBodyComponent {
  constructor(public service:UsersService){}
}
