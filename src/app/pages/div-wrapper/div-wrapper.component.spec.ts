import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DivWrapperComponent } from './div-wrapper.component';

describe('DivWrapperComponent', () => {
  let component: DivWrapperComponent;
  let fixture: ComponentFixture<DivWrapperComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DivWrapperComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DivWrapperComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
