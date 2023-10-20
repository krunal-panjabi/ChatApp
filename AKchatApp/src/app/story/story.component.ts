  import { Component } from '@angular/core';
  import { MatDialog, MatDialogRef, MatDialogModule } from '@angular/material/dialog';
  import { MatButtonModule } from '@angular/material/button';
  import { StoryUploadComponent } from '../story-upload/story-upload.component';
  import { UsersService } from '../users.service';
  import { AllStories } from '../Models/allStories';
  import { StoryViewComponent } from '../story-view/story-view.component';
  import { Router } from '@angular/router';
  import { animate, state, style, transition, trigger } from '@angular/animations';

  @Component({
    selector: 'app-story',
    templateUrl: './story.component.html',
    styleUrls: ['./story.component.css'],
    animations: [
      trigger('customDialogAnimation', [
        state('void', style({ opacity: 0, transform: 'scale(0.8)' })),
        transition('void => *', animate('300ms ease-out')),
        transition('* => void', animate('200ms ease-in')),
      ]),
    ],
  })
  export class StoryComponent {
    storyuser: any;
    // allStories: AllStories[] = [];
    constructor(public dialog: MatDialog, public service: UsersService, private router: Router) { }


    ngOnInit(): void {

      this.service.getStoryData().subscribe(data => {
        this.service.allStories = data;


        console.log("story"+this.service.myName);
        console.log(this.service.allStories);
      });
    }
    openDialog(enterAnimationDuration: string, exitAnimationDuration: string): void {
     const dialogRef= this.dialog.open(StoryUploadComponent, {
        width: '600px',
        enterAnimationDuration,
        exitAnimationDuration,
      });

      dialogRef.afterClosed().subscribe((result) => {
        if (result && result.submitted) {
          // Refresh the data in StoryComponent after the form is submitted
          this.service.getStoryData().subscribe((data) => {
            this.service.allStories = data;
          });
        }
      });
    }

    deleteStory(userid : number){
      alert(userid);
      this.service.deleteMyStory(userid).subscribe({
        next:()=>{
          this.ngOnInit();
          this.service.LiveStory();

        }
      
    })
    }



    bb( userId: any,enterAnimationDuration: string, exitAnimationDuration: string) {



   

      this.service.storyOfUser(userId).subscribe({
        next: (res) => {
          console.log('response for image',res);
          // const elements: string[] = res.imgstr.split(',data');
          //  const count=this.service.storyOfUser(userId)..length;
            const dialogRef = this.dialog.open(StoryViewComponent, {
              width: '1000px',
              height: '700px',
              panelClass: 'custom-dialog-panel',
              data:{res}
  
            });
            const removalTimeout = setTimeout(() => {
              dialogRef.close(); // Close the dialog
            }, 10000);
        },
        error: () => {
          console.log('error ')
        }
      }
      )


    }


isMyStory(storyuser: string): boolean {
  if(this.storyuser == this.service.myName){
    return true;
  }
  else{
    return false;
  }
}




    ngOnDestroy(): void {
      // Unsubscribe when the component is destroyed
      this.service.allStories=[];
    }
    open() {
      alert("hello");
    }
  }
