import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SearchBanksComponent } from './search-banks.component';

describe('SearchBanksComponent', () => {
  let component: SearchBanksComponent;
  let fixture: ComponentFixture<SearchBanksComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SearchBanksComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SearchBanksComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
