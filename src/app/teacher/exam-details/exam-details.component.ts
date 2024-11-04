import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ExamService, Exam } from '../../../services/exam.service';
import { QuestionService, Question } from '../../../services/question.service';
import { forkJoin, Observable } from 'rxjs';
import { CommonModule } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';

interface ExamSection {
  title: string;
  description: string;
  questions: {
    questionId: string; // Sử dụng questionId để lấy thông tin câu hỏi
    score: number;
    questionData?: Question;
  }[];
}


interface QuestionMapItem {
  sectionIndex: number;
  questionIndex: number;
}

@Component({
  selector: 'app-exam-details',
  templateUrl: './exam-details.component.html',
  styleUrls: ['./exam-details.component.scss'],
  standalone: true,
  imports: [CommonModule]
})
export class ExamDetailsComponent implements OnInit {
  examId: string | null = null;
  exam: Exam | null = null;
  sections: ExamSection[] = [];
  isLoading = true;

  constructor(
    private route: ActivatedRoute,
    private examService: ExamService,
    private questionService: QuestionService
  ) {}

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      this.examId = params.get('id');
      if (this.examId) {
        this.loadExamDetails(this.examId);
      }
    });
  }

  loadExamDetails(id: string) {
    this.examService.getExamById(id).subscribe({
      next: (exam: Exam) => {
        console.log('Loaded exam in component:', exam); // Log dữ liệu nhận được từ service
        this.exam = exam;
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error fetching exam details:', error);
        this.isLoading = false;
      }
    });
  }
  
  
  

  loadQuestionsForSections(sections: ExamSection[]) {
    const questionObservables: Observable<Question>[] = [];
    const questionMap = new Map<string, QuestionMapItem>();
  
    sections.forEach((section, sectionIndex) => {
      section.questions.forEach((question, questionIndex) => {
        const questionId = question.questionId;
        if (questionId) {
          questionObservables.push(this.questionService.getQuestionById(questionId.trim()));
          questionMap.set(questionId, { sectionIndex, questionIndex });
        }
      });
    });
  
    forkJoin(questionObservables).subscribe({
      next: (questions: Question[]) => {
        console.log('Loaded questions:', questions);
  
        // Khởi tạo `sections` và gán chi tiết cho `questions`
        this.sections = sections.map(section => ({
          ...section,
          questions: section.questions.map(q => ({
            ...q,
            questionData: undefined // Khởi tạo `questionData`
          }))
        }));
  
        // Gán từng câu hỏi vào đúng vị trí trong `sections`
        questions.forEach(question => {
          const questionId = question._id;
          if (questionId && questionMap.has(questionId)) {
            const mapItem = questionMap.get(questionId);
            if (mapItem) {
              this.sections[mapItem.sectionIndex].questions[mapItem.questionIndex].questionData = question;
            }
          }
        });
  
        console.log('Processed sections with questions:', this.sections);
        this.isLoading = false;
      },
      error: (error: HttpErrorResponse) => {
        console.error('Error fetching questions:', error.message);
        console.error('Error status code:', error.status);
        console.error('Full error details:', error);
        this.isLoading = false;
      }
    });
  }
  
  
  

  goBack(): void {
    window.history.back();
  }
}
