import { TestBed } from '@angular/core/testing';

import { AssistantService } from '../side-nav/assistants-menu/assistant.service';

describe('AssistantService', () => {
  let service: AssistantService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AssistantService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
