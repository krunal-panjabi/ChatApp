import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UsersService } from '../users.service';
import { Router } from '@angular/router';
import { profile } from '../Models/profile';

@Component({
  selector: 'app-login-page',
  templateUrl: './login-page.component.html',
  styleUrls: ['./login-page.component.css']
})
export class LoginPageComponent implements OnInit {
  userForm : FormGroup = new FormGroup({});
  submitted = false;
 
  constructor(private formBuilder : FormBuilder ,private service : UsersService,private router:Router) { }

  ngOnInit(): void {
    this.userForm.reset();
    this.initializeForm();
  }
  initializeForm(){
    this.userForm = this.formBuilder.group({
      username : [null ,[Validators.required,Validators.minLength(3),Validators.maxLength(15)]],
      password : [null ,[Validators.required]],
    })
  }

  submitForm(){
    this.submitted = true ;
    if (this.userForm.valid) {
      this.service.LoginData(this.userForm.value).subscribe({
        next: (response) => {
          if(response){
            console.log(response);
            console.log("the token",response.token);
            if(response)
            { this.service.storeToken(response.token);
              this.service.getuserImage(this.userForm.get('username')?.value).subscribe({
                next: (data: profile) => {
                  this.service.imageUrl = data.imgstr;
                  console.log(this.service.imageUrl);
                },
                error: (error) => {
                  console.error('Error loading private chats', error);
                }
              });
              this.service.myName=this.userForm.get('username')?.value;
              this.router.navigateByUrl('/chat')
            }
            else
            {
              this.userForm.setErrors({InvalidUser:true})
            }
          }
          else{
            this.userForm.setErrors({CheckUser:true})
          }
         
          },
       
        error: (error) => {
          this.userForm.setErrors({CheckUser:true});
          console.log('Error:', error);
          // Perform error handling, such as displaying a user-friendly message
        },
      }
    )
    }
  }



}
