import { TestBed } from '@angular/core/testing';

import { RefreshTimerService } from './refresh-timer.service';

describe('RefreshTimerService', () => {
  let service: RefreshTimerService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(RefreshTimerService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
