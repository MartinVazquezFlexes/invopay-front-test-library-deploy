import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

//creo los filtros
export interface InsurerFilters {
  stateFilter?: string;
  entityFilter?: string;
  nameFilter?: string;
}

@Injectable({
  providedIn: 'root'
})
export class InsurerFiltersService {

//Filtros para el listado de ventas
//Para poder unir filtros de fecha y filtros del modal
//Uso de observables - subject

constructor() { }

  private filtersSubject = new BehaviorSubject<InsurerFilters>({}); //Creamos el sujeto
  filters$ = this.filtersSubject.asObservable(); //Me suscribo a sus cambios

  setFilters(filters: InsurerFilters) { //Actualizo filtros
    this.filtersSubject.next({ ...this.filtersSubject.value, ...filters });
  }

  getFilters() { //Recuperar los filtros
    return this.filtersSubject.value;
  }



}