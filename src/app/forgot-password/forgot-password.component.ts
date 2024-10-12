import { Component } from '@angular/core';
import { Router, RouterLink, RouterOutlet, RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-forgot-password',
  standalone: true,
  templateUrl: './forgot-password.component.html', // Moved templateUrl here
  styleUrls: ['./forgot-password.component.scss'],
  imports: [RouterLink, RouterOutlet, RouterModule, FormsModule]
})
export class ForgotPasswordComponent {
  email: string = '';

  constructor(private router: Router) {}

  onSubmit(frm1: any) {
    if (!frm1.email) {
      alert('Please enter your email address!');
      return;
    }

    const forgotPasswordData = {
      email: frm1.email
    };

    console.log('Forgot Password Data:', forgotPasswordData);
    alert('Một liên kết đặt lại mật khẩu đã được gửi đến địa chỉ email của bạn.');
    
    this.router.navigate(['/reset-password']);
  }
}
