import { Component, ElementRef, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { UsersService } from '../users.service';
import { Router } from '@angular/router';
import { GalleryData } from '../Models/galleryData';
import { StoryData } from '../Models/storyData';
import { AllStories } from '../Models/allStories';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-story-upload',
  templateUrl: './story-upload.component.html',
  styleUrls: ['./story-upload.component.css']
})
export class StoryUploadComponent  {
  @ViewChild('fileInput') fileInput: any;
  @ViewChild('galleryimg') galleryimg !:ElementRef ;
  urls = new Array<string>();
  selectedFiles?: FileList;
  previews: string[] = [];
  isslider=false;
  isbutton=false;
  slideIndex = 0;            


  currentIndex: number = 0;      
  storyForm: FormGroup;

  constructor(private formBuilder: FormBuilder, private service: UsersService,private router:Router,public dialogRef: MatDialogRef<StoryUploadComponent>) {
    this.storyForm = this.formBuilder.group({
      caption: '',
      imgstr: []
    });
  }


  // detectFiles(event : any) {
  //   this.urls = [];
  //   let files = event.target.files;
  //   if (files) {
  //     for (let file of files) {
  //       let reader = new FileReader();
  //       reader.onload = (e: any) => {
  //         this.urls.push(e.target.result);
  //       }
  //       reader.readAsDataURL(file);
  //     }
  //     this.convertToBase64(files);
  //   }
  // }

  selectimage() {
    this.fileInput.nativeElement.click();
  }
  // removeImage(index: number) {
  //   this.previews.splice(index, 1);
  // }
  removeCurrentImage(): void {
    console.log("the preview",this.previews);
    if (this.previews.length > 1) {
      this.previews.splice(this.currentIndex, 1);

      if (this.currentIndex >= this.previews.length) {
        this.currentIndex = this.previews.length - 1;
      }
      console.log('the remove',this.previews.length);
      if(this.previews.length===1){
        this.isbutton=false;
      }
    }
    else{
      this.previews=[];
      this.isslider=false;
      console.log("the empty preview",this.previews);
    }
  }
  goToPrevious(): void {
    const isFirstSlide = this.currentIndex === 0;
    const newIndex = isFirstSlide
      ? this.previews.length - 1
      : this.currentIndex - 1;

 
    this.currentIndex = newIndex;
  }

  goToNext(): void {
    const isLastSlide = this.currentIndex === this.previews.length - 1;
    const newIndex = isLastSlide ? 0 : this.currentIndex + 1;

    this.currentIndex = newIndex;
  }
  goToSlide(slideIndex: number): void {
    this.currentIndex = slideIndex;
  }

  detectFiles(event: any) {
    alert('called');
    this.previews = [];
   
    this.selectedFiles = event.target.files;
    if (this.selectedFiles && this.selectedFiles[0]) {
      const numberOfFiles = this.selectedFiles.length;
      for (let i = 0; i < numberOfFiles; i++) {
        const reader = new FileReader();

        reader.onload = (e: any) => {
          // console.log(e.target.result);
          this.previews.push(e.target.result);
          if (this.previews.length > 0) {
                  this.isslider=true;
                  console.log("the length",this.previews.length);
          }
          if(this.previews.length>1){
            this.isbutton=true;
          }
        };
        reader.readAsDataURL(this.selectedFiles[i]);
      }
    }
  
  }

  getCurrentSlideUrl() {
    return `${this.previews[this.currentIndex]}`;
  }
 

  convertToBase64(file: File) {
    const reader = new FileReader();
    reader.onload = (e: any) => {
      const base64String = e.target.result;

      this.storyForm.get('imgstr')?.setValue(base64String);
       this.galleryimg.nativeElement.setAttribute('src',this.storyForm.get('imgstr')?.value)
    };
    reader.readAsDataURL(file);
  }

  onFormSubmit() {
    const imgstr = this.previews.join(',');
    // Set the imgstr value in the form control
    this.storyForm.get('imgstr')?.setValue(imgstr);
    const formValue = this.storyForm.value;

    console.log(formValue);

    const postData: StoryData = {
      caption: formValue.caption,
      imgstr: formValue.imgstr,
      uploadedUser: this.service.myName

    };

    console.log(postData);

    if(this.storyForm.valid){
           this.service.uploadStoryData(formValue.caption, formValue.imgstr, this.service.myName).subscribe(data =>{
            this.dialogRef.close({submitted : true});
            this.service.getStoryData().subscribe({
              next:(data)=>{
                this.service.allStories=data;
                this.service.LiveStory();
              },

            })
           });
          //  this.service.getStoryData().subscribe(data => {
          //   this.allStories = data;
          // });
         }
  }
}
