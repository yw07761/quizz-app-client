import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.scss'],
  standalone: true,
  imports: [CommonModule, FormsModule]
})
export class SettingsComponent implements OnInit {
  user: any = null;
  updatedUser: any = {}; // Initialize an object for the updated user information

  constructor(private authService: AuthService, private router: Router) {}

  ngOnInit() {
    this.user = this.authService.getCurrentUser(); // Fetch current user info
    if (this.user) {
      this.updatedUser = { ...this.user }; // Initialize updated user info
    }
  }

  updateUser() {
    if (this.updatedUser) {
      this.authService.updateUser(this.updatedUser).subscribe({
        next: (response) => {
          console.log('User updated successfully:', response);
          alert('Cập nhật thông tin thành công!'); // Notify the user
          this.router.navigate(['/profile']); // Redirect to the profile page after update
        },
        error: (error) => {
          console.error('Error updating user:', error);
          alert('Có lỗi xảy ra khi cập nhật thông tin. Vui lòng thử lại.');
        }
      });
    } else {
      console.error('No user data to update.');
    }
  }
}
