import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UsersService } from '../users.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-confirm-password',
  templateUrl: './confirm-password.component.html',
  styleUrls: ['./confirm-password.component.css']
})
export class ConfirmPasswordComponent {
  newPass : FormGroup = new FormGroup({});
  otp:string ='';
  newPassword:string ='';


  constructor(private formBuilder: FormBuilder, private service: UsersService, private router: Router) {
    this.newPass = this.formBuilder.group({
      otp: ['', Validators.required], // Add required validation
      newPassword: ['', Validators.required], // Add required validation
      confirmPassword: ['', Validators.required] // Add required validation
    }, { validators: this.passwordsMatchValidator }); // Add a custom validator
  }

  ngOnInit(): void {
    this.newPass.reset();
    localStorage.clear();
  }
  
  submitForm(){
    // alert(this.newPass.get("email")?.value);
     alert(this.newPass.get("newPassword")?.value);

  
  
    if(this.newPass.valid){
      this.otp=this.newPass.get("otp")?.value;
      this.newPassword=this.newPass.get("newPassword")?.value;
      this.service.newPassword(this.otp,this.newPassword).subscribe(data =>{
        this.router.navigateByUrl('/login')
  
     
     
      });
        }
  
  }

  passwordsMatchValidator(group: FormGroup) {
    const newPassword = group.get('newPassword')!.value;
    const confirmPassword = group.get('confirmPassword')!.value;

    if (newPassword !== confirmPassword) {
      return { passwordsNotMatch: true };
    }

    return null;
  }


}
