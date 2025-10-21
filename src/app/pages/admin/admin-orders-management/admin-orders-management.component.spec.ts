import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminOrdersManagementComponent } from './admin-orders-management.component';

describe('AdminOrdersManagementComponent', () => {
  let component: AdminOrdersManagementComponent;
  let fixture: ComponentFixture<AdminOrdersManagementComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdminOrdersManagementComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AdminOrdersManagementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
