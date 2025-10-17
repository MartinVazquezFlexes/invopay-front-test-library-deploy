import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import {
  Filtros,
  SellFiltersService,
} from '../../services/sellFilters.service';
import { FormControl, FormGroup } from '@angular/forms';
import { sale } from '../../models/sale';
import { SellService } from '../../services/sell.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-sell-list',
  templateUrl: './sell-list.component.html',
  styleUrls: ['./sell-list.component.css'],
})
export class SellListComponent implements OnInit, OnDestroy {
  //
  constructor(
    private filtersService: SellFiltersService,
    private saleService: SellService
  ) {}

  private readonly router = inject(Router);

  //Creo los controls
  filtersForm!: FormGroup<{
    startDate: FormControl<string | null>;
    endDate: FormControl<string | null>;
  }>;

  //Uso de fechas para limitar el rango a 90 dias(3 meses)
  // y que la fecha Desde no sea mayor a Hasta,
  //  y que no se pueda poner una fecha mayor a hoy
  today: Date = new Date();
  todayString: string = this.today.toISOString().substring(0, 10); //para el maximo de fecha
  startDateMax: string = this.todayString; // máximo inicial para startDate
  startDateMin: string = new Date(
    this.today.getFullYear(),
    this.today.getMonth() - 1,
    this.today.getDate()
  )
    .toISOString()
    .substring(0, 10); // inicial: 1 mes atrás
  endDateMax: string = this.todayString; // máximo para endDate
  endDateMin: string = this.startDateMin; // mínimo para endDate inicialmente

  oneMonthAgo: Date = new Date();
  private subscription!: Subscription; //para borrar al destruir

  ngOnInit() {
    //Fechas iniciales del filtro / un mes atras / hoy /
    this.oneMonthAgo.setMonth(this.today.getMonth() - 1);

    //revisamos que venimos del sale-details
    const navigation = this.router.getCurrentNavigation();
    const keepFilters =
      navigation?.extras?.state?.['keepFilters'] ||
      history.state?.keepFilters ||
      false;



    //Los inicializo y obtengo los filtros
    let filters: Filtros;

    if (keepFilters) {
      //si vengo del detalle = cargo los filtros
      filters = this.filtersService.getFilters();

      //saco el keepFilters al navegar para evitar guardado de filtros
      //navegando a otras pantallas
      window.history.replaceState({}, '');
      //console.log('State limpiado');

    } else {
      //si no es del detalle = neuvos filtros(restart todo)
      filters = {
        startDateFilter: this.oneMonthAgo.toLocaleDateString('en-CA'),
        endDateFilter: this.today.toLocaleDateString('en-CA'),
        productFilter: undefined,
        brokerFilter: undefined,
        productIdFilter: undefined 
      };

      //reseteamos filtros
      this.filtersService.setFilters(filters);
    }

    this.filtersForm = new FormGroup({
      startDate: new FormControl(
        filters.startDateFilter || this.oneMonthAgo.toLocaleDateString('en-CA')
      ),
      endDate: new FormControl(
        filters.endDateFilter || this.today.toLocaleDateString('en-CA')
      ),
    });

    //Para limitar rangos de fechas
    this.updateDateRanges();
    this.filtersForm.get('startDate')?.valueChanges.subscribe(() => {
      this.updateDateRanges();
    });

    this.filtersForm.get('endDate')?.valueChanges.subscribe(() => {
      this.updateDateRanges();
    });

    //Me suscribo a los cambios de filtros y actualizo al cambiar
    //(cuando toco los botones se actualizan)
    this.subscription = this.filtersService.filtros$.subscribe((filtros) => {
      this.filtersForm.patchValue(
        {
          //Actualiza el form si limpio los filtros al cerrar el modal
          startDate:
            filtros.startDateFilter ||
            this.oneMonthAgo.toLocaleDateString('en-CA'),
          endDate:
            filtros.endDateFilter || this.today.toLocaleDateString('en-CA'),
        },
        { emitEvent: false }
      ); //para no disparar valueChanges

      this.applyFilters(filtros);
    });

    this.getSales();
  }

  showModal = false;

  //Info de la tabla
  tableData: sale[] = [];
  filteredSales: sale[] = [];
  getSales() {
    this.saleService.getSales().subscribe({
      next: (response) => {
        //convertir de number a string "ARS 13.000"
        this.tableData = response.content.map((s: sale) => ({
          ...s,
          saleDateToOrder: s.saleDate,
          amount: `${s.currency} ${Math.round(s.amount).toLocaleString()}`,
          policyAmount: `${s.currency} ${Math.round(
            s.policyAmount
          ).toLocaleString()}`,
          premiumAmount: `${s.currency} ${Math.round(
            s.premiumAmount
          ).toLocaleString()}`,
        })) as any; //cambiar a any porque deja de ser number

        this.filteredSales = this.tableData; //Lista que voy a filtrar

        //Al cargar le aplico los filtros que existan para la tabla
        const existingFilters = this.filtersService.getFilters();
        this.applyFilters(existingFilters);

        //this.updatePage();
      },
      error: (error) => {
        console.error(error);
      },
    });
  }

  //Encabezados
  propertyOrder = [
    'saleDate',
    'productName',
    'brokerName',
    'customerName',
    'policyAmount',
    'premiumAmount',
  ];

  //Por si queres traducir el encabezado
  keyTranslate = 'IP.ADMIN_TABLE';

