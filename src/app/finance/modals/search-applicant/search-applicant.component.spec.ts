import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SearchApplicantComponent } from './search-applicant.component';

describe('SearchApplicantComponent', () => {
  let component: SearchApplicantComponent;
  let fixture: ComponentFixture<SearchApplicantComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SearchApplicantComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SearchApplicantComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
