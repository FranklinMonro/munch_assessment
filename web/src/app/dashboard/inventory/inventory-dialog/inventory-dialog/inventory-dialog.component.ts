import { Component, inject, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';

import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';

import { Product } from '../../inventory.service';

@Component({
  selector: 'app-inventory-dialog',
  imports: [
    MatButtonModule,
    MatDialogModule,
  ],
  templateUrl: './inventory-dialog.component.html',
  styleUrl: './inventory-dialog.component.scss'
})
export class InventoryDialogComponent implements OnInit {
  data: Product = inject(MAT_DIALOG_DATA);
  productForm: FormGroup = new FormGroup({});

  constructor() { }
  ngOnInit(): void {
    this.createForm();
  }

 createForm() {
  this.productForm = new FormGroup({
    name: new FormControl('', [Validators.required]),
    price: new FormControl(0, [Validators.required]),
    qty: new FormControl(0, [Validators.required]),
    description: new FormControl('', [Validators.required]),
    upsells_to: new FormControl([''], [Validators.required]),
    upsell_from: new FormControl([''], [Validators.required]),
    active: new FormControl(false, [Validators.required]),
  });
 }
}
