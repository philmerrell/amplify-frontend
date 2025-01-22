import { TestBed } from '@angular/core/testing';

import { ConversationRenameService } from './conversation-rename.service';

describe('ConversationRenameService', () => {
  let service: ConversationRenameService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ConversationRenameService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
