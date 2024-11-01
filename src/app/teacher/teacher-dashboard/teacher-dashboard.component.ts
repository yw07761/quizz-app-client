import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../../services/auth.service';
import { Router } from '@angular/router'; // Import Router
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-teacher-dashboard',
  templateUrl: './teacher-dashboard.component.html',
  styleUrls: ['./teacher-dashboard.component.scss'],
  standalone: true,
  imports: [
    CommonModule,  // Import để sử dụng ngClass, ngIf, ngFor, etc.
    FormsModule    // Import để sử dụng [(ngModel)] cho các form
  ]
})
export class TeacherDashboardComponent implements OnInit {
  user: any = null;
  isDropdownActive = false;

  constructor(private authService: AuthService, private router: Router) {} // Inject Router

  ngOnInit() {
    this.user = this.authService.getCurrentUser();
  }

  toggleDropdown() {
    this.isDropdownActive = !this.isDropdownActive;
  }

  logout() {
    this.authService.logout().subscribe({
      next: () => {
        window.location.href = '/login';
      },
      error: (error) => {
        console.error('Logout error:', error);
      }
    });
  }

  navigateToCreateExam() {
    // Điều hướng tới trang tạo bài thi
    this.router.navigate(['/exam-create']);
  }
}
