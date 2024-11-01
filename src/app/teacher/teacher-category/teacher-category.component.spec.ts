import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TeacherCategoryComponent } from './teacher-category.component';

describe('TeacherCategoryComponent', () => {
  let component: TeacherCategoryComponent;
  let fixture: ComponentFixture<TeacherCategoryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TeacherCategoryComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TeacherCategoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
