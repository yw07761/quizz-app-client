import { Component, OnInit } from '@angular/core';
import { QuestionService, Question } from '../../../services/question.service';
import { ExamService } from '../../../services/exam.service';
import { AuthService } from '../../../services/auth.service';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

interface ExtendedQuestion extends Question {
  score?: number;
}

interface Section {
  title: string;
  description: string;
  questions: ExtendedQuestion[];
}

@Component({
  selector: 'app-exam-create',
  templateUrl: './exam-create.component.html',
  styleUrls: ['./exam-create.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    FormsModule
  ]
})
export class ExamCreateComponent implements OnInit {
  exam: any = {
    name: '',
    description: '',
    startDate: '',
    endDate: '',
    maxAttempts: 1,
    duration: 30,
    maxScore: 10,
    autoDistributeScore: false,
    showStudentResult: false,
    displayResults: 'afterGrading',
    questionOrder: 'A, B, C',
    questionsPerPage: 1,
  };

  sections: Section[] = [];
  availableQuestions: Question[] = [];
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
    private questionService: QuestionService,
    private examService: ExamService,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    const user = this.authService.getCurrentUser();
    this.teacherId = user?._id;
  
    this.questionService.getQuestions().subscribe((questions) => {
      this.availableQuestions = questions;
      this.filteredQuestions = questions; // Initialize with all available questions
      this.updateUniqueFilters(); // Set unique categories and groups
    });
  }
  
  updateUniqueFilters() {
    this.uniqueCategories = [...new Set(this.availableQuestions.map(q => q.category).filter(Boolean) as string[])];
    this.uniqueGroups = [...new Set(this.availableQuestions.map(q => q.group).filter(Boolean) as string[])];
    
    // Log kiểm tra giá trị của uniqueCategories và uniqueGroups
    console.log('Unique Categories:', this.uniqueCategories);
    console.log('Unique Groups:', this.uniqueGroups);
  }
  
  

 

  // Function to add a new section
  addSection() {
    this.sections.push({ title: '', description: '', questions: [] });
  }

  // Function to add a question to a section
  addQuestionToSection(sectionIndex: number, questionId: string) {
    if (!questionId) return;

    const selectedQuestion = this.availableQuestions.find(q => q._id === questionId);

    if (selectedQuestion) {
      const questionExists = this.sections[sectionIndex].questions.some(
        q => q._id === selectedQuestion._id
      );

      if (!questionExists) {
        this.sections[sectionIndex].questions.push({
          ...selectedQuestion,
          score: 0
        });
      } else {
        alert('Câu hỏi này đã được thêm vào phần này!');
      }
    }
  }

  // Function to handle form submission (exam)
  onSubmit() {
    console.log('Exam submitted:', this.exam);
    console.log('Sections:', this.sections);
  }

  // Function to remove a question from a section
  removeQuestionFromSection(sectionIndex: number, questionIndex: number) {
    if (confirm('Bạn có chắc muốn xóa câu hỏi này?')) {
      this.sections[sectionIndex].questions.splice(questionIndex, 1);
    }
  }

  // Function to save the exam to the server
  saveExam() {
    const examData = {
      ...this.exam,
      createdBy: this.teacherId,
      sections: this.sections.map(section => ({
        ...section,
        questions: section.questions.map(q => ({
          questionId: q._id,
          score: q.score
        }))
      }))
    };

    console.log("Exam data being sent:", examData);

    this.examService.createExam(examData).subscribe({
      next: (response) => {
        console.log('Exam saved successfully:', response);
        alert('Bài thi đã được lưu thành công!');
        this.router.navigate(['/teacher-dashboard']);
      },
      error: (error) => {
        console.error('Error saving exam:', error);
        alert('Có lỗi xảy ra khi lưu bài thi. Vui lòng thử lại.');
      }
    });
  }

  // Function to toggle section visibility (expand/collapse)
  toggleSection(section: string) {
    this.isSectionOpen[section] = !this.isSectionOpen[section];
  }

  // Function to go back to the previous page
  navigateBack() {
    window.history.back();
  }

  // Function to reset filters and display all questions
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


}
