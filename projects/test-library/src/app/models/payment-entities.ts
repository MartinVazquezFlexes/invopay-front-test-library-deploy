export interface PaymentEntity{
    id: number,
    name: string,
    logoUrl: string,
    paymentChannels: string[],
    isActive: boolean,
    description: string
}