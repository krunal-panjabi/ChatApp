import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { LoginPageComponent } from './login-page/login-page.component';
import { ReactiveFormsModule } from '@angular/forms';
import { RegisterationPageComponent } from './registeration-page/registeration-page.component';
import { HttpClientModule } from '@angular/common/http';
import { UsersService } from './users.service';

@NgModule({
  declarations: [
    AppComponent,
    LoginPageComponent,
    RegisterationPageComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    NgbModule,
    ReactiveFormsModule,
    HttpClientModule
  ],
   providers: [UsersService],
  bootstrap: [AppComponent]
})
export class AppModule { }
