import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { Router, RouterModule } from '@angular/router'; // Import Router
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    RouterModule 
  ]
})
export class ProfileComponent implements OnInit {
  user: any = null;

  constructor(private authService: AuthService, private router: Router) {}

  ngOnInit() {
    this.authService.getCurrentUserFromApi().subscribe(
      (userData) => {
        this.user = userData;
        console.log('User from API:', this.user);  // Log dữ liệu từ API
      },
      (error) => {
        console.error('Lỗi khi lấy thông tin người dùng từ API:', error);
      }
    );
  }
  goBack(): void {
    window.history.back();
  }

  // Nếu bạn cần điều hướng bằng TypeScript:
  navigateToSettings() {
    this.router.navigate(['/settings']);
  }
}
