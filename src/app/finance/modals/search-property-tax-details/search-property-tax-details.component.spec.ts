import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SearchPropertyTaxDetailsComponent } from './search-property-tax-details.component';

describe('SearchPropertyTaxDetailsComponent', () => {
  let component: SearchPropertyTaxDetailsComponent;
  let fixture: ComponentFixture<SearchPropertyTaxDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SearchPropertyTaxDetailsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SearchPropertyTaxDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
