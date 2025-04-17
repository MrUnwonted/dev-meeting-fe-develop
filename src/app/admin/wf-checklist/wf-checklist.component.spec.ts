import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WfChecklistComponent } from './wf-checklist.component';

describe('WfChecklistComponent', () => {
  let component: WfChecklistComponent;
  let fixture: ComponentFixture<WfChecklistComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [WfChecklistComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(WfChecklistComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
