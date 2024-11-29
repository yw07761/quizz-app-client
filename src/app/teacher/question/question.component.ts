import { Component, OnInit } from '@angular/core';
import { QuestionService, Question } from '../../../services/question.service';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import * as XLSX from 'xlsx';

@Component({
  selector: 'app-question',
  templateUrl: './question.component.html',
  styleUrls: ['./question.component.scss'],
  standalone: true,
  imports: [CommonModule, FormsModule]
})
export class QuestionComponent implements OnInit {
  // Danh sách câu hỏi đã tải lên
  questions: Question[] = []; 
  // Các thuộc tính dùng cho các form câu hỏi
  category: string = '';
  group: string = '';
  categories: string[] = [
    'Grammar', 'Vocabulary', 'Reading Comprehension', 
    'Listening Comprehension', 'Pronunciation', 'Translation'
  ];
  groups: string[] = ['Beginner', 'Intermediate', 'Advanced'];

  // Các câu hỏi được tải lên từ file Excel
  uploadedQuestions: Question[] = [];

  isPreviewVisible: boolean = false;
  question: any;

  constructor(private questionService: QuestionService, private router: Router) {}

  ngOnInit() {
    const state = history.state as any;
    if (state.question) {
      this.questions.push(state.question); // Lưu câu hỏi vào danh sách khi có state
    }
  }

  // Thêm câu hỏi mới
  addQuestion(): void {
    this.questions.push({
      text: '',
      answers: [{ text: '', isCorrect: false }, { text: '', isCorrect: false }],
      category: '',
      group: '',
      status: 'pending',  // Trạng thái mặc định
    });
  }
  

  // Xóa câu hỏi
  removeQuestion(index: number): void {
    this.questions.splice(index, 1);
  }

  // Thêm câu trả lời
  addAnswer(questionIndex: number): void {
    this.questions[questionIndex].answers.push({ text: '', isCorrect: false });
  }

  // Xóa câu trả lời
  removeAnswer(questionIndex: number, answerIndex: number): void {
    this.questions[questionIndex].answers.splice(answerIndex, 1);
  }

  // Chuyển đổi trạng thái đúng/sai của câu trả lời
  toggleAnswer(questionIndex: number, answerIndex: number): void {
    const answer = this.questions[questionIndex].answers[answerIndex];
    answer.isCorrect = !answer.isCorrect;
  }

  // Lưu tất cả câu hỏi
  saveAllQuestions(): void {
    this.questionService.bulkAddQuestions(this.questions).subscribe({
      next: () => {
        alert('Tất cả câu hỏi đã được lưu thành công!');
        // Điều hướng đến /teacher/library sau khi lưu thành công
        this.router.navigate(['/teacher-library']);
      },
      error: (err) => {
        console.error('Error saving questions:', err);
        alert('Có lỗi xảy ra khi lưu câu hỏi.');
      },
    });
  }


  // Mở xem trước
  openPreview(): void {
    this.isPreviewVisible = true;
  }

  // Đóng xem trước
  closePreview(): void {
    this.isPreviewVisible = false;
  }

  // Xử lý file tải lên
  onFileUpload(event: any): void {
    const file = event.target.files[0];
    if (!file) return;

    const reader: FileReader = new FileReader();
    reader.onload = (e: any) => {
      const bstr: string = e.target.result;
      const workbook: XLSX.WorkBook = XLSX.read(bstr, { type: 'binary' });
      const sheetName: string = workbook.SheetNames[0];
      const worksheet: XLSX.WorkSheet = workbook.Sheets[sheetName];

      const excelData: any[][] = XLSX.utils.sheet_to_json(worksheet, { header: 1 });
      this.populateQuestionsFromExcel(excelData);
    };

    reader.readAsBinaryString(file);
  }

  // Điền dữ liệu từ Excel vào danh sách câu hỏi
  populateQuestionsFromExcel(data: any[][]): void {
    const newQuestions = data.slice(1).map((row) => ({
      text: row[0] || '',
      category: row[1] || '',
      group: row[2] || '',
      answers: [
        { text: row[3] || '', isCorrect: row[7] === 'true' },
        { text: row[4] || '', isCorrect: row[8] === 'true' },
        { text: row[5] || '', isCorrect: row[9] === 'true' },
        { text: row[6] || '', isCorrect: row[10] === 'true' },
      ],
      status: (row[11] === 'pending' || row[11] === 'approved' || row[11] === 'rejected') ? row[11] : 'pending',
    }));

    this.questions = [...this.questions, ...newQuestions];  // Gán câu hỏi vào mảng chính
  }

  // Xóa câu hỏi đã tải lên
  removeUploadedQuestion(index: number): void {
    this.uploadedQuestions.splice(index, 1);
  }

  // Lưu câu hỏi
  saveQuestion() {
    const questionToSave = this.questions[0]; // Hoặc câu hỏi bạn muốn lưu từ mảng
    questionToSave.category = this.category;
    questionToSave.group = this.group;
  
    if (questionToSave.text.trim()) {
      this.questionService.addQuestion(questionToSave).subscribe({
        next: () => alert('Câu hỏi đã được lưu.'),
        error: (err) => console.error(err),
      });
    } else {
      alert('Vui lòng nhập nội dung câu hỏi.');
    }
  }
  
  // Đặt lại form
  resetForm() {
    this.questions = [{  // Tạo một mảng mới chứa một câu hỏi trống
      text: '',
      answers: [{ text: '', isCorrect: false }, { text: '', isCorrect: false }],
      status: 'pending',
      category: '',
      group: ''
    }];
    this.category = '';
    this.group = '';
  }
  
  goBack(): void {
    window.history.back();
  }
  closeForm() {
    window.history.back();
  }
  onFileSelected(event: any, questionIndex: number): void {
    const file = event.target.files[0];
    if (file && file.type.startsWith('audio/')) {
      // Prepare the form data for file upload
      const formData = new FormData();
      formData.append('audioFile', file);
    
      // Send the file to the backend to upload it to S3
      this.questionService.uploadAudioFile(formData).subscribe({
        next: (response) => {
          // Once uploaded, store the S3 URL in the 'text' property
          this.questions[questionIndex].text = response.audioUrl; // Assuming response contains the URL of the uploaded file
        },
        error: (err) => {
          console.error('File upload error:', err);
          alert('Có lỗi khi tải tệp âm thanh lên.');
        },
      });
    } else {
      alert('Vui lòng chọn tệp âm thanh hợp lệ.');
    }
  }
  
  
  
  
  // Cập nhật các câu hỏi hiện tại
  updateQuestions(): void {
    const updatedQuestions = this.questions.filter(q => q.text.trim() !== '' && q.answers.length > 0);

    if (updatedQuestions.length === 0) {
      alert('Không có câu hỏi nào hợp lệ để cập nhật.');
      return;
    }

    // Lặp qua từng câu hỏi hợp lệ và gọi updateQuestion
    updatedQuestions.forEach(question => {
      this.questionService.updateQuestion(question).subscribe({
        next: (updatedQuestion) => {
          console.log('Câu hỏi đã được cập nhật:', updatedQuestion);
          alert('Câu hỏi đã được cập nhật thành công!');
          
          // Sau khi cập nhật thành công, điều hướng về trang /teacher-library
          this.router.navigate(['/teacher-library']);
        },
        error: (err) => {
          console.error('Lỗi khi cập nhật câu hỏi:', err);
          alert('Có lỗi xảy ra khi cập nhật câu hỏi.');
        },
      });
    });
  }
  
  
}
