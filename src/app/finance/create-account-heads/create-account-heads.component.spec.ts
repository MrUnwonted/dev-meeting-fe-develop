import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateAccountHeadsComponent } from './create-account-heads.component';

describe('CreateAccountHeadsComponent', () => {
  let component: CreateAccountHeadsComponent;
  let fixture: ComponentFixture<CreateAccountHeadsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CreateAccountHeadsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CreateAccountHeadsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
