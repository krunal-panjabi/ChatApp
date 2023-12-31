import { Component, OnDestroy, OnInit } from '@angular/core';
import { UsersService } from '../users.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Router } from '@angular/router';
import { MessageService } from '../message.service';
import { GalleryData } from '../Models/galleryData';
import { PostCommentComponent } from '../post-comment/post-comment.component';
import { MatDialog } from '@angular/material/dialog';
import { UsersLikedPost } from '../Models/usersLikedPosts';
import { UserLikedPostsComponent } from '../user-liked-posts/user-liked-posts.component';
import { GalleryService } from '../gallery.service';


@Component({
  selector: 'app-my-posts',
  templateUrl: './my-posts.component.html',
  styleUrls: ['./my-posts.component.css']
})
export class MyPostsComponent {
  grid = true;
  galleryData: GalleryData[] = [];
  userLikedPost: UsersLikedPost[] = [];
  constructor(public service : UsersService,public galleryservice:GalleryService,private modalService:NgbModal,private router:Router,public msgservice:MessageService,private matdialog: MatDialog) {
    if(window.location.pathname === "/chat")
    {
      service.isButtonVisisble=true;
    }
   }

   ngOnInit(): void {
    this.service.myName = sessionStorage.getItem('myName') || '';
    this.service.imageUrl=sessionStorage.getItem('userimage') || '';
  this.service.getMyGalleryData(this.service.myName).subscribe(data => {
    this.galleryData = data;
    console.log('the data',this.galleryData);
  });
} 
  
comment(postId : any){
  this.matdialog.open(PostCommentComponent,{
    width:'500px',  
    height : '400px',   
    // position:{top:'48px',right:'50px', },
    panelClass: 'custom-dialog-container',
    data:{postId}
   })
}

likes(imageId: any){
  // this.service.UsersLikedPost(imageId).subscribe(data => {
  //   this.userLikedPost = data;
  //   console.log(this.userLikedPost);
    this.matdialog.open(UserLikedPostsComponent,{
      width:'500px',  
      height : '400px',   
      
      // position:{top:'48px',right:'50px', },
      panelClass: 'custom-dialog-container',
      data:{imageId}
     })
  // });
}

confirmDelete(galleryId: any) {
  const confirmation = window.confirm('Are you sure you want to delete this post?');

  if (confirmation) {
    // The user confirmed the delete action, perform the delete operation here
    this.deletePost(galleryId);
  } else {
    // The user canceled the delete action, do nothing
  }
}

deletePost(id:any){
  this.service.deleteMyPost(id).subscribe({
    next:()=>{
      this.ngOnInit();
      // this.service.LiveStory();
    }
  })
 }

}
