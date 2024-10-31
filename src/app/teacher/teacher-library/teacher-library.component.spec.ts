import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TeacherLibraryComponent } from './teacher-library.component';

describe('TeacherLibraryComponent', () => {
  let component: TeacherLibraryComponent;
  let fixture: ComponentFixture<TeacherLibraryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TeacherLibraryComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TeacherLibraryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
