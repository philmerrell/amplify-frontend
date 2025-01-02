import { TestBed } from '@angular/core/testing';

import { DeveloperSettingsService } from './developer-settings.service';

describe('DeveloperSettingsService', () => {
  let service: DeveloperSettingsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DeveloperSettingsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
