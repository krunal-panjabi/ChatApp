import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UsersService } from '../users.service';
import { Router } from '@angular/router';
import { profile } from '../Models/profile';
import { MatStep, MatStepper } from '@angular/material/stepper';
import { AngularEditorConfig } from '@kolkov/angular-editor';

@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.css']
})

export class UserProfileComponent implements OnInit {
  @ViewChild('button2') button2!: ElementRef;
  @ViewChild('stepper') stepper!: MatStepper;

  currentUser: any;
  imageUrl: string = "";
  imageUrl2: string = "";
  fileToUpload!: File;
  file!: File;
  file1!:File;
  nameError: boolean = false;
  emailError:boolean=false;
  htmlContent = '';
  empForm: FormGroup;
  oldname = '';
  
  ngOnInit(): void {
    this.service.myName = sessionStorage.getItem('myName') || '';
    this.service.imageUrl = sessionStorage.getItem('userimage') || '';
    this.service.getuserprofiledetail().subscribe({
      next: (data: profile) => {
        this.service.singleuser = data;
        this.imageUrl2=data.imgstr2 ?? '';
        console.log(data);
        this.empForm.patchValue(this.service.singleuser);
      },
      error: (error) => {
        console.error('Error loading private chats', error);
      }
    });
   

    if (this.service.imageUrl === "") {

      this.imageUrl = ""; // Replace with your actual default image URL
    } else {
      this.imageUrl = this.service.imageUrl;
    }
  
    
  }

//   if (this.service.imageUrl2 === "") {

//     this.imageUrl2 = ""; 
//   } else {
//     this.imageUrl2 = this.service.imageUrl2;
//   }
// }


  constructor(private formBuilder: FormBuilder, public service: UsersService, private router: Router) {
    if (window.location.pathname !== "/chat") {
      service.isButtonVisisble = true;
    }
    this.empForm = this.formBuilder.group({
      name: ['', Validators.required],
      email: ['', [Validators.email,this.validateEmail]],
      gender: '',
      phonenumber:'',
      dob: [null, Validators.required],
      aboutme: '',
      status: '',
      imgstr: '',
      imgstr2: '',
      workplace:'',
      schoolname:'',
      clgname:'',
      instalink:'',
      twitterlink:'',
      facebooklink:'',
      linkdinlink:''
    });
  }

  validateNamepro(event: any) {
    if (event.target.value.trim() !== this.service.myName && event.target.value.trim().length > 0) {
      this.service.CheckName(event.target.value).subscribe({
        next: (response) => {
          if (!response) {
            this.empForm.get('name')?.setErrors({ invalid: true, message: "Name is already taken." })
            this.nameError = true;
          }
          else {
            this.nameError = false;
          }
        }
      })
    }
    else {
      this.nameError = false;
    }
  }


  updateDate(event: any) {
    this.empForm.get('dob')?.setValue(event.target.value);
  }


  validateEmail(event: any) {
    if (event && event.target && event.target.value) {
      const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
  
      if (!emailPattern.test(event.target.value)) {
        this.empForm.get('email')?.setErrors({ invalid: true, message: "Enter Valid Email" });
        this.emailError = true;
      } else {
        this.emailError = false;
      }
    }
  
    return null;
  }
  
  
  onFormSubmit() {
    // this.button2.nativeElement.click();
    if (this.empForm.valid) {
      // if (
      //   this.empForm.get('name')?.hasError('required') ||
      //   this.empForm.get('email')?.hasError('invalid') ||
      //   this.empForm.get('name')?.hasError('invalid') |ha|
      //   this.empForm.get('email')?.hasError('required')
      // ) 
      // {
      //   // Do not proceed with submission if there are errors
      //   return;
      // }
      this.oldname = this.service.myName;
      if (this.service.myName.trim() !== this.empForm.get('name')?.value.trim()) {
        sessionStorage.setItem('myName', this.empForm.get('name')?.value);
        this.service.myName = this.empForm.get('name')?.value;
        this.service.notifyOthertabsforname();
      }
      this.imageUrl = this.empForm.get('imgstr')?.value;
      this.imageUrl2 = this.empForm.get('imgstr2')?.value;
      
      this.service.imageUrl = this.empForm.get('imgstr')?.value;
      
      console.log("the form",this.empForm.value);
      if(this.file){
     
        this.service.uploadfile(this.file, this.service.myName).subscribe(
          data => {
            this.service.getuserImage(this.empForm.get('name')?.value).subscribe({
              next: (data: profile) => {
                sessionStorage.setItem('userimage', data.imgstr ?? '');
                this.service.imageUrl = data.imgstr ?? '';
                console.log("the iamge", data.imgstr);
              },
              error: (error) => {
                console.error('Error loading private chats', error);
              }
            });
          }
        );
      }
    
      this.service.postFile(this.empForm.value, this.oldname).subscribe({
        next: (response) => {
          console.log(response);
          // this.service.getuserImage(this.empForm.get('name')?.value).subscribe({
          //   next: (data: profile) => {
          //     sessionStorage.setItem('userimage', data.imgstr ?? '');
          //     this.service.imageUrl = data.imgstr ?? '';
          //     console.log("the iamge", data.imgstr);
          //   },
          //   error: (error) => {
          //     console.error('Error loading private chats', error);
          //   }
          // });
        },
        error: (error) => {
          console.log(error);
        },
    });
    }
  }

  handleFileInput2(event: any) {
    let reader = new FileReader();
    this.file1 = event.target.files[0];
    reader.onload = (event: any) => {
      this.imageUrl2 = event.target.result;
      this.service.coverimg=event.target.result;
      this.empForm.get('imgstr2')?.setValue(event.target.result);
    };
    reader.readAsDataURL(this.file1);
  }

  handleFileInput(event: any) {
    let reader = new FileReader();
    this.file = event.target.files[0];
    reader.onload = (event: any) => {
      this.imageUrl = event.target.result;
      this.empForm.get('imgstr')?.setValue(event.target.result);
      console.log("the image",event.target.result);
    };
    reader.readAsDataURL(this.file);
  }   


  abc() {
    // alert("dsf")
  }
  button1() {
    this.stepper.next();
  }
    config: AngularEditorConfig = {
      editable: true,
      spellcheck: true,
      height: '10rem',
      minHeight: '3rem',
      placeholder: 'Enter text here...',
      translate: 'no',
      defaultParagraphSeparator: 'p',
      defaultFontName: 'Arial',
     
    };
}




