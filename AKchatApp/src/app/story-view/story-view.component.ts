import { Component, ElementRef, Inject, Renderer2 } from '@angular/core';
import { UsersService } from '../users.service';
import { AllStories } from '../Models/allStories';
import { StoryView } from '../Models/storyView';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';


@Component({
  selector: 'app-story-view',
  templateUrl: './story-view.component.html',
  styleUrls: ['./story-view.component.css']
})
export class StoryViewComponent {
  Story: StoryView []=[];
  constructor(public service : UsersService,@Inject(MAT_DIALOG_DATA) public data: any,private elementRef: ElementRef,private renderer: Renderer2){}
  storydata:any=this.data['res'];
  ngOnInit():void{


  }

  ngAfterViewInit(): void {
    const progressBar = this.elementRef.nativeElement.querySelector('#progressBar');
    const progressBarDiv = progressBar.querySelector('div.bar');
  
    const timetotal = 4; // Total time in seconds
    let timeleft = timetotal;
  
    const updateProgressBar = () => {
      const progressBarWidth = (timeleft / timetotal) * 100;
      this.renderer.setStyle(progressBarDiv, 'width', progressBarWidth + '%');
      // progressBarDiv.innerHTML = Math.floor(timeleft / 60) + ':' + (timeleft % 60);
    };
  
    const interval = setInterval(() => {
      if (timeleft > 0) {
        timeleft--;
        updateProgressBar();
      } else {
        clearInterval(interval);
      }
    }, 1000);
  
    updateProgressBar();
  }
  
}
