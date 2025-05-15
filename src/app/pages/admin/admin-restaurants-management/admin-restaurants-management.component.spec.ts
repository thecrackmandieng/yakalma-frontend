import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminRestaurantsManagementComponent } from './admin-restaurants-management.component';

describe('AdminRestaurantsManagementComponent', () => {
  let component: AdminRestaurantsManagementComponent;
  let fixture: ComponentFixture<AdminRestaurantsManagementComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdminRestaurantsManagementComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AdminRestaurantsManagementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
