import { HttpClient, HttpErrorResponse, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, map, Observable } from 'rxjs';

import { environment }  from '../../../environments/environment.development';
import { Product } from '../inventory/inventory.service';

@Injectable({
  providedIn: 'root'
})
export class StoreService {

  constructor(private httpClient: HttpClient) { }

  public postProduct = (product: Product[]): Observable<Product[]> => {
      return this.httpClient.post<Product[]>(`${environment.apiUrl}/api/products/buy`, product, 
        { observe: 'response' }).pipe(
          map((response: HttpResponse<Product[]>) => {
            return response.body!;
          }),
          catchError((error: HttpErrorResponse) =>  { throw new Error(error.message); }),
        );
    };
}
