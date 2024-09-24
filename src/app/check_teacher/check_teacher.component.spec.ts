import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Check_teacherComponent } from './check_teacher.component';

describe('Check_teacherComponent', () => {
  let component: Check_teacherComponent;
  let fixture: ComponentFixture<Check_teacherComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ Check_teacherComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(Check_teacherComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should add a new category when createCategory is called', () => {
    spyOn(window, 'prompt').and.returnValue('New Category');
    component.createCategory();
    expect(component.categories.length).toBe(1);
    expect(component.categories[0]).toBe('New Category');
  });

  it('should not add a category if input is empty or whitespace', () => {
    spyOn(window, 'prompt').and.returnValue(' ');
    component.createCategory();
    expect(component.categories.length).toBe(0);
  });
});
