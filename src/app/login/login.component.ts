import { Component } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { RouterLink, RouterOutlet } from '@angular/router';
import { FormsModule } from '@angular/forms';


@Component({
  selector: 'app-login',
  standalone: true,
  template: `
    <a routerLink="/register">register</a>
    <a routerLink="/forgot-password">forgot-password</a>
  `, 
  imports: [RouterLink, FormsModule , RouterOutlet],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],


})
export class LoginComponent {
  loginForm: FormGroup;
  email: string = '';
  password: string = '';
  constructor() {
    this.loginForm = new FormGroup({
      email: new FormControl('', Validators.required),
      password: new FormControl('', Validators.required)
    });
  }
  
  onSubmit() {
    console.log('Thành công');
    console.log('Form Submitted', this.email, this.password)
    }
}