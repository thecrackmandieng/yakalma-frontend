import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HeaderLComponent } from './header-l.component';

describe('HeaderLComponent', () => {
  let component: HeaderLComponent;
  let fixture: ComponentFixture<HeaderLComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HeaderLComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HeaderLComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
