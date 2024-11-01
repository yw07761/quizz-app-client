import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-teacher-class-detail',
  templateUrl: './teacher-class-detail.component.html',
  styleUrls: ['./teacher-class-detail.component.scss'],
  standalone: true,
  imports: [CommonModule, RouterModule]
})
export class TeacherClassDetailComponent implements OnInit {
  classId: number | null = null;
  classDetail: { id: number; code: string; name: string; description: string; students: string[] } | undefined;

  // Sample classes data - replace with your data source
  classes = [
    { id: 1, code: 'CLASS1', name: 'ENG101', description: 'English Class 101', students: ['Student A', 'Student B'] },
    { id: 2, code: 'CLASS2', name: 'ENG202', description: 'English Class 202', students: ['Student C', 'Student D'] }
  ];

  constructor(private route: ActivatedRoute) {}

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      const id = params.get('id');
      this.classId = id ? +id : null;
      this.loadClassDetails();
    });
  }

  loadClassDetails(): void {
    if (this.classId !== null) {
      this.classDetail = this.classes.find(cls => cls.id === this.classId);
    }
  }
}
