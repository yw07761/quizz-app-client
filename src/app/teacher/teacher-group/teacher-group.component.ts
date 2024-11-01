import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-teacher-group',
  templateUrl: './teacher-group.component.html',
  styleUrls: ['./teacher-group.component.scss'],
  standalone: true,
  imports: [CommonModule, FormsModule]
})
export class TeacherGroupComponent implements OnInit {
  user: any = null;
  isDropdownActive = false;
  isAddGroupModalOpen: boolean = false;
  newGroupName: string = '';
  groups: Array<{ id: number; name: string }> = [];

  constructor(private authService: AuthService) {}

  ngOnInit() {
    this.user = this.authService.getCurrentUser();
    this.loadGroups();
  }

  toggleDropdown() {
    this.isDropdownActive = !this.isDropdownActive;
  }

  openAddGroupModal() {
    this.isAddGroupModalOpen = true;
  }

  closeAddGroupModal() {
    this.isAddGroupModalOpen = false;
    this.newGroupName = '';
  }

  addGroup() {
    if (this.newGroupName.trim() !== '') {
      const newGroup = {
        id: this.groups.length + 1,
        name: this.newGroupName.trim()
      };
      this.groups.push(newGroup);
      this.saveGroups();
      this.closeAddGroupModal();
    }
  }

  editGroup(group: any) {
    const newName = prompt('Enter new group name:', group.name);
    if (newName && newName.trim() !== '') {
      group.name = newName.trim();
      this.saveGroups();
    }
  }

  deleteGroup(group: any) {
    if (confirm('Are you sure you want to delete this group?')) {
      this.groups = this.groups.filter(grp => grp.id !== group.id);
      this.saveGroups();
    }
  }

  private saveGroups() {
    localStorage.setItem('groups', JSON.stringify(this.groups));
  }

  private loadGroups() {
    const savedGroups = localStorage.getItem('groups');
    if (savedGroups) {
      this.groups = JSON.parse(savedGroups);
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
