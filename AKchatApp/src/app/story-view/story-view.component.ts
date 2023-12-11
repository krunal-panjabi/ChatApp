import { Component, ElementRef, Inject, Renderer2 } from '@angular/core';
import { UsersService } from '../users.service';
import { AllStories } from '../Models/allStories';
import { StoryView } from '../Models/storyView';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import * as $ from 'jquery';
// import 'slick-carousel';



@Component({
  selector: 'app-story-view',
  templateUrl: './story-view.component.html',
  styleUrls: ['./story-view.component.css']
})
export class StoryViewComponent {
  Story: StoryView[] = [];
  slideIndex = 0;
  currentIndex: number = 0;
  // _abc: string[] = [];
  storydata: any = this.data['res'];
  elements: string[] = this.storydata.imgstr.split(',data');
  newElements = this.elements.map((item, index) => (index === 0 ? item : `data${item}`));
  constructor(public service: UsersService, @Inject(MAT_DIALOG_DATA) public data: any, private elementRef: ElementRef, private renderer: Renderer2) { }
  // set abc(value: string[]) {
  //   this._abc = value;
  // }

  // get abc(): string[] {
  //   return this._abc;
  // }


  // updateProgressBar() {
  //   const progressBar = this.elementRef.nativeElement.querySelector('#progressBar');
  //   const progressBarDiv = progressBar.querySelector('div.bar');

  //   const timetotal = 4; // Total time in seconds
  //   let timeleft = timetotal;

  //   const progressBarWidth = (timeleft / timetotal) * 100;
  //   this.renderer.setStyle(progressBarDiv, 'width', progressBarWidth + '%');
  // }

  getCurrentSlideUrl() {
    return `${this.newElements[this.currentIndex]}`;
  }

  goToPrevious(): void {
    const isFirstSlide = this.currentIndex === 0;
    const newIndex = isFirstSlide
      ? this.newElements.length - 1
      : this.currentIndex - 1;
    this.currentIndex = newIndex;
  }

  goToNext(): void {
    const isLastSlide = this.currentIndex === this.newElements.length - 1;
    const newIndex = isLastSlide ? 0 : this.currentIndex + 1;
    this.currentIndex = newIndex;
    // this.updateProgressBar();
  }

  goToSlide(slideIndex: number): void {
    this.currentIndex = slideIndex;
  }
  // restartProgressBar() {
  //   const progressBar = this.elementRef.nativeElement.querySelector('#progressBar');
  //   const progressBarDiv = progressBar.querySelector('div.bar');
  //   const timetotal = 4; // Total time in seconds

  //   // Reset the timer variables
  //   let timeleft = timetotal;

  //   // Reset the progress bar to its initial state
  //   const progressBarWidth = (timeleft / timetotal) * 100;
  //   this.renderer.setStyle(progressBarDiv, 'width', progressBarWidth + '%');
  // }
  ngOnInit(): void {
    console.log(this.newElements);
  }
    showSlides() {
      let i;
      const slides = document.getElementsByClassName("mySlides") as HTMLCollectionOf<HTMLElement>;
      const dots = document.getElementsByClassName("dot");
      console.log(slides)
      for (i = 0; i < slides.length; i++) {
        slides[i].style.display = "none";
      }

      this.slideIndex++;

      if (this.slideIndex > slides.length) {
        this.slideIndex = 1;
      }

      for (i = 0; i < dots.length; i++) {
        dots[i].className = dots[i].className.replace(" active", "");
      }

      slides[this.slideIndex - 1].style.display = "block";
      dots[this.slideIndex - 1].className += " active";

      setTimeout(() => {
        this.showSlides();
      }, 4000); 
    }



















  // ngAfterViewInit(): void {


  // $('#carousel-slider').slick({
  //   arrows: false,
  //   infinite: true,
  //   slidesToShow: 1,
  //   slidesToScroll: 1,
  //   autoplay: true,
  //   autoplaySpeed: 1500,
  //   mobileFirst: true
  // });


  //   const progressBar = this.elementRef.nativeElement.querySelector('#progressBar');
  //   const progressBarDiv = progressBar.querySelector('div.bar');

  //   const timetotal = 4; // Total time in seconds
  //   let timeleft = timetotal;

  //   const updateProgressBar = () => {
  //     const progressBarWidth = (timeleft / timetotal) * 100;
  //     this.renderer.setStyle(progressBarDiv, 'width', progressBarWidth + '%');
  //     // progressBarDiv.innerHTML = Math.floor(timeleft / 60) + ':' + (timeleft % 60);
  //   };

  //   const interval = setInterval(() => {
  //     if (timeleft > 0) {
  //       timeleft--;
  //       updateProgressBar();
  //     } else {
  //       clearInterval(interval);
  //     }
  //   }, 1000);

  //   updateProgressBar();

  //   const restartButton = document.getElementById('restartButton');
  //   if (restartButton) {
  //     restartButton.addEventListener('click', () => {
  //       // this.restartProgressBar(); // Call the function to restart the progress bar and timer
  //     });
  //   } else {
  //     console.error('Button with ID "restartButton" not found.');
  //   }



  // }



}
