import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'check_teaccher',
  templateUrl: './check_teacher.component.html',
  styleUrls: ['./check_teacher.component.scss']
})
export class Check_teacherComponent implements OnInit {
  // Mảng lưu các danh mục
  categories: string[] = [];

  constructor() { }

  ngOnInit(): void {
  }

  // Hàm tạo danh mục mới
  createCategory() {
    const newCategory = prompt("Nhập tên danh mục:");
    if (newCategory && newCategory.trim() !== '') {
      this.categories.push(newCategory);
    } else {
      alert("Tên danh mục không được rỗng!");
    }
  }
}