import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TeacherGroupComponent } from './teacher-group.component';

describe('TeacherGroupComponent', () => {
  let component: TeacherGroupComponent;
  let fixture: ComponentFixture<TeacherGroupComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TeacherGroupComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TeacherGroupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
