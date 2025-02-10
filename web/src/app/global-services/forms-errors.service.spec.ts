import { TestBed } from '@angular/core/testing';

import { FormsErrorsService } from './forms-errors.service';

describe('FormsErrorsService', () => {
  let service: FormsErrorsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(FormsErrorsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
