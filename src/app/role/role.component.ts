import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-role',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './role.component.html',
  styleUrls: ['./role.component.scss']
})
export class RoleComponent implements OnInit {
  selectedRole: string | null = null;
  isLoading = false;
  errorMessage: string | null = null;

  constructor(
    private router: Router,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    // Check if the user is logged in
    const user = this.authService.getCurrentUser();
    if (!user) {
      this.router.navigate(['/login']);
      return;
    }
  }

  handleOptionClick(role: 'student' | 'teacher'): void {
    this.selectedRole = role;
    this.isLoading = true;
    this.errorMessage = null;
    
    const user = this.authService.getCurrentUser();
    if (!user?._id) {
      this.errorMessage = 'User information not found. Please login again.';
      this.isLoading = false;
      return;
    }

    // Call to update the user role
    this.authService.updateUserRole(user._id, role).subscribe({
      next: (response) => {
        console.log('Role updated successfully:', response);
        localStorage.setItem('user', JSON.stringify(response.user));
        this.isLoading = false;
        
        // Navigate based on the selected role
        if (role === 'student') {
          this.router.navigate(['/home']);
        } else {
          this.router.navigate(['/home']);
        }
      },
      error: (error) => {
        console.error('Error updating role:', error);
        this.errorMessage = error.message || 'Failed to update role. Please try again.';
        this.isLoading = false;
        this.selectedRole = null;

        // If there's no token, navigate to login
        if (error.message === 'No token found') {
          this.router.navigate(['/login']);
        }
      }
    });
  }
}
