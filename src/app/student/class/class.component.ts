import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../../services/auth.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-class',
  templateUrl: './class.component.html',
  styleUrls: ['./class.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    FormsModule
  ]
})
export class ClassComponent implements OnInit {
  user: any = null;
  isDropdownActive = false;
  isAddClassModalVisible = false;
  classCode: string = ''; // Updated for joining class by code
  classes = [
    {
      code: 'CLS001',
      name: 'Mathematics 101',
      description: 'Introductory class on Mathematics.',
      students: [{ id: 1, name: 'John Doe' }, { id: 2, name: 'Jane Doe' }]
    },
    {
      code: 'CLS002',
      name: 'Physics 101',
      description: 'Introductory class on Physics.',
      students: [{ id: 3, name: 'Alice' }, { id: 4, name: 'Bob' }]
    }
  ];

  constructor(private authService: AuthService) {}

  ngOnInit() {
    this.user = this.authService.getCurrentUser();
  }

  toggleDropdown() {
    this.isDropdownActive = !this.isDropdownActive;
  }

  openAddClassModal() {
    this.isAddClassModalVisible = true;
  }

  closeAddClassModal() {
    this.isAddClassModalVisible = false;
    this.classCode = ''; // Clear input field on close
  }

  joinClass() {
    if (this.classCode) {
      console.log('Joining class with code:', this.classCode);
      this.closeAddClassModal();
    } else {
      console.warn('Class code is required to join a class.');
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
