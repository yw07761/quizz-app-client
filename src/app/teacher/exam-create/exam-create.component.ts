import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { QuestionService, Question } from '../../../services/question.service';
import { ExamService } from '../../../services/exam.service';
import { AuthService } from '../../../services/auth.service'; // Import AuthService
import { Router } from '@angular/router';

// Interface for an extended question including `score` property
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
  teacherId: string | undefined; // Store the teacher's ID here

  isSectionOpen: { [key: string]: boolean } = {
    general: true,
    advanced: true
  };

  constructor(
    private questionService: QuestionService,
    private examService: ExamService,
    private authService: AuthService, // Inject AuthService to access user info
    private router: Router
  ) {}

  ngOnInit(): void {
    // Retrieve the teacher's ID from the AuthService
    const user = this.authService.getCurrentUser();
    this.teacherId = user?._id; // Assuming `_id` is the unique identifier for the teacher

    // Fetch the list of questions from the QuestionService
    this.questionService.getQuestions().subscribe((questions) => {
      this.availableQuestions = questions;
    });
  }

  onSubmit() {
    console.log('Exam submitted:', this.exam);
    console.log('Sections:', this.sections);
  }

  addSection() {
    this.sections.push({ title: '', description: '', questions: [] });
  }

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

  removeQuestionFromSection(sectionIndex: number, questionIndex: number) {
    if (confirm('Bạn có chắc muốn xóa câu hỏi này?')) {
      this.sections[sectionIndex].questions.splice(questionIndex, 1);
    }
  }

  saveExam() {
    // Prepare exam data with teacherId
    const examData = {
      ...this.exam,
      createdBy: this.teacherId, // Include the teacher's ID
      sections: this.sections.map(section => ({
        ...section,
        questions: section.questions.map(q => ({
          questionId: q._id,
          score: q.score
        }))
      }))
    };

    console.log("Exam data being sent:", examData);

    // Call the service to save the exam
    this.examService.createExam(examData).subscribe({
      next: (response) => {
        console.log('Exam saved successfully:', response);
        alert('Bài thi đã được lưu thành công!');
        this.router.navigate(['/teacher-dashboard']); // Navigate after saving
      },
      error: (error) => {
        console.error('Error saving exam:', error);
        alert('Có lỗi xảy ra khi lưu bài thi. Vui lòng thử lại.');
      }
    });
  }

  toggleSection(section: string) {
    this.isSectionOpen[section] = !this.isSectionOpen[section];
  }

  navigateBack() {
    window.history.back();
  }
}
