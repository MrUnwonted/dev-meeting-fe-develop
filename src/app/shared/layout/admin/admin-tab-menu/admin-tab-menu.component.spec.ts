import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminTabMenuComponent } from './admin-tab-menu.component';

describe('AdminTabMenuComponent', () => {
  let component: AdminTabMenuComponent;
  let fixture: ComponentFixture<AdminTabMenuComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AdminTabMenuComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AdminTabMenuComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
