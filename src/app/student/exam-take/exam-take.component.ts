// exam-take.component.ts
import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ExamService, Exam } from '../../../services/exam.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

export interface Answer {
  questionId: string;
  answer: string;
  timestamp: Date;
}

export interface ExamSubmission {
  answers: {
    questionId: string;
    answer: string;
    timestamp: Date;
  }[];
  startTime: string;
  endTime: string;
}

@Component({
  selector: 'app-exam-take',
  templateUrl: './exam-take.component.html',
  styleUrls: ['./exam-take.component.scss'],
  standalone: true,
  imports: [CommonModule, FormsModule]
})
export class ExamTakeComponent implements OnInit, OnDestroy {
  exam: Exam | null = null;
  examId: string | null = null;
  selectedAnswers: { [key: string]: Answer } = {};
  remainingTime: number = 0;
  timerInterval: any;
  examStartTime: Date | null = null;
  isExamEnded: boolean = false;
  answeredQuestions: number = 0;
  totalQuestions: number = 0;
  currentSection: number = 0;
  isSubmitting: boolean = false;
  errorMessage: string = '';
  showConfirmSubmit: boolean = false;
  showTimeoutWarning: boolean = false;

  constructor(
    private route: ActivatedRoute,
    private examService: ExamService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.examId = this.route.snapshot.paramMap.get('id');
    if (this.examId) {
      this.loadExam(this.examId);
      this.loadSavedExamState();
    }
  }

  ngOnDestroy(): void {
    this.clearTimer();
    this.saveExamState();
  }

  private loadExam(id: string): void {
    this.examService.getExamById(id).subscribe({
      next: (exam) => {
        this.exam = exam;
        this.totalQuestions = this.calculateTotalQuestions();
        if (!this.examStartTime) {
          this.startExam();
        }
        this.initializeTimer();
      },
      error: (error) => {
        console.error('Error loading exam:', error);
        this.showErrorMessage('Không thể tải bài thi. Vui lòng thử lại sau.');
      }
    });
  }

  private startExam(): void {
    this.examStartTime = new Date();
    this.isExamEnded = false;
    if (this.examId) {
      localStorage.setItem(`exam_${this.examId}_start`, this.examStartTime.toISOString());
    }
  }

  private loadSavedExamState(): void {
    if (!this.examId) return;

    try {
      const savedState = localStorage.getItem(`exam_${this.examId}_state`);
      if (savedState) {
        const state = JSON.parse(savedState);
        
        // Validate and convert saved answers
        const validAnswers: { [key: string]: Answer } = {};
        Object.entries(state.answers).forEach(([qId, ans]: [string, any]) => {
          if (ans && ans.answer && ans.questionId) {
            validAnswers[qId] = {
              questionId: ans.questionId,
              answer: ans.answer,
              timestamp: new Date(ans.timestamp)
            };
          }
        });

        this.selectedAnswers = validAnswers;
        
        // Handle start time
        const savedStartTime = new Date(state.startTime);
        this.examStartTime = isNaN(savedStartTime.getTime()) ? new Date() : savedStartTime;
        
        this.currentSection = typeof state.currentSection === 'number' ? 
          state.currentSection : 0;

        this.answeredQuestions = Object.keys(validAnswers).length;
      } else {
        this.examStartTime = new Date();
      }
    } catch (error) {
      console.error('Error loading saved state:', error);
      this.clearSavedState();
      this.examStartTime = new Date();
    }
  }

  private saveExamState(): void {
    if (this.examId) {
      const state = {
        answers: this.selectedAnswers,
        startTime: this.examStartTime,
        currentSection: this.currentSection
      };
      localStorage.setItem(`exam_${this.examId}_state`, JSON.stringify(state));
    }
  }

  private clearSavedState(): void {
    if (this.examId) {
      localStorage.removeItem(`exam_${this.examId}_state`);
      localStorage.removeItem(`exam_${this.examId}_start`);
    }
  }

  private clearTimer(): void {
    if (this.timerInterval) {
      clearInterval(this.timerInterval);
      this.timerInterval = null;
    }
  }

  private initializeTimer(): void {
    if (!this.exam || !this.examStartTime) return;

    const duration = this.exam.duration * 60 * 1000;
    const endTime = new Date(this.examStartTime.getTime() + duration);
    const now = new Date();

    if (now >= endTime) {
      this.endExam();
      return;
    }

    this.remainingTime = Math.floor((endTime.getTime() - now.getTime()) / 1000);
    this.startTimer();
  }

  private startTimer(): void {
    this.clearTimer();
    this.timerInterval = setInterval(() => {
      this.remainingTime--;
      if (this.remainingTime <= 300 && !this.showTimeoutWarning) {
        this.showTimeoutWarning = true;
      }
      if (this.remainingTime <= 0) {
        this.endExam();
      }
    }, 1000);
  }

