import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Library_teacherComponent } from './Library _ teacher.component';

describe('Library_teacherComponent', () => {
  let component: Library_teacherComponent;
  let fixture: ComponentFixture<Library_teacherComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [Library_teacherComponent]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(Library_teacherComponent);
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

  it('should edit an existing category when editCategory is called', () => {
    component.categories = ['Test Category'];
    spyOn(window, 'prompt').and.returnValue('Updated Category');
    component.editCategory(0);
    expect(component.categories[0]).toBe('Updated Category');
  });

  it('should delete a category when deleteCategory is called', () => {
    component.categories = ['Test Category'];
    spyOn(window, 'confirm').and.returnValue(true);
    component.deleteCategory(0);
    expect(component.categories.length).toBe(0);
  });
});
