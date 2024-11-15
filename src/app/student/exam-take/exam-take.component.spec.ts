import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ExamTakeComponent } from './exam-take.component';

describe('ExamTakeComponent', () => {
  let component: ExamTakeComponent;
  let fixture: ComponentFixture<ExamTakeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ExamTakeComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ExamTakeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
