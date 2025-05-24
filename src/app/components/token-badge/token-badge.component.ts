import { Component, OnInit, OnDestroy } from '@angular/core';
import { TokenService } from '../../services/token.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-token-badge',
  template: `
    <div class="token-badge">
      <span class="icon">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M12 2L15 8H9L12 2ZM12 22L9 16H15L12 22ZM2 12L8 15V9L2 12ZM22 12L16 9V15L22 12Z" stroke="#ff5252" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
      </span>
      <span class="count">{{ displayTokens }}</span>
    </div>
  `,
  styleUrls: ['./token-badge.component.scss']
})
export class TokenBadgeComponent implements OnInit, OnDestroy {
  tokens: number | null = null;
  error: boolean = false;
  private tokenSubscription: Subscription | null = null;

  constructor(private tokenService: TokenService) {}

  get displayTokens() {
    if (this.error) return '?';
    if (this.tokens === null) return '-';
    return this.tokens;
  }

  ngOnInit() {
    this.tokenSubscription = this.tokenService.getUserTokens().subscribe({
      next: tokens => {
        this.tokens = tokens;
      },
      error: () => {
        this.error = true;
      }
    });
  }

  ngOnDestroy() {
    if (this.tokenSubscription) {
      this.tokenSubscription.unsubscribe();
    }
  }
}
