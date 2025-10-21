import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LivreurDeliveriesHistoryComponent } from './livreur-deliveries-history.component';

describe('LivreurDeliveriesHistoryComponent', () => {
  let component: LivreurDeliveriesHistoryComponent;
  let fixture: ComponentFixture<LivreurDeliveriesHistoryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LivreurDeliveriesHistoryComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LivreurDeliveriesHistoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
