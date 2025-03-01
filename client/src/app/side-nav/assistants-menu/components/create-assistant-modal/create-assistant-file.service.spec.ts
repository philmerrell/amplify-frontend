import { TestBed } from '@angular/core/testing';

import { CreateAssistantFileService } from './create-assistant-file.service';

describe('CreateAssistantFileService', () => {
  let service: CreateAssistantFileService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CreateAssistantFileService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
