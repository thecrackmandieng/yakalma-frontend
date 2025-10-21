import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InscriptionLCompletComponent } from './inscription-l-complet.component';

describe('InscriptionLCompletComponent', () => {
  let component: InscriptionLCompletComponent;
  let fixture: ComponentFixture<InscriptionLCompletComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [InscriptionLCompletComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(InscriptionLCompletComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
