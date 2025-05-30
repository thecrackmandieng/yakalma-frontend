import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InscriptionPCompletComponent } from './inscription-p-complet.component';

describe('InscriptionPCompletComponent', () => {
  let component: InscriptionPCompletComponent;
  let fixture: ComponentFixture<InscriptionPCompletComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [InscriptionPCompletComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(InscriptionPCompletComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
