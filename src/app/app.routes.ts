import { Routes } from '@angular/router';
import { Exam_studentComponent } from './exam_student/exam_student.component';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { ForgotPasswordComponent } from './forgot-password/forgot-password.component';
import { QRcodeComponent } from './qrcode/qrcode.component';
import { ResetPWComponent } from './reset-pw/reset-pw.component';
import { HomeComponent } from './home/home.component';
import { Library_teacherComponent } from './Library _ teacher/Library _ teacher.component'; // Đổi tên folder và component cho dễ hiểu
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
import { TeacherClassComponent } from './teacher/teacher-class/teacher-class.component';
import { TeacherClassDetailComponent } from './teacher/teacher-class-detail/teacher-class-detail.component';
import { TeacherStatisticsComponent } from './teacher/teacher-statistics/teacher-statistics.component';
import { TeacherCategoryComponent } from './teacher/teacher-category/teacher-category.component';
import { TeacherGroupComponent } from './teacher/teacher-group/teacher-group.component';
import { StudentDashboardComponent } from './student/student-dashboard/student-dashboard.component';
import { ClassComponent} from './student/class/class.component';
import { ExamHistoryComponent} from './student/exam-history/exam-history.component';
import { SummaryComponent} from './student/summary/summary.component';
import { ProfileComponent} from './profile/profile.component'
import { SettingsComponent} from './settings/settings.component'
import { ExamTakeComponent } from './student/exam-take/exam-take.component';

const routes: Routes = [
  { path: 'role', component: RoleComponent },
  { path: 'settings', component: SettingsComponent },
  { path: 'exam', component: Exam_studentComponent },
  { path: 'exam-take/:id', component: ExamTakeComponent },
  { path: 'home', component: HomeComponent },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'forgot-password', component: ForgotPasswordComponent },
  { path: 'qrcode', component: QRcodeComponent },
  { path: 'reset-password', component: ResetPWComponent },
  { path: 'library-teacher', component: Library_teacherComponent }, // Đổi tên route
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
  { path: 'teacher-class', component: TeacherClassComponent },
  { path: 'teacher-class-detail', component: TeacherClassDetailComponent },
  { path: 'teacher-statistics', component: TeacherStatisticsComponent },
  { path: 'teacher-category', component: TeacherCategoryComponent },
  { path: 'teacher-group', component: TeacherGroupComponent },
  { path: 'class-student', component: ClassComponent },
  { path: 'exam-history', component: ExamHistoryComponent },
  { path: 'summary-student', component: SummaryComponent },
  { path: 'student-dashboard', component: StudentDashboardComponent },
  { path: 'profile', component: ProfileComponent },


  { path: '', redirectTo: '/home', pathMatch: 'full' },
  { path: '**', redirectTo: '/home' } // Route không tìm thấy
];

export { routes }; // Export routes để có thể sử dụng trong các file khác
