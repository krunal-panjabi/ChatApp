import { Component } from '@angular/core';
import { UsersService } from '../users.service';
import { Router } from '@angular/router';
import { GalleryData } from '../Models/galleryData';
import { NonNullAssert } from '@angular/compiler';

@Component({
  selector: 'app-photo-gallery',
  templateUrl: './photo-gallery.component.html',
  styleUrls: ['./photo-gallery.component.css']
})
export class PhotoGalleryComponent {
  heartIconClass = 'bi bi-heart';
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
  this.service.getGalleryData().subscribe(data => {
    this.galleryData = data;
    console.log(data);
  });
}


toggleHeartClass(id:number|null) {
  this.heartIconClass = this.heartIconClass === 'bi bi-heart' ? 'bi bi-heart-fill' : 'bi bi-heart';

}


}
