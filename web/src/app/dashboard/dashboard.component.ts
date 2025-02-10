import { Component, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthLogIn } from '../authenticate/authenticate.interface';

import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatSidenavModule } from '@angular/material/sidenav';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-dashboard',
  imports: [
    CommonModule,
    RouterModule,
    MatButtonModule,
    MatIconModule,
    MatListModule,
    MatToolbarModule,
    MatTooltipModule,
    MatSidenavModule
  ],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss'
})
export class DashboardComponent {
  // @ViewChild('sidenav') sidenav: MatSidenav | undefined;
  isExpanded: boolean = true;
  
  isShowing: boolean = false;
  
  userData: AuthLogIn = JSON.parse(localStorage.getItem('userInfo')!);
  firstName: String | undefined;
  surnName: String | undefined;

  navItems = [
    { role: ['seller'], toolTip: 'Invetory', link: 'inventory', icon: 'inventory_2', navName: 'Invetory' },
    { role: ['seller', 'buyer'], toolTip: 'Store', link: 'store', icon: 'storefront', navName: 'Store' },
    { role: ['seller', 'buyer'], toolTip: 'History', link: 'history', icon: 'history', navName: 'History' },
  ];

  constructor() {}

  logOut() {
    console.log('Logging out');
  }
}
