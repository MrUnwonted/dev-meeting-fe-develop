import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProfileDocsComponent } from './profile-docs.component';

describe('ProfileDocsComponent', () => {
  let component: ProfileDocsComponent;
  let fixture: ComponentFixture<ProfileDocsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProfileDocsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProfileDocsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
