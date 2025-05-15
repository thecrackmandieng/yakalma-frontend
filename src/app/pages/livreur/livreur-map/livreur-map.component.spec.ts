import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LivreurMapComponent } from './livreur-map.component';

describe('LivreurMapComponent', () => {
  let component: LivreurMapComponent;
  let fixture: ComponentFixture<LivreurMapComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LivreurMapComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LivreurMapComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
