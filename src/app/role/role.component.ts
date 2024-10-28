import { Component } from '@angular/core';

@Component({
  selector: 'app-role',
  standalone: true,
  templateUrl: './role.component.html',
  styleUrls: ['./role.component.scss']  // Chỉnh sửa ở đây thành styleUrls
})
export class RoleComponent {
  selectedRole: string | null = null; // Biến để lưu vai trò đã chọn

  handleOptionClick(role: string): void {
    this.selectedRole = role; // Lưu vai trò đã chọn
    alert(`Bạn đã chọn: ${role === 'student' ? 'Học viên tham gia làm bài trắc nghiệm' : 'Giáo viên tạo và quản lý bài trắc nghiệm Online'}`);
  }
}
