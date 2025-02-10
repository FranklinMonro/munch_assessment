import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormGroup, FormControl, Validators, AbstractControl } from '@angular/forms';


import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSelectModule } from '@angular/material/select';

import { FormsErrorsService } from '../../global-services/forms-errors.service';

@Component({
  selector: 'app-authenticate',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatButtonModule,
    MatCardModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
    MatProgressSpinnerModule,
    MatSelectModule,
  ],
  templateUrl: './authenticate.component.html',
  styleUrl: './authenticate.component.scss'
})
export class AuthenticateComponent implements OnInit {
  loginForm: FormGroup = new FormGroup({});

  show: boolean = false;

  load: boolean = false;

  loginPage: boolean = true;

  userRoles = [
    { item: 'seller', value: 'Seller' },
    { item: 'buyer', value: 'Buyer' }
  ]

  constructor(
    private readonly formErrorService: FormsErrorsService
  ) { }

  ngOnInit(): void {
   this.createForm();
  }

  createForm(): void {
    this.loginForm = new FormGroup({
      email: new FormControl('', [Validators.required, Validators.email]),
      password: new FormControl('', [Validators.required]),
      confirmPassword: new FormControl(''),
      name: new FormControl(''),
      surname: new FormControl(''),
      role: new FormControl('')
    });
  }

  private passwordConfirming(): { passwordInvalid: boolean } | null {
    if (this.loginForm?.get('password')?.value !==  this.loginForm?.get('confirmPassword')?.value) {
        return { passwordInvalid: true};
    }
    return null;
  }

  togglePages(): void {
    this.loginPage = !this.loginPage;
    if (!this.loginPage) {
      this.loginForm.get('confirmPassword')?.setValidators([Validators.required, this.passwordConfirming.bind(this)]);
      this.loginForm.get('name')?.setValidators([Validators.required]);
      this.loginForm.get('surname')?.setValidators([Validators.required]);
      this.loginForm.get('role')?.setValidators([Validators.required]);
    } else {
      this.loginForm.get('name')?.clearValidators();
      this.loginForm.get('surname')?.clearValidators();
      this.loginForm.get('role')?.clearValidators();
    }
  }

  public getFormError = (formInput: AbstractControl): string => {
    return this.formErrorService.formErrorInput(formInput.errors!);
  };

  onSubmit(): void {
    console.log(this.loginForm.value);
  }
}
