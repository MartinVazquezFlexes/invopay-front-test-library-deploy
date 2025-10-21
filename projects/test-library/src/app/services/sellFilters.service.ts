import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

//creo los filtros
export interface SaleFilters {
  startDateFilter?: string;
  endDateFilter?: string;
  productIdFilter?: string;
  productFilter?: string;
  brokerFilter?: string;
}

@Injectable({
  providedIn: 'root'
})
export class SellFiltersService {

//Filtros para el listado de ventas
//Para poder unir filtros de fecha y filtros del modal
//Uso de observables - subject

constructor() { }

  private filtersSubject = new BehaviorSubject<SaleFilters>({}); //Creamos el sujeto
  filters$ = this.filtersSubject.asObservable(); //Me suscribo a sus cambios

  setFilters(filters: SaleFilters) { //Actualizo filtros
    this.filtersSubject.next({ ...this.filtersSubject.value, ...filters });
  }

  getFilters() { //Recuperar los filtros
    return this.filtersSubject.value;
  }



}
