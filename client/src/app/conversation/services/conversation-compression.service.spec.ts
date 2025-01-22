import { TestBed } from '@angular/core/testing';

import { ConversationCompressionService } from './conversation-compression.service';

describe('ConversationCompressionService', () => {
  let service: ConversationCompressionService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ConversationCompressionService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
