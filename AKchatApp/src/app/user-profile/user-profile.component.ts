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
  currentUser: any;
  // userForm : FormGroup = new FormGroup({});
  // submitted = false;
  selectedOption: string = '';
  Gender: string = '';
  empForm: FormGroup;


  constructor(private formBuilder : FormBuilder,private service : UsersService , private router: Router) { 
    this.empForm = this.formBuilder.group({
      Name: '',
      Email: '',
      gender:'',
      phonenumber:'',
      dob:'',
      aboutme:'',
      status:'',

    });
  }
  onFormSubmit(){
  if(this.empForm.valid){
    console.log(this.empForm.value);
  }
  }

  ngOnInit(): void {
  }

}
