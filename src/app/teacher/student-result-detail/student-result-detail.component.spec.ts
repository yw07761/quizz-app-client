import { ComponentFixture, TestBed } from '@angular/core/testing';

import { studentResultDetailComponent } from './student-result-detail.component';

describe('StudentResultDetailComponent', () => {
  let component: studentResultDetailComponent;
  let fixture: ComponentFixture<studentResultDetailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [studentResultDetailComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(studentResultDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
