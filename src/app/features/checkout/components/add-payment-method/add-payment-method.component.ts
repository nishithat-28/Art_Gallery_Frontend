import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { PaymentService } from '../../../../core/services/payment.service';

@Component({
  selector: 'app-add-payment-method',
  templateUrl: './add-payment-method.component.html',
  styleUrls: ['./add-payment-method.component.scss']
})
export class AddPaymentMethodComponent implements OnInit {
  paymentForm: FormGroup;
  loading = false;
  error: string | null = null;

  constructor(
    private fb: FormBuilder,
    private paymentService: PaymentService,
    private dialogRef: MatDialogRef<AddPaymentMethodComponent>,
    private snackBar: MatSnackBar
  ) {
    this.paymentForm = this.fb.group({
      cardNumber: ['', [Validators.required, Validators.pattern('^[0-9]{16}$')]],
      expiryMonth: ['', [Validators.required, Validators.pattern('^(0[1-9]|1[0-2])$')]],
      expiryYear: ['', [Validators.required, Validators.pattern('^[0-9]{2}$')]],
      cvc: ['', [Validators.required, Validators.pattern('^[0-9]{3,4}$')]],
      name: ['', [Validators.required]],
      isDefault: [false]
    });
  }

  ngOnInit(): void {}

  onSubmit(): void {
    if (this.paymentForm.valid) {
      this.loading = true;
      this.error = null;

      const paymentMethod = {
        cardNumber: this.paymentForm.get('cardNumber')?.value,
        expiryMonth: this.paymentForm.get('expiryMonth')?.value,
        expiryYear: this.paymentForm.get('expiryYear')?.value,
        cvc: this.paymentForm.get('cvc')?.value,
        name: this.paymentForm.get('name')?.value,
        isDefault: this.paymentForm.get('isDefault')?.value
      };

      this.paymentService.addPaymentMethod(paymentMethod).subscribe({
        next: (result) => {
          this.loading = false;
          this.snackBar.open('Payment method added successfully', 'Close', { duration: 3000 });
          this.dialogRef.close(true);
        },
        error: (error) => {
          this.loading = false;
          this.error = 'Failed to add payment method. Please try again.';
          this.snackBar.open(this.error, 'Close', { duration: 3000 });
        }
      });
    } else {
      this.snackBar.open('Please fill in all required fields correctly', 'Close', { duration: 3000 });
    }
  }

  onCancel(): void {
    this.dialogRef.close();
  }

  formatCardNumber(event: any): void {
    let value = event.target.value.replace(/\D/g, '');
    value = value.replace(/(\d{4})/g, '$1 ').trim();
    this.paymentForm.patchValue({ cardNumber: value });
  }

  formatExpiry(event: any, field: 'expiryMonth' | 'expiryYear'): void {
    let value = event.target.value.replace(/\D/g, '');
    if (field === 'expiryMonth') {
      value = value.slice(0, 2);
      if (parseInt(value) > 12) {
        value = '12';
      }
    } else {
      value = value.slice(0, 2);
    }
    this.paymentForm.patchValue({ [field]: value });
  }
} 