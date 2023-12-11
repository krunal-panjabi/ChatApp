import { Component } from '@angular/core';
import { UsersService } from '../users.service';
import { Router } from '@angular/router';
import { GalleryData } from '../Models/galleryData';
import { MatDialog } from '@angular/material/dialog';
import { NotificationComponent } from '../notification/notification.component';
import { PostCommentComponent } from '../post-comment/post-comment.component';
import { GalleryService } from '../gallery.service';


@Component({
  selector: 'app-photo-gallery',
  templateUrl: './photo-gallery.component.html',
  styleUrls: ['./photo-gallery.component.css']
})
export class PhotoGalleryComponent {
  showAllNames = false;
  filterAlert=false;
//  galleryData: GalleryData[] = [];
  constructor(public service: UsersService,public galleryservice:GalleryService ,private router: Router,private matdialog: MatDialog) {
    if(window.location.pathname !== "/chat")
    {
      service.isButtonVisisble=true;
    }
   }

  ngOnInit(): void {
    this.service.myName = sessionStorage.getItem('myName') || '';
    this.service.imageUrl=sessionStorage.getItem('userimage') || '';
    if (this.service.myName) {
     console.log(this.service.myName);
     
   }
   
   this.fetchGalleryData();
  //  this.service.createChatConnection();
 }

 toggleShowAllNames() {
  this.showAllNames = !this.showAllNames;
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
    }
  })
 }

 fetchGalleryData() {
  if(!this.galleryservice.filterAlert){
    this.filterAlert=false;
    this.service.getGalleryData(this.service.myName).subscribe(data => {
      this.galleryservice.galleryData = data;
    });
  }
  else if(this.galleryservice.filtergalleryData.length>0){
    this.galleryservice.filterAlert=false;
    this.filterAlert=true;
  }  
}

getGalleryData(): GalleryData[] {
  return this.filterAlert ? this.galleryservice.filtergalleryData : this.galleryservice.galleryData;
}

toggleHeartClass(id:any,uUser:string) {
  // const myName = this.service.myName;
  const myName = this.service.myName;
  this.service.sendGalleryData(id,myName).subscribe({
    next:(data)=>{
      const index = this.galleryservice.galleryData.findIndex((item) => item.galleryId === id);
      this.galleryservice.galleryData[index]!.currentUserLiked = this.galleryservice.galleryData[index]!.currentUserLiked === 1 ? 0 : 1;
      if(this.galleryservice.galleryData[index].currentUserLiked===1){
        this.galleryservice.galleryData[index]!.likeCount=(this.galleryservice.galleryData[index]!.likeCount ?? 0) + 1;
      }
      else if((this.galleryservice.galleryData[index]?.likeCount ?? 0) > 0) {
        this.galleryservice.galleryData[index]!.likeCount = (this.galleryservice.galleryData[index]?.likeCount ?? 0) - 1;
      }
      //this.galleryservice.galleryData[index]!.currentUserLiked = 1;
      //this.service.getGalleryData(this.service.myName).subscribe({
      //   next:(data)=>{
      //     this.service.likePost(uUser);
      //     this.galleryservice.galleryData = data;
      //   }
      // }) 
    },
    error:(error)=>{
      console.log('error ')
    }
})
}

comment(postId : any,name:string){
  this.matdialog.open(PostCommentComponent,{
    width:'500px',  
    height : '400px',   
    
    // position:{top:'48px',right:'50px', },
    panelClass: 'custom-dialog-container',
    data: {
      postId: postId,
      name: name
    }
   })
}


}
