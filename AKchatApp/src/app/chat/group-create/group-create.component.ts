import { Component,OnInit} from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { UsersService } from 'src/app/users.service';


@Component({
  selector: 'app-group-create',
  templateUrl: './group-create.component.html',
  styleUrls: ['./group-create.component.css']
})
export class GroupCreateComponent  {
  submitted = false;

  groupForm : FormGroup = new FormGroup({});

  /**
   *
   */
  constructor(public activeModal: NgbActiveModal, private formBuilder : FormBuilder,private service : UsersService ) {
  }

  submitForm(){
    this.submitted = true ;

    if(this.groupForm.valid){
      this.service.postData(this.groupForm.value).subscribe(data =>{
        alert("added");
        this.groupForm.reset();
      })
    }
  }


  }

