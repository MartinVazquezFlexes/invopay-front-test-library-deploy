
import { Component, inject, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { RevenueService } from '../../services/revenue.service';
import { detailRevenueTable, PremiumPaymentInstallment, RevenueDetail } from '../../models/revenue';
import { FormControl, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-collection-details',
  templateUrl: './collection-details.component.html',
  styleUrls: ['./collection-details.component.css']
})
export class CollectionDetailsComponent implements OnInit {

  constructor(private revenueService : RevenueService) { }

  private readonly router = inject(Router)

  //objeto que viene de la API
revenueDetails: RevenueDetail = {
  transactionData: {
    revenueDate: '',
    currency: '',
    amount: 0,
    paymentProvider: '',
    paymentChannel: '',
    transactionObservations: ''
  },
  conciliationData: {
    isConsolidated: false,
    productName: '',
    policyNumber: '',
    policyAmount: 0,
    paymentNumber: 0,
    paymentValue: 0,
    brokerName: ''
  },
  policyData: {
    number: '',
    amount: 0,
    saleDate: '',
    productName: '',
    premiumAmount: 0,
    premiumPaymentInstallments: null,
    premiumPaymentPlan: []
  }
};

revenueDetailsFormatted!: any; //objeto formateado con montos formateados
isRevenueConsolidated: boolean = true;
//this.saleDetails.policyData.premiumPaymentPlan //aca esta la info de la cuota
tableData: detailRevenueTable[] = [];

  //reactiveForm para los inputs
  detailedInfoForm: FormGroup = new FormGroup({
    revenueDate: new FormControl(
      { value: '', disabled: true },
      Validators.required
    ),
    amountRevenue: new FormControl(
      { value: '', disabled: true },
      Validators.required
    ),
    paymentChannel: new FormControl(
      { value: '', disabled: true },
      Validators.required
    ),
    paymentEntity: new FormControl(
      { value: '', disabled: true },
      Validators.required
    ),
    transactionObservations: new FormControl(
      { value: '', disabled: true },
      Validators.required
    ),
    isConsolidated: new FormControl(
      { value: '', disabled: true },
      Validators.required
    ),
    policyNumber: new FormControl(
      { value: '', disabled: true },
      Validators.required
    ),
    productName: new FormControl(
      { value: '', disabled: true },
      Validators.required
    ),
    amountPolicy: new FormControl(
      { value: '', disabled: true },
      Validators.required
    ),
    brokerName: new FormControl(
      { value: '', disabled: true },
      Validators.required
    ),
    payNumber: new FormControl(
      { value: '', disabled: true },
      Validators.required
    ),
    payAmount: new FormControl(
      { value: '', disabled: true },
      Validators.required
    ),
    productNamePolicy: new FormControl(
      { value: '', disabled: true },
      Validators.required
    ),
    policyNumberPol: new FormControl(
      { value: '', disabled: true },
      Validators.required
    ),
    amountPolPolicy: new FormControl(
      { value: '', disabled: true },
      Validators.required
    ),
    saleDate: new FormControl(
      { value: '', disabled: true },
      Validators.required
    ),
    premiumAmount: new FormControl(
      { value: '', disabled: true },
      Validators.required
    ),
  });



  //Encabezados
  propertyOrder = ['installmentNumber', 'dueDate', 'amount'];

  //Por si queres traducir el encabezado
  keyTranslate = 'IP.ADMIN_TABLE';

  //Titulos
  /*titlesFile = new Map<string,string>([
    ['installmentNumber', 'Nro Cuota'],
    ['dueDate', 'Fecha Vencimiento'],
    ['amount', 'Valor'],
  ]);*/


  //Acciones de la tabla
  actions: string[] = [''];

  //Acciones de condicion
  actionsIf: any[] = [];

  //Inicializar la tabla
  initTable = true;

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

  ngOnInit() { 
    const data = history.state.data;
    //console.log('Datos recibidos:', data);
    this.getRevenueToShow(data);
  }

    // getter para acceder a cualquier control
  getControl(controlName: string): FormControl {
    return this.detailedInfoForm.get(controlName) as FormControl;
  }


