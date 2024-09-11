import { Component } from '@angular/core';

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  //styleUrls: ['./forgot-password.component.css']
})
export class ForgotPasswordComponent {
  email: string = '';

  onSubmit() {
    if (!this.email) {
      alert('Please enter your email address!');
      return;
    }

    // Giả sử bạn có một API để gửi yêu cầu đặt lại mật khẩu
    const forgotPasswordData = {
      email: this.email
    };

    // Thực hiện logic gửi dữ liệu đến backend ở đây
    console.log('Forgot Password Data:', forgotPasswordData);

    // Thông báo cho người dùng rằng yêu cầu đã được gửi
    alert('A password reset link has been sent to your email address.');

    // Có thể điều hướng người dùng về trang đăng nhập
    // this.router.navigate(['/login']);
  }
}
