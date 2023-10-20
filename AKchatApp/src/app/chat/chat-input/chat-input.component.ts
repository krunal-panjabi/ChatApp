import { Component, EventEmitter, OnInit, ElementRef, Output, OnChanges, OnDestroy, AfterViewInit, SimpleChanges, ViewChild, DoCheck } from '@angular/core';
import { UsersService } from 'src/app/users.service';
import { EmojioneAreaDirective } from './emojione-area.diractive';

declare var $: any;

@Component({
  selector: 'app-chat-input',
  templateUrl: './chat-input.component.html',
  styleUrls: ['./chat-input.component.css'],
})
export class ChatInputComponent implements OnInit, OnDestroy, AfterViewInit, OnChanges {

  content: any;
  @Output() contentemitter = new EventEmitter();
  content1: string = '';
  @Output() contentemitter1 = new EventEmitter<string>();
  constructor(public service: UsersService, private el: ElementRef) {
  }

  onTyping() {
    if (this.service.isGroupChat) {
      this.content = $("#mText")[0].emojioneArea.getText();
      if (this.content.trim() != "") {
        const recipientId = 'recipientUserId';
        this.service.startTypingGrp();
      }
      else {
        this.service.closeTypingGrp();
      }
    } else {
      this.content = $("#mText")[0].emojioneArea.getText();
      if (this.content.trim() != "") {
        const recipientId = 'recipientUserId';
        this.service.startTyping(this.service.toUser);
      }
      else {
        this.service.closeTyping(this.service.toUser);
      }
    }

  }

  onselect(e: any) {
    this.service.forimagetoggle = true;
    if (e.target.files) {
      for (let i = 0; i < e.target.files.length; i++) {
        const reader = new FileReader();
        reader.onload = (event: any) => {
          this.service.preview.push(event.target.result);
        }
        reader.readAsDataURL(e.target.files[i]);
      }
    }
  }

  ngOnDestroy(): void {
  }
  ngOnChanges(changes: SimpleChanges): void {
  }
  ngAfterViewInit(): void {
  }

  ngOnInit(): void {
    $('#mText').emojioneArea({
      buttonTitle: "Use the TAB key to insert emoji faster",
     pickerPosition: 'top'
    });
    $(document).on('input', '.emojionearea-editor', () => {
      this.onTyping();
    });
    //   $(this.el.nativeElement).emojioneArea({
    // pickerPosition:'right'
    //   });

  }

  sendMessage() {
    // this.content=(document.querySelector('.emojionearea-editor') as HTMLInputElement).value;
    if (this.service.forimagetoggle) {

      this.contentemitter.emit(this.service.preview[0]);
      this.service.preview=[];
    }
    else {
      this.content = $("#mText")[0].emojioneArea.getText();

      this.service.isTyping = false;
      if (this.content.trim() !== "") {
        console.log('teh message', this.content);
        this.contentemitter.emit(this.content);
      }
      this.content = $("#mText")[0].emojioneArea.setText('');
      this.content = "";
    }

  }
}
