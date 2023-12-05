import { Injectable } from '@angular/core';
import { GalleryData } from './Models/galleryData';
import { UsersService } from './users.service';

@Injectable({
  providedIn: 'root'
})
export class GalleryService {
  galleryData: GalleryData[] = [];
  filtergalleryData:GalleryData[]=[];
  myposts:GalleryData[]=[];
  filterAlert=false;
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
    if (this.filtergalleryData.length === 0) {
      this.filtergalleryData=this.galleryData;
      this.service.getGalleryData(this.service.myName).subscribe(data => {
        this.filtergalleryData = data.sort((a, b) => {
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
      this.filtergalleryData=this.galleryData;
      this.filtergalleryData = this.filtergalleryData.sort((a, b) => {
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