  getRevenueToShow(id: number){
    this.revenueService.getRevenuesById(id).subscribe({
      next: (response) => {
        this.revenueDetails = response;

        if(this.revenueDetails.conciliationData == null && this.revenueDetails.policyData == null){
          this.isRevenueConsolidated = false;
        }

        //convertir de number a string "ARS 13.000"
        const currency = this.revenueDetails.transactionData.currency;

        //le doy formato al precio de todas
        if(this.isRevenueConsolidated){
          this.revenueDetailsFormatted = {
          ...this.revenueDetails,
          transactionData: {
            ...this.revenueDetails.transactionData,
            revenueDate: this.formatDate(this.revenueDetails.transactionData.revenueDate),
            amount: `${currency} ${Math.round(
              this.revenueDetails.transactionData.amount
            ).toLocaleString()}`,
          },

          conciliationData:{
            ...this.revenueDetails.conciliationData,
            policyAmount: `${currency} ${Math.round(
              this.revenueDetails.conciliationData.policyAmount
            ).toLocaleString()}`,
            paymentValue: `${currency} ${Math.round(
              this.revenueDetails.conciliationData.paymentValue
            ).toLocaleString()}`,
            isConsolidated: this.revenueDetails.conciliationData.isConsolidated ? 'SI' : 'NO',
          },
          policyData:{
            ...this.revenueDetails.policyData,
            amount: `${currency} ${Math.round(
              this.revenueDetails.policyData.amount
            ).toLocaleString()}`,
            premiumAmount: `${currency} ${Math.round(
              this.revenueDetails.policyData.premiumAmount
            ).toLocaleString()}`,
            premiumPaymentPlan:
              this.revenueDetails.policyData.premiumPaymentPlan.map((p) => ({
                ...p,
                amount: `${currency} ${Math.round(p.amount).toLocaleString()}`,
              })),
          }
        };
        }
        else{
          this.revenueDetailsFormatted = {
          ...this.revenueDetails,
          transactionData: {
            ...this.revenueDetails.transactionData,
            revenueDate: this.formatDate(this.revenueDetails.transactionData.revenueDate),
            amount: `${currency} ${Math.round(
              this.revenueDetails.transactionData.amount
            ).toLocaleString()}`,
          },
        };
        }
      
        this.setFormValues();
        this.setTableData();
      }
    })
  }


  setFormValues() {
    if (!this.revenueDetailsFormatted) return;

    this.detailedInfoForm.patchValue({
      //transaccion
      revenueDate: this.revenueDetailsFormatted.transactionData?.revenueDate || '',
      amountRevenue: this.revenueDetailsFormatted.transactionData?.amount || '',
      paymentChannel: this.revenueDetailsFormatted.transactionData?.paymentChannel || '',
      paymentEntity: this.revenueDetailsFormatted.transactionData?.paymentProvider || '',
      transactionObservations: this.revenueDetailsFormatted.transactionData?.transactionObservations || '',
      
      //conciliacion
       //isConsolidated - productName - policyNumber
       //  amountPolicy  - payNumber - payAmount - brokerName
      isConsolidated: this.revenueDetailsFormatted.conciliationData?.isConsolidated || '',
      productName: this.revenueDetailsFormatted.conciliationData?.productName || '',
      policyNumber: this.revenueDetailsFormatted.conciliationData?.policyNumber || '',
      amountPolicy: this.revenueDetailsFormatted.conciliationData?.policyAmount || '',
      payNumber: this.revenueDetailsFormatted.conciliationData?.paymentNumber || '',
      payAmount: this.revenueDetailsFormatted.conciliationData?.paymentValue || '',
      brokerName: this.revenueDetailsFormatted.conciliationData?.brokerName || '',

      //poliza
       //productNamePolicy - policyNumberPol - amountPolPolicy - 
       // saleDate - premiumAmount
      productNamePolicy: this.revenueDetailsFormatted.policyData?.productName || '',
      policyNumberPol: this.revenueDetailsFormatted.policyData?.number || '',
      amountPolPolicy: this.revenueDetailsFormatted.policyData?.amount || '',
      saleDate: this.revenueDetailsFormatted.policyData?.saleDate
        ? this.revenueDetailsFormatted.policyData?.saleDate.split('T')[0]
        : '',
      premiumAmount: this.revenueDetailsFormatted.policyData?.premiumAmount || '',
    });
  }

setTableData(){
  //validar que sea consolidada
  if (!this.isRevenueConsolidated) {
    this.tableData = [];
    return;
  }

  //cargo la tabla
  this.tableData = this.revenueDetails.policyData.premiumPaymentPlan.map((installment) => {
    const isPaid = installment.isPaid;
    const currency = this.revenueDetails.transactionData.currency;
    const formattedAmount = `${currency} ${Math.round(Number(installment.amount)).toLocaleString()}`;
    
    return {
      installmentNumber: installment.installmentNumber,
      dueDate: installment.dueDate.split('T')[0],
      amount: formattedAmount,
      isPaid: isPaid ? 'Pagada' : 'No Pagada',
    }; 
  });
}


  //Navegar entre secciones
  showTransaction = true; //La que empieza siempre por default
  showConciliation = false;
  showPolicy = false;
  activeSection: string = 'transaction'; //Para remarcar la seccion donde estoy

  showTransactionSection(){
    this.showTransaction = true; //Mostrar
    this.showConciliation = false;
    this.showPolicy = false;
    this.activeSection = 'transaction';
  }

  showConciliationSection(){
    this.showTransaction = false;
    this.showConciliation = true; //Mostrar
    this.showPolicy = false;
    this.activeSection = 'conciliation';
  }

  showPolicySection(){
    this.showTransaction = false; 
    this.showConciliation = false; 
    this.showPolicy = true; //Mostrar
    this.activeSection = 'policy';
  }


  //le aviso que mantenga los filtros al volver del detalle unicamente
  back() {
    this.router.navigate(['/invopay/revenues-list'], { 
      state: { keepFilters: true } 
    });
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

}
