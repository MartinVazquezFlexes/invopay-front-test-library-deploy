import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Scheme, SchemeDetails } from '../models/scheme';

@Injectable({
  providedIn: 'root'
})
export class SchemeService {

private readonly baseUrl = 'https://api.130.211.34.27.nip.io/api/v1/invopay/';

constructor(private http: HttpClient) {}

//GetAll
getSchemes(){
  return this.http.get<any>(this.baseUrl + 'commission-schemes');
}


//GetById
getSchemeById(id: number): Observable<any> { //Usar SchemeDetails
  return this.http.get<any>(`${this.baseUrl}commission-schemes/${id}`);
}


//UpdateStatus
patchScheme(id: number): Observable<any> {
  return this.http.patch<any>(`${this.baseUrl}commission-schemes/${id}/activation`, {});
}


}
