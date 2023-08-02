import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UsersService } from '../users.service';


@Component({
  selector: 'app-registeration-page',
  templateUrl: './registeration-page.component.html',
  styleUrls: ['./registeration-page.component.css']
})
export class RegisterationPageComponent implements OnInit {
  userForm : FormGroup = new FormGroup({});
  submitted = false;
  constructor(private formBuilder : FormBuilder,private service : UsersService) { }

  ngOnInit(): void {
    this.initializeForm();
  }
  initializeForm(){
    this.userForm = this.formBuilder.group({
      username : ['' ,[Validators.required,Validators.minLength(3),Validators.maxLength(15)]],
      password : ['' ,[Validators.required]],
    })
  }

  validateName(event: any) {
    if (event.target.value== '') {
      this.userForm.get('username')?.setErrors({ invalid: true ,message:"Name is alreday taken." });
    }
    // else {
    //   this.accountService.validateEmail(event.target.value).subscribe(
    //     data => {
    //       if (data.toString() == 'false') {
    //         this.registerForm.get('username')?.setErrors({ invalid: true ,message:"EmailId is already in use. Please enter different EmailId."});
    //         console.log(data);
    //       }
    //     }
    //   )
    // }
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