  //Titulos
  titlesFile = new Map<string, string>([
    ['saleDate', 'Fecha Venta'],
    ['productName', 'Producto'],
    ['brokerName', 'Broker'],
    ['customerName', 'Cliente'],
    ['policyAmount', 'Poliza'],
    ['premiumAmount', 'Prima'],
  ]);

  //Acciones de la tabla
  actions: string[] = ['detail'];

  //Acciones de condicion
  actionsIf: any[] = [];

  //Inicializar la tabla
  initTable = true;

  //Si queremos scroll o no
  scroll = true;

  //Cuando se pulsa el boton de detalle le paso el
  // dataField que tiene la informacion del objeto
  onAction(event: any) {
    //console.log('Acción recibida:', event);
    this.router.navigate(['/invopay/sale-details'], {
      state: { data: event.dataField.id }, //objetoId seleccionado para mostrar en el detalle
    });
  }

  //Si seleccionamos items
  onSelectedItemsChange(items: any[]) {
    console.log('Items seleccionados:', items);
  }

  openModal() {
    this.showModal = true;
  }

  closeModal() {
    this.showModal = false;
  }

  updateDateRanges() {
    const startValue =
      this.filtersForm.get('startDate')?.value ??
      this.oneMonthAgo.toISOString().substring(0, 10);
    const endValue =
      this.filtersForm.get('endDate')?.value ??
      this.today.toISOString().substring(0, 10);

    const start = new Date(startValue);
    const end = new Date(endValue);

    //maximo 3 meses antes de end
    const startMin = new Date(end);
    startMin.setMonth(end.getMonth() - 3);

    this.startDateMin = startMin.toISOString().substring(0, 10);
    this.startDateMax = end.toISOString().substring(0, 10);

    //end no puede ser menor a start ni mayor a hoy
    this.endDateMin = start.toISOString().substring(0, 10);
    this.endDateMax = this.today.toISOString().substring(0, 10);
  }

  //Filtros

  applyDateFilters() {
    const val = this.filtersForm.value;

    const filtros: Filtros = {
      startDateFilter: val.startDate || undefined,
      endDateFilter: val.endDate || undefined,
    };

    //seteo para que se dispare el cambio
    this.filtersService.setFilters(filtros);
  }

  applyFilters(filters?: Filtros) {
    const appliedFilters: Filtros = filters ?? this.filtersService.getFilters();
    //console.log('Filtros:', appliedFilters);

    this.filteredSales = this.tableData.filter((sale) => {
      //acomodo todas las fechas a "yyyy/mm/dd"
      const saleDate = new Date(sale.saleDate);
      saleDate.setHours(0, 0, 0, 0);

      const start = appliedFilters.startDateFilter
        ? new Date(appliedFilters.startDateFilter)
        : null;
      start?.setHours(0, 0, 0, 0);

      const end = appliedFilters.endDateFilter
        ? new Date(appliedFilters.endDateFilter)
        : null;
      end?.setHours(0, 0, 0, 0);

      const productoOk =
        !appliedFilters.productFilter ||
        sale.productName
          .toLowerCase()
          .includes(appliedFilters.productFilter.toLowerCase());

      const brokerOk =
        !appliedFilters.brokerFilter ||
        sale.brokerName
          .toLowerCase()
          .includes(appliedFilters.brokerFilter.toLowerCase());

      const idOk =
        !appliedFilters.productIdFilter ||
        sale.productId === appliedFilters.productIdFilter;

      const desdeOk = !start || saleDate >= start;
      const hastaOk = !end || saleDate <= end;

      return desdeOk && hastaOk && productoOk && brokerOk && idOk;
    });

    this.currentPage = 1; //cargo la pagina 1 al filtrar
    this.updatePage(); //actualizo los items de la pagina 1
  }

  //Paginador
  /*
    Aca irian los datos de cantidad de items en tiempo real
    totalItems = total con filtros y sin
    items por pagina cambiar segun seleccion
    current pages seria tableData.lenght / itemsPerPage y rounded para arriba
  */
  pagedData: sale[] = [];
  currentPage = 1;
  itemsPerPage = 25;

  onPageChange(page: number) {
    this.currentPage = page;
    this.updatePage();
  }

  updatePage() {
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    const endIndex = startIndex + this.itemsPerPage;

    this.pagedData = this.filteredSales.slice(startIndex, endIndex);
  }

  onItemsPerPageChange(newValue: number) {
    this.itemsPerPage = newValue;
    this.currentPage = 1;
    this.updatePage();
  }

  onSort(event: any) {
  const sortKey = event.key; //revenueDateDisplay
  const sortEvent = event.event; //'asc', 'desc' o 'clean'

  //mapear al original
  const sortFieldMap: { [key: string]: string } = {
    'saleDate': 'saleDateToOrder'
  };

  const actualSortField = sortFieldMap[sortKey] || sortKey;

  if (sortEvent === 'clean') {
    this.applyFilters();
  } else {
    this.filteredSales.sort((a, b) => {
      let aValue = (a as any)[actualSortField];
      let bValue = (b as any)[actualSortField];

      //convertir a fecha para sort
      if (actualSortField === 'saleDateToOrder') {
        aValue = new Date(aValue).getTime();
        bValue = new Date(bValue).getTime();
      }

      if (aValue < bValue) return sortEvent === 'asc' ? -1 : 1;
      if (aValue > bValue) return sortEvent === 'asc' ? 1 : -1;
      return 0;
    });
  }

  this.currentPage = 1;
  this.updatePage();
}

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}
