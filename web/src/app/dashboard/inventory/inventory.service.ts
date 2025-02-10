import { HttpClient, HttpErrorResponse, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, map, Observable } from 'rxjs';

import { environment }  from '../../../environments/environment.development';

export interface Product {
  id?: string,
  name?: string,
  price?: number,
  qty?: number,
  description?: string,
  upsells_to?: string[],
  upsell_from?: string[],
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
/** Constants used to fill up our data base. */
readonly FRUITS: string[] = [
  'blueberry',
  'lychee',
  'kiwi',
  'mango',
  'peach',
  'lime',
  'pomegranate',
  'pineapple',
];
readonly NAMES: string[] = [
  'Maia',
  'Asher',
  'Olivia',
  'Atticus',
  'Amelia',
  'Jack',
  'Charlotte',
  'Theodore',
  'Isla',
  'Oliver',
  'Isabella',
  'Jasper',
  'Cora',
  'Levi',
  'Violet',
  'Arthur',
  'Mia',
  'Thomas',
  'Elizabeth',
];

  readonly PRODUCTS: Product[] = [
    { id: '4554451', name: 'Product1'},
    { id: '4554452', name: 'Product2'},
    { id: '4554453', name: 'Product3'},
    { id: '4554454', name: 'Product4'},
    { id: '4554455', name: 'Product5'},
    { id: '4554456', name: 'Product6'},
    { id: '4554457', name: 'Product7'},
  ];
  constructor(private httpClient: HttpClient) { }

  createNewUser(id: number): UserData {
    const name =
      this.NAMES[Math.round(Math.random() * (this.NAMES.length - 1))] +
      ' ' +
      this.NAMES[Math.round(Math.random() * (this.NAMES.length - 1))].charAt(0) +
      '.';
  
    return {
      id: id.toString(),
      name: name,
      progress: Math.round(Math.random() * 100).toString(),
      fruit: this.FRUITS[Math.round(Math.random() * (this.FRUITS.length - 1))],
    };
  }

  public postProduct = (product: Product): Observable<Product> => {
    return this.httpClient.post<Product>(`${environment.apiUrl}/api/product`, product, 
      { observe: 'response' }).pipe(
        map((response: HttpResponse<Product>) => {
          return response.body!;
        }),
        catchError((error: HttpErrorResponse) =>  { throw new Error(error.message); }),
      );
  };
}
