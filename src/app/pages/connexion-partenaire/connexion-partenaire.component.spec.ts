import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConnexionPartenaireComponent } from './connexion-partenaire.component';

describe('ConnexionPartenaireComponent', () => {
  let component: ConnexionPartenaireComponent;
  let fixture: ComponentFixture<ConnexionPartenaireComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ConnexionPartenaireComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ConnexionPartenaireComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
