import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ExamService, Exam } from '../../../services/exam.service';
import { QuestionService, Question } from '../../../services/question.service';
import { forkJoin, Observable } from 'rxjs';
import { CommonModule } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

interface ExamSection {
  title: string;
  description: string;
  questions: {
    questionId: string; // Sử dụng questionId để lấy thông tin câu hỏi
    score: number;
    questionData?: Question;
  }[];
}

interface QuestionMapItem {
  sectionIndex: number;
  questionIndex: number;
}

@Component({
  selector: 'app-exam-edit',
  templateUrl: './exam-edit.component.html',
  styleUrls: ['./exam-edit.component.scss'],
  standalone: true,
  imports: [CommonModule, FormsModule]
})
export class ExamEditComponent implements OnInit {
  examId: string | null = null;
  exam: Exam | null = null;
  isLoading = true;
  availableQuestions: Question[] = []; // Dữ liệu câu hỏi có sẵn
  filteredQuestions: Question[] = [];
  teacherId: string | undefined;

  selectedCategory: string = '';
  selectedGroup: string = '';
  uniqueCategories: string[] = [];
  uniqueGroups: string[] = [];

  isSectionOpen: { [key: string]: boolean } = {
    general: true,
    advanced: true
  };

  constructor(
    private route: ActivatedRoute,
    private examService: ExamService,
    private questionService: QuestionService,
    private router: Router

  ) {}

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      this.examId = params.get('id');
      if (this.examId) {
        this.loadExamDetails(this.examId);
      }
    });
    this.loadAvailableQuestions(); // Load available questions when component initializes
  }

  loadAvailableQuestions() {
    this.questionService.getQuestions().subscribe({
      next: (questions) => {
        this.availableQuestions = questions;
        this.updateUniqueFilters();  // Gọi sau khi dữ liệu câu hỏi đã được tải
      },
      error: (error) => {
        console.error('Error fetching available questions:', error);
      }
    });
  }
  
  updateUniqueFilters() {
    // Đảm bảo rằng bạn chỉ lấy các giá trị không null hoặc undefined cho category và group
    this.uniqueCategories = [...new Set(this.availableQuestions.map(q => q.category).filter(Boolean) as string[])];
    this.uniqueGroups = [...new Set(this.availableQuestions.map(q => q.group).filter(Boolean) as string[])];
  
    // Log kiểm tra giá trị của uniqueCategories và uniqueGroups
    console.log('Unique Categories:', this.uniqueCategories);
    console.log('Unique Groups:', this.uniqueGroups);
  }
  
  onCategoryOrGroupChange() {
    console.log('Category selected:', this.selectedCategory);
    console.log('Group selected:', this.selectedGroup);
    this.filterQuestions();
  }
  
  

  filterQuestions() {
    console.log("Filtered Questions before filtering:", this.filteredQuestions); // Kiểm tra câu hỏi trước khi lọc
  
    this.filteredQuestions = this.availableQuestions.filter(question => {
      const categoryMatch = this.selectedCategory ? question.category === this.selectedCategory : true;
      const groupMatch = this.selectedGroup ? question.group === this.selectedGroup : true;
      return categoryMatch && groupMatch;
    });
  
    console.log("Filtered Questions after filtering:", this.filteredQuestions); // Kiểm tra câu hỏi sau khi lọc
  }
  

  clearFilters() {
    // Reset bộ lọc về trạng thái ban đầu
    this.selectedCategory = '';
    this.selectedGroup = '';
    this.filteredQuestions = this.availableQuestions;
  }
  loadExamDetails(id: string) {
    this.examService.getExamById(id).subscribe({
      next: (exam: Exam) => {
        this.exam = exam;
        this.isLoading = false;

        // Initialize isSectionOpen for each section in the exam
        this.exam.sections.forEach((_, index) => {
          this.isSectionOpen['section' + index] = false;
        });
      },
      error: (error) => {
        console.error('Error fetching exam details:', error);
        this.isLoading = false;
      }
    });
  }

  updateExam() {
    if (this.exam && this.examId) {
      this.examService.updateExam(this.examId, this.exam).subscribe({
        next: (response) => {
          console.log('Exam updated successfully:', response);
          alert('Bài thi đã được cập nhật thành công');
          this.router.navigate(['/teacher-dashboard'])
        },
        error: (error: HttpErrorResponse) => {
          console.error('Error updating exam:', error.message);
        }
      });
    } else {
      console.error('Exam or examId is not defined. Cannot update exam.');
    }
  }

  removeQuestionFromSection(sectionIndex: number, questionIndex: number) {
    if (this.exam && this.exam.sections[sectionIndex]) {
      this.exam.sections[sectionIndex].questions.splice(questionIndex, 1);
    }
  }

  addQuestionToSection(sectionIndex: number, questionId: string) {
    if (!questionId) return;

    const selectedQuestion = this.availableQuestions.find(q => q._id === questionId);

    if (selectedQuestion) {
      const questionExists = this.exam?.sections[sectionIndex].questions.some(q => q.questionId === selectedQuestion._id);

      if (!questionExists) {
        this.exam?.sections[sectionIndex].questions.push({
          questionId: selectedQuestion._id,
          score: 0,
          questionData: selectedQuestion // Add the question data as well
        });
      } else {
        alert('Câu hỏi này đã được thêm vào phần này!');
      }
    }
  }

  toggleSection(section: string): void {
    this.isSectionOpen[section] = !this.isSectionOpen[section]; // Toggle the section's open state
  }

  goBack(): void {
    window.history.back();
  }
}