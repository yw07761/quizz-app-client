import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ExamResultDetailComponent } from './exam-result-detail.component';

describe('ExamResultDetailComponent', () => {
  let component: ExamResultDetailComponent;
  let fixture: ComponentFixture<ExamResultDetailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ExamResultDetailComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ExamResultDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
