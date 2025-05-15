import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LivreurPubComponent } from './livreur-pub.component';

describe('LivreurPubComponent', () => {
  let component: LivreurPubComponent;
  let fixture: ComponentFixture<LivreurPubComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LivreurPubComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LivreurPubComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
