import { Component,EventEmitter,Inject,Input,OnInit, Output } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { UsersService } from '../users.service';
import { UserDetails } from '../Models/userDetails';
import { Subscription, take, timer } from 'rxjs';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';

@Component({
  selector: 'app-user-detail',
  templateUrl: './user-detail.component.html',
  styleUrls: ['./user-detail.component.css']
})
export class UserDetailComponent {
  @Output() dataEvent = new EventEmitter<string>();
  @Input() receivedData!: string;
  username!: string;
  imageUrl: string = "";
  userslist:string[]=[];
  names:string[]=[];
  images:string[]=[];
  filteredlist:string[]=[];
  htmlContent: string = '';
  sanitizedHtml: SafeHtml;
  isLoading = false;
  // private subscription: Subscription;
  // receivedData: string = '';


  // constructor( public service : UsersService) {
  //   this.subscription = this.service.data$.subscribe((data: any) => {
  //     alert("data comes?")
  //     this.receivedData = data;
  //     this.showAlert();
  //   });
  
  //   this.username = this.receivedData;
  // }

  constructor(public service: UsersService,private sanitizer: DomSanitizer) {
    this.sanitizedHtml = this.sanitizer.bypassSecurityTrustHtml(this.htmlContent);
    // this.subscription = this.service.data$.subscribe((data: any) => {
    //   this.username = data; 
    //   alert('Data received in UserDetailsComponent: ' + this.username);
    // });
  }

  back() {
    this.dataEvent.emit('A');
  }

  // showAlert(){
  //   alert("woohoo this worked");
    
  //    this.ngOnInit()
  // }

  someMethod(username : any) {
    // alert(username);
    this.receivedData = username
    
  }

  mutualdetail(name :any)
  {
    this.isLoading = true; 

      
      timer(500) // Emit a value after 1 second
        .pipe(take(1)) // Take only one emitted value
        .subscribe(() => {
          this.isLoading = false; // Deactivate loading screen after 1 second
        });


    this.service.getUserDetails(name).subscribe({
      next: (data: UserDetails) => {
        console.log(data);
        this.service.oneuserdetail = data;
        this.htmlContent=this.service.oneuserdetail.aboutme??'';
        // this.imageUrl = data.imgstr
        // this.empForm.patchValue(this.service.singleuser);
      },
      error: (error) => {
        console.error('Error loading private chats', error);
      }
    });

    this.service.getMutualNames(name).subscribe( {
      next: (data) => {
         console.log( data);
        this.service.mutualFriends = data;      
        console.log("mutual friends",this.service.mutualFriends.images)
  this.names=data.names.split(",")  ;
  this.images=data.images.split(",")  
  
        // this.names = this.service.mutualFriends.names
        // console.log(this.names);
        // this.isLoading = false;
      }, 
  
     });



}

ngOnInit(): void {

  // this.service.data$.subscribe(data => {
  //   this.receivedData = data;
    
  // });
 
//  alert(this.receivedData);


  this.service.getUserDetails(this.receivedData).subscribe({
    next: (data: UserDetails) => {
      console.log(data);
      this.service.oneuserdetail = data;
      this.htmlContent=this.service.oneuserdetail.aboutme??'';
      // this.imageUrl = data.imgstr
      // this.empForm.patchValue(this.service.singleuser);
    },
    error: (error) => {
      console.error('Error loading private chats', error);
    }
  });




  this.service.getMutualNames(this.receivedData).subscribe( {
    next: (data) => {
       console.log( data);
      this.service.mutualFriends = data;      
      console.log("mutual friends",this.service.mutualFriends.images)
this.names=data.names.split(",")  ;
this.images=data.images.split(",")  

      // this.names = this.service.mutualFriends.names
      // console.log(this.names);
    }, 

   });



  // this.service.getAllUserNames().subscribe({
  //   next:(data)=>{
  //     data.forEach(user=>{
  //       const imgAry = user.mutualimages ? user.mutualimages.split(',') : [];
  //       const friendsarr = user.mutualnames ? user.mutualnames.split(',') : [];
  //        const newUser={
  //          username:user.username,
  //          status:user.status,
  //          mutualimages:user.mutualimages,
  //          imgstr:user.imgstr,
  //          mutualarr:imgAry,
  //          mutualfriends:friendsarr
  //        }

  //        this.service.searchfilteredlist.push(newUser);
  //        this.service.searchuserlist.push(newUser);
  //     });
  //     console.log("the usermutual",this.service.searchfilteredlist);
  //     this.userslist=data.filter(user=>user.username!==this.service.myName).map(user=>user.username);

  //     this.filteredlist=this.userslist;
  //   }
  // })

  // const filteredUsers = this.service.searchfilteredlist.filter(user => user.username === this.service.oneuserdetail.name);
  //   console.log("user data",filteredUsers);
  //   const imgArray = filteredUsers.map(user => user.mutualarr);
  //   const friendNamesArray = filteredUsers.map(user => user.mutualfriends);




}
}
