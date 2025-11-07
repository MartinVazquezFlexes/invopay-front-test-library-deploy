import { Component, OnInit } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { ProvidersService } from '../services/providers.service';
import { PaymentEntity } from '../models/payment-entities';
import { FormControl } from '@angular/forms';
import IpSelectInputOption from 'dist/base/lib/interfaces/ip-select-input-option';

@Component({
  selector: 'app-providers',
  templateUrl: './providers.component.html',
  styleUrls: ['./providers.component.scss'], 
})
export class ProvidersComponent implements OnInit {
  constructor(private providerService: ProvidersService, private sanitizer: DomSanitizer) {}

  //Encabezados
  propertyOrder = [
    'logoUrl',
    'name',
    'paymentChannels',
    'isPaymentEntityActive',
    'description',
  ];

  //Por si queres traducir el encabezado
  keyTranslate = 'IP.ADMIN_TABLE';

  //Titulos
  /*titlesFile = new Map<string, string>([
    ['logoUrl', 'Logo'],
    ['name', 'Nombre'],
    ['paymentProvider', 'Proveedor'],
    ['paymentChannels', 'Canales de Pago'],
    ['isPaymentEntityActive', 'Activo'],
    ['description', 'Descripción'],
  ]);*/

  //Acciones de la tabla
  //actions: string[] = ['detail'];

  //Acciones de condicion
  actionsIf: any[] = [];

  //Inicializar la tabla
  initTable = false;

  //Si queremos scroll o no
  scroll = true;

  //Cuando se pulsa el boton de detalle le paso el
  // dataField que tiene la informacion del objeto
  onAction(event: any) {
    //console.log('Acción recibida:', event);
  }

  //Si seleccionamos items
  onSelectedItemsChange(items: any[]) {
    console.log('Items seleccionados:', items);
  }

  tableData: PaymentEntity[] = [];

  ngOnInit() {
    this.getPaymentEntities();
  }

  getPaymentEntities() {
    this.providerService.getPaymentEntities().subscribe({
      next: (response) => {
        this.tableData = response.content;
        //console.log('Proveedores: ', this.tableData);

        this.tableData = response.content.map((paymentEntity: PaymentEntity) => ({
          ...paymentEntity,
          logoUrl: paymentEntity.logoUrl,
          isPaymentEntityActive: paymentEntity.isActive ? 'Si' : 'No', //mostrar si/no segun isActive

        })) as any; //cambiar a any porque deja de ser number

        this.currentPage = 1; //cargo la pagina 1
        this.updatePage(); //actualizo los items de la pagina 1
      },
    });
  }

  //Paginador
  /*
          Aca irian los datos de cantidad de items en tiempo real
          totalItems = total con filtros y sin
          items por pagina cambiar segun seleccion
          current pages seria tableData.lenght / itemsPerPage y rounded para arriba
  */
  pagedData: PaymentEntity[] = [];
  currentPage = 1;
  itemsPerPage = 15;

  onPageChange(page: number) {
    this.currentPage = page;
    this.updatePage();
  }

  updatePage() {
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    const endIndex = startIndex + this.itemsPerPage;

    this.pagedData = this.tableData.slice(startIndex, endIndex);
  }

  itemsPerPageControl = new FormControl('15');
  pageOptions: IpSelectInputOption[] = [
    { value: '10', label: '10' },
    { value: '15', label: '15' },
    { value: '20', label: '20' },
    { value: '25', label: '25' },
  ];
  onItemsPerPageChange(newValue: any) {
    console.log(newValue);
    this.itemsPerPage = Number(newValue);
    this.itemsPerPageControl.setValue(newValue); //sincroniza el control
    this.currentPage = 1;
    this.updatePage();
  }
}
