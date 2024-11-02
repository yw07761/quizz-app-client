import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { QuestionService, Question } from '../../../services/question.service';

// Tạo interface mở rộng cho câu hỏi, bao gồm thuộc tính `score`
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
  availableQuestions: Question[] = []; // Dữ liệu từ service

  // Tracking trạng thái của các section
  isSectionOpen: { [key: string]: boolean } = {
    general: true,
    advanced: true
  };

  constructor(private questionService: QuestionService) { }

  ngOnInit(): void {
    // Lấy danh sách câu hỏi từ dịch vụ
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

  // Thêm câu hỏi từ danh sách có sẵn vào phần đang tạo
  // Cập nhật phương thức addQuestionToSection
  addQuestionToSection(sectionIndex: number, questionId: string) {
    if (!questionId) return;

    const selectedQuestion = this.availableQuestions.find(q => q._id === questionId);
    
    if (selectedQuestion) {
      // Kiểm tra xem câu hỏi đã tồn tại trong section chưa
      const questionExists = this.sections[sectionIndex].questions.some(
        q => q._id === selectedQuestion._id
      );

      if (!questionExists) {
        // Thêm câu hỏi mới vào section với điểm mặc định là 0
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


  toggleSection(section: string) {
    this.isSectionOpen[section] = !this.isSectionOpen[section];
  }

  navigateBack() {
    window.history.back();
  }
}
