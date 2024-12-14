import { Component, OnInit } from '@angular/core';
import { QuestionService, Question } from '../../../services/question.service';
import { ExamService } from '../../../services/exam.service';
import { AuthService } from '../../../services/auth.service';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

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
  availableQuestions: Question[] = [];
  filteredQuestions: Question[] = [];
  teacherId: string | undefined;
  isMaxScoreError: boolean = false;
  selectedCategory: string = '';
  selectedGroup: string = '';
  uniqueCategories: string[] = [];
  uniqueGroups: string[] = [];

  isSectionOpen: { [key: string]: boolean } = {
    general: true,
    advanced: true
  };

  constructor(
    private questionService: QuestionService,
    private examService: ExamService,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    const user = this.authService.getCurrentUser();
    this.teacherId = user?._id;
  
    this.questionService.getQuestions().subscribe((questions) => {
      this.availableQuestions = questions;
      this.filteredQuestions = questions; // Initialize with all available questions
      this.updateUniqueFilters(); // Set unique categories and groups
    });
  }
  
  
  updateUniqueFilters() {
    this.uniqueCategories = [...new Set(this.availableQuestions.map(q => q.category).filter(Boolean) as string[])];
    this.uniqueGroups = [...new Set(this.availableQuestions.map(q => q.group).filter(Boolean) as string[])];
    
    // Log kiểm tra giá trị của uniqueCategories và uniqueGroups
    console.log('Unique Categories:', this.uniqueCategories);
    console.log('Unique Groups:', this.uniqueGroups);
  }
  
  // Function to handle form submission (exam)
  onSubmit() {
    console.log('Exam submitted:', this.exam);
    console.log('Sections:', this.sections);
  }

  addQuestionToSection(sectionIndex: number, questionId: string) {
    if (!questionId) {
      alert('Vui lòng chọn một câu hỏi để thêm!');
      return;
    }
  
    // Tìm câu hỏi được chọn trong danh sách availableQuestions
    const selectedQuestion = this.availableQuestions.find((q) => q._id === questionId);
  
    if (selectedQuestion) {
      // Kiểm tra xem câu hỏi đã tồn tại trong phần chưa
      const questionExistsInSection = this.sections[sectionIndex]?.questions.some(
        (q) => q._id === selectedQuestion._id
      );
  
      if (questionExistsInSection) {
        alert('Câu hỏi này đã được thêm vào phần này!');
        return; // Nếu câu hỏi đã có trong phần, không thêm nữa
      }
  
      // Kiểm tra xem câu hỏi đã được thêm vào bất kỳ phần nào trong bài thi chưa
      const questionAlreadyAdded = this.sections.some(section =>
        section.questions.some(q => q._id === selectedQuestion._id)
      );
  
      if (questionAlreadyAdded) {
        alert('Câu hỏi này đã được thêm vào một phần khác!');
        return; // Nếu câu hỏi đã được thêm vào phần khác, không cho phép thêm nữa
      }
  
      // Thêm câu hỏi vào phần hiện tại (sectionIndex)
      this.sections[sectionIndex]?.questions.push({
        ...selectedQuestion,
        score: 1, // Khởi tạo điểm mặc định
      });
  
      // Sau khi thêm câu hỏi, gọi filterQuestions để loại bỏ câu hỏi đã chọn khỏi danh sách có thể chọn
      this.filterQuestions();
    } else {
      alert('Không tìm thấy câu hỏi!');
    }
  }
  

  // Hàm kiểm tra tổng điểm
  checkTotalScore(): boolean {
    // Tính tổng điểm của các câu hỏi trong tất cả các phần
    const totalScore = this.sections.reduce((total, section) => {
      const sectionScore = section.questions.reduce((sectionTotal, question) => sectionTotal + (question.score || 0), 0);
      return total + sectionScore;
    }, 0);

    // So sánh tổng điểm với điểm tối đa
    if (totalScore !== this.exam.maxScore) {
      alert(`Tổng điểm của các câu hỏi (${totalScore}) không khớp với điểm tối đa của bài thi (${this.exam.maxScore})!`);
      return false; // Trả về false nếu tổng điểm không khớp
    }
    return true; // Trả về true nếu tổng điểm khớp
  }

  // Function to save the exam to the server
  saveExam() {
  // Kiểm tra tổng điểm trước khi gửi
  if (!this.checkTotalScore()) {
    return; // Nếu tổng điểm không hợp lệ, dừng lại và không gửi bài thi
  }

  const examData = {
    ...this.exam,
    createdBy: this.teacherId,
    sections: this.sections.map(section => ({
      ...section,
      questions: section.questions.map(q => ({
        questionId: q._id,
        score: q.score
      }))
    }))
  };

  console.log("Exam data being sent:", examData);

  this.examService.createExam(examData).subscribe({
    next: (response) => {
      console.log('Exam saved successfully:', response);
      alert('Bài thi đã được lưu thành công!');
      window.history.back();
    },
    error: (error) => {
      console.error('Error saving exam:', error);
      alert('Có lỗi xảy ra khi lưu bài thi. Vui lòng thử lại.');
    }
  });
}


  // Function to toggle section visibility (expand/collapse)
  toggleSection(section: string) {
    this.isSectionOpen[section] = !this.isSectionOpen[section];
  }

  // Function to go back to the previous page
  navigateBack() {
    window.history.back();
  }

  // Function to reset filters and display all questions
  onCategoryOrGroupChange() {
    console.log('Category selected:', this.selectedCategory);
    console.log('Group selected:', this.selectedGroup);
    this.filterQuestions();
  }
  addSection() {
    this.sections.push({ title: '', description: '', questions: [] });
  }

  

  removeQuestionFromSection(sectionIndex: number, questionIndex: number) {
    if (confirm('Bạn có chắc muốn xóa câu hỏi này?')) {
      this.sections[sectionIndex].questions.splice(questionIndex, 1);
    }
  }
  
  

  filterQuestions() {
    console.log("Filtered Questions before filtering:", this.filteredQuestions); // Kiểm tra câu hỏi trước khi lọc
  
    this.filteredQuestions = this.availableQuestions.filter(question => {
      const categoryMatch = this.selectedCategory ? question.category === this.selectedCategory : true;
      const groupMatch = this.selectedGroup ? question.group === this.selectedGroup : true;
      const statusMatch = question.status === "approved";
      
      // Kiểm tra xem câu hỏi đã được thêm vào bất kỳ phần nào chưa
      const questionAlreadyAdded = this.sections.some(section => 
        section.questions.some(q => q._id === question._id)
      );
      
      return categoryMatch && groupMatch && statusMatch && !questionAlreadyAdded; // Loại bỏ câu hỏi đã được thêm
    });
  
    console.log("Filtered Questions after filtering:", this.filteredQuestions); // Kiểm tra câu hỏi sau khi lọc
  }
  
  

clearFilters() {
    // Reset bộ lọc về trạng thái ban đầu
    this.selectedCategory = '';
    this.selectedGroup = '';
    this.filteredQuestions = this.availableQuestions;
}


}
