import { Component,OnInit,ElementRef, ViewChild, inject} from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { MatChipInputEvent } from '@angular/material/chips';
import { Router } from '@angular/router';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { map, startWith } from 'rxjs';
import { group } from 'src/app/Models/group';
import { UsersService } from 'src/app/users.service';


@Component({
  selector: 'app-group-create',
  templateUrl: './group-create.component.html',
  styleUrls: ['./group-create.component.css']
})
export class GroupCreateComponent  {
  submitted = false;
  grpname:string='';
  selectedUsers: string[] = [];
  groupForm : FormGroup = new FormGroup({});
  allnames:string='';
  group:group | undefined;

  constructor(public activeModal: NgbActiveModal, private formBuilder : FormBuilder,public service : UsersService ) {
    this.groupForm = this.formBuilder.group({
      username: [''],
      members: this.formBuilder.array([]),
    });

  
  }

  get membersArray(): FormArray {
    return this.groupForm.get('members') as FormArray;
  }

  

  ngOnInit(): void {

    this.service.offlineUsers.forEach((user) => {
      this.membersArray.push(new FormControl(false)); // Initialize unchecked
    });
   
    this.service.getAllUsers();
   
  }
  updateSelectedUsers(user: any, event: Event) {
    const isChecked = (event.target as HTMLInputElement).checked;
    if (isChecked) {
      console.log("this is user name",user.username);
      this.selectedUsers.push(user.username);
    } else {
      const index = this.selectedUsers.indexOf(user.userName);
      if (index !== -1) {
        this.selectedUsers.splice(index, 1);
      }
    }
  }
  addUser(event: MatChipInputEvent): void {
    debugger;
    const value = (event.value || '').trim();
    if (value) {
      this.selectedUsers.push(value);
    }
    console.log("the list",this.selectedUser);
  }

  removeUser(user: string): void {
    debugger;
    const index = this.selectedUsers.indexOf(user);
    if (index >= 0) {
      this.selectedUsers.splice(index, 1);
    }
    console.log("the list",this.selectedUser);
  }
  
  selectedUser(event: MatAutocompleteSelectedEvent): void {
    this.selectedUsers.push(event.option.viewValue);
  }
  getSelectedUsers() {
   // this.selectedUsers.push(this.service.myName);
     this.allnames = this.selectedUsers.join(',');
      this.service.createGroup(this.grpname, this.allnames).subscribe(
        (response) => {
          console.log('Group created:', response);
          this.activeModal.close('Group created successfully');
          this.service.getAllGroups(this.service.myName);
        },
        (error) => {
          console.error('Error creating group:', error);
        }
      );
      this.service.getAllGroups(this.service.myName);
      this.service.callbackend();
    }
  }

