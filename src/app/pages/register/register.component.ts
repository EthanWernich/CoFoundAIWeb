import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './register.component.html'
})
export class RegisterComponent {
  email: string = '';
  password: string = '';
  confirmPassword: string = '';
  loading: boolean = false;
  error: string | null = null;

  constructor(
    private auth: AuthService,
    private router: Router
  ) {}

  async register() {
    if (this.password !== this.confirmPassword) {
      this.error = "Passwords don't match";
      return;
    }

    try {
      this.loading = true;
      this.error = null;
      await this.auth.signUp(this.email, this.password);
      this.router.navigate(['/']);
    } catch (err: any) {
      this.error = err.message;
    } finally {
      this.loading = false;
    }
  }

  goToLogin() {
    this.router.navigate(['/login']);
  }
}
