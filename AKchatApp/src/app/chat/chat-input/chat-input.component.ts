import { Component, EventEmitter, OnInit,ElementRef, Output, OnChanges, OnDestroy, AfterViewInit, SimpleChanges, ViewChild,DoCheck} from '@angular/core';
import { UsersService } from 'src/app/users.service';
import { EmojioneAreaDirective } from './emojione-area.diractive';

declare var $:any;

@Component({
  selector: 'app-chat-input',
  templateUrl: './chat-input.component.html',
  styleUrls: ['./chat-input.component.css'],
})
export class ChatInputComponent implements OnInit,OnDestroy,AfterViewInit,OnChanges{
 
content :any;
@Output() contentemitter = new EventEmitter();
content1: string = '';
@Output() contentemitter1 = new EventEmitter<string>();
constructor(public service:UsersService,private el:ElementRef){
}

onTyping() {
  this.content= $("#mText")[0].emojioneArea.getText();
  if(this.content.trim()!="")
  {
    const recipientId = 'recipientUserId';
    this.service.startTyping(this.service.toUser);
  }
  else{
    this.service.closeTyping(this.service.toUser);
  }
}

ngOnDestroy(): void {
  // $('#mText').emojioneArea({
  //   pickerPosition:'right',
  //   destroy:true
  // });

}
ngOnChanges(changes: SimpleChanges): void {
  // if(this.content.trim()!="")
  // {
  //   this.onTyping();
  // }
}
ngAfterViewInit(): void {
//   const mytext=this.el.nativeElement.querySelector('#mText');
// $(mytext).emojioneArea({
//   pickerPosition:'right'
// })
// $(this.messageEditor.nativeElement).emojioneArea({
//   pickerPosition:'right'
// })
}

ngOnInit(): void {
  $('#mText').emojioneArea({
    pickerPosition:'right'
  });
 $(document).on('input','.emojionearea-editor',()=>{
  this.onTyping();
 });
//   $(this.el.nativeElement).emojioneArea({
// pickerPosition:'right'
//   });

}

sendMessage(){
    // this.content=(document.querySelector('.emojionearea-editor') as HTMLInputElement).value;
  this.content= $("#mText")[0].emojioneArea.getText(); 

  this.service.isTyping=false;
  if(this.content.trim()!=="")
  {
    console.log('teh message',this.content);
    this.contentemitter.emit(this.content);
  }
  this.content= $("#mText")[0].emojioneArea.setText('');
  this.content="";
}
}
