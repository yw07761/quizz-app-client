import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
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
      }[];
    }[];
  };
  score: number;
  maxScore: number;
  percentageScore: number;
  startTime: Date | string;
  endTime: Date | string;
  answers: { questionId: string; answer: string }[];
}

@Component({
  selector: 'app-exam-result-detail',
  templateUrl: './exam-result-detail.component.html',
  styleUrls: ['./exam-result-detail.component.scss'],
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule]
})
export class ExamResultDetailComponent implements OnInit {
  user: any = null;
  examResult: ExamResultDetail | null = null;
  loading: boolean = true;
  error: string | null = null;

  constructor(
    private route: ActivatedRoute,
    private examService: ExamService,
    private authService: AuthService,
    private router: Router,
  ) {}

  ngOnInit() {
    this.user = this.authService.getCurrentUser();
    const examId = this.route.snapshot.paramMap.get('id');
    
    if (examId) {
      this.loadExamResult(examId);
    } else {
      this.error = 'No exam ID provided';
      this.loading = false;
    }
  }

  goBack() {
    this.router.navigate(['/student-dashboard']);
  }
  
  loadExamResult(examId: string) {
    if (!this.user?._id) {
      this.error = 'Không tìm thấy thông tin người dùng';
      this.loading = false;
      console.log('User ID not found:', this.user);
      return;
    }
  
    console.log('Fetching exam history for user ID:', this.user._id);
  
    this.examService.getExamHistory(this.user._id).subscribe({
      next: (results) => {
        console.log('Fetched exam history:', results); // Log the results
  
        const result = results.find((r) => r.examId === examId || r.examId._id === examId);
        console.log('Searching for exam result with ID:', examId);
        console.log('Exam result found:', result); // Log the found result
  
        if (result) {
          console.log('Found exam result:', result);
  
          // Check if examId is an object and contains sections
          if (result.examId && typeof result.examId !== 'string' && result.examId.sections) {
            result.examId.sections.forEach((section: { questions?: any[] }) => {
              const questions = section.questions || []; // Handle undefined questions
              questions.forEach((question: any) => {
                const userAnswer = result.answers.find(
                  (a: { questionId: any }) => a.questionId === question._id
                );
                question.userAnswer = userAnswer?.answer || null; // Assign answer or null if not found
                console.log(`Question ID: ${question._id}, User Answer: ${question.userAnswer}`); // Log each question's user answer
              });
            });
          } else {
            console.warn('Exam ID does not contain sections or is not an object:', result.examId);
          }
  
          this.examResult = result; // Ensure this is the correct type
          console.log('Processed exam result:', this.examResult); // Log the processed exam result
        } else {
          console.warn('No exam result found for the provided exam ID:', examId);
          this.error = 'Không tìm thấy kết quả bài thi';
        }
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading exam result:', error);
        this.error = 'Không thể tải kết quả bài thi';
        this.loading = false;
      },
    });
  }

  // Calculate correct answers for a section
  calculateSectionScore(section: { questions: any[] }): { correct: number; total: number } {
    let correct = 0;
    const total = section.questions.length;

    section.questions.forEach((question) => {
      const correctAnswer = question.answers.find((a: any) => a.isCorrect);
      if (correctAnswer?.text === question.userAnswer) {
        correct++;
      }
    });

    return { correct, total };
  }

  // Get the correct answer for a specific question
  getCorrectAnswer(question: any): string {
    const correctAnswer = question.answers.find((a: any) => a.isCorrect);
    return correctAnswer ? correctAnswer.text : 'Không có đáp án đúng';
  }

  // Format dates for display
  formatDate(date: Date | string): string {
    const dateObj = new Date(date);
    return dateObj.toLocaleString('vi-VN', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  }

  // Calculate performance color for percentage score
  getPerformanceColor(percentage: number): string {
    if (percentage >= 80) return 'green';
    if (percentage >= 50) return 'orange';
    return 'red';
  }

  // Handle navigation between sections (if implemented in UI)
  nextSection(currentSectionIndex: number): number {
    if (this.examResult && currentSectionIndex < this.examResult.examId.sections.length - 1) {
      return currentSectionIndex + 1;
    }
    return currentSectionIndex;
  }

  previousSection(currentSectionIndex: number): number {
    if (currentSectionIndex > 0) {
      return currentSectionIndex - 1;
    }
    return currentSectionIndex;
  }
}
