import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../../services/auth.service';
import { ExamService } from '../../../services/exam.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-exam-history',
  templateUrl: './exam-history.component.html',
  styleUrls: ['./exam-history.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    FormsModule
  ]
})
export class ExamHistoryComponent implements OnInit {
  user: any = null;
  examHistory: any[] = [];
  filteredExamHistory: any[] = [];
  isDropdownActive = false;

  constructor(private authService: AuthService, private examService: ExamService) {}

  ngOnInit() {
    this.user = this.authService.getCurrentUser();
    this.loadExamHistory();
  }

  // Load user's exam history
  loadExamHistory() {
    if (!this.user) return;
    this.examService.getExamHistory(this.user._id).subscribe({
      next: (history) => {
        this.examHistory = history;
        this.filteredExamHistory = history;
      },
      error: (error) => {
        console.error('Error loading exam history:', error);
      }
    });
  }

  toggleDropdown() {
    this.isDropdownActive = !this.isDropdownActive;
  }

  // Logout function
  logout() {
    this.authService.logout().subscribe({
      next: () => {
        window.location.href = '/login';
      },
      error: (error) => {
        console.error('Logout error:', error);
      }
    });
  }

  // Filter results based on search input
  filterResults(event: any) {
    const searchTerm = event.target.value.toLowerCase();
    this.filteredExamHistory = this.examHistory.filter(exam =>
      exam.name.toLowerCase().includes(searchTerm) || 
      exam.score.toString().includes(searchTerm)
    );
  }

  // Apply additional filter logic if needed
  applyFilter() {
    console.log('Filter applied');
  }

  // View details of a specific exam
  viewExamDetails(examId: string) {
    window.location.href = `/exam-details/${examId}`;
  }
}
