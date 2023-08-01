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

