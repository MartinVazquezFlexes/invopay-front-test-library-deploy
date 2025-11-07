import { Component, inject, OnDestroy, OnInit, Input } from '@angular/core';
import {
  InsurerFilters,
  InsurerFiltersService,
} from '../../../components/notifications/insurers/services/insurer-filters.service';
import { InsurerService } from '../../../components/notifications/insurers/services/insurer.service';
import { Router } from '@angular/router';
import { FormControl, FormGroup } from '@angular/forms';
import { Subscription } from 'rxjs';

// Tipo para identificar el contexto
export type NotificationContext = 'insurer' | 'broker';

@Component({
  selector: 'app-notifications-list',
  templateUrl: './notifications-list.component.html',
  styleUrls: ['./notifications-list.component.css'],
})
export class NotificationsListComponent implements OnInit, OnDestroy {
  // Input para identificar el contexto
  @Input() context: NotificationContext = 'insurer';

  constructor(
    private filtersService: InsurerFiltersService,
    private insurerService: InsurerService
  ) {}

  private readonly router = inject(Router);

  filtersForm!: FormGroup<{
    state: FormControl<string | null>;
    entity: FormControl<string | null>;
    name: FormControl<string | null>;
  }>;

  showModalDetail = false;
  showModalResponse = false;
  showReplySended = false;
  private subscription!: Subscription;

  ngOnInit() {
    let filters: InsurerFilters = {
      stateFilter: undefined,
      entityFilter: undefined,
      nameFilter: undefined,
    };

    this.filtersService.setFilters(filters);

    this.filtersForm = new FormGroup({
      state: new FormControl(filters.stateFilter || ''),
      entity: new FormControl(filters.entityFilter || ''),
      name: new FormControl(filters.nameFilter || ''),
    });

    this.subscription = this.filtersService.filters$.subscribe((filters) => {
      this.filtersForm.patchValue(
        {
          state: filters.stateFilter || '',
          entity: filters.entityFilter || '',
          name: filters.nameFilter || '',
        },
        { emitEvent: false }
      );

      this.applyFilters(filters);
    });

    this.getNotifications();
  }

  // Getter para obtener la etiqueta del campo "nombre" según contexto
  get nameFieldLabel(): string {
    return this.context === 'insurer' 
      ? 'IP.NOTIFICATIONS.BROKER_NAME' // "Nombre Corredor/Proveedor"
      : 'IP.NOTIFICATIONS.USER_NAME'; // "Nombre de usuario"
  }

  // Getter para obtener el título según contexto
  get pageTitle(): string {
    return this.context === 'insurer'
      ? 'IP.NOTIFICATIONS.TITLE_INSURER' // "Notificaciones - Aseguradora"
      : 'IP.NOTIFICATIONS.TITLE_BROKER'; // "Notificaciones - Corredor"
  }

  tableData: any[] = [];
  filteredNotifications: any[] = [];
  
  getNotifications() {
    // Aquí llamarías al servicio correspondiente según el contexto
    if (this.context === 'insurer') {
      this.getInsurerNotifications();
    } else {
      this.getBrokerNotifications();
    }
  }

  getInsurerNotifications() {
    // Datos de prueba para aseguradora
    this.tableData = [
      {
        id: 1,
        notificationDate: '2025-10-30 14:00',
        entity: 'Liquidación',
        brokerName: 'Corredor López',
        message: 'Consulta sobre liquidación pendiente',
        hasResponse: 'Si',
      },
      {
        id: 2,
        notificationDate: '2025-10-30 15:20',
        entity: 'Comisión',
        brokerName: 'Proveedor Pérez',
        message: 'Solicitud de aclaración de comisión',
        hasResponse: 'No',
      },
    ];
    
    this.filteredNotifications = this.tableData;
    const existingFilters = this.filtersService.getFilters();
    this.applyFilters(existingFilters);

    /* Llamada real al servicio
    this.insurerService.getInsurerNotifications().subscribe({
      next: (response) => {
        this.tableData = response.content;
        this.filteredNotifications = this.tableData;
        const existingFilters = this.filtersService.getFilters();
        this.applyFilters(existingFilters);
      },
      error: (error) => {
        console.error(error);
      },
    });
    */
  }

  getBrokerNotifications() {
    // Datos de prueba para corredor
    this.tableData = [
      {
        id: 1,
        notificationDate: '2025-10-30 14:00',
        entity: 'Factura',
        respondedUser: 'Usuario Admin',
        message: 'Respuesta sobre estado de factura',
        hasResponse: 'Si',
      },
      {
        id: 2,
        notificationDate: '2025-10-30 15:20',
        entity: 'Pago',
        respondedUser: 'Usuario Finanzas',
        message: 'Confirmación de pago procesado',
        hasResponse: 'No',
      },
    ];
    
    this.filteredNotifications = this.tableData;
    const existingFilters = this.filtersService.getFilters();
    this.applyFilters(existingFilters);

    /* Llamada real al servicio
    this.insurerService.getBrokerNotifications().subscribe({
      next: (response) => {
        this.tableData = response.content;
        this.filteredNotifications = this.tableData;
        const existingFilters = this.filtersService.getFilters();
        this.applyFilters(existingFilters);
      },
      error: (error) => {
        console.error(error);
      },
    });
    */
  }

