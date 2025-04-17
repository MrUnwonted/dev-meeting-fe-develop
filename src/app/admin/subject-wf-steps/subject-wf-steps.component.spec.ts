import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SubjectWfStepsComponent } from './subject-wf-steps.component';

describe('SubjectWfStepsComponent', () => {
  let component: SubjectWfStepsComponent;
  let fixture: ComponentFixture<SubjectWfStepsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SubjectWfStepsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SubjectWfStepsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
