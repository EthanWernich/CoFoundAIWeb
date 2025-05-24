import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { IdeaService } from '../../services/idea.service';

@Component({
  selector: 'app-my-ideas',
  templateUrl: './my-ideas.component.html',
  styleUrls: ['./my-ideas.component.scss'],
  standalone: true,
  imports: [CommonModule, RouterModule]
})
export class MyIdeasComponent implements OnInit {
  ideas: any[] = [];
  loading = true;
  error: string | null = null;

  constructor(
    private ideaService: IdeaService,
    private router: Router
  ) {}

  ngOnInit() {
    this.loadIdeas();
  }

  loadIdeas() {
    this.loading = true;
    this.error = null;

    this.ideaService.getUserIdeas().subscribe({
      next: (response) => {
        this.ideas = response.data || [];
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading ideas:', error);
        this.error = 'Failed to load ideas. Please try again.';
        this.loading = false;
      }
    });
  }

  formatDate(dateString: string): string {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  }

  viewIdeaDetails(idea: any) {
    this.router.navigate(['/idea', idea.id]);
  }

  goHome() {
    this.router.navigate(['/']);
  }
}
