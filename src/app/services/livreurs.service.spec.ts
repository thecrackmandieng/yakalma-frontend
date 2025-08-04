import { TestBed } from '@angular/core/testing';

import { LivreursService } from './livreurs.service';

describe('LivreursService', () => {
  let service: LivreursService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(LivreursService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
