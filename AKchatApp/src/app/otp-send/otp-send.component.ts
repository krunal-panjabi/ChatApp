import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UsersService } from '../users.service';
import { Router } from '@angular/router';
@Component({
  selector: 'app-otp-send',
  templateUrl: './otp-send.component.html',
  styleUrls: ['./otp-send.component.css']
})
export class OtpSendComponent {

  otpForm : FormGroup = new FormGroup({});
  otp:string ='';
  showResendButton: boolean = false;
  // newPassword:string ='';


  constructor(private formBuilder: FormBuilder, private service: UsersService, private router: Router) {
    this.otpForm = this.formBuilder.group({
      otp: ['', Validators.required], // Add required validation
      // newPassword: ['', Validators.required], 
      // confirmPassword: ['', Validators.required] 
    })
  }

  ngOnInit(): void {
    this.otpForm.reset();
   
  }
  
  submitForm(){
    // alert(this.newPass.get("email")?.value);
    //  alert(this.otpForm.get("newPassword")?.value);

  
  
    if(this.otpForm.valid){
      this.otp=this.otpForm.get("otp")?.value;
      // this.newPassword=this.otpForm.get("newPassword")?.value;
      this.service.SendOtp(this.otp).subscribe({
        next:(response)=>{
          console.log("response", response);
          if (response.result === 'success') {
              this.router.navigateByUrl('/confirmPassword');
          } else if (response.result === 'timeout') {
              this.showResendButton = true;
              this.otpForm.setErrors({ timeout: true });
          } else if (response.result === 'wrong') {
              this.otpForm.setErrors({ Invalidotp: true });
          }
        }
        // this.router.navigateByUrl('/login')
  
     
     
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
