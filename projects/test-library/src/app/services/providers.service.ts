import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { PaymentEntity } from '../models/payment-entities';

@Injectable({
  providedIn: 'root'
})
export class ProvidersService {

  private readonly http: HttpClient = inject(HttpClient);
  private readonly providersUrl = 'https://api.130.211.34.27.nip.io/api/v1/invopay/';

  constructor() { }

  getPaymentEntities(): Observable<any> {
    return this.http.get<any>(`${this.providersUrl}revenue/payment-entities`);
  }

}
