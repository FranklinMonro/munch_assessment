import { HttpClient, HttpErrorResponse, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, map, Observable } from 'rxjs';

import { environment }  from '../../../environments/environment.development';

export interface History {
  id: string,
  items?: object;
  invoice_date: Date,
}
@Injectable({
  providedIn: 'root'
})
export class HistoryService {

  constructor(private httpClient: HttpClient) { }

  public getHistory = (): Observable<History[]> => {
    return this.httpClient.get<History[]>(`${environment.apiUrl}/api/products/history`, 
      { observe: 'response' }).pipe(
        map((response: HttpResponse<History[]>) => {
          return response.body!;
        }),
        catchError((error: HttpErrorResponse) =>  { throw new Error(error.message); }),
      );
  };
}
