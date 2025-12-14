import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ForgotPasswordPartenaireComponent } from './forgot-password-partenaire.component';

describe('ForgotPasswordPartenaireComponent', () => {
  let component: ForgotPasswordPartenaireComponent;
  let fixture: ComponentFixture<ForgotPasswordPartenaireComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ForgotPasswordPartenaireComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ForgotPasswordPartenaireComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
