import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../../services/auth.service';
import { QuestionService, Question } from '../../../services/question.service';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-admin-question',
  templateUrl: './admin-question.component.html',
  styleUrl: './admin-question.component.scss',
  standalone: true,
  imports: [CommonModule, FormsModule]
})
export class AdminQuestionComponent implements OnInit {
  user: any = null;
  isDropdownActive = false;
  questions: Question[] = [];
  filteredQuestions: Question[] = [];
  selectedCategory: string = '';
  selectedGroup: string = '';
  uniqueCategories: string[] = [];
  uniqueGroups: string[] = [];
  isFilterDropdownVisible: boolean = false;
  filteredApprovedQuestions: Question[] = []; // Thêm thuộc tính lọc câu hỏi đã duyệt
  isStatusDropdownVisible: boolean = false;
  // Các thuộc tính hiện có
  approvedQuestions: Question[] = [];
  pendingQuestions: Question[] = [];
  showPending: boolean = true; // Track which set of questions to display
  showApproved: boolean = false;
  isPendingOpen = true;
  isApprovedOpen = true;
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
        this.filteredQuestions = questions;
        this.filteredApprovedQuestions = questions.filter(q => q.status === 'approved'); // Lọc câu hỏi đã duyệt
        this.updateUniqueFilters();
        this.splitQuestionsByStatus();  // Phân chia câu hỏi theo trạng thái
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

  filterQuestions() {
    this.filteredQuestions = this.questions.filter(question => {
      const categoryMatch = this.selectedCategory ? question.category === this.selectedCategory : true;
      const groupMatch = this.selectedGroup ? question.group === this.selectedGroup : true;
      return categoryMatch && groupMatch;
    });
    this.splitQuestionsByStatus();  // Phân chia lại câu hỏi theo trạng thái
  }
  
  
  splitQuestionsByStatus() {
    this.approvedQuestions = this.filteredQuestions.filter(q => q.status === 'approved');
    this.pendingQuestions = this.filteredQuestions.filter(q => q.status === 'pending');
  }
  
  approveQuestion(question: Question) {
    this.changeQuestionStatus(question, 'approved');
  }
  
  rejectQuestion(question: Question) {
    this.changeQuestionStatus(question, 'pending');
  }
  
  
  changeQuestionStatus(question: Question, status: 'approved' | 'pending') {
    if (question._id) {
      question.status = status;
      this.questionService.updateQuestionStatus(question._id, status).subscribe({
        next: () => {
          this.loadQuestions();
          alert(`Câu hỏi đã được ${status === 'approved' ? 'phê duyệt' : 'chờ phê duyệt'}`);
        },
        error: (error) => {
          console.error('Error updating question status:', error);
          alert('Có lỗi xảy ra khi cập nhật trạng thái câu hỏi');
        }
      });
    }
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

  clearFilters() {
    this.selectedCategory = '';
    this.selectedGroup = '';
    this.filteredQuestions = this.questions;
    this.isFilterDropdownVisible = false;
  }

  searchQuestions(event: any) {
    const searchTerm = event.target.value.toLowerCase();
    if (!searchTerm) {
      // Nếu không có từ khóa tìm kiếm, reset lại filteredQuestions về tất cả câu hỏi
      this.filteredQuestions = this.questions;
    } else {
      // Lọc các câu hỏi theo từ khóa tìm kiếm
      this.filteredQuestions = this.questions.filter(question => 
        question.text.toLowerCase().includes(searchTerm) ||
        question.category?.toLowerCase().includes(searchTerm) ||
        question.group?.toLowerCase().includes(searchTerm)
      );
    }
    this.splitQuestionsByStatus();  // Cập nhật lại câu hỏi theo trạng thái
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

  // Phương thức để định dạng hiển thị câu trả lời
  getCorrectAnswers(question: Question): string {
    const correctAnswers = question.answers
      .filter(answer => answer.isCorrect)
      .map(answer => answer.text);
    return correctAnswers.join(', ');
  }

  // Phương thức để đếm số câu trả lời đúng
  countCorrectAnswers(question: Question): number {
    return question.answers.filter(answer => answer.isCorrect).length;
  }

  // Phương thức để lấy tổng số câu trả lời
  getTotalAnswers(question: Question): number {
    return question.answers.length;
  }
  goBack(): void {
    this.router.navigate(['/admin-dashboard']); // Điều hướng về trang Dashboard
  }

  toggleStatusDropdown() {
    this.isStatusDropdownVisible = !this.isStatusDropdownVisible;
  }

  showPendingQuestions() {
    this.showPending = true;
    this.showApproved = false;
  }

  showApprovedQuestions() {
    this.showPending = false;
    this.showApproved = true;
  }
  // Toggle the visibility of pending questions
  togglePendingQuestions() {
    this.isPendingOpen = !this.isPendingOpen;
  }

  // Toggle the visibility of approved questions
  toggleApprovedQuestions() {
    this.isApprovedOpen = !this.isApprovedOpen;
  }
  
}