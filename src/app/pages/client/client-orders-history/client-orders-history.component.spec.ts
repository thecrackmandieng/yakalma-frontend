import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ClientOrdersHistoryComponent } from './client-orders-history.component';

describe('ClientOrdersHistoryComponent', () => {
  let component: ClientOrdersHistoryComponent;
  let fixture: ComponentFixture<ClientOrdersHistoryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ClientOrdersHistoryComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ClientOrdersHistoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
