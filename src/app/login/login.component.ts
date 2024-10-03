import { Component } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { RouterLink, RouterOutlet } from '@angular/router';


@Component({
  selector: 'app-login',
  standalone: true,
  template: `
    <a routerLink="/register">register</a>
    <a routerLink="/forgot-password">forgot-password</a>
  `, 
  imports: [RouterLink, RouterOutlet],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],


})
export class LoginComponent {
  loginForm: FormGroup;

  constructor() {
    this.loginForm = new FormGroup({
      username: new FormControl('', Validators.required),
      password: new FormControl('', Validators.required)
    });
  }

  onSubmit() {
    // Handle form submission here
  }
}