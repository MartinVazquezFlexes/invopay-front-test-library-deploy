import { HttpClient, HttpHeaders } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { RevenueDetail, revenueDetails } from '../models/revenue';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class RevenueService {
private readonly http: HttpClient = inject(HttpClient);
private readonly revenueUrl = 'https://api.130.211.34.27.nip.io/api/v1/invopay/';

constructor() {}


//token: string = '';

getRevenues(){
  return this.http.get<any>(this.revenueUrl + 'revenue');
}

/*getRevenuesById(id: number) {
  const headers = new HttpHeaders({
    'Authorization': `Bearer ${this.token}`
  });

  return this.http.get<RevenueDetail>(`${this.revenueUrl}revenue/${id}`, { headers });
}*/

getRevenuesById(id: number): Observable<RevenueDetail> {
  return this.http.get<RevenueDetail>(`${this.revenueUrl}revenue/${id}`);
}

}
