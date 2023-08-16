import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UsersService } from '../users.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.css']
})
export class UserProfileComponent {
  userForm : FormGroup = new FormGroup({});
  submitted = false;
  selectedOption: string = '';
  Gender: string = '';


  constructor(private formBuilder : FormBuilder,private service : UsersService , private router: Router) { }

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
    debugger;
    this.service.CheckName(event.target.value).subscribe({
      next:(response)=>{
        if(!response){
          this.userForm.get('username')?.setErrors({invalid:true , message :"Name is already taken."})
        }
      }
    })
  }

  submitForm(){
    this.submitted = true ;

    if(this.userForm.valid){
      this.service.postData(this.userForm.value).subscribe(data =>{
        alert("added");
        this.userForm.reset();
        this.router.navigateByUrl('/login')
      })
    }
  }
}