  shouldShowWarning(): boolean {
    return this.remainingTime <= 300;
  }

  formatTime(seconds: number): string {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  }

  get progressPercentage(): number {
    if (this.totalQuestions === 0) return 0;
    return (this.answeredQuestions / this.totalQuestions) * 100;
  }

  previousSection(): void {
    if (this.currentSection > 0) {
      this.currentSection--;
    }
  }

  nextSection(): void {
    if (this.currentSection < (this.exam?.sections.length ?? 0) - 1) {
      this.currentSection++;
    }
  }

  goToSection(index: number): void {
    if (index >= 0 && index < (this.exam?.sections.length ?? 0)) {
      this.currentSection = index;
    }
  }

  onAnswerSelected(questionId: string, answer: string): void {
    if (this.isExamEnded || this.isSubmitting) return;

    const wasAnswered = this.selectedAnswers[questionId]?.answer === answer;
    
    if (wasAnswered) {
      // If already selected, unselect it
      delete this.selectedAnswers[questionId];
    } else {
      // If not selected or different answer, update selection
      this.selectedAnswers[questionId] = {
        questionId,
        answer,
        timestamp: new Date()
      };
    }

    this.answeredQuestions = Object.keys(this.selectedAnswers).length;
    this.saveExamState();
  }

  isAnswerSelected(questionId: string, answer: string): boolean {
    return this.selectedAnswers[questionId]?.answer === answer;
  }

  getAnsweredInSection(section: any): number {
    return section.questions.filter((q: any) => 
      this.selectedAnswers[q._id]
    ).length;
  }

  isQuestionAnswered(questionId: string): boolean {
    return !!this.selectedAnswers[questionId];
  }

  isSectionCompleted(sectionIndex: number): boolean {
    if (!this.exam) return false;
    const section = this.exam.sections[sectionIndex];
    return this.getAnsweredInSection(section) === section.questions.length;
  }

  get canSubmit(): boolean {
    return !this.isExamEnded && 
           !this.isSubmitting && 
           Object.keys(this.selectedAnswers).length > 0 &&
           this.currentSection === (this.exam?.sections.length ?? 0) - 1;
  }

  submitExam(): void {
    if (!this.exam || !this.examId || this.isExamEnded || this.isSubmitting) return;
  
    if (!this.showConfirmSubmit) {
      this.showConfirmSubmit = true;
      return;
    }
  
    if (!this.examStartTime) {
      this.showErrorMessage('Thời gian bắt đầu không hợp lệ');
      return;
    }
  
    this.isSubmitting = true;
  
    // Format answers correctly
    const formattedAnswers: { questionId: any; answer: string; timestamp: string; }[] = [];
    
    this.exam.sections.forEach(section => {
      section.questions.forEach(question => {
        const answer = this.selectedAnswers[question._id];
        if (answer) {
          formattedAnswers.push({
            questionId: question._id,
            answer: answer.answer,
            timestamp: answer.timestamp.toISOString()
          });
        }
      });
    });
  
    const submissionData = {
      answers: formattedAnswers,
      startTime: this.examStartTime.toISOString(),
      endTime: new Date().toISOString()
    };
  
    console.log('Submitting data:', submissionData);
  
    this.examService.submitExam(this.examId, submissionData).subscribe({
      next: (result) => {
        this.isSubmitting = false;
        this.clearSavedState();
        localStorage.setItem('lastExamResult', JSON.stringify(result));
        this.router.navigate(['/exams-history', result.id]);
      },
      error: (error) => {
        this.isSubmitting = false;
        console.error('Error submitting exam:', error);
        this.showErrorMessage('Có lỗi xảy ra khi nộp bài thi. Vui lòng thử lại.');
      }
    });
  }

  confirmSubmit(): void {
    this.showConfirmSubmit = false;
    this.submitExam();
  }

  cancelSubmit(): void {
    this.showConfirmSubmit = false;
  }

  acknowledgeTimeWarning(): void {
    this.showTimeoutWarning = false;
  }

  showErrorMessage(message: string): void {
    this.errorMessage = message;
    setTimeout(() => {
      this.errorMessage = '';
    }, 5000);
  }

  private endExam(): void {
    if (this.isExamEnded) return;
    
    this.isExamEnded = true;
    this.clearTimer();

    if (Object.keys(this.selectedAnswers).length > 0) {
      this.showConfirmSubmit = true;
    } else {
      this.showErrorMessage('Bài thi kết thúc mà không có câu trả lời nào được ghi nhận.');
      this.router.navigate(['/exams-history']);
    }
  }

  private calculateTotalQuestions(): number {
    if (!this.exam) return 0;
    return this.exam.sections.reduce((total, section) => 
      total + section.questions.length, 0);
  }
}