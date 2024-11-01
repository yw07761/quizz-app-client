import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ExamHistoryComponent } from './exam-history.component';

describe('ExamHistoryComponent', () => {
  let component: ExamHistoryComponent;
  let fixture: ComponentFixture<ExamHistoryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ExamHistoryComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ExamHistoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
