import { Component } from '@angular/core';
import { UsersService } from '../users.service';
import { Router } from '@angular/router';
import { GalleryData } from '../Models/galleryData';
import { MatDialog } from '@angular/material/dialog';
import { NotificationComponent } from '../notification/notification.component';
import { PostCommentComponent } from '../post-comment/post-comment.component';


@Component({
  selector: 'app-photo-gallery',
  templateUrl: './photo-gallery.component.html',
  styleUrls: ['./photo-gallery.component.css']
})
export class PhotoGalleryComponent {

  galleryData: GalleryData[] = [];
  constructor(public service: UsersService, private router: Router,private matdialog: MatDialog) {
    if(window.location.pathname !== "/chat")
    {
      service.isButtonVisisble=true;
    }
   }

  ngOnInit(): void {

    if (this.service.myName) {


     // this.updateImageUrl(); // Update imageUrl if myName is available
     console.log(this.service.myName);
     
   }
   else{
    setTimeout(() => {
      this.router.navigateByUrl('/no-connection');
      setTimeout(() => {
        this.router.navigateByUrl('/login');
      }, 3000);
    }, 0);
   }
   this.fetchGalleryData();
 }

 fetchGalleryData() {
  this.service.getGalleryData(this.service.myName).subscribe(data => {
    this.galleryData = data;
  });
}


toggleHeartClass(id:any) {
  // const myName = this.service.myName;
 
  const myName = this.service.myName;
  this.service.sendGalleryData(id,myName).subscribe({
    next:(data)=>{
      this.fetchGalleryData();
    },
    error:(error)=>{
      console.log('error ')
    }


})
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


}
