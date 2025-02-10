import { Component, inject, OnInit, ViewChild } from '@angular/core';

import { MatButtonModule } from '@angular/material/button';
import { MatDialog } from '@angular/material/dialog';
import { MatDividerModule } from '@angular/material/divider';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatPaginatorModule, MatPaginator } from '@angular/material/paginator';
import { MatSortModule, MatSort } from '@angular/material/sort';
import { MatTableModule, MatTableDataSource, MatTable} from '@angular/material/table';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

import { HistoryService, History } from './history.service';
import { HistoryListDialogComponent } from './history-list-dialog/history-list-dialog/history-list-dialog.component';

@Component({
  selector: 'app-history',
  imports: [
    MatButtonModule,
    MatDividerModule,
    MatFormFieldModule,
    MatInputModule,
    MatPaginatorModule,
    MatSortModule,
    MatTableModule,
    MatProgressSpinnerModule,
  ],
  templateUrl: './history.component.html',
  styleUrl: './history.component.scss'
})
export class HistoryComponent implements OnInit {
  @ViewChild(MatPaginator) paginator: MatPaginator | undefined;
  @ViewChild(MatSort) sort: MatSort | undefined;
  @ViewChild(MatTable) table: MatTable<History> | undefined;
  loadSpinner = false;
  displayedColumns: string[] = ['invoice_date', 'items'];
  dataSource: MatTableDataSource<History> = new MatTableDataSource<History>([]);
  readonly dialog = inject(MatDialog);
  constructor(
    private readonly historyService: HistoryService,
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
    this.historyService.getHistory().subscribe({
      next: (response) => {
        this.dataSource = new MatTableDataSource(response);
      },
      error: (error) => {
        console.error(error);
      }
    });
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

  viewRow(row: History) {
    console.log(row.items);
    const dialogRef = this.dialog.open(HistoryListDialogComponent, {
      data: row.items
    });

    dialogRef.afterClosed().subscribe(() => {
      this.getList();
    });
  }
}
