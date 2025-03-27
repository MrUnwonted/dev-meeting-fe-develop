import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RptPmsActivitiesComponent } from './rpt-pms-activities.component';

describe('RptPmsActivitiesComponent', () => {
  let component: RptPmsActivitiesComponent;
  let fixture: ComponentFixture<RptPmsActivitiesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [RptPmsActivitiesComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RptPmsActivitiesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
