import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SearchAccountHeadsComponent } from './search-account-heads.component';

describe('SearchAccountHeadsComponent', () => {
  let component: SearchAccountHeadsComponent;
  let fixture: ComponentFixture<SearchAccountHeadsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SearchAccountHeadsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SearchAccountHeadsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
