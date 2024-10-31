import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';

import { AppComponent } from './app.component';
import { AuthService } from '../services/auth.service'; // Import AuthService

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule // Đảm bảo rằng HttpClientModule được import
  ],
  providers: [AuthService], // Đăng ký AuthService
  bootstrap: [AppComponent]
})
export class AppModule { }
