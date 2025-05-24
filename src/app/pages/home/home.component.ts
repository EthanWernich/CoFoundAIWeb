import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent {
  showNotification = true;
  constructor(public auth: AuthService) {}

  ngOnInit() {
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
