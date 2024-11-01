import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../../services/auth.service';
import { NgModule } from '@angular/core';
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
  selectedClass: number | null = null; // Changed to number to maintain consistency
  email: string = '';
  className: string = '';
  classDescription: string = '';

  // Array to hold the classes dynamically
  classes: Array<{ id: number; code: string; name: string; description: string; students: string[] }> = [];

  constructor(private authService: AuthService) {}

  ngOnInit() {
    this.user = this.authService.getCurrentUser();
    this.loadClasses();
  }

  toggleDropdown() {
    this.isDropdownActive = !this.isDropdownActive;
  }

  openInviteModal(classId: number) {
    this.selectedClass = classId; // Keep as number for easier reference
    this.isInviteModalVisible = true;
  }

  closeInviteModal() {
    this.isInviteModalVisible = false;
    this.email = '';
  }

  addStudent() {
    if (this.email && this.selectedClass !== null) {
      const selectedClass = this.classes.find(cls => cls.id === this.selectedClass);
      if (selectedClass) {
        console.log(`Thêm học viên ${this.email} vào lớp ${selectedClass.name}`);
        selectedClass.students.push(this.email);
        this.saveClasses();
        this.closeInviteModal();
      }
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
      const newClass = {
        id: this.classes.length + 1,
        code: `CLASS${this.classes.length + 1}`,
        name: this.className.trim(),
        description: this.classDescription.trim(),
        students: []
      };
      this.classes.push(newClass);
      this.saveClasses();
      this.closeAddClassModal();
    }
  }

  private saveClasses() {
    localStorage.setItem('classes', JSON.stringify(this.classes));
  }

  private loadClasses() {
    const savedClasses = localStorage.getItem('classes');
    if (savedClasses) {
      this.classes = JSON.parse(savedClasses);
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
