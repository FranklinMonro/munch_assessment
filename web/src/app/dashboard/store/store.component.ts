import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { InventoryService, Product } from '../inventory/inventory.service';
import { ToastrService } from 'ngx-toastr';

import { MatButtonModule } from '@angular/material/button';
import { MatDividerModule } from '@angular/material/divider';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatPaginatorModule, MatPaginator } from '@angular/material/paginator';
import { MatSortModule, MatSort } from '@angular/material/sort';
import { MatTableModule, MatTableDataSource, MatTable} from '@angular/material/table';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSelectChange, MatSelectModule } from '@angular/material/select';
import { StoreService } from './store.service';

@Component({
  selector: 'app-store',
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
    MatSelectModule,
  ],
  templateUrl: './store.component.html',
  styleUrl: './store.component.scss'
})
export class StoreComponent implements OnInit, AfterViewInit {
  @ViewChild(MatPaginator) paginator: MatPaginator | undefined;
  @ViewChild(MatSort) sort: MatSort | undefined;
  @ViewChild(MatTable) table: MatTable<Product> | undefined;
  loadSpinner = false;
  productList: Product[] = [];
  buyList: Product[] = [];
  displayedColumns: string[] = ['name', 'price', 'qty', 'description', 'delete'];
  dataSource: MatTableDataSource<Product> = new MatTableDataSource<Product>([]);
  constructor(
     private readonly inventoryService: InventoryService,
     private readonly toastr: ToastrService,
     private readonly storeService: StoreService
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
        this.productList = response.filter((product) => product.qty! > 0);
      },
      error: (error) => {
        console.error(error);
        this.toastr.error('Error getting products');
        this.loadSpinner = false;
      },
      complete: () => {
        this.loadSpinner = false;
      }
    });
  }

  onSelectionChange(event: MatSelectChange) {
    this.dataSource?.data.push(event.value);
    this.table!.renderRows();
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

  updateQty(event: KeyboardEvent, product: Product) {
    const index = this.dataSource.data.indexOf(product);
    this.dataSource.data[index].qty = parseInt((event.currentTarget as HTMLInputElement)?.value);
  }

  deleteRow(product: Product) {
    const index = this.dataSource.data.indexOf(product);
    this.dataSource.data.splice(index, 1);
    this.table!.renderRows();
  }

  buyProducts() {
    this.loadSpinner = true;
    this.storeService.postProduct(this.dataSource.data).subscribe({
      next: (response: Product[]) => {
        this.toastr.success('Products bought');
        this.dataSource.data = [];
        this.loadSpinner = false;
      },
      error: (error) => {
        console.error(error);
        this.toastr.error('Error buying products');
        this.loadSpinner = false;
      },
      complete: () => {
        this.loadSpinner = false;
        this.getList();
      }
    });
  }
}
