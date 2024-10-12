import { Routes} from '@angular/router';
import { Exam_studentComponent } from './screens/exam_student/exam_student.component';
import { LoginComponent } from './screens/login/login.component';
import { RegisterComponent } from './screens/register/register.component';
import { ForgotPasswordComponent } from './screens/forgot-password/forgot-password.component';
import {QRcodeComponent} from './screens/qrcode/qrcode.component';
import {ResetPWComponent} from './screens/reset-pw/reset-pw.component';
import { HomeComponent } from './screens/home/home.component';
import { Library_teacherComponent } from './screens/Library _ teacher/Library _ teacher.component';
import { TermsComponent } from './screens/terms/terms.component';
import { PrivacyComponent } from './screens/privacy/privacy.component';
import { GuideComponent } from './screens/guide/guide.component';
import { ContactComponent } from './screens/contact/contact.component';

const routes: Routes = [
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
