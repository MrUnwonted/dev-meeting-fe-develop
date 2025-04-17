import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SearchTranactionTypesComponent } from './search-tranaction-types.component';

describe('SearchTranactionTypesComponent', () => {
  let component: SearchTranactionTypesComponent;
  let fixture: ComponentFixture<SearchTranactionTypesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SearchTranactionTypesComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SearchTranactionTypesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
