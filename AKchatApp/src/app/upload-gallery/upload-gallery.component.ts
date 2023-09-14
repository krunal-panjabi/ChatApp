import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { UsersService } from '../users.service';
import { GalleryData } from '../Models/galleryData';
import { Router } from '@angular/router';


@Component({
  selector: 'app-upload-gallery',
  templateUrl: './upload-gallery.component.html',
  styleUrls: ['./upload-gallery.component.css']
})
export class UploadGalleryComponent implements OnInit {
  galleryForm: FormGroup;
  currentUser: any;
  fileToUpload!: File;

  constructor(private formBuilder: FormBuilder, private service: UsersService,private router:Router) {
    this.galleryForm = this.formBuilder.group({
      caption: '',
      imgstr: ''
    });
  }

  ngOnInit() {
    this.galleryForm.reset();
    if (this.service.myName) {

      // this.updateImageUrl(); // Update imageUrl if myName is available
      console.log(this.service.myName);
      
    }
    else{
     setTimeout(() => {
       this.router.navigateByUrl('/no-connection');
       setTimeout(() => {
         this.router.navigateByUrl('/login');
       }, 3000);
     }, 0);
    }
  }


  handleFileInput(event: any) {
    if (event.target.files && event.target.files[0]) {
      const file = event.target.files[0]; // Assuming only one file is selected
      this.convertToBase64(file);
    }
    
  }

  convertToBase64(file: File) {
    const reader = new FileReader();
    reader.onload = (e: any) => {
      const base64String = e.target.result;
  
      this.galleryForm.get('imgstr')?.setValue(base64String);
      this.galleryimg.nativeElement.setAttribute('src',this.galleryForm.get('imgstr')?.value)
    };
    reader.readAsDataURL(file);
  }

  onFormSubmit() {
    const formValue = this.galleryForm.value;

    
    const postData: GalleryData = {
      caption: formValue.caption,
      imgstr: formValue.imgstr,
      uploadedUser: this.service.myName ,
      galleryId : null,
      likeCount : null,
      currentUserLiked : null
    };

    console.log(postData);

    if(this.galleryForm.valid){
           this.service.uploadGalleryData(formValue.caption, formValue.imgstr, this.service.myName).subscribe(data =>{
     
           });
           this.router.navigateByUrl('/gallery')
         }
  }
}