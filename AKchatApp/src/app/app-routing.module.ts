import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { RegisterationPageComponent } from './registeration-page/registeration-page.component';
import { LoginPageComponent } from './login-page/login-page.component';

const routes: Routes = [
  { path: '', component: LoginPageComponent },
  { path: 'register', component: RegisterationPageComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
