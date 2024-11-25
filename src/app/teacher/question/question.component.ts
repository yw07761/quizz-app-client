import { Component, OnInit } from '@angular/core';
import { QuestionService, Question } from '../../../services/question.service';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-question',
  templateUrl: './question.component.html',
  styleUrls: ['./question.component.scss'],
  standalone: true,
  imports: [CommonModule, FormsModule]
})
export class QuestionComponent implements OnInit {
  question: Question = {
    text: '',
    answers: [{ text: '', isCorrect: false }, { text: '', isCorrect: false }],
    status: 'pending', // Trạng thái câu hỏi: 'pending', 'approved', 'rejected'
  };
  category: string = '';
  group: string = '';
  categories: string[] = [
    'Grammar',
    'Vocabulary',
    'Reading Comprehension',
    'Listening Comprehension',
    'Pronunciation',
    'Translation'
  ];
  groups: string[] = ['Beginner', 'Intermediate', 'Advanced'];
  isPreviewVisible: boolean = false;




  constructor(private questionService: QuestionService, private router: Router) {}

  ngOnInit() {
    const state = history.state as any;
    if (state.question) {
      this.question = state.question;
      this.category = this.question.category || '';
      this.group = this.question.group || '';
    }
  }
  
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

    if (this.question._id) {
      // Cập nhật câu hỏi hiện có
      this.questionService.updateQuestion(this.question).subscribe({
        next: () => {
          alert('Câu hỏi đã được cập nhật');
          this.router.navigate(['/teacher-library']);
        },
        error: (error) => {
          console.error('Error updating question:', error);
          alert('Có lỗi xảy ra khi cập nhật câu hỏi');
        }
      });
    } else {
      // Thêm câu hỏi mới
      this.questionService.addQuestion(this.question).subscribe({
        next: () => {
          alert('Câu hỏi đã được lưu vào thư viện');
          this.router.navigate(['/teacher-library']);
        },
        error: (error) => {
          console.error('Error saving question:', error);
          alert('Có lỗi xảy ra khi lưu câu hỏi');
        }
      });
    }
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
  openPreview() {
    if (!this.question.text.trim()) {
      alert("Vui lòng nhập nội dung câu hỏi.");
      return;
    }
    if (this.question.answers.some(answer => !answer.text.trim())) {
      alert("Vui lòng nhập đầy đủ nội dung câu trả lời.");
      return;
    }
    this.isPreviewVisible = true;
  }
  
  closePreview() {
    this.isPreviewVisible = false;
  }
  
}