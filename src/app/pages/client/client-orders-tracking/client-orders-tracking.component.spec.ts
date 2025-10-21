import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ClientOrdersTrackingComponent } from './client-orders-tracking.component';

describe('ClientOrdersTrackingComponent', () => {
  let component: ClientOrdersTrackingComponent;
  let fixture: ComponentFixture<ClientOrdersTrackingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ClientOrdersTrackingComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ClientOrdersTrackingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
