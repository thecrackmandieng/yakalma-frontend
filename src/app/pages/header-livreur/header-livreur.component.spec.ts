import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HeaderLivreurComponent } from './header-livreur.component';

describe('HeaderLivreurComponent', () => {
  let component: HeaderLivreurComponent;
  let fixture: ComponentFixture<HeaderLivreurComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HeaderLivreurComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HeaderLivreurComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
