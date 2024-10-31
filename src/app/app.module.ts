import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http'; // Nhập HttpClientModule
import { AppComponent } from './app.component';
import { RouterModule } from '@angular/router';

@NgModule({
  declarations: [
    AppComponent,
    // Các component khác
  ],
  imports: [
    BrowserModule,
    HttpClientModule, // Thêm HttpClientModule vào imports
    RouterModule.forRoot([]) // Khai báo các routes
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
