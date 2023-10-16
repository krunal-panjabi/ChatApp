import { Component } from '@angular/core';
import { UsersService } from '../users.service';
import { Router } from '@angular/router';
import { GalleryData } from '../Models/galleryData';

@Component({
  selector: 'app-photo-gallery',
  templateUrl: './photo-gallery.component.html',
  styleUrls: ['./photo-gallery.component.css']
})
export class PhotoGalleryComponent {

  galleryData: GalleryData[] = [];
  constructor(public service: UsersService, private router: Router) { }

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
  const myName = this.service.myName;
 



}


}