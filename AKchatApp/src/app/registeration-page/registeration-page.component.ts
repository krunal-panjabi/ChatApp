import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UsersService } from '../users.service';
import { Router } from '@angular/router';


@Component({
  selector: 'app-registeration-page',
  templateUrl: './registeration-page.component.html',
  styleUrls: ['./registeration-page.component.css']
})
export class RegisterationPageComponent implements OnInit {
  userForm : FormGroup = new FormGroup({});
  submitted = false;
  constructor(private formBuilder : FormBuilder,private service : UsersService , private router: Router) { }

  ngOnInit(): void {
    this.initializeForm();
  }
  initializeForm(){
    this.userForm = this.formBuilder.group({
      username : ['' ,[Validators.required,Validators.minLength(3),Validators.maxLength(15)]],
      password : ['' ,[Validators.required]],
      email:['',[Validators.required,this.validateEmail]],
      confirmPassword: ['', Validators.required] // Add required validation
    }, { validators: this.passwordsMatchValidator })
    
  }

  
  passwordsMatchValidator(group: FormGroup) {
    const password = group.get('password')!.value;
    const confirmPassword = group.get('confirmPassword')!.value;

    if (password !== confirmPassword) {
      return { passwordsNotMatch: true };
    }

    return null;
  }

  
  validateName(event: any) {
    debugger;
    this.service.CheckName(event.target.value).subscribe({
      next:(response)=>{
        if(!response){
          this.userForm.get('username')?.setErrors({invalid:true , message :"Name is already taken."})
        }
      }
    })
  }
  validateEmail(control: AbstractControl) {
    const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;

    if (control.value && !emailPattern.test(control.value)) {
      return { invalidEmail: true };
    }

    return null;
  }
  submitForm(){
    this.submitted = true ;

    if(this.userForm.valid){
      this.service.postData(this.userForm.value).subscribe(data =>{
        this.userForm.reset();
        this.router.navigateByUrl('/login')
      })
    }
  }

}

