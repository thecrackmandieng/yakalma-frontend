import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RestaurantListeComponent } from './restaurant-liste.component';

describe('RestaurantListeComponent', () => {
  let component: RestaurantListeComponent;
  let fixture: ComponentFixture<RestaurantListeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RestaurantListeComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RestaurantListeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
