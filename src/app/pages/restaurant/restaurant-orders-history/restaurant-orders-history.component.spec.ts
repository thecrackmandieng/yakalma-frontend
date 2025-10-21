import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RestaurantOrdersHistoryComponent } from './restaurant-orders-history.component';

describe('RestaurantOrdersHistoryComponent', () => {
  let component: RestaurantOrdersHistoryComponent;
  let fixture: ComponentFixture<RestaurantOrdersHistoryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RestaurantOrdersHistoryComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RestaurantOrdersHistoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
