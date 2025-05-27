import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router, ActivatedRoute } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  showNotification = true;

  constructor(
    public auth: AuthService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit() {
    // Check for payment reference in URL
    this.route.queryParams.subscribe(params => {
      const reference = params['reference'];
      if (reference) {
        // Redirect to payment callback with the reference
        this.router.navigate(['/payment-callback'], {
          queryParams: {
            reference: reference,
            status: 'success'  // Since Paystack redirected here, we assume success
          }
        });
      }
    });

    setTimeout(() => {
      this.showNotification = false;
    }, 10000);
  }

  async logout() {
    try {
      await this.auth.signOut();
    } catch (error) {
      console.error('Error logging out:', error);
    }
  }
}
