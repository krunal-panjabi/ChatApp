import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UsersService } from '../users.service';
import { Router } from '@angular/router';
import { profile } from '../Models/profile';
import { MatStepper } from '@angular/material/stepper';

@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.css']
})
export class UserProfileComponent implements OnInit {
  @ViewChild('button2') button2!: ElementRef;
  @ViewChild('stepper') stepper!: MatStepper;
  currentUser: any;
  imageUrl: string = "/assets/img/upload.png";
  fileToUpload!: File;
  file!: File;
  nameError: boolean = false;
  empForm: FormGroup;
  oldname = '';

  ngOnInit(): void {
    this.service.myName = sessionStorage.getItem('myName') || '';
    this.service.imageUrl = sessionStorage.getItem('userimage') || '';
    this.service.getuserprofiledetail().subscribe({
      next: (data: profile) => {
        this.service.singleuser = data;
        this.empForm.patchValue(this.service.singleuser);
      },
      error: (error) => {
        console.error('Error loading private chats', error);
      }
    });


    if (this.service.imageUrl === "") {

      this.imageUrl = "https://www.google.com/url?sa=i&url=https%3A%2F%2Fwww.vecteezy.com%2Ffree-vector%2Fprofile-icon&psig=AOvVaw1YXgufaK25e4kCD3jshBmw&ust=1692781344078000&source=images&cd=vfe&opi=89978449&ved=0CBAQjRxqFwoTCOCPlfvz74ADFQAAAAAdAAAAABAJ"; // Replace with your actual default image URL
    } else {
      this.imageUrl = this.service.imageUrl;
    }
  }

  constructor(private formBuilder: FormBuilder, private service: UsersService, private router: Router) {
    if (window.location.pathname !== "/chat") {
      service.isButtonVisisble = true;
    }
    this.empForm = this.formBuilder.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      gender: ['', Validators.required],
      phonenumber: ['', Validators.required],
      dob: [null, Validators.required],
      aboutme: ['', Validators.required],
      status: ['', Validators.required],
      imgstr: ''
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
  onFormSubmit() {
    // this.button2.nativeElement.click();
    if (this.empForm.valid) {
      this.oldname = this.service.myName;
      if (this.service.myName.trim() !== this.empForm.get('name')?.value.trim()) {
        sessionStorage.setItem('myName', this.empForm.get('name')?.value);
        this.service.myName = this.empForm.get('name')?.value;
      }
    
      this.imageUrl = this.empForm.get('imgstr')?.value;
      
      this.service.imageUrl = this.empForm.get('imgstr')?.value;
      // Programmatically trigger a click on button2
      // this.button2.nativeElement.click();
      this.service.postFile(this.empForm.value, this.oldname).subscribe({
        next: (response) => {
          console.log(response);
        },
        error: (error) => {
          console.log(error);
        }
      });

      this.service.getAllUsers().subscribe({
        next: (data) => {
          this.service.offlineUsers = data;
          this.service.usernamelist = this.service.offlineUsers;
        }
      });
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


  }

  handleFileInput(event: any) {
    let reader = new FileReader();
    this.file = event.target.files[0];
    reader.onload = (event: any) => {
      this.imageUrl = event.target.result;
      this.empForm.get('imgstr')?.setValue(event.target.result);
    };
    reader.readAsDataURL(this.file);
  }
  abc() {
    // alert("dsf")
  }
  button1() {
    this.stepper.next();
  }
}




