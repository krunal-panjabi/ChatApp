import { Component,EventEmitter,Inject,Input,OnInit, Output } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { UsersService } from '../users.service';
import { UserDetails } from '../Models/userDetails';
import { Subscription, take, timer } from 'rxjs';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { userslikepostsdata } from '../Models/userslikepostsdata';
import { GalleryService } from '../gallery.service';
import { Router } from '@angular/router';
import { GalleryData } from '../Models/galleryData';

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
  coverUrl: string ='';
  userslist:string[]=[];
  posts: any[] = [];
  myposts:GalleryData[]=[];
  names:string[]=[];
  images:string[]=[];
  filteredlist:string[]=[];
  likeposts: userslikepostsdata[] = [];
  htmlContent: string = '';
  sanitizedHtml: SafeHtml;
  isLoading = false;
  selecteddiv=1;
  noofflineuser:any;
  showMore = false;
  maxCommentsToShow = 2;
 
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

  constructor(public service: UsersService,private router:Router,private sanitizer: DomSanitizer,public galleryservice:GalleryService) {
    this.sanitizedHtml = this.sanitizer.bypassSecurityTrustHtml(this.htmlContent);
    
  }

  back() {
    this.dataEvent.emit('A');
  }
  redirectToPost(postid:any){
    this.isLoading = true; 
      
      timer(2000) 
        .pipe(take(1)) 
        .subscribe(() => {
          this.isLoading = false; 
        });
    this.galleryservice.changeOrderById(postid);
     setTimeout(() => {
      this.router.navigateByUrl('/gallery');
    }, 1000); 

  }


  changediv(number:any,name:any){
    this.isLoading = true; 
      
      timer(500) 
        .pipe(take(1)) 
        .subscribe(() => {
          this.isLoading = false; 
        });
    this.selecteddiv=number;

    if(number===2){
      this.service.getUsersLikePosts(name).subscribe({
        next: (data) => {
         this.likeposts = data;        
        }
      })
    }
    else if(number===3){
      this.service.getUsersCommentPosts(name).subscribe({
        next:(data)=>{
          const organizedData: { [key: number]: { image: string | undefined,caption:string | undefined,uplodeduserimg:string | undefined,uplodedby:string|undefined ,comments: string[],showMore: false } } = {};
          data.forEach(user=>{
            const postid = user.postid;
            if (!organizedData.hasOwnProperty(postid || 0)){
              organizedData[postid || 0] = { image: user.imgstr, comments: [],uplodeduserimg:user.uploadedbyimage,uplodedby:user.uplodedby,caption:user.caption,showMore:false };
            }
            organizedData[postid || 0].comments.push(user.comment || ''); // Handle null or undefined comments
          });
          this.posts = Object.values(organizedData);
        }
      })
    }
  }
  someMethod(username : any) {
    // alert(username);
    this.receivedData = username
    
  }
  toggleShowMore(post: any) {
    post.showMore = !post.showMore;
  }

  getComments(post: any) {
    return post.showMore ? post.comments : post.comments.slice(0, this.maxCommentsToShow);
  }
  mutualdetail(name :any)
  {
    this.selecteddiv=1;
    this.posts=[];
    this.likeposts=[];
    this.myposts=[];
    this.isLoading = true; 
      
      timer(2000) // Emit a value after 1 second
        .pipe(take(1)) // Take only one emitted value
        .subscribe(() => {
          this.isLoading = false; // Deactivate loading screen after 1 second
        });
    this.service.getUserDetails(name).subscribe({
      next: (data: UserDetails) => {
        console.log(data);
        this.service.oneuserdetail = data;
        this.htmlContent=this.service.oneuserdetail.aboutme??'';
        this.service.getMyGalleryData(data.name).subscribe(data => {
          this.myposts = data;
        });
      },
      error: (error) => {
        console.error('Error loading private chats', error);
      }
    });
   
   


    this.service.getMutualNames(name).subscribe( {
      next: (data) => {
         console.log( data);
        this.service.mutualFriends = data;      
        console.log("mutual friends",this.service.mutualFriends.images);
  this.names=data.names.split(",");  
  this.images=data.images.split(",");  
  console.log("the names and images",this.names,this.images);  
        // this.names = this.service.mutualFriends.names
        // console.log(this.names);
        // this.isLoading = false;
      }, 
     });
}

ngOnInit(): void {
  this.isLoading = true; 
      timer(2000) 
        .pipe(take(1)) 
        .subscribe(() => {
          this.isLoading = false; 
        });
  this.service.getUserDetails(this.receivedData).subscribe({
    next: (data: UserDetails) => {
      console.log(data);
      this.service.oneuserdetail = data;
      this.htmlContent=this.service.oneuserdetail.aboutme??'';
      this.service.getMyGalleryData(data.name).subscribe(data => {
        this.myposts = data;
      });
      console.log("myposts",this.myposts);
    },
    error: (error) => {
      console.error('Error loading private chats', error);
    }
  });


  this.service.getMutualNames(this.receivedData).subscribe( {
    next: (data) => {
       console.log( data);
      this.service.mutualFriends = data;      
      console.log("mutual friends",this.service.mutualFriends.images);
      this.names=data.names.split(",");
      this.images=data.images.split(",");
      console.log("the names and images",this.names,this.images);  
      // this.names = this.service.mutualFriends.names
      // console.log(this.names);
    }, 

  });
 

}



}
