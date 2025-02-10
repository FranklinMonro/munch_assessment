import { HttpClient, HttpErrorResponse, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, map, Observable, Subject } from 'rxjs';

import { environment }  from '../../../environments/environment.development';

export interface Product {
  id?: string,
  name?: string,
  price?: number,
  qty?: number,
  description?: string,
  upsells_to?: string[],
  active?: boolean,
}

export interface UserData {
  id: string;
  name: string;
  progress: string;
  fruit: string;
}

@Injectable({
  providedIn: 'root'
})
export class InventoryService {
 
  constructor(private httpClient: HttpClient) { }

  public postProduct = (product: Product): Observable<Product> => {
    return this.httpClient.post<Product>(`${environment.apiUrl}/api/products`, product, 
      { observe: 'response' }).pipe(
        map((response: HttpResponse<Product>) => {
          return response.body!;
        }),
        catchError((error: HttpErrorResponse) =>  { throw new Error(error.message); }),
      );
  };

  public getProducts = (): Observable<Product[]> => {
    return this.httpClient.get<Product[]>(`${environment.apiUrl}/api/products`, 
      { observe: 'response' }).pipe(
        map((response: HttpResponse<Product[]>) => {
          return response.body!;
        }),
        catchError((error: HttpErrorResponse) =>  { throw new Error(error.message); }),
      )
  };

  public patchProduct = (product: Product): Observable<any> => { 
    return this.httpClient.patch<any>(`${environment.apiUrl}/api/products`, product, 
      { observe: 'response' }).pipe(
        map((response: HttpResponse<any>) => {
          return response;
        }),
        catchError((error: HttpErrorResponse) =>  { throw new Error(error.message); }),
      );
  }
}
