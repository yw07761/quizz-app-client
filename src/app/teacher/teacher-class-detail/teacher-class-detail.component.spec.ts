import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TeacherClassDetailComponent } from './teacher-class-detail.component';

describe('TeacherClassDetailComponent', () => {
  let component: TeacherClassDetailComponent;
  let fixture: ComponentFixture<TeacherClassDetailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TeacherClassDetailComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TeacherClassDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
