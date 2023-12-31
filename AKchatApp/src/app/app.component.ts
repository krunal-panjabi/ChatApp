import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { UsersService } from './users.service';
import { AngularEditorConfig } from '@kolkov/angular-editor';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'AKchatApp';
  constructor(router:Router,public service:UsersService){
    router.events.subscribe(val=>{
     if(window.location.pathname==='/' || window.location.pathname==='/login' || window.location.pathname==='/register'){
      this.service.isLogInComponent=false;
     }
     else{
      this.service.isLogInComponent=true;
     }
    });

    if ('BroadcastChannel' in window) {
      const channel = new BroadcastChannel('session-logout');
      channel.onmessage = (event) => {
        const message=event.data;
        sessionStorage.clear();
      };
    }

    if ('BroadcastChannel' in window) {
      const channel = new BroadcastChannel('session-name');
      channel.onmessage = (event) => {
        const updatedName = event.data;
        sessionStorage.setItem('myName', updatedName);
        this.service.myName=sessionStorage.getItem('myName') || '';
      };
    }
  }
}





