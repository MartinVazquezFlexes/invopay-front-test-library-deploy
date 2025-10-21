import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { RevenueService } from '../../services/revenue.service';
import {
  RevenueFilters,
  RevenueFiltersService,
} from '../../services/revenueFilters.service';
import { FormControl, FormGroup } from '@angular/forms';
import { Subscription } from 'rxjs';
import { revenueDetails } from '../../models/revenue';

@Component({
  selector: 'app-collections-list',
  templateUrl: './collections-list.component.html',
  styleUrls: ['./collections-list.component.css'],
})
export class CollectionsListComponent implements OnInit, OnDestroy {
  constructor(
    private filtersService: RevenueFiltersService,
    private revenueService: RevenueService
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
    let filters: RevenueFilters;

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
        paymentChannelFilter: undefined,
        startDateFilter: this.oneMonthAgo.toLocaleDateString('en-CA'),
        endDateFilter: this.today.toLocaleDateString('en-CA'),
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
    this.subscription = this.filtersService.filters$.subscribe((filters) => {
      this.filtersForm.patchValue(
        {
          //Actualiza el form si limpio los filtros al cerrar el modal
          startDate:
            filters.startDateFilter ||
            this.oneMonthAgo.toLocaleDateString('en-CA'),
          endDate:
            filters.endDateFilter || this.today.toLocaleDateString('en-CA'),
        },
        { emitEvent: false }
      ); //para no disparar valueChanges

      this.applyFilters(filters);
    });

    this.getRevenues();
  }

  
  //Recibir la info de los filtros y guardarla en observable para no perderla al navegar


  //Encabezados
  propertyOrder = [
    'revenueDateDisplay',
    'revenueAmount',
    'paymentProvider',
    'paymentChannel',
    'isConsolidated',
    'policyNumber',
    'productName',
    'premiumAmount',
    'brokerName', //Consolidada SI
  ];

  //Por si queres traducir el encabezado
  keyTranslate = 'IP.ADMIN_TABLE';

  //Titulos
  /*titlesFile = new Map<string, string>([
    ['revenueDateDisplay', 'Fecha'],
    ['revenueAmount', 'Recaudado'],
    ['paymentProvider', 'Proveedor'],
    ['paymentChannel', 'Canal Pago'],
    ['isConsolidated', 'Consolidada'],
    ['policyNumber', 'Nro Poliza'],
    ['productName', 'Producto'],
    ['premiumAmount', 'Prima'],
    ['brokerName', 'Broker'],
  ]);*/

  //Acciones de la tabla
  actions: string[] = ['detail'];

  //Acciones de condicion
  actionsIf: any[] = [];

  //Inicializar la tabla
  initTable = true;

  //Si queremos scroll o no
  scroll = true;


  //MODAL
  showModal = false;
  openModal() {
    this.showModal = true;
  }

  closeModal() {
    this.showModal = false;
  }

  //Cuando se pulsa el boton de detalle le paso el
  // dataField que tiene la informacion del objeto
  onAction(event: any) {
    //console.log('Acción recibida:', event);
    this.router.navigate(['/invopay/revenue-details'], {
      state: { data: event.dataField.id }, //objeto seleccionado para mostrar en el detalle
    });
  }

  openMenuId: number | null = null;

  toggleMenu(id: number) {
    this.openMenuId = this.openMenuId === id ? null : id;
  }

  toDetails(id:number){
    this.router.navigate(['/invopay/revenue-details'], {
      state: { data: id }, //objeto seleccionado para mostrar en el detalle
    });
  }

  //Si seleccionamos items
  onSelectedItemsChange(items: any[]) {
    console.log('Items seleccionados:', items);
  }

