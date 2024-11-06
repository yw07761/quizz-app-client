import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../../services/auth.service';
import { Router } from '@angular/router';
import { ClassService } from '../../../services/class.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-teacher-class',
  templateUrl: './teacher-class.component.html',
  styleUrls: ['./teacher-class.component.scss'],
  standalone: true,
  imports: [FormsModule, CommonModule]
})
export class TeacherClassComponent implements OnInit {
  user: any = null;
  isDropdownActive = false;
  isInviteModalVisible = false;
  isAddClassModalVisible = false;
  selectedClassId: string | null = null;

  // Form inputs
  className: string = '';
  classDescription: string = '';
  startDate: string = '';
  endDate: string = '';
  maxStudents: number = 30;
  location: string = 'Chưa có địa điểm';
  status: string = 'open';
  email: string = '';

  classes: Array<{
    id: string;
    classId: string;
    className: string;
    schedule: string;
    teacher: string;
    students: string[];
    startDate: string;
    endDate: string;
    maxStudents: number;
    location: string;
    status: string;
    currentStudents: number; // Thêm thuộc tính currentStudents
  }> = [];

  constructor(
    private authService: AuthService,
    private classService: ClassService,
    private router: Router
  ) {}

  ngOnInit() {
    this.user = this.authService.getCurrentUser();
    this.loadClasses();
  }

  toggleDropdown() {
    this.isDropdownActive = !this.isDropdownActive;
  }

  openAddClassModal() {
    this.isAddClassModalVisible = true;
  }

  closeAddClassModal() {
    this.isAddClassModalVisible = false;
    this.clearClassForm();
  }

  addClass() {
    if (this.className && this.classDescription) {
      const teacherInfo = {
        _id: this.user?._id,
        email: this.user?.email,
        username: this.user?.username
      };

      const classId = `CLASS${Date.now()}`; // Mã lớp mới
      const newClass = {
        classId: classId,
        className: this.className.trim(),
        description: this.classDescription.trim(),
        teacher: teacherInfo, // Gán thông tin giáo viên đầy đủ
        schedule: 'Mon, Wed, Fri - 9:00AM to 11:00AM', // Lịch học
        students: [], // Mảng sinh viên ban đầu rỗng
        startDate: new Date(this.startDate).toISOString(),
        endDate: this.endDate ? new Date(this.endDate).toISOString() : undefined,
        maxStudents: this.maxStudents,
        location: this.location.trim(),
        status: this.status,
        currentStudents: 0, // Số sinh viên hiện tại
      };

      this.classService.addClass(newClass).subscribe({
        next: () => {
          console.log('Thêm lớp thành công');
          this.loadClasses(); // Tải lại danh sách lớp
          this.closeAddClassModal(); // Đóng modal
        },
        error: (error: any) => console.error('Lỗi khi thêm lớp:', error)
      });
    } else {
      console.error('Tên lớp và mô tả không được để trống');
    }
  }

  loadClasses() {
    this.classService.getClasses().subscribe({
      next: (data) => {
        this.classes = data;
        console.log('Classes loaded:', this.classes); // Log danh sách lớp
      },
      error: (error: any) => console.error('Lỗi khi tải danh sách lớp:', error)
    });
  }

  openInviteModal(classId: string) {
    this.selectedClassId = classId;
    this.isInviteModalVisible = true;
  }

  closeInviteModal() {
    this.isInviteModalVisible = false;
    this.email = '';
  }

  addStudent() {
    if (this.selectedClassId && this.email) {
      const studentData = {
        email: this.email.trim() // Đảm bảo email không có khoảng trắng
      };

      this.classService.addStudent(this.selectedClassId, studentData).subscribe({
        next: () => {
          console.log('Thêm học viên thành công');
          this.closeInviteModal(); // Đóng modal mời học viên
          this.loadClasses(); // Tải lại danh sách lớp
        },
        error: (error: any) => console.error('Lỗi khi thêm học viên:', error) // Ghi log lỗi
      });
    } else {
      console.error('ID lớp và email không được để trống');
    }
  }

  // Phương thức đăng xuất
  logout() {
    this.authService.logout().subscribe({
      next: () => {
        this.router.navigate(['/login']); // Chuyển hướng đến trang đăng nhập
      },
      error: (error) => {
        console.error('Logout error:', error);
      }
    });
  }

  private clearClassForm() {
    this.className = '';
    this.classDescription = '';
    this.startDate = '';
    this.endDate = '';
    this.maxStudents = 30;
    this.location = 'Chưa có địa điểm';
    this.status = 'open';
  }
}
