import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UsersService } from '../users.service';
import { Router } from '@angular/router';
import { profile } from '../Models/profile';

@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.css']
})
export class UserProfileComponent  implements OnInit{
  currentUser: any;
  imageUrl: string = "/assets/img/upload.png";
  fileToUpload!: File ;
  file!:File;

  empForm: FormGroup;
 
  ngOnInit(): void {
    if (this.service.myName) {
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

    this.empForm.patchValue(this.service.singleuser);
    if (this.service.singleuser.imgstr === "") {
    
      this.imageUrl = "https://www.google.com/url?sa=i&url=https%3A%2F%2Fwww.vecteezy.com%2Ffree-vector%2Fprofile-icon&psig=AOvVaw1YXgufaK25e4kCD3jshBmw&ust=1692781344078000&source=images&cd=vfe&opi=89978449&ved=0CBAQjRxqFwoTCOCPlfvz74ADFQAAAAAdAAAAABAJ"; // Replace with your actual default image URL
    } else {
      this.imageUrl = this.service.singleuser.imgstr;
    }  
  
  
  
  }

  constructor(private formBuilder : FormBuilder,private service : UsersService , private router: Router) { 
    this.empForm = this.formBuilder.group({
      name: '',
      email: '',
      gender:'',
      phonenumber:'',
      dob:Date,
      aboutme:'',
      status:'',
      imgstr:''
    });
  }



  onFormSubmit() {
    if (this.empForm.valid) {
      // Update image preview
      this.imageUrl = this.empForm.get('imgstr')?.value;

      // Update service image
      this.service.imageUrl = this.empForm.get('imgstr')?.value;

      this.service.postFile(this.empForm.value).subscribe({
        next: (response) => {
          console.log(response);
        },
        error: (error) => {
          console.log(error);
        }
      });

      this.service.getAllUsers();
      this.service.myName = this.empForm.get('name')?.value;

      this.service.uploadfile(this.file, this.service.myName).subscribe(
        data => {
          console.log('done');
        }
      );

      this.service.getuserImage(this.empForm.get('name')?.value).subscribe({
        next: (data: profile) => {
          // this.service.imageUrl = data.imgstr;
          console.log(data.imgstr);
        },
        error: (error) => {
          console.error('Error loading private chats', error);
        }
      });
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
}
