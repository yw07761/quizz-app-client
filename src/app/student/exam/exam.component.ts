// exam.component.ts
import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Exam, ExamService } from '../../../services/exam.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-exam',
  templateUrl: './exam.component.html',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule
  ]
})
export class ExamComponent implements OnInit, OnDestroy {
  examId: string | null = null;
  exam: Exam | null = null;
  answers: any = {};
  remainingTime: number = 300; // Thời gian làm bài (300 giây = 5 phút)
  timer: any;

  constructor(private route: ActivatedRoute, private examService: ExamService) {}

  ngOnInit() {
    const examId = this.route.snapshot.paramMap.get('id');
    if (!examId) {
      alert("Không tìm thấy bài thi!");
      return; // Dừng lại nếu không có examId
    }
    this.examService.getExam(examId).subscribe(data => {
      this.exam = data;
      this.startTimer();
    }, error => {
      console.error("Error fetching exam:", error);
      alert("Đã xảy ra lỗi khi tải bài thi. Vui lòng thử lại.");
    });
  }

  startTimer() {
    this.timer = setInterval(() => {
      if (this.remainingTime > 0) {
        this.remainingTime--;
      } else {
        clearInterval(this.timer);
        alert("Thời gian làm bài đã hết! Bài thi sẽ tự động nộp.");
        this.submitExam();
      }
    }, 1000);
  }

  submitExam() {
    const examId = this.route.snapshot.paramMap.get('id');
  
    // Kiểm tra xem examId có phải là null không
    if (!examId) {
      alert("Không tìm thấy ID bài thi!");
      return; // Dừng lại nếu không có examId
    }
  
    // Gọi dịch vụ để nộp bài thi
    this.examService.submitExam(examId, this.answers).subscribe(response => {
      alert(`Bài kiểm tra đã được nộp thành công! Điểm của bạn là: ${response.score}`);
      clearInterval(this.timer);
    }, error => {
      console.error("Error submitting exam:", error);
      alert("Đã xảy ra lỗi khi nộp bài kiểm tra. Vui lòng thử lại.");
    });
  }

  ngOnDestroy() {
    clearInterval(this.timer);
  }
}