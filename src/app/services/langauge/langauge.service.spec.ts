import { TestBed } from '@angular/core/testing';

import { LangaugeService } from './langauge.service';

describe('LangaugeService', () => {
  let service: LangaugeService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(LangaugeService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
