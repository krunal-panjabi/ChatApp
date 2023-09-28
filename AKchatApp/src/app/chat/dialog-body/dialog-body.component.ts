import { Component } from '@angular/core';
import { UsersService } from 'src/app/users.service';

@Component({
  selector: 'app-dialog-body',
  templateUrl: './dialog-body.component.html',
  styleUrls: ['./dialog-body.component.css']
})
export class DialogBodyComponent {
  flag:boolean=false;
  constructor(public service:UsersService){}
  toggle(name:string){
    debugger;
    const divClass = '.user-' + name;
    const selecteddiv = document.querySelector(divClass) as HTMLElement;
    selecteddiv.classList.add('d-none');
  }
  togglediv()
  {
    this.flag=!this.flag;
  }
}
