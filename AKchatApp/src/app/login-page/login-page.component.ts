import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UsersService } from '../users.service';

@Component({
  selector: 'app-login-page',
  templateUrl: './login-page.component.html',
  styleUrls: ['./login-page.component.css']
})
export class LoginPageComponent implements OnInit {
  userForm : FormGroup = new FormGroup({});
  submitted = false;
  constructor(private formBuilder : FormBuilder ,private service : UsersService) { }

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

    if(this.userForm.valid){
      this.service.postData(this.userForm.value).subscribe(data =>{
        alert("added");
        console.log(data);
        this.userForm.reset();
      })
    }
  }

}
