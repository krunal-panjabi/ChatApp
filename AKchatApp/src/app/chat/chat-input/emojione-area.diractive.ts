import { Directive, ElementRef, OnInit } from '@angular/core';
declare var $:any;
@Directive({
  selector: '[appEmojioneArea]'
})
export class EmojioneAreaDirective implements OnInit {
  constructor(private el: ElementRef) {}

  ngOnInit(): void {
    // Initialize your emojioneArea behavior here
    $(this.el.nativeElement).emojioneArea({
      pickerPosition: 'right'
    });
  }
}
