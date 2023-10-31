import { Component, EventEmitter, Output } from '@angular/core';
import { UsersService } from 'src/app/users.service';
declare var $:any;
@Component({
  selector: 'app-chat-input-general',
  templateUrl: './chat-input-general.component.html',
  styleUrls: ['./chat-input-general.component.css']
})
export class ChatInputGeneralComponent {
  content :string='';
  @Output() contentemitter = new EventEmitter();
  content1: string = '';
  

  constructor(public service:UsersService){
  
  }
  ngOnInit(): void {
    $('#mTexts').emojioneArea({
      pickerPosition:'top'
    });
   $(document).on('input','.emojionearea-editor',()=>{
    
   });
  }
  
  
    sendMessage(){
      this.content= $("#mTexts")[0].emojioneArea.getText();
    if(this.content.trim()!=="")
    {
      console.log('teh message',this.content);
      this.contentemitter.emit(this.content);
    }
    this.content= $("#mTexts")[0].emojioneArea.setText('');
    this.content=""
  }
}
