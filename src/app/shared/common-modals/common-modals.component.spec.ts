import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CommonModalsComponent } from './common-modals.component';

describe('CommonModalsComponent', () => {
  let component: CommonModalsComponent;
  let fixture: ComponentFixture<CommonModalsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CommonModalsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CommonModalsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
