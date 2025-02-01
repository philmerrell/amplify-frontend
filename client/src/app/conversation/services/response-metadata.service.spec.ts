import { TestBed } from '@angular/core/testing';

import { ResponseMetadataService } from './response-metadata.service';

describe('ResponseMetadataService', () => {
  let service: ResponseMetadataService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ResponseMetadataService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
