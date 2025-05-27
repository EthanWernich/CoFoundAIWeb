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

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private tokenService: TokenService
  ) {}

  ngOnInit() {
    // Get the reference from the URL query parameters
    this.route.queryParams.subscribe(params => {
      const reference = params['reference'];
      const status = params['status'];

      if (status === 'success' && reference) {
        // Determine which payment was made based on the reference
        // You'll need to store these mappings in your database or environment
        const tokenMap: { [key: string]: number } = {
          'u2704xj6vz': 2,  // 2 tokens
          'kejapkzqi1': 5,  // 5 tokens
          '2wf7o754hi': 20  // 20 tokens
        };

        const tokensToAdd = tokenMap[reference];
        if (tokensToAdd) {
          this.tokenService.incrementTokens(tokensToAdd).subscribe({
            next: () => {
              this.loading = false;
              this.success = true;
              this.tokensAdded = tokensToAdd;
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
        } else {
          this.loading = false;
          this.error = 'Invalid payment reference. Please contact support.';
        }
      } else {
        this.loading = false;
        this.error = 'Payment was not successful. Please try again.';
      }
    });
  }
}
