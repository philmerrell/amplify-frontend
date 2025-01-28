import { TestBed } from '@angular/core/testing';

import { BasePromptService } from './base-prompt.service';

describe('BasePromptService', () => {
  let service: BasePromptService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(BasePromptService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
