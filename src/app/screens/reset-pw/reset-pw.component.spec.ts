import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ResetPWComponent } from './reset-pw.component';
import { beforeEach, describe, it } from 'node:test';

describe('ResetPWComponent', () => {
  let component: ResetPWComponent;
  let fixture: ComponentFixture<ResetPWComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ResetPWComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ResetPWComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
