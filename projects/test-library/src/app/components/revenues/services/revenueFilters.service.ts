import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';


//creo los filtros
export interface RevenueFilters {
  paymentChannelFilter?: string;
  startDateFilter?: string;
  endDateFilter?: string;
}

@Injectable({
  providedIn: 'root'
})
export class RevenueFiltersService {

constructor() { }

  private filtersRevenueSubject = new BehaviorSubject<RevenueFilters>({}); //Creamos el sujeto
  filters$ = this.filtersRevenueSubject.asObservable(); //Me suscribo a sus cambios

  setFilters(filters: RevenueFilters) { //Actualizo filtros
    this.filtersRevenueSubject.next({ ...this.filtersRevenueSubject.value, ...filters });
  }

  getFilters() { //Recuperar los filtros
    return this.filtersRevenueSubject.value;
  }

}
