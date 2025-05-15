import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ClientRestaurantsComponent } from './client-restaurants.component';

describe('ClientRestaurantsComponent', () => {
  let component: ClientRestaurantsComponent;
  let fixture: ComponentFixture<ClientRestaurantsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ClientRestaurantsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ClientRestaurantsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
