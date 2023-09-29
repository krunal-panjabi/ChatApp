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
  @ViewChild('galleryimg') galleryimg !:ElementRef ;
  urls = new Array<string>();
  selectedFiles?: FileList;


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

  
  detectFiles(event: any) {
 
    this.selectedFiles = event.target.files;
    // console.log("the files",this.selectedFiles);
    if (this.selectedFiles) {
      const numberOfFiles = this.selectedFiles.length;
      for (let i = 0; i < numberOfFiles; i++) {
        const reader = new FileReader();

        reader.onload = (e: any) => {
          const base64String = e.target.result;
          this.urls.push(base64String);
         
        };
        // console.log(this.urls);

        this.storyForm.get('imgstr')?.setValue(this.urls);

        // reader.readAsDataURL(this.selectedFiles[i]);
      }
      // for (let file of this.selectedFiles) {
      //   let reader = new FileReader();
      //   reader.onload = (e: any) => {
      //     const base64String = e.target.result;
      //     this.urls.push(base64String);
      //     console.log('Base64 Image:', base64String);
      //   }
      //   reader.readAsDataURL(file);
      // }
    }
  }
  



  // handleFileInput(event: any) {
  //   if (event.target.files && event.target.files[0]) {
  //     const file = event.target.files[0]; // Assuming only one file is selected
  //     this.convertToBase64(file);
  //   }
    
  // }

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
    const formValue = this.storyForm.value;

    console.log(formValue);
    
    const postData: StoryData = {
      caption: formValue.caption,
      imgstr: formValue.imgstr,
      uploadedUser: this.service.myName
     
    };

    console.log(postData);

    // if(this.storyForm.valid){
    //        this.service.uploadStoryData(formValue.caption, formValue.imgstr, this.service.myName).subscribe(data =>{
    //         this.dialogRef.close({submitted : true});
    //         this.service.getStoryData().subscribe({
    //           next:(data)=>{
    //             this.service.allStories=data;
    //           },
    //         })
    //        });
    //       //  this.service.getStoryData().subscribe(data => {
    //       //   this.allStories = data;
    //       // });
    //      }
  }
}
