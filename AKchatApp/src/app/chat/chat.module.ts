import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ChatRoutingModule } from './chat-routing.module';
import { ChatComponent } from './chat.component';
import { ChatpageComponent } from './chatpage/chatpage.component';
import { MessagesComponent } from './messages/messages.component';
import { ChatInputComponent } from './chat-input/chat-input.component';
import { FormsModule } from '@angular/forms';
import { PrivateChatsComponent } from './private-chats/private-chats.component';


@NgModule({
  declarations: [
    ChatComponent,
    ChatpageComponent,
    MessagesComponent,
    ChatInputComponent,
    PrivateChatsComponent
  ],
  imports: [
    CommonModule,
    ChatRoutingModule,
    FormsModule
  ]
})
export class ChatModule { }
