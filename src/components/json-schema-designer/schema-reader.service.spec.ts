import { TestBed, inject } from '@angular/core/testing';

import { SchemaReaderService } from './schema-reader.service';

describe('SchemaReaderService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [SchemaReaderService]
    });
  });

  it('should be created', inject([SchemaReaderService], (service: SchemaReaderService) => {
    expect(service).toBeTruthy();
  }));
});
