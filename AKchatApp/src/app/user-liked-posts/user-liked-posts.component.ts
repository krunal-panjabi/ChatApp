import { Component,Inject,OnInit } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { UsersService } from '../users.service';
import { UsersLikedPost } from '../Models/usersLikedPosts';

@Component({
  selector: 'app-user-liked-posts',
  templateUrl: './user-liked-posts.component.html',
  styleUrls: ['./user-liked-posts.component.css']
})
export class UserLikedPostsComponent implements OnInit{
  userLikedPost: UsersLikedPost[] = [];
  imageId!: number;

  // userName!: string;
  //    userImg!: string;

  constructor(@Inject(MAT_DIALOG_DATA) public data: any, public service : UsersService) {
    this.imageId = data.imageId; // Access 'res' property from data
    // this.userImg=data.userimg
  }
  ngOnInit(): void {
    // alert(this.imageId);
     console.log(this.imageId);

    this.service.UsersLikedPost(this.imageId).subscribe(data => {
      this.userLikedPost = data;
      console.log(this.userLikedPost);
      
    });
  }

}



// export class MutualFriendListComponent implements OnInit{
//   imagedata: string[];
//   namedata: string[];
//   constructor(@Inject(MAT_DIALOG_DATA) public data: any) {
//     this.imagedata = data.mutualarr; // Access 'res' property from data
//     this.namedata=data.mutualfriendnames
//   }
// ngOnInit(): void {
//   console.log("imgdata",this.imagedata);
//   console.log("the friend",this.namedata);
// }
// }