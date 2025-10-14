import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';


//creo los filtros
export interface FiltrosRevenue {
  paymentChannelFilter?: string;
  startDateFilter?: string;
  endDateFilter?: string;
}

@Injectable({
  providedIn: 'root'
})
export class RevenueFiltersService {

constructor() { }

  private filtersRevenueSubject = new BehaviorSubject<FiltrosRevenue>({}); //Creamos el sujeto
  filtros$ = this.filtersRevenueSubject.asObservable(); //Me suscribo a sus cambios

  setFilters(filtros: FiltrosRevenue) { //Actualizo filtros
    this.filtersRevenueSubject.next({ ...this.filtersRevenueSubject.value, ...filtros });
  }

  getFilters() { //Recuperar los filtros
    return this.filtersRevenueSubject.value;
  }

}
