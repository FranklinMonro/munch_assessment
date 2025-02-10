import { Component, inject } from '@angular/core';

import { MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { MatListModule } from '@angular/material/list';
@Component({
  selector: 'app-history-list-dialog',
  imports: [
    MatDialogModule,
    MatListModule,
  ],
  templateUrl: './history-list-dialog.component.html',
  styleUrl: './history-list-dialog.component.scss'
})
export class HistoryListDialogComponent {
  data = inject(MAT_DIALOG_DATA);
}
