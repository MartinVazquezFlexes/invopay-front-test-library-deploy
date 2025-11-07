import { Component, inject, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { SellService } from '../services/sell.service';
import { detailSaleTable, SaleDetails } from '../models/sale';


@Component({
  selector: 'app-sell-details',
  templateUrl: './sell-details.component.html',
  styleUrls: ['./sell-details.component.scss'],
})
export class SellDetailsComponent implements OnInit {
  constructor(private saleService: SellService) {}

  private readonly router = inject(Router);

  saleDetails: SaleDetails = {
    //objeto obtenido de la API
    id: 0,
    amount: 0,
    saleDate: null,
    currency: '',
    customer: {
      externalId: '',
      firstName: '',
      lastName: '',
      email: '',
      phoneNumber: '',
      fullName: '',
    },
    brokerId: 0,
    brokerName: '',
    brokerNameBussiness: '',
    productId: '',
    productName: '',
    premiumPaymentInstallments: null,
    policyData: {
      number: '',
      amount: 0,
      saleDate: null,
      productName: null,
      premiumAmount: 0,
      premiumPaymentInstallments: null,
      premiumPaymentPlan: [],
    },
  };
  saleDetailsFormatted!: any; //objeto formateado con montos formateados
    //this.saleDetails.policyData.premiumPaymentPlan //aca esta la info de la cuota
  tableData: detailSaleTable[]=[];

  //reactiveForm para los inputs
  detailedInfoForm: FormGroup = new FormGroup({
    // Información detallada
    saleDate: new FormControl(
      { value: '', disabled: true },
      Validators.required
    ),
    productName: new FormControl(
      { value: '', disabled: true },
      Validators.required
    ),
    premiumAmount: new FormControl(
      { value: '', disabled: true },
      Validators.required
    ),
    brokerCommission: new FormControl(
      { value: '', disabled: true },
      Validators.required
    ),
    policyNumber: new FormControl(
      { value: '', disabled: true },
      Validators.required
    ),
    policyAmount: new FormControl(
      { value: '', disabled: true },
      Validators.required
    ),
    commissionPercentage: new FormControl(
      { value: '', disabled: true },
      Validators.required
    ),
    // Información del cliente
    customerName: new FormControl(
      { value: '', disabled: true },
      Validators.required
    ),
    customerPhoneNumber: new FormControl(
      { value: '', disabled: true },
      Validators.required
    ),
    customerEmail: new FormControl(
      { value: '', disabled: true },
      Validators.required
    ),
  });



  ngOnInit() {
    const data = history.state.data;
    //console.log('Datos recibidos:', data);
    this.getSaleToShow(data);
  }

  //Info de la tabla
  //dataTable!: any; //Informacion para la tabla


  /*Datos que necesito: 
  - installmentNumber (Nro Cuota)
  - amount (Valor)
  - dueDate (Fecha Vencimiento)
  - isPaid (Estado: Pagada/No Pagada)
  Datos que no estan ahi:
  - commission (Comisión: SI/NO)
  - commissionAmount (Valor Comisión)
  - payedDate (Fecha de Pago)
  */
  
  //Encabezados
  propertyOrder = [
    'installmentNumber',
    'amount',
    'dueDate',
    'isPaid',
    'commission',
    'commissionAmount',
    'payedDate',
  ];

  //Por si queres traducir el encabezado
  keyTranslate = 'IP.ADMIN_TABLE';

  //Titulos
  /*titlesFile = new Map<string, string>([
    ['installmentNumber', 'Nro Cuota'],
    ['amount', 'Valor'],
    ['dueDate', 'Fecha Vencimiento'],
    ['isPaid', 'Estado'],
    ['commission', 'Comisión'],
    ['commissionAmount', 'Valor Comisión'],
    ['payedDate', 'Fecha Pago'],
  ]);*/

  //Acciones de la tabla
  actions: string[] = [''];

  //Acciones de condicion
  actionsIf: any[] = [];

  //Inicializar la tabla
  initTable = false;

  //Si queremos scroll o no
  scroll = true;

  //Cuando se pulsa el boton de detalle le paso el
  // dataField que tiene la informacion del objeto
  onAction(event: any) {
    console.log('Acción recibida:', event);
  }

  //Si seleccionamos items
  onSelectedItemsChange(items: any[]) {
    console.log('Items seleccionados:', items);
  }

  // getter para acceder a cualquier control
  getControl(controlName: string): FormControl {
    return this.detailedInfoForm.get(controlName) as FormControl;
  }



  getSaleToShow(id: number) {
    this.saleService.getSaleById(id).subscribe({
      next: (response) => {
        this.saleDetails = response;

        //convertir de number a string "ARS 13.000"
        const currency = this.saleDetails.currency;

        //le doy formato al precio
        this.saleDetailsFormatted = {
          ...this.saleDetails,
          amount: `${currency} ${Math.round(
            this.saleDetails.amount
          ).toLocaleString()}`,
          commissionPercentage:
            (this.saleDetails.amount / this.saleDetails.policyData.amount) *
            100,
          policyData: {
            ...this.saleDetails.policyData,
            amount: `${currency} ${Math.round(
              this.saleDetails.policyData.amount
            ).toLocaleString()}`,
            premiumAmount: `${currency} ${Math.round(
              this.saleDetails.policyData.premiumAmount
            ).toLocaleString()}`,
            premiumPaymentPlan:
              this.saleDetails.policyData.premiumPaymentPlan.map((plan) => ({
                ...plan,
                amount: `${currency} ${Math.round(plan.amount).toLocaleString()}`,
              })),
          },
        };

        this.setFormValues();
        this.setTableData();
        
      },
      error: (error) => {
        console.error(error);
      },
    });
  }

    setFormValues() {
    if (!this.saleDetailsFormatted) return;

    this.detailedInfoForm.patchValue({
      // Información detallada
      saleDate: this.saleDetailsFormatted.saleDate
        ? this.saleDetailsFormatted.saleDate.split('T')[0]
        : '',
      productName: this.saleDetailsFormatted.productName,
      premiumAmount: this.saleDetailsFormatted.policyData?.premiumAmount || '',
      brokerCommission: `${this.saleDetailsFormatted.amount || ''}`,
      policyNumber: this.saleDetailsFormatted.policyData?.number || '',
      policyAmount: this.saleDetailsFormatted.policyData?.amount || '',
      commissionPercentage: `${
        this.saleDetailsFormatted.commissionPercentage || 0
      }%`,
      // Información del cliente
      customerName: this.saleDetails.customer.fullName || '',
      customerPhoneNumber: this.saleDetails.customer.phoneNumber || '',
      customerEmail: this.saleDetails.customer.email || '',
    });
  }



  //this.saleDetails.policyData.premiumPaymentPlan //aca esta la info de la cuota
  /*Datos que necesito: 
  - installmentNumber (Nro Cuota)
  - amount (Valor)
  - dueDate (Fecha Vencimiento)
  - isPaid (Estado: Pagada/No Pagada)
  Datos que no estan ahi:
  - commission (Comisión: SI/NO)
  - commissionAmount (Valor Comisión)
  - payedDate (Fecha de Pago)
  */
  setTableData(){
  const currency = this.saleDetails.currency;

  this.tableData = this.saleDetails.policyData.premiumPaymentPlan.map((installment) => {
    const isPaid = installment.isPaid;

    //pasar amounts a ARS 13.601
    const formattedAmount = `${currency} ${Math.round(Number(installment.amount)).toLocaleString()}`;
    const formattedCommissionAmount = isPaid
      ? `${currency} ${Math.round(this.saleDetails.amount).toLocaleString()}`
      : '';

    return {
      installmentNumber: installment.installmentNumber,
      amount: formattedAmount,
      dueDate: installment.dueDate.split('T')[0],
      isPaid: isPaid ? 'Pagada' : 'No Pagada',
      commission: isPaid ? 'Sí' : 'No',
      commissionAmount: formattedCommissionAmount,
      payedDate: isPaid ? installment.dueDate.split('T')[0] : '',}; 
  });
  
  //console.log('Datos de la tabla:', this.tableData);
  }

  //le aviso que mantenga los filtros al volver del detalle unicamente
  back() {
  this.router.navigate(['/invopay/sales-list'], { 
    state: { keepFilters: true } 
  });
  }

    onSort(event: any) {
  const sortKey = event.key; //revenueDateDisplay
  const sortEvent = event.event; //'asc', 'desc' o 'clean'

  //mapear al original
  const sortFieldMap: { [key: string]: string } = {
    'dueDate': 'dueDate'
  };

  const actualSortField = sortFieldMap[sortKey] || sortKey;

  if (sortEvent === 'clean') {
    this.tableData = [...this.tableData];
  } else {
    this.tableData.sort((a, b) => {
      let aValue = (a as any)[actualSortField];
      let bValue = (b as any)[actualSortField];

      //convertir a fecha para sort
      if (actualSortField === 'dueDate') {
        aValue = new Date(aValue).getTime();
        bValue = new Date(bValue).getTime();
      }

      if (aValue < bValue) return sortEvent === 'asc' ? -1 : 1;
      if (aValue > bValue) return sortEvent === 'asc' ? 1 : -1;
      return 0;
    });
  }
}

}
