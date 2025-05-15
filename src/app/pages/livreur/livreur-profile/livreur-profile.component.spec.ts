import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LivreurProfileComponent } from './livreur-profile.component';

describe('LivreurProfileComponent', () => {
  let component: LivreurProfileComponent;
  let fixture: ComponentFixture<LivreurProfileComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LivreurProfileComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LivreurProfileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
