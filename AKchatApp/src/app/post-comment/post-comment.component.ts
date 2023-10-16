import { Component, OnInit,Inject } from '@angular/core';
import { FormBuilder, FormGroup  } from '@angular/forms';
import { UsersService } from '../users.service';
import { Router } from '@angular/router';
import { PostComments } from '../Models/postComments';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';



@Component({
  selector: 'app-post-comment',
  templateUrl: './post-comment.component.html',
  styleUrls: ['./post-comment.component.css']
})
export class PostCommentComponent implements OnInit{
  commentForm: FormGroup;
  comment: string='';
  commentData: PostComments[] = [];
  storydata:any=this.data['postId'];

  constructor(private formBuilder: FormBuilder,@Inject(MAT_DIALOG_DATA) public data: any, private service: UsersService,private router:Router) {
    this.commentForm = this.formBuilder.group({
             comment : ''       // Define your form controls here
    });
    
  }

  ngOnInit(): void {
    this.commentForm.reset();
    // this.service.getPostComments(this.storydata);
  //  alert(this.storydata);
   this.getComments();
   
  }

  getComments(){
    this.service.getPostComments(this.storydata).subscribe(data => {
      console.log(data);
      this.commentData = data;

    });

  }

  onFormSubmit(){
    const formValue = this.commentForm.value;
    const postData: PostComments = {
      comment: formValue.comment,
      commenter: this.service.myName ,
      postId : this.storydata,
     
    };

    if(this.commentForm.valid){
      

      // alert("component"+postData);
    this.service.uploadPostComment(postData).subscribe({
      next: (response) => {
        console.log(response);
        this.commentForm.reset();
        this.getComments();
      },
      error: (error) => {
        console.log(error);
      }
    });

  }




  }
}
