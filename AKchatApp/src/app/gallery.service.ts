import { Injectable } from '@angular/core';
import { GalleryData } from './Models/galleryData';
import { UsersService } from './users.service';

@Injectable({
  providedIn: 'root'
})
export class GalleryService {
  galleryData: GalleryData[] = [];
  myposts:GalleryData[]=[];
  constructor(public service: UsersService) {}

  // changeOrderById(postid:any){
  //   this.galleryData = this.galleryData.sort((a, b) => {
  //     if (a.galleryId === postid) {
  //       return -1; // a comes first
  //     } else if (b.galleryId === postid) {
  //       return 1; // b comes first
  //     } else {
  //       return 0; // no change in order for other elements
  //     }
  //   });
  // }
  changeOrderById(postid: any) {
    if (this.galleryData.length === 0) {
      alert('if');
      this.service.getGalleryData(this.service.myName).subscribe(data => {
        this.galleryData = data.sort((a, b) => {
          if (a.galleryId === postid) {
            return -1; 
          } else if (b.galleryId === postid) {
            return 1; 
          } else {
            return 0; 
          }
        });
      });
    } else {
      alert('else');
      this.galleryData = this.galleryData.sort((a, b) => {
        if (a.galleryId === postid) {
          return -1; 
        } else if (b.galleryId === postid) {
          return 1;
        } else {
          return 0; 
        }
      });
    }
  }


}
