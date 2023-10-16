import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UsersService } from '../users.service';
import { Router } from '@angular/router';
import { profile } from '../Models/profile';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-login-page',
  templateUrl: './login-page.component.html',
  styleUrls: ['./login-page.component.css']
})
export class LoginPageComponent implements OnInit {
  userForm : FormGroup = new FormGroup({});
  submitted = false;
 
  constructor(private formBuilder : FormBuilder ,private service : UsersService,private router:Router, private toastr: ToastrService) { }

  ngOnInit(): void {
    this.userForm.reset();
    this.initializeForm();
    localStorage.clear();
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
            if(response.message==="Valid")
            { this.service.storeToken(response.token);
              this.service.myName=this.userForm.get('username')?.value;
              this.service.getNotificationMsg().subscribe({
                next:(data)=>{
                  this.service.notimsgs = data;
                  this.service.countmsg=this.service.notimsgs.length;
                  console.log("the count",this.service.countmsg)
                },
                error: (error) => {
                  console.error('Error loading private chats', error);
                }
              });
              this.service.getuserImage(this.userForm.get('username')?.value).subscribe({
                next: (data: profile) => {
                  this.service.imageUrl = data.imgstr;
                },
                error: (error) => {
                  console.error('Error loading private chats', error);
                }
              });    
              this.toastr.success('Success', 'You are Loggedinnn',{
                disableTimeOut:false,
                closeButton:true,
                progressBar:true
              });   
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
          this.userForm.setErrors({servererror:true});
          console.log('Error:', error);
        },
      }
    )
    }
  }



}
