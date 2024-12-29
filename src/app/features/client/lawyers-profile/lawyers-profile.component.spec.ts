import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LawyersProfileComponent } from './lawyers-profile.component';

describe('LawyersProfileComponent', () => {
  let component: LawyersProfileComponent;
  let fixture: ComponentFixture<LawyersProfileComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LawyersProfileComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LawyersProfileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
