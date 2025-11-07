import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import {
  RevenueFilters,
  RevenueFiltersService,
} from '../services/revenueFilters.service';
import IpSelectInputOption from 'dist/base/lib/interfaces/ip-select-input-option';

@Component({
  selector: 'app-list-filters-revenue',
  templateUrl: './list-filters-revenue.component.html',
  styleUrls: ['./list-filters-revenue.component.scss'],
})
export class ListFiltersRevenueComponent implements OnInit {
  constructor(private filtersService: RevenueFiltersService) {}

  //Creo los controls
  filtersModalForm!: FormGroup<{
    paymentChannel: FormControl<string | null>;
  }>;

  ngOnInit() {
    //Los inicializo y obtengo los filtros
    const filters = this.filtersService.getFilters();
    this.filtersModalForm = new FormGroup({
      paymentChannel: new FormControl(filters.paymentChannelFilter || ''),
    });
  }

  @Output() close = new EventEmitter<void>();

  // getter para acceder a cualquier control
  getControl(controlName: string): FormControl {
    return this.filtersModalForm.get(controlName) as FormControl;
  }

  //Filtros
  selectOptions: IpSelectInputOption[] = [
    { value: 'Todos', label: 'Todos' },
    { value: 'Transferencia', label: 'Transferencia' },
    { value: 'Tarjeta', label: 'Tarjeta' },
    { value: 'Boleto', label: 'Boleto' },
    { value: 'Efectivo', label: 'Efectivo' },
    { value: 'Cheque', label: 'Cheque' },
  ];
  onChangeSelected(newValue: any) {
    this.getControl('paymentChannel').setValue(newValue); //sincroniza el control
  }

  cleanFilters() {
    const today = new Date();
    const oneMonthAgo = new Date();
    oneMonthAgo.setMonth(today.getMonth() - 1);
    //Actualizar tabla
    // Resetear FormGroup
    this.filtersModalForm.setValue({
      paymentChannel: '',
    });

    //Restart el service
    this.filtersService.setFilters({
      startDateFilter: oneMonthAgo.toLocaleDateString('en-CA'),
      endDateFilter: today.toLocaleDateString('en-CA'),
      paymentChannelFilter: '',
    });

    this.close.emit();
  }

  applyFilters() {
    const filters = this.filtersService.getFilters();
    //console.log('Filtros:', filters);
    //filtrar por los datos obtenidos
    //Actualizar tabla
    const val = this.filtersModalForm.value;

    const filtersApply: RevenueFilters = {
      paymentChannelFilter:
        val.paymentChannel === 'Todos'
          ? undefined
          : val.paymentChannel ?? undefined,
    };

    //guardo los filtros y cierro
    this.filtersService.setFilters(filtersApply);

    this.close.emit();
  }
}
