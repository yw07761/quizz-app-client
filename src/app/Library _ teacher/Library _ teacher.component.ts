import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-category',
  templateUrl: './Library _ teacher.component.html',
  styleUrls: ['./Library _ teacher.component.scss']
})
export class Library_teacherComponent implements OnInit {
  categories: string[] = [];

  constructor() { }

  ngOnInit(): void {
    // Khởi tạo có thể thêm dữ liệu mẫu
    this.categories = ['English question'];
  }

  // Hàm tạo danh mục mới
  createCategory() {
    const newCategory = prompt('Nhập tên danh mục:');
    if (newCategory && newCategory.trim()) {
      this.categories.push(newCategory.trim());
    } else {
      alert('Tên danh mục không được để trống!');
    }
  }

  // Hàm sửa danh mục
  editCategory(index: number) {
    const updatedCategory = prompt('Sửa tên danh mục:', this.categories[index]);
    if (updatedCategory && updatedCategory.trim()) {
      this.categories[index] = updatedCategory.trim();
    } else {
      alert('Tên danh mục không được để trống!');
    }
  }

  // Hàm xóa danh mục
  deleteCategory(index: number) {
    if (confirm('Bạn có chắc muốn xóa danh mục này?')) {
      this.categories.splice(index, 1);
    }
  }
}
