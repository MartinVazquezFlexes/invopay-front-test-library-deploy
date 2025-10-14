export interface sale{
    id:number,
    amount:number,
    saleDate: string, 
    currency: string, 
    customerId: string, 
    customerName: string, 
    brokerId:number,
    brokerName:string,
    brokerNameBussiness:string,
    productId:string,
    productName:string,
    policyAmount:number,
    policyNumber:string,
    premiumPaymentInstallments:number,
    premiumAmount:number
}


export interface SaleDetails {
  id: number;
  amount: number;
  saleDate: string | null;
  currency: string;
  customer: Customer;
  brokerId: number;
  brokerName: string;
  brokerNameBussiness: string;
  productId: string;
  productName: string;
  premiumPaymentInstallments: number | null;
  policyData: PolicyData;
}

export interface Customer {
  externalId: string;
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  fullName: string;
}

export interface PolicyData {
  number: string;
  amount: number;
  saleDate: string | null;
  productName: string | null;
  premiumAmount: number;
  premiumPaymentInstallments: number | null;
  premiumPaymentPlan: PremiumPaymentInstallment[];
}

export interface PremiumPaymentInstallment {
  installmentNumber: number;
  dueDate: string;
  amount: number;
  isPaid: boolean;
}

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
export interface detailSaleTable{
  installmentNumber:number,
  amount:string,
  dueDate: string,
  isPaid: string,
  commission:string,
  commissionAmount: string,
  payedDate: string
}