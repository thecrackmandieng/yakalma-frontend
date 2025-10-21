import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RestaurantMenuManagementComponent } from './restaurant-menu-management.component';

describe('RestaurantMenuManagementComponent', () => {
  let component: RestaurantMenuManagementComponent;
  let fixture: ComponentFixture<RestaurantMenuManagementComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RestaurantMenuManagementComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RestaurantMenuManagementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
