import { Routes} from '@angular/router';
import { Exam_studentComponent } from './exam_student/exam_student.component';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { ForgotPasswordComponent } from './forgot-password/forgot-password.component';
import {QRcodeComponent} from './qrcode/qrcode.component';
import {ResetPWComponent} from './reset-pw/reset-pw.component';
import { HomeComponent } from './home/home.component';
import { Library_teacherComponent } from './Library _ teacher/Library _ teacher.component';
import { TermsComponent } from './terms/terms.component';
import { PrivacyComponent } from './privacy/privacy.component';
import { GuideComponent } from './guide/guide.component';
import { ContactComponent } from './contact/contact.component';
import { RoleComponent } from './role/role.component';

const routes: Routes = [
  { path: 'role', component: RoleComponent },
  { path: 'exam', component: Exam_studentComponent },
  { path: 'home', component: HomeComponent },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'forgot-password', component: ForgotPasswordComponent },
  { path: 'qrcode', component: QRcodeComponent},
  { path: 'reset-password', component: ResetPWComponent},
  { path: 'Library_teacherComponent', component:Library_teacherComponent},
  { path: 'terms', component: TermsComponent},
  { path: 'privacy', component: PrivacyComponent},
  { path: 'guide', component: GuideComponent},
  { path: 'contact', component: ContactComponent},


  { path: '', redirectTo: '/home', pathMatch: 'full' }
];

export { routes }; // Export routes để có thể sử dụng trong các file khác
