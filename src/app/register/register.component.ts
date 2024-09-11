import { Component } from '@angular/core';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  //styleUrls: ['./register.component.css']
})
export class RegisterComponent {
  name: string = '';
  email: string = '';
  password: string = '';
  confirmPassword: string = '';

  onSubmit() {
    if (this.password !== this.confirmPassword) {
      alert('Passwords do not match!');
      return;
    }

    // Giả sử bạn muốn gửi dữ liệu đăng ký đến một API
    const registrationData = {
      name: this.name,
      email: this.email,
      password: this.password
    };

    // Thực hiện logic gửi dữ liệu đến backend ở đây
    console.log('Registration Data:', registrationData);

    // Nếu thành công, bạn có thể điều hướng đến trang đăng nhập
    // this.router.navigate(['/login']);
  }
}
