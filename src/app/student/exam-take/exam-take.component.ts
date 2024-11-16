import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ExamService, Exam } from '../../../services/exam.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-exam-take',
  templateUrl: './exam-take.component.html',
  styleUrls: ['./exam-take.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    FormsModule  
  ]
})
export class ExamTakeComponent implements OnInit {
  exam: Exam | null = null;
  examId: string | null = null;
  selectedAnswers: { [key: string]: string } = {}; // Stores selected answers for each question

  constructor(
    private route: ActivatedRoute,
    private examService: ExamService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.examId = this.route.snapshot.paramMap.get('id');
    if (this.examId) {
      this.loadExam(this.examId);
    }
  }

  loadExam(id: string) {
    this.examService.getExamById(id).subscribe({
      next: (exam) => {
        this.exam = exam;
      },
      error: (error) => {
        console.error('Error loading exam details:', error);
      }
    });
  }

  onAnswerSelected(questionId: string, answer: string) {
    this.selectedAnswers[questionId] = answer;
    console.log("Selected answer for question", questionId, "is", answer);
  }

  submitExam() {
    if (!this.exam || !this.examId) return;
  
    console.log("Selected answers before submission:", this.selectedAnswers);
  
    this.examService.submitExam(this.examId, this.selectedAnswers).subscribe({
      next: (result) => {
        alert('Bài thi đã được nộp thành công!');
        this.router.navigate(['/exam-history']);
      },
      error: (error) => {
        console.error('Error submitting exam:', error);
      }
    });
  }
}
