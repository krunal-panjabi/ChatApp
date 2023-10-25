import { Component } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
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


constructor( private formBuilder : FormBuilder ,private service : UsersService,private router:Router) {
  this.forget = this.formBuilder.group({
    email: ''
  });
}

ngOnInit(): void {
  this.forget.reset();
  localStorage.clear();
}

submitForm(){
  alert(this.forget.get("email")?.value);


  if(this.forget.valid){
    this.router.navigateByUrl('/confirmPassword');
    this.toemail=this.forget.get("email")?.value;
    this.service.forgetPassword(this.toemail).subscribe(data =>{

   
   
    });
      }

}


}
