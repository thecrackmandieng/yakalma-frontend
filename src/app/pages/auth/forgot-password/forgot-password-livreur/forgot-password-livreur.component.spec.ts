import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ForgotPasswordLivreurComponent } from './forgot-password-livreur.component';

describe('ForgotPasswordLivreurComponent', () => {
  let component: ForgotPasswordLivreurComponent;
  let fixture: ComponentFixture<ForgotPasswordLivreurComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ForgotPasswordLivreurComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ForgotPasswordLivreurComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
