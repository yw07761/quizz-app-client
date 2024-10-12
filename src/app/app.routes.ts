import { Routes} from '@angular/router';
import { Exam_studentComponent } from './exam_student/exam_student.component';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { ForgotPasswordComponent } from './forgot-password/forgot-password.component';
import {QRcodeComponent} from './qrcode/qrcode.component';
import {ResetPWComponent} from './reset-pw/reset-pw.component';
import { HomeComponent } from './home/home.component';
import { Library_teacherComponent } from './Library _ teacher/Library _ teacher.component';

const routes: Routes = [
  { path: 'exam', component: Exam_studentComponent },
  { path: 'home', component: HomeComponent },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'forgot-password', component: ForgotPasswordComponent },
  { path: 'qrcode', component: QRcodeComponent},
  { path: 'reset-password', component: ResetPWComponent},
  { path: 'Library_teacherComponent', component:Library_teacherComponent},

  { path: '', redirectTo: '/login', pathMatch: 'full' }
];

export { routes }; // Export routes để có thể sử dụng trong các file khác
