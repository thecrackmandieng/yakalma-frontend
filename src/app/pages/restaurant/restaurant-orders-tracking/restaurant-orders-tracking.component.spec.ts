import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RestaurantOrdersTrackingComponent } from './restaurant-orders-tracking.component';

describe('RestaurantOrdersTrackingComponent', () => {
  let component: RestaurantOrdersTrackingComponent;
  let fixture: ComponentFixture<RestaurantOrdersTrackingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RestaurantOrdersTrackingComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RestaurantOrdersTrackingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
