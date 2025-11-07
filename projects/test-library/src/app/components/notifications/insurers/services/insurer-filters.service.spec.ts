/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { InsurerFiltersService } from './insurer-filters.service';

describe('Service: InsurerFilters', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [InsurerFiltersService]
    });
  });

  it('should ...', inject([InsurerFiltersService], (service: InsurerFiltersService) => {
    expect(service).toBeTruthy();
  }));
});
