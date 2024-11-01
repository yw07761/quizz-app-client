import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-teacher-category',
  templateUrl: './teacher-category.component.html',
  styleUrls: ['./teacher-category.component.scss'],
  standalone: true,
  imports: [CommonModule, FormsModule]
})
export class TeacherCategoryComponent implements OnInit {
  user: any = null;
  isDropdownActive = false;
  isAddCategoryModalOpen: boolean = false;
  newCategoryName: string = '';
  categories: Array<{ id: number; name: string }> = [];

  constructor(private authService: AuthService) {}

  ngOnInit() {
    this.user = this.authService.getCurrentUser();
    this.loadCategories();
  }

  toggleDropdown() {
    this.isDropdownActive = !this.isDropdownActive;
  }

  openAddCategoryModal() {
    this.isAddCategoryModalOpen = true;
  }

  closeAddCategoryModal() {
    this.isAddCategoryModalOpen = false;
    this.newCategoryName = '';
  }

  addCategory() {
    if (this.newCategoryName.trim() !== '') {
      const newCategory = {
        id: this.categories.length + 1,
        name: this.newCategoryName.trim()
      };
      this.categories.push(newCategory);
      this.saveCategories();
      this.closeAddCategoryModal();
    }
  }

  editCategory(category: any) {
    const newName = prompt('Enter new category name:', category.name);
    if (newName && newName.trim() !== '') {
      category.name = newName.trim();
      this.saveCategories();
    }
  }

  deleteCategory(category: any) {
    if (confirm('Are you sure you want to delete this category?')) {
      this.categories = this.categories.filter(cat => cat.id !== category.id);
      this.saveCategories();
    }
  }

  private saveCategories() {
    localStorage.setItem('categories', JSON.stringify(this.categories));
  }

  private loadCategories() {
    const savedCategories = localStorage.getItem('categories');
    if (savedCategories) {
      this.categories = JSON.parse(savedCategories);
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