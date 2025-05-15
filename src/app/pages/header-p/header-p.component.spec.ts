import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HeaderPComponent } from './header-p.component';

describe('HeaderPComponent', () => {
  let component: HeaderPComponent;
  let fixture: ComponentFixture<HeaderPComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HeaderPComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HeaderPComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
