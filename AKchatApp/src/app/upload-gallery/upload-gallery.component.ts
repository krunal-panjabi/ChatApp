import { Component, ElementRef, OnInit, Renderer2, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { UsersService } from '../users.service';
import { GalleryData } from '../Models/galleryData';
import { Router } from '@angular/router';
import { data } from 'jquery';


@Component({
  selector: 'app-upload-gallery',
  templateUrl: './upload-gallery.component.html',
  styleUrls: ['./upload-gallery.component.css']
})
export class UploadGalleryComponent implements OnInit {
  @ViewChild('galleryimg') galleryimg !:ElementRef ;
  galleryForm: FormGroup;
  currentUser: any;
  fileToUpload!: File;
  imgg : string ='';
  grid = true;
  selectedTags = '';
  selectedProfiles: Set<string> = new Set();
  constructor(private formBuilder: FormBuilder, public service: UsersService,private router:Router,private renderer: Renderer2,private elementRef: ElementRef) {
    this.galleryForm = this.formBuilder.group({
      caption: '',
      imgstr: ''
    });
  }

  ngOnInit() {
    this.service.myName = sessionStorage.getItem('myName') || '';
    this.service.imageUrl=sessionStorage.getItem('userimage') || '';
    this.galleryForm.reset();
    this.service.getAllUsers().subscribe({
      next:(data)=>{
        this.service.offlineUsers=data;
        
      }
    })
    this.service.createChatConnection();
  }


  handleFileInput(event: any) {
    if (event.target.files && event.target.files[0]) {
      const file = event.target.files[0]; // Assuming only one file is selected
      this.convertToBase64(file);
      console.log("newww"+file);
    }
    
  }
  includename(name: string): void {
    if (this.selectedProfiles.has(name)) {
      this.selectedProfiles.delete(name);
    } else {
      this.selectedProfiles.add(name);
    }
    this.selectedTags = Array.from(this.selectedProfiles).join(',');
  }
  // tagpeople(){
  //   const divElement = this.elementRef.nativeElement.querySelector('#afterclick');
  //   const divElement1 = this.elementRef.nativeElement.querySelector('#afterclick1');
  //   const divElement2 = this.elementRef.nativeElement.querySelector('#afterclick2');
    
    
    
  //   if (divElement2.classList.contains('d-flex')) {
  //     this.renderer.removeClass(divElement2, 'd-flex');
  //   } else {
  //     this.renderer.addClass(divElement2, 'd-flex');
  //   }

  //   if (divElement.classList.contains('afterclick')) {
  //     this.renderer.removeClass(divElement, 'afterclick');
  //   } else {
  //     this.renderer.addClass(divElement, 'afterclick');
  //   }

  //   if (divElement1.classList.contains('afterclick1')) {
  //     this.renderer.removeClass(divElement1, 'afterclick1');
  //     this.renderer.addClass(divElement1, 'd-none');
  //   } else {
  //     this.renderer.removeClass(divElement1, 'd-none');
  //     this.renderer.addClass(divElement1, 'afterclick1');
  //   }


  // }

  convertToBase64(file: File) {
    const reader = new FileReader();
    reader.onload = (e: any) => {
      const base64String = e.target.result;
      // Do something with the base64String, such as assigning it to a variable or form control
      // For example, if you want to set it in a form control:
      this.galleryForm.get('imgstr')?.setValue(base64String);
      this.galleryimg.nativeElement.src = base64String;  
    };
    reader.readAsDataURL(file);
  }
  

  tagpeople(){
    const divElement = this.elementRef.nativeElement.querySelector('#afterclick');
    const divElement1 = this.elementRef.nativeElement.querySelector('#afterclick1');
    const divElement2 = this.elementRef.nativeElement.querySelector('#afterclick2');
    
    
    
    if (divElement2.classList.contains('d-flex')) {
      this.renderer.removeClass(divElement2, 'd-flex');
    } else {
      this.renderer.addClass(divElement2, 'd-flex');
    }

    if (divElement.classList.contains('afterclick')) {
      this.renderer.removeClass(divElement, 'afterclick');
    } else {
      this.renderer.addClass(divElement, 'afterclick');
    }

    if (divElement1.classList.contains('afterclick1')) {
      this.renderer.removeClass(divElement1, 'afterclick1');
      this.renderer.addClass(divElement1, 'd-none');
    } else {
      this.renderer.removeClass(divElement1, 'd-none');
      this.renderer.addClass(divElement1, 'afterclick1');
    }


  }

  onFormSubmit() {
    const formValue = this.galleryForm.value;
    const postData: GalleryData = {
      caption: formValue.caption,
      imgstr: formValue.imgstr,
      uploadedUser: this.service.myName ,
      galleryId : null,
      likeCount : null,
      currentUserLiked : null,
      userimage : null,
      tagnames:this.selectedTags
    };
    if(this.galleryForm.valid){
           this.service.uploadGalleryData(formValue.caption, formValue.imgstr, this.service.myName,this.selectedTags).subscribe({
            next:(data:any)=>{
              this.service.LiveNotiforPost(this.selectedTags);
            }
           });
                
          
           this.service.getGalleryData(this.service.myName);
           this.router.navigateByUrl('/gallery')
         }
  }
}