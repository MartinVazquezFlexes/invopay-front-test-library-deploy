import { HttpClient, HttpHeaders } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { sale, SaleDetails } from '../models/sale';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SellService {

private readonly salesUrl = 'https://api.130.211.34.27.nip.io/api/v1/invopay/';

constructor(
  private http: HttpClient) {}

//token: string = '';

getSales(){
  return this.http.get<any>(this.salesUrl + 'sale');
}

/*getSaleById(id: number) {
  const headers = new HttpHeaders({
    'Authorization': `Bearer ${this.token}`
  });

  return this.http.get<SaleDetails>(`${this.salesUrl}sale/${id}`, { headers });
}*/

getSaleById(id: number): Observable<SaleDetails> {
  return this.http.get<SaleDetails>(`${this.salesUrl}sale/${id}`);
}

}
