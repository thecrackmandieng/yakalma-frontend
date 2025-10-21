import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PartenairePubComponent } from './partenaire-pub.component';

describe('PartenairePubComponent', () => {
  let component: PartenairePubComponent;
  let fixture: ComponentFixture<PartenairePubComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PartenairePubComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PartenairePubComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
