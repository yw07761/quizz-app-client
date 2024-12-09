import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../../services/auth.service';
import { QuestionService, Question } from '../../../services/question.service';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-teacher-library',
  templateUrl: './teacher-library.component.html',
  styleUrls: ['./teacher-library.component.scss'],
  standalone: true,
  imports: [CommonModule, FormsModule]
})
export class TeacherLibraryComponent implements OnInit {
  user: any = null;
  isDropdownActive = false;
  questions: Question[] = [];
  filteredQuestions: Question[] = [];
  selectedCategory: string = '';
  selectedGroup: string = '';
  uniqueCategories: string[] = [];
  uniqueGroups: string[] = [];
  isFilterDropdownVisible: boolean = false;
  approvedQuestions: any[] = []; // Danh sách câu hỏi đã duyệt
  unapprovedQuestions: any[] = []; // Danh sách câu hỏi chưa duyệt
  isApprovedOpen = true;
  isUnapprovedOpen = false;

  constructor(
    private authService: AuthService,
    private questionService: QuestionService,
    private router: Router
  ) {}

  ngOnInit() {
    this.user = this.authService.getCurrentUser();
    this.loadQuestions();
  }

  loadQuestions() {
    this.questionService.getQuestions().subscribe({
      next: (questions) => {
        this.questions = questions;
        this.filteredQuestions = [...this.questions]; // Initialize filteredQuestions with all questions
        this.updateUniqueFilters(); // Update unique filters for category and group

        // Phân loại câu hỏi theo trạng thái
        this.approvedQuestions = this.questions.filter(q => q.status === 'approved');
        this.unapprovedQuestions = this.questions.filter(q => q.status !== "approved");
        
        // Log to verify the lists
        console.log('Approved Questions:', this.approvedQuestions);
        console.log('Unapproved Questions:', this.unapprovedQuestions);
      },
      error: (error) => {
        console.error('Error loading questions:', error);
      }
    });
  }

  updateUniqueFilters() {
    this.uniqueCategories = [...new Set(this.questions.map(q => q.category).filter(Boolean) as string[])];
    this.uniqueGroups = [...new Set(this.questions.map(q => q.group).filter(Boolean) as string[])];
  }

  toggleFilterDropdown() {
    this.isFilterDropdownVisible = !this.isFilterDropdownVisible;
  }

  editQuestion(question: Question) {
    this.router.navigate(['/question'], { state: { question } });
  }

  deleteQuestion(question: Question) {
    if (question._id && confirm('Bạn có chắc muốn xóa câu hỏi này không?')) {
      this.questionService.deleteQuestion(question._id).subscribe({
        next: () => {
          this.questions = this.questions.filter(q => q._id !== question._id);
          this.filteredQuestions = this.filteredQuestions.filter(q => q._id !== question._id);
          this.updateUniqueFilters();
          alert('Câu hỏi đã được xóa');
          this.loadQuestions();
        },
        error: (error) => {
          console.error('Error deleting question:', error);
          alert('Có lỗi xảy ra khi xóa câu hỏi');
        }
      });
    }
  }

  toggleDropdown() {
    this.isDropdownActive = !this.isDropdownActive;
  }

  

  createNewQuestion() {
    this.router.navigate(['/question']);
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

  getCorrectAnswers(question: Question): string {
    const correctAnswers = question.answers
      .filter(answer => answer.isCorrect)
      .map(answer => answer.text);
    return correctAnswers.join(', ');
  }

  countCorrectAnswers(question: Question): number {
    return question.answers.filter(answer => answer.isCorrect).length;
  }

  getTotalAnswers(question: Question): number {
    return question.answers.length;
  }

  // Updated filterQuestions() to improve the filtering logic
  // Cập nhật phương thức filterQuestions// Cập nhật phương thức filterQuestions
  filterQuestions() {
    // Lọc câu hỏi theo category và group đã chọn
    this.filteredQuestions = this.questions.filter(question => {
      const categoryMatch = this.selectedCategory ? question.category === this.selectedCategory : true;
      const groupMatch = this.selectedGroup ? question.group === this.selectedGroup : true;
      return categoryMatch && groupMatch;
    });
  
    // Sau khi áp dụng các bộ lọc, kiểm tra lại câu hỏi đã duyệt và chưa duyệt
    this.approvedQuestions = this.filteredQuestions.filter(question => question.status === 'approved');
    this.unapprovedQuestions = this.filteredQuestions.filter(question => question.status !== 'approved');
  
    console.log('Approved Questions:', this.approvedQuestions);
    console.log('Unapproved Questions:', this.unapprovedQuestions);
  
    this.isFilterDropdownVisible = false; // Đóng dropdown sau khi áp dụng bộ lọc
  }
  


  // Updated clearFilters() to reset the selected values and filtered list
  clearFilters() {
    this.selectedCategory = '';  // Reset category filter
    this.selectedGroup = '';     // Reset group filter
    this.filteredQuestions = this.questions; // Reset to show all questions
    this.isFilterDropdownVisible = false;  // Close filter dropdown
  }
  searchQuestions(event: any) {
    const searchTerm = event.target.value.toLowerCase();
    
    // Nếu không có từ khóa tìm kiếm, hiển thị tất cả câu hỏi
    if (!searchTerm) {
      this.filteredQuestions = this.questions;
    } else {
      // Lọc câu hỏi theo text, category và group
      this.filteredQuestions = this.questions.filter(question => {
        const textMatch = question.text.toLowerCase().includes(searchTerm);
        const categoryMatch = question.category?.toLowerCase().includes(searchTerm);
        const groupMatch = question.group?.toLowerCase().includes(searchTerm);
    
        return textMatch || categoryMatch || groupMatch;
      });
    }
  
    // Kiểm tra lại các câu hỏi đã duyệt và chưa duyệt
    this.approvedQuestions = this.filteredQuestions.filter(question => question.status === 'approved');
    this.unapprovedQuestions = this.filteredQuestions.filter(question => question.status !== 'approved');
  }
  
  // Toggle function for approved questions
  toggleApprovedQuestions() {
    this.isApprovedOpen = !this.isApprovedOpen;
  }

  // Toggle function for unapproved questions
  toggleUnapprovedQuestions() {
    this.isUnapprovedOpen = !this.isUnapprovedOpen;
  }
}
