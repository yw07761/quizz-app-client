"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
exports.__esModule = true;
exports.Library_teacherComponent = void 0;
var core_1 = require("@angular/core");
var Library_teacherComponent = /** @class */ (function () {
    function Library_teacherComponent() {
        this.categories = [];
    }
    Library_teacherComponent.prototype.ngOnInit = function () {
        // Khởi tạo có thể thêm dữ liệu mẫu
        this.categories = ['English question'];
    };
    // Hàm tạo danh mục mới
    Library_teacherComponent.prototype.createCategory = function () {
        var newCategory = prompt('Nhập tên danh mục:');
        if (newCategory && newCategory.trim()) {
            this.categories.push(newCategory.trim());
        }
        else {
            alert('Tên danh mục không được để trống!');
        }
    };
    // Hàm sửa danh mục
    Library_teacherComponent.prototype.editCategory = function (index) {
        var updatedCategory = prompt('Sửa tên danh mục:', this.categories[index]);
        if (updatedCategory && updatedCategory.trim()) {
            this.categories[index] = updatedCategory.trim();
        }
        else {
            alert('Tên danh mục không được để trống!');
        }
    };
    // Hàm xóa danh mục
    Library_teacherComponent.prototype.deleteCategory = function (index) {
        if (confirm('Bạn có chắc muốn xóa danh mục này?')) {
            this.categories.splice(index, 1);
        }
    };
    Library_teacherComponent = __decorate([
        core_1.Component({
            selector: 'app-category',
            templateUrl: './Library _ teacher.component.html',
            styleUrls: ['./Library _ teacher.component.scss']
        })
    ], Library_teacherComponent);
    return Library_teacherComponent;
}());
exports.Library_teacherComponent = Library_teacherComponent;
