import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InscriptionPartenaireComponent } from './inscription-partenaire.component';

describe('InscriptionPartenaireComponent', () => {
  let component: InscriptionPartenaireComponent;
  let fixture: ComponentFixture<InscriptionPartenaireComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [InscriptionPartenaireComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(InscriptionPartenaireComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
