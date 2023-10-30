import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UsersService } from '../users.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-forget-password',
  templateUrl: './forget-password.component.html',
  styleUrls: ['./forget-password.component.css']
})
export class ForgetPasswordComponent {
  
  forget : FormGroup = new FormGroup({});
  toemail:string ='';
  submitted= false;


constructor( private formBuilder : FormBuilder ,private service : UsersService,private router:Router) {
  this.forget = this.formBuilder.group({
    email: ['', Validators.required]
  });
}

ngOnInit(): void {
  this.forget.reset();
 
}


submitForm(){
  this.submitted=true;
  // alert(this.forget.get("email")?.value);
  if(this.forget.valid){
    // this.router.navigateByUrl('/otp-send');
    this.toemail=this.forget.get("email")?.value;
    this.service.forgetPassword(this.toemail).subscribe({
      next:(response)=>{
         console.log("response", response);
        if (response.result === 'NoUser') {
          this.forget.setErrors({ NoUser: true });        } 
          else{
            localStorage.setItem('email',this.toemail);
            console.log("the email",localStorage.getItem('email'));
            this.router.navigateByUrl('/otp-send');

          }
      }
   
   
    });
      }

}


}
