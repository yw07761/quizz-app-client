import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ExamService } from '../../../services/exam.service';
import { AuthService } from '../../../services/auth.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

interface Answer {
  text: string;
  isCorrect: boolean;
}

interface Question {
  _id: string;
  text: string;
  answers: Answer[];
  userAnswer?: string;
  isCorrect?: boolean;
  questionId?: {   // Updated to reflect that questionId is an object
    text: string;
    answers: Answer[];
  };
  score?: number;
}

interface ExamResultDetail {
  _id: string;
  examId: {
    _id: string;
    name: string;
    description: string;
    sections: {
      title: string;
      questions: Question[];  // Questions should follow the updated interface
    }[];
  };
  score: number;
  maxScore: number;
  percentageScore: number;
  startTime: Date | string;
  endTime: Date | string;
  answers: { questionId: string; answer: string }[]; // This structure seems correct
  correctAnswers?: number;
  totalQuestions?: number;
}


@Component({
  selector: 'app-student-result-detail',
  templateUrl: './student-result-detail.component.html',
  styleUrls: ['./student-result-detail.component.scss'],
  standalone: true,
  imports: [CommonModule, FormsModule],
})
export class studentResultDetailComponent implements OnInit {
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
  // Lấy examId và userId từ URL
  const examIdParam = this.route.snapshot.paramMap.get('examId');
  const userIdParam = this.route.snapshot.paramMap.get('userId');

  // Nếu có userId trong URL, thì dùng userId đó
  if (examIdParam) {
    this.examId = examIdParam;
  }
  if (userIdParam) {
    this.userId = userIdParam;  // Lấy userId từ URL nếu có
  }

  // Nếu có userId thì tải thông tin người dùng
  if (this.userId) {
    this.authService.getUserById(this.userId).subscribe({
      next: (userDetails) => {
        this.user = userDetails; // Set the user object to the retrieved details
        this.loadExamResult();
      },
      error: (error) => {
        console.error('Error fetching user details:', error);
        this.error = 'Không thể tải thông tin người dùng';
        this.loading = false;
      },
    });
  }
}


  loadExamResult() {
    if (!this.examId || !this.userId) {
      this.error = 'Không tìm thấy thông tin bài thi hoặc người dùng';
      this.loading = false;
      return;
    }

    // Dùng userId từ URL (hoặc của người dùng hiện tại)
    console.log('Loading exam result for userId:', this.userId);

    // Lấy lịch sử thi của người dùng theo userId
    this.examService.getExamHistory(this.userId).subscribe({
      next: (results) => {
        console.log('Fetched Exam History:', results);

        const result = results.find(
          (r) => r._id === this.examId || r.examId === this.examId || (r.examId as any)?._id === this.examId
        );

        if (result) {
          if (typeof result.examId === 'string') {
            this.examService.getExamDetails(result.examId).subscribe({
              next: (examDetails) => {
                result.examId = examDetails;
                this.mapUserAnswers(result); // Áp dụng đáp án của người dùng
              },
              error: (error) => {
                console.error('Error fetching exam details:', error);
                this.error = 'Không thể tải dữ liệu chi tiết bài thi';
              },
            });
          } else if (result.examId.sections) {
            this.mapUserAnswers(result); // Nếu đã có sections thì xử lý
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
