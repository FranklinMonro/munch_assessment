import { Component, inject, OnInit } from '@angular/core';
import { ReactiveFormsModule, FormControl, FormGroup, Validators, AbstractControl } from '@angular/forms';

import { MatCheckboxModule } from '@angular/material/checkbox';
import { MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSelectModule } from '@angular/material/select';

import { InventoryService, Product } from '../../inventory.service';
import { ToastrService } from 'ngx-toastr';
import { FormsErrorsService } from '../../../../global-services/forms-errors.service';

@Component({
  selector: 'app-inventory-dialog',
  imports: [
    ReactiveFormsModule,
    MatCheckboxModule,
    MatDialogModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatProgressSpinnerModule,
    MatSelectModule,
  ],
  templateUrl: './inventory-dialog.component.html',
  styleUrl: './inventory-dialog.component.scss'
})
export class InventoryDialogComponent implements OnInit {
  loadSpinner = false;
  productList: Product[] = [];
  data: Product = inject(MAT_DIALOG_DATA);
  productForm: FormGroup = new FormGroup({});

  constructor(
    private readonly inventoryService: InventoryService,
    private readonly formErrorService: FormsErrorsService,
    private readonly toastr: ToastrService,
  ) { }
  ngOnInit(): void {
    this.createForm();
    this.productList = this.inventoryService.PRODUCTS;
  }

 createForm() {
  this.productForm = new FormGroup({
    name: new FormControl('', [Validators.required]),
    price: new FormControl(0, [Validators.required]),
    qty: new FormControl(0, [Validators.required]),
    description: new FormControl('', [Validators.required]),
    upsells_to: new FormControl(['']),
    upsell_from: new FormControl([''], [Validators.required]),
    active: new FormControl(true, [Validators.required]),
  });
 }

 public getFormError = (formInput: AbstractControl): string => {
     return this.formErrorService.formErrorInput(formInput.errors!);
   };

 onSubmit() {
  console.log(this.productForm.value);
  this.loadSpinner = true;
  this.inventoryService.postProduct(this.productForm.value).subscribe({
    next: (response) => {},
    error: (errror: Error) => {
      console.error(errror);
      this.toastr.error(`Error adding product, error: ${errror.message}`, 'ERROR');
    },
    complete: () => {
      console.info('Product added completed');
      this.loadSpinner = false;
      this.toastr.success('Product added successfully');
    }
  });
 }
}
