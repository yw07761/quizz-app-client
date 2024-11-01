import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../../services/auth.service';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
@Component({
  selector: 'app-teacher-class',
  templateUrl: './teacher-class.component.html',
  styleUrls: ['./teacher-class.component.scss']
})
export class TeacherClassComponent implements OnInit {
  user: any = null;
  isDropdownActive = false;
  isInviteModalVisible = false;
  isAddClassModalVisible = false;
  selectedClass: string | null = null;
  email: string = '';
  className: string = '';
  classDescription: string = '';

  // Danh sách học viên tĩnh cho từng lớp
  classStudents: { [key: string]: string[] } = {
    'ENG101': ['Học viên 1', 'Học viên 2', 'Học viên 3', 'Học viên 4', 'Học viên 5'],
    'ENG202': ['Học viên 6', 'Học viên 7', 'Học viên 8', 'Học viên 9', 'Học viên 10']
  };

  constructor(private authService: AuthService) {}

  ngOnInit() {
    this.user = this.authService.getCurrentUser();
  }

  toggleDropdown() {
    this.isDropdownActive = !this.isDropdownActive;
  }

  openInviteModal(classCode: string) {
    this.selectedClass = classCode;
    this.isInviteModalVisible = true;
  }

  closeInviteModal() {
    this.isInviteModalVisible = false;
    this.email = '';
  }

  addStudent() {
    if (this.email && this.selectedClass) {
      console.log(`Thêm học viên ${this.email} vào lớp ${this.selectedClass}`);
      this.classStudents[this.selectedClass].push(this.email);
      this.closeInviteModal();
    }
  }

  openAddClassModal() {
    this.isAddClassModalVisible = true;
  }

  closeAddClassModal() {
    this.isAddClassModalVisible = false;
    this.className = '';
    this.classDescription = '';
  }

  addClass() {
    if (this.className && this.classDescription) {
      console.log(`Thêm lớp với tên: ${this.className} và mô tả: ${this.classDescription}`);
      // Thêm lớp mới vào danh sách lớp với danh sách học viên trống
      this.classStudents[this.className] = [];
      this.closeAddClassModal();
    }
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
}
