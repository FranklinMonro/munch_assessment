import { Injectable } from '@angular/core';

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
  constructor() { }

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
}
