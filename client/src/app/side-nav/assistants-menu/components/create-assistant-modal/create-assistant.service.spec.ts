import { TestBed } from '@angular/core/testing';

import { CreateAssistantService } from './create-assistant.service';

describe('CreateAssistantService', () => {
  let service: CreateAssistantService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CreateAssistantService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
