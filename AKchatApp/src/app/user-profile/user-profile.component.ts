import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UsersService } from '../users.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.css']
})
export class UserProfileComponent  implements OnInit{
  currentUser: any;
  imageUrl: string = "/assets/img/upload.png";
  fileToUpload!: File ;
  file!:File;
  // userForm : FormGroup = new FormGroup({});
  // submitted = false;
  // selectedOption: string = '';
  // Gender: string = '';
  empForm: FormGroup;
 
  ngOnInit(): void {

    this.empForm.patchValue(this.service.singleuser);
    this.imageUrl=this.service.singleuser.imgstr;
  }

  constructor(private formBuilder : FormBuilder,private service : UsersService , private router: Router) { 
    this.empForm = this.formBuilder.group({
      name: '',
      email: '',
      gender:'',
      phonenumber:'',
      dob:Date,
      aboutme:'',
      status:'',
      imgstr:''
    });
  }
  onFormSubmit(){
  if(this.empForm.valid){
    console.log(this.empForm.value);
    this.service.postFile(this.empForm.value).subscribe({
      next:(response)=>{
       console.log(response);
      },
      error:(error)=>{
        console.log(error);
      }
    })
    this.service.getAllUsers();
    this.service.myName=this.empForm.get('name')?.value;
    console.log("fie name",this.file);
    this.service.uploadfile(this.file,this.service.myName).subscribe(
      data =>{
        console.log('done');
      }
    );
  }
  }

  handleFileInput(event:any) {
    let reader=new FileReader();
    this.file=event.target.files[0];
   
    reader.onload=(event:any)=>{
      this.imageUrl=event.target.result;
    }
    reader.readAsDataURL(this.file);
  
    }
}
// this.service.LoginData(this.userForm.value).subscribe({
      
//   next: (response) => {
//     console.log("the response",response);   
//     },
//   error: (error) => {
//   },
// }