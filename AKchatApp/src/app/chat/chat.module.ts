import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ChatRoutingModule } from './chat-routing.module';
import { ChatComponent } from './chat.component';
import { ChatpageComponent } from './chatpage/chatpage.component';
import { MessagesComponent } from './messages/messages.component';
import { ChatInputComponent } from './chat-input/chat-input.component';
import { GroupCreateComponent } from './group-create/group-create.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { PrivateChatsComponent } from './private-chats/private-chats.component';
import { GroupChatComponent } from './group-chat/group-chat.component';
import { DialogBodyComponent } from './dialog-body/dialog-body.component';
import { ChatInputGeneralComponent } from './chat-input-general/chat-input-general.component';
import { MaterialModule } from '../material.module';
import {MatChipInputEvent, MatChipsModule} from '@angular/material/chips';
// import { ToastrModule } from 'ngx-toastr';

@NgModule({
  declarations: [
    ChatComponent,
    ChatpageComponent,
    MessagesComponent,
    ChatInputComponent,
    PrivateChatsComponent,
    GroupCreateComponent,
    GroupChatComponent,
    DialogBodyComponent,
    ChatInputGeneralComponent
  ],
  imports: [
    CommonModule,
    ChatRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    MaterialModule,
    MatChipsModule,
    // MatChatInputEvent
    // ToastrModule
  ]
})
export class ChatModule { }
