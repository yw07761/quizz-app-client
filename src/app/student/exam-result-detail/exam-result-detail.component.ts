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
        isCorrect?: boolean;
      }[];
    }[];
  };
  score: number;
  maxScore: number;
  percentageScore: number;
  startTime: Date | string;
  endTime: Date | string;
  answers: { questionId: string; answer: string }[];
  correctAnswers?: number;
  totalQuestions?: number;
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
  error: string | null = null;
  examResult: ExamResultDetail | null = null;
  examId: string | null = null;
  userId: string | null = null;
  user: any = null;

  constructor(
    private route: ActivatedRoute,
    private examService: ExamService,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    
    // Extract examId and userId from route parameters
    const examIdParam = this.route.snapshot.paramMap.get('examId');
    const userIdParam = this.route.snapshot.paramMap.get('userId');
    const idParam = this.route.snapshot.paramMap.get('id');

    // Case for '/exam-result-detail/:examId/:userId'
    if (examIdParam && userIdParam) {
      this.examId = examIdParam;
      this.userId = userIdParam;
    } 
    // Case for '/exam-result-detail/:id'
    else if (idParam) {
      this.examId = idParam;
      this.userId = null; // userId is not provided in this case
    } else {
      this.error = 'Không tìm thấy thông tin bài thi';
      this.loading = false;
      return;
    }
    this.user = this.authService.getCurrentUser();
    this.loadExamResult();
  }

  loadExamResult() {
    if (!this.examId) {
      this.error = 'Không tìm thấy thông tin bài thi';
      this.loading = false;
      return;
    }

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
            r._id === this.examId ||
            r.examId === this.examId ||
            (r.examId as any)?._id === this.examId
        );

        if (result) {
          if (typeof result.examId === 'string') {
            this.examService.getExamDetails(result.examId).subscribe({
              next: (examDetails) => {
                result.examId = examDetails;
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

        if (userAnswer?.answer === this.getCorrectAnswer(question)) {
          correctAnswers++;
        }

        totalQuestions++;
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
    window.history.back();
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
