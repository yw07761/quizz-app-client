import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
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

  constructor(
    private route: ActivatedRoute,
    private examService: ExamService
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

  submitExam() {
    // Logic to submit answers (you can implement this part later)
  }
}
