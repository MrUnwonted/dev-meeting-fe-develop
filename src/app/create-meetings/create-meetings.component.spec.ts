import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateMeetingsComponent } from './create-meetings.component';

describe('CreateMeetingsComponent', () => {
  let component: CreateMeetingsComponent;
  let fixture: ComponentFixture<CreateMeetingsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CreateMeetingsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CreateMeetingsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
