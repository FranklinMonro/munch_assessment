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
import { AuthService } from '../authenticate/authenticate.service';

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
    { toolTip: 'Invetory', link: 'inventory', icon: 'inventory_2', navName: 'Invetory' },
    { toolTip: 'Store', link: 'store', icon: 'storefront', navName: 'Store' },
    { toolTip: 'History', link: 'history', icon: 'history', navName: 'History' },
  ];

  constructor(private authService: AuthService) {}

  logOut() {
    console.log('Logging out');
    this.authService.postLogOut();
  }
}
