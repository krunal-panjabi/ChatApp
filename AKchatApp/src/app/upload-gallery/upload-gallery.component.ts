import { Component, ElementRef, OnInit, Renderer2, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { UsersService } from '../users.service';
import { GalleryData } from '../Models/galleryData';
import { Router } from '@angular/router';
import { data } from 'jquery';
import { OfflineUsers } from '../Models/OfflineUsers';
import { userslikepostsdata } from '../Models/userslikepostsdata';


@Component({
  selector: 'app-upload-gallery',
  templateUrl: './upload-gallery.component.html',
  styleUrls: ['./upload-gallery.component.css']
})
export class UploadGalleryComponent implements OnInit {
  @ViewChild('galleryimg') galleryimg !: ElementRef;
  galleryForm: FormGroup;
  currentUser: any;
  fileToUpload!: File;
  posts: any[] = [];
  likeposts: userslikepostsdata[] = [];
  imgg: string = '';
  grid = true;
  selectedTags = '';
  userfilterlist!: OfflineUsers[];
  searchctrl = new FormControl('');
  tagdiv: boolean = true;
  showAllNames = false;
  imagesrcurl = '';
  showMore = false;
  maxCommentsToShow = 2;
  selectedProfiles: Set<string> = new Set();
  constructor(private formBuilder: FormBuilder, public service: UsersService, private router: Router, private renderer: Renderer2, private elementRef: ElementRef) {
    this.galleryForm = this.formBuilder.group({
      caption: '',
      imgstr: ''
    });
  }
 

  toggleShowMore(post: any) {
    post.showMore = !post.showMore;
  }

  getComments(post: any) {
    return post.showMore ? post.comments : post.comments.slice(0, this.maxCommentsToShow);
  }
  // organizeData() {
  //   const organizedData = {};

  //   backendData.forEach(entry => {
  //     const postId = entry.postid;

  //     if (!organizedData[postId]) {
  //       organizedData[postId] = { image: entry.imgstr, comments: [] };
  //     }

  //     organizedData[postId].comments.push(entry.comment);
  //   });

  //   // Convert the organized data to an array for easy iteration in the template
  //   this.posts = Object.values(organizedData);
  // }

  ngOnInit() {
    // this.service.getUsersLikeComment().subscribe({
    //   next: (data) => {
    //     const organizedData: { [key: number]: { image: string | undefined, liked: number|undefined, comments: string[] } } = {};

    //     data.forEach(user => {
    //       const postid = user.postid;

    //       if (!organizedData.hasOwnProperty(postid || 0)) {
    //         organizedData[postid || 0] = { image: user.imgstr, liked: user.userliked, comments: [] };
    //       }
    //       organizedData[postid || 0].comments.push(user.comment || ''); // Handle null or undefined comments
    //     });

    //     this.posts = Object.values(organizedData);
    //   }

    // });
    this.service.getUsersLikePosts().subscribe({
      next: (data) => {
        this.likeposts = data;
      }
    })
    this.service.getUsersCommentPosts().subscribe({
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
    console.log("data of users", this.posts)
    this.service.myName = sessionStorage.getItem('myName') || '';
    this.service.imageUrl = sessionStorage.getItem('userimage') || '';
    this.galleryForm.reset();
    this.service.getAllUsers().subscribe({
      next: (data) => {
        this.service.offlineUsers = data;
        this.userfilterlist = data;
      }
    })
    // this.service.getUsersLikeComment().subscribe({
    //   next:(data)=>{
    //     const organizedData: { [key: number]: { image: string,liked:number ,comments: string[] } } = {};
    //     data.forEach(user=>{
    //       const postid=user.postid;
    //       if(!organizedData[postid]){

    //       }
    //     })
    //   }
    // })


    // this.service.createChatConnection();
  }
  onSearchInputChange1() {
    const searchterm = (this.searchctrl.value ?? '').toLocaleLowerCase();
    this.userfilterlist = this.service.offlineUsers.filter(user => user.username.toLowerCase().includes(searchterm));
  }

  backtodiv() {
    this.tagdiv = true;

  }
  toggleShowAllNames() {
    this.showAllNames = !this.showAllNames;
  }
  handleFileInput(event: any) {
    if (event.target.files && event.target.files[0]) {
      const file = event.target.files[0]; // Assuming only one file is selected
      this.convertToBase64(file);
      console.log("newww" + file);
    }

  }
  includename(name: string): void {

    if (this.selectedProfiles.has(name)) {
      this.selectedProfiles.delete(name);
    } else {
      this.selectedProfiles.add(name);
    }
    this.selectedTags = Array.from(this.selectedProfiles).join(',');
  }
  removeName(name: string): void {
    this.selectedProfiles.delete(name);
  }
  tagpeople() {
    // const divElement = this.elementRef.nativeElement.querySelector('#afterclick');
    // const divElement1 = this.elementRef.nativeElement.querySelector('#afterclick1');
    // const divElement2 = this.elementRef.nativeElement.querySelector('#afterclick2');



    // if (divElement2.classList.contains('d-flex')) {
    //   this.renderer.removeClass(divElement2, 'd-flex');
    // } else {
    //   this.renderer.addClass(divElement2, 'd-flex');
    // }

    // if (divElement.classList.contains('afterclick')) {
    //   this.renderer.removeClass(divElement, 'afterclick');
    // } else {
    //   this.renderer.addClass(divElement, 'afterclick');
    // }

    // if (divElement1.classList.contains('afterclick1')) {
    //   this.renderer.removeClass(divElement1, 'afterclick1');
    //   this.renderer.addClass(divElement1, 'd-none');
    // } else {
    //   this.renderer.removeClass(divElement1, 'd-none');
    //   this.renderer.addClass(divElement1, 'afterclick1');
    // }
    this.tagdiv = false;

  }

  convertToBase64(file: File) {
    const reader = new FileReader();
    reader.onload = (e: any) => {
      const base64String = e.target.result;
      // Do something with the base64String, such as assigning it to a variable or form control
      // For example, if you want to set it in a form control:
      this.galleryForm.get('imgstr')?.setValue(base64String);
      this.galleryimg.nativeElement.src = base64String;
      this.imagesrcurl = base64String;
    };
    reader.readAsDataURL(file);
  }




  onFormSubmit() {
    const formValue = this.galleryForm.value;
    const postData: GalleryData = {
      caption: formValue.caption,
      imgstr: formValue.imgstr,
      uploadedUser: this.service.myName,
      galleryId: null,
      likeCount: null,
      currentUserLiked: null,
      userimage: null,
      tagnames: this.selectedTags
    };
    if (this.galleryForm.valid) {
      this.service.uploadGalleryData(formValue.caption, formValue.imgstr, this.service.myName, this.selectedTags).subscribe({
        next: (data: any) => {
          this.service.LiveNotiforPost(this.selectedTags);
        }
      });


      this.service.getGalleryData(this.service.myName);
      this.router.navigateByUrl('/gallery')
    }
  }
}