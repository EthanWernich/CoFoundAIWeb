import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { IdeaService } from '../../services/idea.service';

@Component({
  selector: 'app-idea-details',
  templateUrl: './idea-details.component.html',
  styleUrls: ['./idea-details.component.scss'],
  standalone: true,
  imports: [CommonModule, RouterModule]
})
export class IdeaDetailsComponent implements OnInit {
  idea: any = null;
  loading = true;
  error: string | null = null;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private ideaService: IdeaService
  ) {}

  ngOnInit() {
    const ideaId = this.route.snapshot.paramMap.get('id');
    if (ideaId) {
      this.loadIdeaDetails(ideaId);
    } else {
      this.error = 'Idea ID not found';
      this.loading = false;
    }
  }

  loadIdeaDetails(ideaId: string) {
    this.loading = true;
    this.error = null;

    this.ideaService.getIdeaById(ideaId).subscribe({
      next: (response) => {
        if (response.data && response.data.length > 0) {
          this.idea = response.data[0];
        } else {
          this.error = 'Idea not found';
        }
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading idea details:', error);
        this.error = error.message || 'Failed to load idea details. Please try again.';
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

  goBack() {
    this.router.navigate(['/my-ideas']);
  }
}
