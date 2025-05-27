import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { TokenService } from '../../services/token.service';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-payment-callback',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="container py-5">
      <div class="row justify-content-center">
        <div class="col-md-6 text-center">
          <div *ngIf="loading" class="alert alert-info">
            Processing your payment...
          </div>
          <div *ngIf="error" class="alert alert-danger">
            {{ error }}
          </div>
          <div *ngIf="success" class="alert alert-success">
            Payment successful! {{ tokensAdded }} tokens have been added to your account.
          </div>
        </div>
      </div>
    </div>
  `
})
export class PaymentCallbackComponent implements OnInit {
  loading = true;
  error: string | null = null;
  success = false;
  tokensAdded = 0;

  // Map of amounts to token counts
  private readonly amountToTokens: { [key: number]: number } = {
    5: 2,   // $5 = 2 tokens
    10: 5,  // $10 = 5 tokens
    30: 20  // $30 = 20 tokens
  };

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private tokenService: TokenService,
    private http: HttpClient
  ) {}

  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      const reference = params['reference'];
      const status = params['status'];

      if (status === 'success' && reference) {
        // Verify the transaction with Paystack
        this.verifyTransaction(reference);
      } else {
        this.loading = false;
        this.error = 'Payment was not successful. Please try again.';
      }
    });
  }

  private verifyTransaction(reference: string) {
    // In a production environment, you should verify the transaction on your backend
    // For now, we'll use the amount from the URL to determine tokens
    // This is a simplified version - in production, you should verify the payment server-side

    // Extract amount from reference (this is a temporary solution)
    // In production, you should verify the actual transaction amount with Paystack
    const amount = this.getAmountFromReference(reference);

    if (amount && this.amountToTokens[amount]) {
      const tokensToAdd = this.amountToTokens[amount];
      this.addTokens(tokensToAdd);
    } else {
      this.loading = false;
      this.error = 'Could not determine token amount. Please contact support with reference: ' + reference;
    }
  }

  private getAmountFromReference(reference: string): number | null {
    // This is a temporary solution - in production, you should verify the actual transaction
    // For now, we'll use the last 4 digits of the reference to determine the amount
    // This is NOT secure and should be replaced with proper server-side verification
    const lastDigits = reference.slice(-4);
    const amountMap: { [key: string]: number } = {
      '5233': 5,   // 2 tokens
      '7023': 10,  // 5 tokens
      '8700': 30   // 20 tokens
    };
    return amountMap[lastDigits] || null;
  }

  private addTokens(amount: number) {
    this.tokenService.incrementTokens(amount).subscribe({
      next: () => {
        this.loading = false;
        this.success = true;
        this.tokensAdded = amount;
        // Redirect to home page after 3 seconds
        setTimeout(() => {
          this.router.navigate(['/']);
        }, 3000);
      },
      error: (err) => {
        this.loading = false;
        this.error = 'Failed to add tokens. Please contact support.';
        console.error('Error adding tokens:', err);
      }
    });
  }
}