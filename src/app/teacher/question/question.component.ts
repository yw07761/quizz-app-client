import { Component } from '@angular/core';
import { QuestionService } from '../../../services/question.service';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

interface Answer {
  text: string;
  isCorrect: boolean;
}

interface Question {
  text: string;
  answers: Answer[];
  category?: string;
  group?: string;
}

@Component({
  selector: 'app-question',
  templateUrl: './question.component.html',
  styleUrls: ['./question.component.scss'],
  standalone: true,
  imports: [
    CommonModule,  // Để sử dụng ngClass, ngIf, ngFor, v.v.
    FormsModule    // Để sử dụng [(ngModel)] cho form
  ]
})
export class QuestionComponent {
  question: Question = {
    text: '',
    answers: [{ text: '', isCorrect: false }, { text: '', isCorrect: false }],
  };
  category: string = '';
  group: string = '';
  groups: string[] = ['Nhóm 1', 'Nhóm 2', 'Nhóm 3'];

  constructor(private questionService: QuestionService, private router: Router) {}

  addAnswer() {
    this.question.answers.push({ text: '', isCorrect: false });
  }

  removeAnswer(index: number) {
    this.question.answers.splice(index, 1);
  }

  toggleAnswer(index: number) {
    this.question.answers[index].isCorrect = !this.question.answers[index].isCorrect;
  }

  saveQuestion() {
    this.question.category = this.category;
    this.question.group = this.group;
    this.questionService.addQuestion(this.question);
    alert('Câu hỏi đã được lưu vào thư viện');
    this.router.navigate(['/teacher-library']);
  }

  resetForm() {
    this.question = {
      text: '',
      answers: [{ text: '', isCorrect: false }, { text: '', isCorrect: false }]
    };
    this.category = '';
    this.group = '';
  }

  closeForm() {
    this.router.navigate(['/teacher-library']);
  }
}
