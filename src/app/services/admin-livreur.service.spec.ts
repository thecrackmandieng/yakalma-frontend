import { TestBed } from '@angular/core/testing';

import { AdminLivreurService } from './admin-livreur.service';

describe('AdminLivreurService', () => {
  let service: AdminLivreurService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AdminLivreurService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