  //Info de la tabla
  tableData: revenueDetails[] = [];
  filteredRevenues: revenueDetails[] = [];
  getRevenues() {
    this.revenueService.getRevenues().subscribe({
      next: (response) => {
        //convertir de number a string "ARS 13.000"
        this.tableData = response.content.map((revenue: revenueDetails) => ({
          ...revenue,
          revenueDate: revenue.revenueDate, //la que voy a filtrar
          revenueDateDisplay: this.formatDate(revenue.revenueDate), //la que voy a mostrar
          revenueAmount: `${revenue.currency} ${Math.round(
            revenue.revenueAmount
          ).toLocaleString()}`,

          isConsolidated: revenue.isConsolidated ? 'Si' : 'No',

          //if isConsolidated = false entonces "-" 
          premiumAmount: revenue.isConsolidated ? `${revenue.currency} ${Math.round(
            revenue.premiumAmount,
          ).toLocaleString()}` : '-'
        })) as any; //cambiar a any porque deja de ser number

        this.filteredRevenues = this.tableData; //Lista que voy a filtrar

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


  applyFilters(filters?: RevenueFilters) {
    const appliedFilters: RevenueFilters =
      filters ?? this.filtersService.getFilters();
    //console.log('Filtros:', appliedFilters);

        //parsear fechas correctamente
    const parseDate = (dateValue: string | Date | null | undefined): Date | null => {
      if (!dateValue) return null;

      let date: Date;

      if (dateValue instanceof Date) {
        date = new Date(dateValue);
      } else {
        //Es un string
        const dateStr = dateValue.toString().trim();
        
        //Si tiene T (formato ISO), extraer solo la parte YYYY-MM-DD
        if (dateStr.includes('T')) {
          //"2025-09-23T00:00:00" -> "2025-09-23"
          const datePart = dateStr.split('T')[0];
          const [year, month, day] = datePart.split('-').map(Number);
          date = new Date(year, month - 1, day);
        } else {
          //Formato YYYY-MM-DD
          const [year, month, day] = dateStr.split('-').map(Number);
          date = new Date(year, month - 1, day);
        }
      }

      //Normalizar a medianoche
      date.setHours(0, 0, 0, 0);
      return date;
    };

    this.filteredRevenues = this.tableData.filter((revenue) => {
      //acomodo todas las fechas a "yyyy/mm/dd"
      const revenueDate = parseDate(revenue.revenueDate);
      const start = parseDate(appliedFilters.startDateFilter);
      const end = parseDate(appliedFilters.endDateFilter);

      //Si no pudo parsear la fecha de venta, excluir
      if (!revenueDate) return false;

      const paymentChannelOk =
        !appliedFilters.paymentChannelFilter ||
        revenue.paymentChannel
          .toLowerCase()
          .includes(appliedFilters.paymentChannelFilter.toLowerCase());

      const startOk = !start || revenueDate >= start;
      const endOk = !end || revenueDate <= end;

      return startOk && endOk && paymentChannelOk;
    });

    this.currentPage = 1; //cargo la pagina 1 al filtrar
    this.updatePage(); //actualizo los items de la pagina 1
  }

    //Filtros

  applyDateFilters() {
    const value = this.filtersForm.value;
    const filters: RevenueFilters = {
      startDateFilter: value.startDate || undefined,
      endDateFilter: value.endDate || undefined,
    };

    //seteo para que se dispare el cambio
    this.filtersService.setFilters(filters);
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



  //Paginador
  /*
        Aca irian los datos de cantidad de items en tiempo real
        totalItems = total con filtros y sin
        items por pagina cambiar segun seleccion
        current pages seria tableData.lenght / itemsPerPage y rounded para arriba
      */
  pagedData: revenueDetails[] = [];
  currentPage = 1;
  itemsPerPage = 50;

  onPageChange(page: number) {
    this.currentPage = page;
    this.updatePage();
  }

  updatePage() {
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    const endIndex = startIndex + this.itemsPerPage;

    this.pagedData = this.filteredRevenues.slice(startIndex, endIndex);
  }

onItemsPerPageChange(newValue: any) {
  this.itemsPerPage = Number(newValue);
  this.currentPage = 1;
  this.updatePage();
}

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }



    //formatear fecha para mostrar
  private formatDate(dateString: string): string {
  const date = new Date(dateString);
  
  const day = date.getDate().toString().padStart(2, '0');
  const month = (date.getMonth() + 1).toString().padStart(2, '0');
  const year = date.getFullYear();
  
  const hours = date.getHours().toString().padStart(2, '0');
  const minutes = date.getMinutes().toString().padStart(2, '0');
  const seconds = date.getSeconds().toString().padStart(2, '0');
  
  return `${day}/${month}/${year} ${hours}:${minutes}:${seconds}`;
}

onSort(event: any) {
  const sortKey = event.key; //revenueDateDisplay
  const sortEvent = event.event; //'asc', 'desc' o 'clean'

  //mapear al original
  const sortFieldMap: { [key: string]: string } = {
    'revenueDateDisplay': 'revenueDate'
  };

  const actualSortField = sortFieldMap[sortKey] || sortKey;

  if (sortEvent === 'clean') {
    this.applyFilters();
  } else {
    this.filteredRevenues.sort((a, b) => {
      let aValue = (a as any)[actualSortField];
      let bValue = (b as any)[actualSortField];

      //convertir a fecha para sort
      if (actualSortField === 'revenueDate') {
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

}
