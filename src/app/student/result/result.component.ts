// result.component.ts
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ExamService } from '../../../services/exam.service';

@Component({
  selector: 'app-result',
  templateUrl: './result.component.html'
})
export class ResultComponent implements OnInit {
  result: any;

  constructor(private route: ActivatedRoute, private examService: ExamService) {}

  ngOnInit() {
    const resultId = this.route.snapshot.paramMap.get('id');
    this.examService.getResult(resultId).subscribe(data => {
      this.result = data;
    });
  }
}