  // Orden de propiedades adaptado según contexto
  get propertyOrder(): string[] {
    const baseOrder = [
      'notificationDate',
      'entity',
    ];
    
    // El nombre del campo cambia según el contexto
    const nameField = this.context === 'insurer' ? 'brokerName' : 'respondedUser';
    
    return [
      ...baseOrder,
      nameField,
      'message',
      'hasResponse',
    ];
  }

  keyTranslate = 'IP.ADMIN_TABLE';
  actions: string[] = ['search', 'comment'];
  actionsIf: any[] = [];
  initTable = false;
  scroll = true;

  detailId: number = 0;
  replyId: number = 0;
  
  onAction(event: any) {
    console.log('Acción recibida:', event);
    if(event.event == "search"){
      this.openModalDetail(event.dataField.id);
    } else {
      this.openModalResponse(event.dataField.id);
    }
  }

  // Mobile
  openMenuId: number | null = null;

  toggleMenu(id: number) {
    this.openMenuId = this.openMenuId === id ? null : id;
  }

  showFiltersOnMobile = false;

  toggleFilters() {
    this.showFiltersOnMobile = !this.showFiltersOnMobile;
  }

  onSelectedItemsChange(items: any[]) {
    console.log('Items seleccionados:', items);
  }

  openModalDetail(id: number) {
    this.detailId = id;
    this.showModalDetail = true;
  }

  closeModalDetail() {
    this.detailId = 0;
    this.showModalDetail = false;

    if (window.innerWidth <= 768) {
      this.showFiltersOnMobile = false;
    }
  }

  openModalResponse(id: number) {
    this.replyId = id;
    this.showModalResponse = true;
  }

  closeModalResponse() {
    this.replyId = 0;
    this.showModalResponse = false;

    if (window.innerWidth <= 768) {
      this.showFiltersOnMobile = false;
    }
  }

  showConfirmReplySend(){
    this.showReplySended = true;
    this.replyId = 0;
    this.showModalResponse = false;
    this.detailId = 0;
    this.showModalDetail = false;
  }

  closeConfirmReplySend(){
    this.showReplySended = false;
  }

  // Filtros
  applyNotificationsFilters() {
    const value = this.filtersForm.value;

    const filters: InsurerFilters = {
      stateFilter: value.state || undefined,
      entityFilter: value.entity || undefined,
      nameFilter: value.name || undefined,
    };

    this.filtersService.setFilters(filters);

    if (window.innerWidth <= 768) {
      this.showFiltersOnMobile = false;
    }
  }

  applyFilters(filters?: InsurerFilters) {
    const appliedFilters: InsurerFilters =
      filters ?? this.filtersService.getFilters();

    const nameField = this.context === 'insurer' ? 'brokerName' : 'userName';

    this.filteredNotifications = this.tableData.filter(
      (notification) => {
        const stateOk =
          !appliedFilters.stateFilter ||
          notification.hasResponse
            .toLowerCase()
            .includes(appliedFilters.stateFilter.toLowerCase());

        const entityOk =
          !appliedFilters.entityFilter ||
          notification.entity
            .toLowerCase()
            .includes(appliedFilters.entityFilter.toLowerCase());

        const nameOk =
          !appliedFilters.nameFilter ||
          notification[nameField]
            .toLowerCase()
            .includes(appliedFilters.nameFilter.toLowerCase());

        return stateOk && entityOk && nameOk;
      }
    );

    this.currentPage = 1;
    this.updatePage();
  }

  cleanFilters() {
    this.filtersForm.setValue({
      state: '',
      entity: '',
      name: '',
    });

    this.filtersService.setFilters({
      stateFilter: '',
      entityFilter: '',
      nameFilter: '',
    });
  }

  // Paginador
  pagedData: any[] = [];
  currentPage = 1;
  itemsPerPage = 25;

  onPageChange(page: number) {
    this.currentPage = page;
    this.updatePage();
  }

  updatePage() {
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    const endIndex = startIndex + this.itemsPerPage;

    this.pagedData = this.filteredNotifications.slice(startIndex, endIndex);
  }

  onItemsPerPageChange(newValue: number) {
    this.itemsPerPage = newValue;
    this.currentPage = 1;
    this.updatePage();
  }

  onSort(event: any) {
    const sortKey = event.key;
    const sortEvent = event.event;

    const sortFieldMap: { [key: string]: string } = {
      notificationDate: 'notificationDate',
    };

    const actualSortField = sortFieldMap[sortKey] || sortKey;

    if (sortEvent === 'clean') {
      this.applyFilters();
    } else {
      this.filteredNotifications.sort((a, b) => {
        let aValue = (a as any)[actualSortField];
        let bValue = (b as any)[actualSortField];

        if (actualSortField === 'notificationDate') {
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
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }
}