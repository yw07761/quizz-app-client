import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { AppComponent } from './app.component';
import { AuthService } from '../services/auth.service'; // Import AuthService
import { TeacherClassComponent } from './teacher/teacher-class/teacher-class.component';
import { TeacherCategoryComponent } from './teacher/teacher-category/teacher-category.component';

@NgModule({
  declarations: [
    AppComponent,
    TeacherClassComponent,
    TeacherCategoryComponent

  ],
  imports: [
    BrowserModule,
    FormsModule
  ],
  providers: [AuthService], // Đăng ký AuthService
  bootstrap: [AppComponent]
})
export class AppModule { }
