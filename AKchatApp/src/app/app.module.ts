import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { LoginPageComponent } from './login-page/login-page.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RegisterationPageComponent } from './registeration-page/registeration-page.component';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { UsersService } from './users.service';
import { HeaderComponent } from './header/header.component';
import { FooterComponent } from './footer/footer.component';
import { UserProfileComponent } from './user-profile/user-profile.component';
import { MaterialModule } from './material.module';
import { PhotoGalleryComponent } from './photo-gallery/photo-gallery.component';
import { UploadGalleryComponent } from './upload-gallery/upload-gallery.component';
import { NoConnectionComponent } from './no-connection/no-connection.component';
import { TokenInterceptor } from './interceptors/token.interceptor';
import { ToastrModule } from 'ngx-toastr';
import { MatChipsModule } from '@angular/material/chips';
import { NotificationComponent } from './notification/notification.component';
import { PostCommentComponent } from './post-comment/post-comment.component';
import { ForgetPasswordComponent } from './forget-password/forget-password.component';
import { ConfirmPasswordComponent } from './confirm-password/confirm-password.component';
import { OtpSendComponent } from './otp-send/otp-send.component';
import { MyPostsComponent } from './my-posts/my-posts.component';
import { UserLikedPostsComponent } from './user-liked-posts/user-liked-posts.component';
import { AngularEditorModule } from '@kolkov/angular-editor';
import { UserDetailComponent } from './user-detail/user-detail.component';
import {MatDialogActions, MatDialogModule} from '@angular/material/dialog';
import { ConfirmdialogueComponent } from './confirmdialogue/confirmdialogue.component';
// import { MdbCarouselModule } from 'mdb-angular-ui-kit/carousel';
//import { MatChipsModule } from '@angular/material/chips';

@NgModule({
  declarations: [
    AppComponent,
    LoginPageComponent,
    RegisterationPageComponent,
    HeaderComponent,
    FooterComponent,
    UploadGalleryComponent,
    UserProfileComponent,
    PhotoGalleryComponent,
    NoConnectionComponent,
    NotificationComponent,
    ForgetPasswordComponent,
    ConfirmPasswordComponent,
    OtpSendComponent,
    MyPostsComponent,
    UserLikedPostsComponent,
    ConfirmdialogueComponent
    // UserDetailComponent
      ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    NgbModule,
    ReactiveFormsModule,
    HttpClientModule,
    FormsModule,
    MatDialogModule,
    MaterialModule,
    BrowserAnimationsModule,
    ToastrModule.forRoot(),
    AngularEditorModule,
    

    // MatChipsModule
    
  ],
  exports:[MatChipsModule,MatDialogActions],
   providers: [UsersService,
    {
      provide:HTTP_INTERCEPTORS,
      useClass:TokenInterceptor,
      multi:true
    }
    ],
  bootstrap: [AppComponent]
})
export class AppModule { }
