import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SearchPropertyTaxComponent } from './search-property-tax.component';

describe('SearchPropertyTaxComponent', () => {
  let component: SearchPropertyTaxComponent;
  let fixture: ComponentFixture<SearchPropertyTaxComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SearchPropertyTaxComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SearchPropertyTaxComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
