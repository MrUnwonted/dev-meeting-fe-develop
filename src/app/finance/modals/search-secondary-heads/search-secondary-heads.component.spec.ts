import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SearchSecondaryHeadsComponent } from './search-secondary-heads.component';

describe('SearchSecondaryHeadsComponent', () => {
  let component: SearchSecondaryHeadsComponent;
  let fixture: ComponentFixture<SearchSecondaryHeadsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SearchSecondaryHeadsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SearchSecondaryHeadsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
