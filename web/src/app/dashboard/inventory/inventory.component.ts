import { AfterViewInit, Component, inject, OnInit, ViewChild } from '@angular/core';

import { MatButtonModule } from '@angular/material/button';
import { MatDialog } from '@angular/material/dialog';
import { MatDividerModule } from '@angular/material/divider';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatPaginatorModule, MatPaginator } from '@angular/material/paginator';
import { MatSortModule, MatSort } from '@angular/material/sort';
import { MatTableModule, MatTableDataSource} from '@angular/material/table';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

import { InventoryService, Product, UserData } from './inventory.service';
import { InventoryDialogComponent } from './inventory-dialog/inventory-dialog/inventory-dialog.component';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-inventory',
  imports: [
    MatButtonModule,
    MatDividerModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
    MatPaginatorModule,
    MatSortModule,
    MatTableModule,
    MatProgressSpinnerModule,
  ],
  templateUrl: './inventory.component.html',
  styleUrl: './inventory.component.scss'
})
export class InventoryComponent implements OnInit, AfterViewInit {
  @ViewChild(MatPaginator) paginator: MatPaginator | undefined;
  @ViewChild(MatSort) sort: MatSort | undefined;

  loadSpinner: boolean = false;
  displayedColumns: string[] = ['name', 'price', 'qty', 'description', 'edit'];
  dataSource: MatTableDataSource<Product> | undefined;
  readonly dialog = inject(MatDialog);
  constructor(
    private inventoryService: InventoryService,
    private readonly toastr: ToastrService,
  ) {}

  ngOnInit(): void {
    this.getList();
  }

  ngAfterViewInit() {
    if (this.paginator) {
      this.dataSource!.paginator = this.paginator!;
      this.dataSource!.sort = this.sort!;
    }
  }

  getList() {
    this.loadSpinner = true;
    this.inventoryService.getProducts().subscribe({
      next: (response: Product[]) => {
        this.dataSource = new MatTableDataSource(response);
        this.dataSource!.paginator = this.paginator!;
        this.dataSource!.sort = this.sort!;
        this.loadSpinner = false;
      },
      error: (error: Error) => {
        console.error(error);
        this.toastr.error('Error loading products');
        this.loadSpinner = false;
      },
    })
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    if (this.dataSource) {
      this.dataSource.filter = filterValue.trim().toLowerCase();
    }

    if (this.dataSource && this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  addProduct() {
    const dialogRef = this.dialog.open(InventoryDialogComponent, {
      width: '50%',
      height: '60%',
    });

    dialogRef.afterClosed().subscribe(() => {
      this.getList();
    });
  }

  editProduct(product: Product) {
    const dialogRef = this.dialog.open(InventoryDialogComponent, {
      width: '50%',
      height: '60%',
      data: product
    });

    dialogRef.afterClosed().subscribe(() => {
      this.getList();
    });
  }
}
