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
      const teacherId = this.user?._id;
      const classId = `CLASS${Date.now()}`;
      const newClass = {
        classId: classId,
        className: this.className.trim(),
        description: this.classDescription.trim(),
        teacher: teacherId,
        startDate: new Date(this.startDate).toISOString(),
        endDate: this.endDate ? new Date(this.endDate).toISOString() : undefined,
        maxStudents: this.maxStudents,
        location: this.location.trim(),
        status: this.status,
      };

      this.classService.addClass(newClass).subscribe({
        next: () => {
          console.log('Thêm lớp thành công');
          this.loadClasses();
          this.closeAddClassModal();
        },
        error: (error: any) => console.error('Lỗi khi thêm lớp:', error)
      });
    }
  }

  loadClasses() {
    this.classService.getClasses().subscribe({
      next: (data) => {
        this.classes = data;
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
      this.classService.addStudent(this.selectedClassId, this.email).subscribe({
        next: () => {
          console.log('Thêm học viên thành công');
          this.closeInviteModal();
        },
        error: (error: any) => console.error('Lỗi khi thêm học viên:', error)
      });
    }
  }

  // Phương thức đăng xuất
  logout() {
    this.authService.logout(); // Gọi phương thức logout từ AuthService
    this.router.navigate(['/login']); // Chuyển hướng đến trang đăng nhập
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
