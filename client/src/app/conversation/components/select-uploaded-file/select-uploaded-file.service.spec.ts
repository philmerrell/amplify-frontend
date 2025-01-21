import { TestBed } from '@angular/core/testing';

import { SelectUploadedFileService } from './select-uploaded-file.service';

describe('SelectUploadedFileService', () => {
  let service: SelectUploadedFileService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SelectUploadedFileService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
