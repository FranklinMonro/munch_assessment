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

import { ToastrService } from 'ngx-toastr';

import { FormsErrorsService } from '../../global-services/forms-errors.service';
import { AuthService } from '../authenticate.service';
import { Router } from '@angular/router';


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

  loadSpinner: boolean = false;

  loginPage: boolean = true;

  userRoles = [
    { item: 'seller', value: 'Seller' },
    { item: 'buyer', value: 'Buyer' }
  ]

  constructor(
    private readonly formErrorService: FormsErrorsService,
    private readonly authService: AuthService,
    private readonly toastr: ToastrService,
    private router: Router,
  ) { }

  ngOnInit(): void {
   this.createForm();
  }

  createForm(): void {
    this.loginForm = new FormGroup({
      email: new FormControl('test@seller.com', [Validators.required, Validators.email]),
      password: new FormControl('seller123', [Validators.required]),
      confirmPassword: new FormControl('seller123'),
      name: new FormControl('The'),
      surname: new FormControl('Seller'),
      role: new FormControl('seller')
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
    this.loadSpinner = true;
    if (this.loginPage) {
      this.authService.postLogIn(this.loginForm.value).subscribe({
        next: () => {
          this.toastr.success('User logged in successfully', 'SUCCESS');
          this.router.navigate(['/dashboard']); 
        },
        error: (error: Error) => {
          if (error.message.includes('401') || error.message.includes('422')) {
            this.toastr.warning('User not found or incorrect', 'WARNING');
          } else {
            this.toastr.error(`Error in login, error: ${error.message}`, 'WARNING');
          }
          this.loadSpinner = false;
        },
        complete: () => {
          console.info('Logincomplete');
          this.loadSpinner = false;
        }
      });
    } else {  
      this.authService.postUser(this.loginForm.value).subscribe({
        next: () => {
          this.toastr.success('User registered successfully', 'SUCCESS');
          this.loginPage = true;
        },
        error: (error: Error) => {
          if (error.message.includes('401')) {
            this.toastr.warning('User already exists', 'WARNING');
          } else {
            this.toastr.error(`Error in register, error: ${error.message}`, 'WARNING');
          }
          this.loadSpinner = false;
        },
        complete: () => {
          console.info('Registercomplete');
          this.loadSpinner = false;
        }
      });
    }
  }
}
