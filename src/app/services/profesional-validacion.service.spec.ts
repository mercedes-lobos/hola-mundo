import { TestBed } from '@angular/core/testing';

import { ProfesionalValidacionService } from './profesional-validacion.service';

describe('ProfesionalValidacionService', () => {
  let service: ProfesionalValidacionService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ProfesionalValidacionService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
