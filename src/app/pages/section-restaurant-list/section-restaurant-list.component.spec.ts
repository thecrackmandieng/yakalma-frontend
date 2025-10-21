import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SectionRestaurantListComponent } from './section-restaurant-list.component';

describe('SectionRestaurantListComponent', () => {
  let component: SectionRestaurantListComponent;
  let fixture: ComponentFixture<SectionRestaurantListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SectionRestaurantListComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SectionRestaurantListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
