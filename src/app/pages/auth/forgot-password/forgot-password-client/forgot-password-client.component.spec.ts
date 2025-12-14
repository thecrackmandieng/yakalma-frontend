import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ForgotPasswordClientComponent } from './forgot-password-client.component';

describe('ForgotPasswordClientComponent', () => {
  let component: ForgotPasswordClientComponent;
  let fixture: ComponentFixture<ForgotPasswordClientComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ForgotPasswordClientComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ForgotPasswordClientComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
