import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Exam_studentComponent } from './exam_student.component';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

describe('Exam_studentComponent ', () => {
  let component: Exam_studentComponent ;
  let fixture: ComponentFixture<Exam_studentComponent >;
  let debugElement: DebugElement;
  let element: HTMLElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [Exam_studentComponent ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(Exam_studentComponent );
    component = fixture.componentInstance;
    fixture.detectChanges();
    debugElement = fixture.debugElement;
    element = debugElement.nativeElement;
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should display logo with text "Your Logo"', () => {
    const logoElement = element.querySelector('.logo span');
    expect(logoElement?.textContent).toContain('Your Logo');
  });

  it('should have a search input with placeholder "Nhập từ khóa"', () => {
    const searchInput: HTMLInputElement = element.querySelector('input[type="text"]')!;
    expect(searchInput.placeholder).toBe('Nhập từ khóa');
  });

  it('should display "Bắt đầu làm bài thi" button', () => {
    const button = element.querySelector('.start-btn');
    expect(button?.textContent).toBe('Bắt đầu làm bài thi');
  });

  it('should display user profile name "Diep"', () => {
    const profileNameElement = element.querySelector('.profile span');
    expect(profileNameElement?.textContent).toBe('Diep');
  });

  it('should display exam course title as "Vocabulary"', () => {
    const courseTitle = element.querySelector('.course-info h3');
    expect(courseTitle?.textContent).toBe('Vocabulary');
  });

  it('should have a timer icon for exam', () => {
    const timerIcon = element.querySelector('.timer img');
    expect(timerIcon).toBeTruthy();
  });
});
