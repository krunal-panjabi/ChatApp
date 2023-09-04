import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { RegisterationPageComponent } from './registeration-page/registeration-page.component';
import { LoginPageComponent } from './login-page/login-page.component';
import { UserProfileComponent } from './user-profile/user-profile.component';
import { PhotoGalleryComponent } from './photo-gallery/photo-gallery.component';
import { UploadGalleryComponent } from './upload-gallery/upload-gallery.component';
import { NoConnectionComponent } from './no-connection/no-connection.component';

const routes: Routes = [
  { path: '', component: LoginPageComponent },
  { path: 'login', component: LoginPageComponent },
  { path: 'register', component: RegisterationPageComponent },
  { path: 'user-profile', component: UserProfileComponent },
  { path: 'gallery', component: PhotoGalleryComponent },
  { path: 'upload-gallery', component: UploadGalleryComponent },
  { path: 'no-connection', component: NoConnectionComponent },
  { path: 'chat', loadChildren: () => import('./chat/chat.module').then(m => m.ChatModule) }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
