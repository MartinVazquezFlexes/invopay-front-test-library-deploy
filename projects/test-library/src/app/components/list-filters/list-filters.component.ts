import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import {
  Filtros,
  SellFiltersService,
} from '../../services/sellFilters.service';
import { FormControl, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-list-filters',
  templateUrl: './list-filters.component.html',
  styleUrls: ['./list-filters.component.css'],
})
export class ListFiltersComponent implements OnInit {
  constructor(private filtersService: SellFiltersService) {}

  //Creo los controls
  filtersModalForm!: FormGroup<{
    idProducto: FormControl<string | null>;
    producto: FormControl<string | null>;
    broker: FormControl<string | null>;
  }>;

  ngOnInit() {
    //Los inicializo y obtengo los filtros
    const filters = this.filtersService.getFilters();
    this.filtersModalForm = new FormGroup({
      idProducto: new FormControl(filters.productIdFilter || ''),
      producto: new FormControl(filters.productFilter || ''),
      broker: new FormControl(filters.brokerFilter || ''),
    });
  }

  @Output() close = new EventEmitter<void>();

  //Filtros

  cleanFilters() {
    const today = new Date();
    const oneMonthAgo = new Date();
    oneMonthAgo.setMonth(today.getMonth() - 1);
    //Actualizar tabla
    // Resetear FormGroup
    this.filtersModalForm.setValue({
      idProducto: '',
      producto: '',
      broker: '',
    });

    //Restart el service
    this.filtersService.setFilters({
      startDateFilter: oneMonthAgo.toLocaleDateString('en-CA'),
      endDateFilter: today.toLocaleDateString('en-CA'),
      productIdFilter: '',
      productFilter: '',
      brokerFilter: '',
    });

    this.close.emit();
  }

  applyFilters() {
    const filters = this.filtersService.getFilters();
    //console.log('Filtros:', filters);
    //filtrar por los datos obtenidos
    //Actualizar tabla
    const val = this.filtersModalForm.value;

    const filtros: Filtros = {
      productIdFilter: val.idProducto || undefined,
      productFilter: val.producto || undefined,
      brokerFilter: val.broker || undefined,
    };

    //guardo los filtros y cierro
    this.filtersService.setFilters(filtros);

    this.close.emit();
  }
}
