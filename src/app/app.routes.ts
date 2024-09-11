import { Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { ForgotPasswordComponent } from './forgot-password/forgot-password.component';
import {QRcodeComponent} from './qrcode/qrcode.component';
import {ResetPWComponent} from './reset-pw/reset-pw.component';
const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'forgot-password', component: ForgotPasswordComponent },
  { path: 'qrcode', component: QRcodeComponent},
  { path: 'reset-password', component: ResetPWComponent},

  { path: '', redirectTo: '/login', pathMatch: 'full' }
];

export { routes }; // Export routes để có thể sử dụng trong các file khác
