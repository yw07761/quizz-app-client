import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TeacherHistoryComponent } from './teacher-history.component';

describe('TeacherHistoryComponent', () => {
  let component: TeacherHistoryComponent;
  let fixture: ComponentFixture<TeacherHistoryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TeacherHistoryComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TeacherHistoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
