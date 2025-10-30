/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { SellFiltersService } from './sellFilters.service';

describe('Service: SellFilters', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [SellFiltersService]
    });
  });

  it('should ...', inject([SellFiltersService], (service: SellFiltersService) => {
    expect(service).toBeTruthy();
  }));
});
