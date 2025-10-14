export interface revenueDetails {
  id: number;
  revenueDate: string;
  currency: string;
  revenueAmount: number;
  paymentProvider: string;
  paymentChannel: string;
  isConsolidated: boolean;
  policyNunber: string;
  productName: string;
  premiumAmount: number;
  brokerName: string;
}

export interface RevenueDetail {
  transactionData: {
    revenueDate: string;
    currency: string;
    amount: number;
    paymentProvider: string;
    paymentChannel: string;
    transactionObservations: string;
  };
  conciliationData: {
    isConsolidated: boolean;
    productName: string;
    policyNumber: string;
    policyAmount: number;
    paymentNumber: number;
    paymentValue: number;
    brokerName: string;
  };
  policyData: {
    number: string;
    amount: number;
    saleDate: string;
    productName: string;
    premiumAmount: number;
    premiumPaymentInstallments: number | null;
    premiumPaymentPlan: PremiumPaymentInstallment[];
  };
}


export interface PremiumPaymentInstallment {
  installmentNumber: number;
  dueDate: string;
  amount: number;
  isPaid: boolean;
}

export interface detailRevenueTable{
  installmentNumber:number,
  dueDate: string,
  amount:string,
  isPaid: string,
}
