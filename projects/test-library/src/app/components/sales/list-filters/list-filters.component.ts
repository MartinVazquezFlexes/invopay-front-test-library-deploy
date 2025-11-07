import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { SaleFilters, SellFiltersService } from '../services/sellFilters.service';
import IpSelectInputOption from 'dist/base/lib/interfaces/ip-select-input-option';

@Component({
  selector: 'app-list-filters',
  templateUrl: './list-filters.component.html',
  styleUrls: ['./list-filters.component.scss'],
})
export class ListFiltersComponent implements OnInit {
  constructor(private filtersService: SellFiltersService) {}

  //Creo los controls
  filtersModalForm!: FormGroup<{
    productId: FormControl<string | null>;
    productName: FormControl<string | null>;
    broker: FormControl<string | null>;
  }>;

  ngOnInit() {
    //Los inicializo y obtengo los filtros
    const filters = this.filtersService.getFilters();
    this.filtersModalForm = new FormGroup({
      productId: new FormControl(filters.productIdFilter || ''),
      productName: new FormControl(filters.productFilter || ''),
      broker: new FormControl(filters.brokerFilter || ''),
    });
  }

  @Output() close = new EventEmitter<void>();


    // getter para acceder a cualquier control
  getControl(controlName: string): FormControl {
    return this.filtersModalForm.get(controlName) as FormControl;
  }

  //Filtros

  selectOptions: IpSelectInputOption[] = [
      { value: 'Juan Pérez', label: 'Juan Pérez' },
      { value: 'Sofía Gómez', label: 'Sofía Gómez' },
      { value: 'María Rodríguez', label: 'María Rodríguez' },
    ];
    onChangeSelected(newValue: any) {
      this.getControl('broker').setValue(newValue); //sincroniza el control
    }

  cleanFilters() {
    const today = new Date();
    const oneMonthAgo = new Date();
    oneMonthAgo.setMonth(today.getMonth() - 1);
    //Actualizar tabla
    // Resetear FormGroup
    this.filtersModalForm.setValue({
      productId: '',
      productName: '',
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
    const value = this.filtersModalForm.value;

    const filtersApply: SaleFilters = {
      productIdFilter: value.productId || undefined,
      productFilter: value.productName || undefined,
      brokerFilter: value.broker || undefined,
    };

    //guardo los filtros y cierro
    this.filtersService.setFilters(filtersApply);

    this.close.emit();
  }
}
