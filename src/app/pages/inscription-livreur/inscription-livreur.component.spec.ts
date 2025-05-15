import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InscriptionLivreurComponent } from './inscription-livreur.component';

describe('InscriptionLivreurComponent', () => {
  let component: InscriptionLivreurComponent;
  let fixture: ComponentFixture<InscriptionLivreurComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [InscriptionLivreurComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(InscriptionLivreurComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
