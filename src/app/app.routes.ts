import { Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { ForgotPasswordComponent } from './forgot-password/forgot-password.component';
import { QRcodeComponent } from './qrcode/qrcode.component';
import { ResetPWComponent } from './reset-pw/reset-pw.component';
import { HomeComponent } from './home/home.component';
import { TermsComponent } from './terms/terms.component';
import { PrivacyComponent } from './privacy/privacy.component';
import { GuideComponent } from './guide/guide.component';
import { ContactComponent } from './contact/contact.component';
import { RoleComponent } from './role/role.component';
import { TeacherDashboardComponent } from './teacher/teacher-dashboard/teacher-dashboard.component';
import { ExamCreateComponent } from './teacher/exam-create/exam-create.component';
import { ExamDetailsComponent} from './teacher/exam-details/exam-details.component';
import { ExamEditComponent} from './teacher/exam-edit/exam-edit.component'
import { TeacherLibraryComponent } from './teacher/teacher-library/teacher-library.component';
import { QuestionComponent } from './teacher/question/question.component';
import { TeacherStatisticsComponent } from './teacher/teacher-statistics/teacher-statistics.component';
import { TeacherCategoryComponent } from './teacher/teacher-category/teacher-category.component';
import { StudentDashboardComponent } from './student/student-dashboard/student-dashboard.component';
import { ExamHistoryComponent} from './student/exam-history/exam-history.component';
import { ProfileComponent} from './profile/profile.component'
import { SettingsComponent} from './settings/settings.component'
import { ExamTakeComponent } from './student/exam-take/exam-take.component';
import { ExamResultDetailComponent } from './student/exam-result-detail/exam-result-detail.component';
import { studentResultDetailComponent } from './teacher/student-result-detail/student-result-detail.component';
import { AdminDashboardComponent } from './admin/admin-dashboard/admin-dashboard.component';
import { AdminUserComponent } from './admin/admin-user/admin-user.component';
import { AdminQuestionComponent } from './admin/admin-question/admin-question.component';
import { AdminExamComponent } from './admin/admin-exam/admin-exam.component';
import { TeacherHistoryComponent} from './teacher/teacher-history/teacher-history.component';
const routes: Routes = [
  { path: 'teacher-history', component: TeacherHistoryComponent},
  { path: 'role', component: RoleComponent },
  { path: 'admin-dashboard', component: AdminDashboardComponent},
  { path: 'admin-user', component: AdminUserComponent},
  { path: 'admin-question', component:  AdminQuestionComponent },
  { path: 'admin-exam', component: AdminExamComponent},
  { path: 'settings', component: SettingsComponent },
  { path: 'exam-result-detail/:id', component: ExamResultDetailComponent},
  { path: 'exam-take/:id', component: ExamTakeComponent },
  { path: 'home', component: HomeComponent },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'forgot-password', component: ForgotPasswordComponent },
  { path: 'qrcode', component: QRcodeComponent },
  { path: 'reset-password', component: ResetPWComponent },
  { path: 'terms', component: TermsComponent },
  { path: 'privacy', component: PrivacyComponent },
  { path: 'guide', component: GuideComponent },
  { path: 'contact', component: ContactComponent },
  { path: 'teacher-dashboard', component: TeacherDashboardComponent },
  { path: 'exam-create', component: ExamCreateComponent },
  { path: 'exam-details/:id', component: ExamDetailsComponent },
  { path: 'exam-edit/:id', component: ExamEditComponent },
  { path: 'teacher-library', component: TeacherLibraryComponent },
  { path: 'question', component: QuestionComponent },
  { path: 'teacher-statistics/:id', component: TeacherStatisticsComponent },
  { path: 'teacher-category', component: TeacherCategoryComponent },
  { path: 'exam-history', component: ExamHistoryComponent },
  { path: 'student-dashboard', component: StudentDashboardComponent },
  { path: 'profile', component: ProfileComponent },
  { path: 'student-result-detail/:examId/:userId', component: studentResultDetailComponent },

  { path: '', redirectTo: '/home', pathMatch: 'full' },
  { path: '**', redirectTo: '/home' } // Route không tìm thấy
];

export { routes }; // Export routes để có thể sử dụng trong các file khác
