/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { RevenueFiltersService } from './revenueFilters.service';

describe('Service: RevenueFilters', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [RevenueFiltersService]
    });
  });

  it('should ...', inject([RevenueFiltersService], (service: RevenueFiltersService) => {
    expect(service).toBeTruthy();
  }));
});
