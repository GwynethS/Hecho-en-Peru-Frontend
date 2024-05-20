import { TestBed } from '@angular/core/testing';

import { LocalCraftsmenService } from './local-craftsmen.service';

describe('LocalCraftsmenService', () => {
  let service: LocalCraftsmenService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(LocalCraftsmenService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
