import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';

interface Question {
  content: string;
  answers: string[];
  correctAnswer?: number;
  score?: number;
}

interface Section {
  title: string;
  description: string;
  questions: Question[];
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
export class ExamCreateComponent {
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

  // Tracking which sections are open or closed
  isSectionOpen: { [key: string]: boolean } = {
    general: true,
    advanced: true
  };

  onSubmit() {
    console.log('Exam submitted:', this.exam);
    console.log('Sections:', this.sections);
  }

  addSection() {
    this.sections.push({ title: '', description: '', questions: [] });
  }

  addQuestionToSection(sectionIndex: number) {
    this.sections[sectionIndex].questions.push({ content: '', answers: [] });
  }

  addAnswerToQuestion(sectionIndex: number, questionIndex: number) {
    this.sections[sectionIndex].questions[questionIndex].answers.push('');
  }

  toggleSection(section: string) {
    this.isSectionOpen[section] = !this.isSectionOpen[section];
  }

  navigateBack() {
    window.history.back();
  }
}
