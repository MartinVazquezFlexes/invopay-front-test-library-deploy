/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { SchemeService } from './scheme.service';

describe('Service: Scheme', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [SchemeService]
    });
  });

  it('should ...', inject([SchemeService], (service: SchemeService) => {
    expect(service).toBeTruthy();
  }));
});
