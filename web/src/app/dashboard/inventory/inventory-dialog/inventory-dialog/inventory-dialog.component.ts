import { Component, inject, OnInit } from '@angular/core';
import { ReactiveFormsModule, FormControl, FormGroup, Validators, AbstractControl } from '@angular/forms';

import { MatCheckboxModule } from '@angular/material/checkbox';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
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
  isEdit: Boolean = false;
  constructor(
    private readonly inventoryService: InventoryService,
    private readonly formErrorService: FormsErrorsService,
    private readonly toastr: ToastrService,
    public dialogRef: MatDialogRef<InventoryDialogComponent>,
  ) { }
  ngOnInit(): void {
    this.createForm();
    this.getList();
  }

  getList() {
    this.loadSpinner = true;
    this.inventoryService.getProducts().subscribe({
      next: (response: Product[]) => {
        this.productList = response;
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

 createForm() {
  this.productForm = new FormGroup({
    id: new FormControl(''),
    name: new FormControl('', [Validators.required]),
    price: new FormControl(0, [Validators.required]),
    qty: new FormControl(0, [Validators.required]),
    description: new FormControl('', [Validators.required]),
    upsells_to: new FormControl(['']),
    upsell_from: new FormControl([''], [Validators.required]),
    active: new FormControl(true, [Validators.required]),
  });
  this.isEdit = false;
  if (this.data) {
    this.isEdit = true;
    this.productForm.patchValue(this.data);
  }
 }

 public getFormError = (formInput: AbstractControl): string => {
     return this.formErrorService.formErrorInput(formInput.errors!);
   };

 onSubmit() {
  this.loadSpinner = true;
  if (this.isEdit) {
    this.inventoryService.patchProduct(this.productForm.value).subscribe({
      error: (error: Error) => {
        this.toastr.error(`Error updating product, error: ${error.message}`, 'ERROR');
        this.loadSpinner = false;
      },
      complete: () => {
        console.info('Product updated completed');
        this.loadSpinner = false;
        this.toastr.success('Product updated successfully');
        this.dialogRef!.close(1);
      }
    });
  } else {
    this.inventoryService.postProduct(this.productForm.value).subscribe({
      error: (errror: Error) => {
        if (errror.message.includes('401')) {
          this.toastr.warning('Product already exists', 'WARRNING');
        } else {
          this.toastr.error(`Error adding product, error: ${errror.message}`, 'ERROR');
        }
        this.loadSpinner = false;
      },
      complete: () => {
        console.info('Product added completed');
        this.loadSpinner = false;
        this.toastr.success('Product added successfully');
        this.dialogRef!.close(1);
      }
    });
  }
 }
}
