import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ExamService } from '../../../services/exam.service';
import { AuthService } from '../../../services/auth.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

interface ExamResultDetail {
  _id: string;
  examId: {
    _id: string;
    name: string;
    description: string;
    sections: {
      title: string;
      questions: {
        _id: string;
        text: string;
        answers: { text: string; isCorrect: boolean }[];
        userAnswer?: string;
        isCorrect?: boolean; // Tracks if user's answer is correct
      }[];
    }[];
  };
  score: number;
  maxScore: number;
  percentageScore: number;
  startTime: Date | string;
  endTime: Date | string;
  answers: { questionId: string; answer: string }[];
  correctAnswers?: number; // Number of correct answers
  totalQuestions?: number; // Total number of questions
}

@Component({
  selector: 'app-exam-result-detail',
  templateUrl: './exam-result-detail.component.html',
  styleUrls: ['./exam-result-detail.component.scss'],
  standalone: true,
  imports: [CommonModule, FormsModule],
})
export class ExamResultDetailComponent implements OnInit {
  loading: boolean = true;
  user: any = null;
  error: string | null = null;
  examResult: ExamResultDetail | null = null;
  examId: string = '';
  userId: string = '';
  constructor(
    private route: ActivatedRoute,
    private examService: ExamService,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
     // Ensure to get both parameters
     this.examId = this.route.snapshot.paramMap.get('examId')!;
     this.userId = this.route.snapshot.paramMap.get('userId')!;
     console.log('Exam ID:', this.examId, 'User ID:', this.userId);
    const examId = this.route.snapshot.paramMap.get('id');
    this.user = this.authService.getCurrentUser();
    if (!examId) {
      this.error = 'Không tìm thấy thông tin bài thi';
      this.loading = false;
      return;
    }

    this.loadExamResult(examId);
  }

  loadExamResult(examId: string) {
    const user = this.authService.getCurrentUser();
    if (!user?._id) {
      this.error = 'Không tìm thấy thông tin người dùng';
      this.loading = false;
      return;
    }

    this.examService.getExamHistory(user._id).subscribe({
      next: (results) => {
        console.log('Fetched Exam History:', results);

        const result = results.find(
          (r) =>
            r._id === examId ||
            r.examId === examId ||
            (r.examId as any)?._id === examId
        );

        if (result) {
          if (typeof result.examId === 'string') {
            this.examService.getExamDetails(result.examId).subscribe({
              next: (examDetails) => {
                result.examId = examDetails; // Attach exam details
                this.mapUserAnswers(result);
              },
              error: (error) => {
                console.error('Error fetching exam details:', error);
                this.error = 'Không thể tải dữ liệu chi tiết bài thi';
              },
            });
          } else if (result.examId.sections) {
            this.mapUserAnswers(result);
          } else {
            this.error = 'Không tìm thấy danh sách câu hỏi trong bài thi';
          }
        } else {
          this.error = 'Không tìm thấy dữ liệu bài thi';
        }
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading exam result:', error);
        this.error = 'Không thể tải dữ liệu bài thi';
        this.loading = false;
      },
    });
  }

  mapUserAnswers(result: any) {
    let correctAnswers = 0;
    let totalQuestions = 0;

    result.examId.sections.forEach((section: any) => {
      section.questions.forEach((question: any) => {
        const userAnswer = result.answers.find(
          (a: { questionId: string }) => a.questionId === question._id
        );

        question.userAnswer = userAnswer?.answer || null;


        if (Array.isArray(question?.questionId?.answers) && question.questionId.answers.length > 0) {
          console.log('Valid answers array:', question.questionId.answers);
        } else {
          console.error('Invalid answers array for question:', question);
        }
        
        
      });
    });

    result.correctAnswers = correctAnswers;
    result.totalQuestions = totalQuestions;

    this.examResult = result;
    console.log('Processed Exam Result:', this.examResult);
    
  }

  formatDate(date: Date | string): string {
    return new Date(date).toLocaleString('vi-VN', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
    });
  }

  goBack() {
    this.router.navigate(['/student-dashboard']);
  }

  getCorrectAnswer(question: any): string {
    if (question && Array.isArray(question.answers)) {
      const correctAnswer = question.answers.find((answer: any) => answer.isCorrect);
      return correctAnswer ? correctAnswer.text : 'Không có đáp án đúng';
    }
    return 'Không có đáp án đúng';
  }

  hasCorrectAnswer(question: any): boolean {
    return question.answers && Array.isArray(question.answers) && question.answers.some((a: any) => a.isCorrect);
  }

  isArray(value: any): boolean {
    return Array.isArray(value);
  }

  getTotalQuestions(): number {
    if (this.examResult?.examId?.sections) {
      return this.examResult.examId.sections.reduce((total, section) => {
        return total + (section.questions?.length || 0);
      }, 0);
    }
    return 0;
  }
  
}