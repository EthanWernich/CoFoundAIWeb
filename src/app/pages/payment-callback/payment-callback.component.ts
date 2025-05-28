import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { TokenService } from '../../services/token.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-payment-callback',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="container py-5">
      <div class="row justify-content-center">
        <div class="col-md-6 text-center">
          <div *ngIf="loading" class="alert" style="background: #212121; color: #e5e6e9; border: 1px solid rgba(255, 255, 255, 0.1);">
            <span style="color: #ff5252;">Processing your payment...</span>
          </div>
          <div *ngIf="error" class="alert" style="background: #212121; color: #ff5252; border: 1px solid rgba(255, 255, 255, 0.1);">
            {{ error }}
          </div>
          <div *ngIf="success" class="alert" style="background: #212121; color: #e5e6e9; border: 1px solid rgba(255, 255, 255, 0.1);">
            <span style="color: #ff5252;">Payment successful!</span> {{ tokensAdded }} tokens have been added to your account.
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

  // Map Paystack product IDs to token amounts
  private readonly productTokens: { [key: string]: number } = {
    'u2704xj6vz': 2,  // $5 package - 2 tokens
    'kejapkzqi1': 5,  // $10 package - 5 tokens
    '2wf7o754hi': 20  // $30 package - 20 tokens
  };

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private tokenService: TokenService
  ) {}

  ngOnInit() {
    // Get the previous URL from session storage
    const previousUrl = sessionStorage.getItem('paymentProductId');
    const reference = this.route.snapshot.queryParams['reference'];

    if (reference && previousUrl && this.productTokens[previousUrl]) {
      // Add tokens based on the product ID stored in session storage
      this.addTokens(this.productTokens[previousUrl]);
    } else {
      this.loading = false;
      this.error = 'Invalid payment reference or product. Please contact support.';
      console.error('Payment details:', { reference, previousUrl });
    }

    // Clear the stored product ID
    sessionStorage.removeItem('paymentProductId');
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