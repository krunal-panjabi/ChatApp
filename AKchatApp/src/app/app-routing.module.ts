import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { RegisterationPageComponent } from './registeration-page/registeration-page.component';
import { LoginPageComponent } from './login-page/login-page.component';
import { UserProfileComponent } from './user-profile/user-profile.component';
import { PhotoGalleryComponent } from './photo-gallery/photo-gallery.component';
import { UploadGalleryComponent } from './upload-gallery/upload-gallery.component';
import { NoConnectionComponent } from './no-connection/no-connection.component';
import { AuthGuard } from './guards/auth.guard';
import { ForgetPasswordComponent } from './forget-password/forget-password.component';
import { ConfirmPasswordComponent } from './confirm-password/confirm-password.component';
import { OtpSendComponent } from './otp-send/otp-send.component';
 import { MyPostsComponent } from './my-posts/my-posts.component';

const routes: Routes = [
  { path: '', component: LoginPageComponent },
  { path: 'login', component: LoginPageComponent },
  { path: 'register', component: RegisterationPageComponent },
  { path: 'forget-password', component: ForgetPasswordComponent },
  { path: 'confirmPassword', component: ConfirmPasswordComponent },
  { path: 'otp-send', component: OtpSendComponent },
  { path: 'my-posts', component: MyPostsComponent },
  { path: 'user-profile', component: UserProfileComponent,canActivate:[AuthGuard] },
  { path: 'gallery', component: PhotoGalleryComponent,canActivate:[AuthGuard] },
  { path: 'upload-gallery', component: UploadGalleryComponent,canActivate:[AuthGuard] },
  { path: 'no-connection', component: NoConnectionComponent,canActivate:[AuthGuard]  },
  { path: 'chat', loadChildren: () => import('./chat/chat.module').then(m => m.ChatModule),canActivate:[AuthGuard] }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
