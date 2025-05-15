import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConnexionLivreurComponent } from './connexion-livreur.component';

describe('ConnexionLivreurComponent', () => {
  let component: ConnexionLivreurComponent;
  let fixture: ComponentFixture<ConnexionLivreurComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ConnexionLivreurComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ConnexionLivreurComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
