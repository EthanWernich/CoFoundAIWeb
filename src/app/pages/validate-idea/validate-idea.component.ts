import { CommonModule } from '@angular/common';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { IdeaValidationService } from '../../services/idea-validation.service';
import { IdeaService } from '../../services/idea.service';
import { HttpClientModule } from '@angular/common/http';
import { RouterModule, Router } from '@angular/router';
import { trigger, state, style, animate, transition } from '@angular/animations';
import { TokenService } from '../../services/token.service';
import { TokenBadgeComponent } from '../../components/token-badge/token-badge.component';
import { AuthService } from '../../services/auth.service';

interface MarketAnalysis {
  interestScore: number;
  trend: string;
  marketSize: string;
  competitiveLandscape: string;
  marketGaps: string;
  keyRisks: string[];
  growthPotential: string;
  summary: string;
}

interface Persona {
  name: string;
  age: string;
  role: string;
  painPoints: string[];
  goals: string[];
  willingness: string;
}

interface Technical {
  stack: string[];
  infrastructure: string[];
  thirdPartyServices: string[];
}

interface MvpFeatures {
  core: string[];
  secondary: string[];
  future: string[];
  technical: Technical;
  timeline: string;
}

interface MarketingStrategy {
  channels: string[];
  tactics: string[];
  contentStrategy: string;
  partnerships: string[];
}

interface Pricing {
  strategy: string;
  tiers: string[];
}

interface Monetization {
  model: string;
  pricing: Pricing;
  revenueStreams: string[];
}

interface Timeline {
  preLaunch: string[];
  launch: string[];
  postLaunch: string[];
}

interface LaunchPlan {
  marketingStrategy: MarketingStrategy;
  monetization: Monetization;
  timeline: Timeline;
}

@Component({
  selector: 'app-validate-idea',
  templateUrl: './validate-idea.component.html',
  styleUrls: ['./validate-idea.component.scss'],
  imports: [CommonModule, FormsModule, HttpClientModule, RouterModule],
  providers: [IdeaValidationService],
  standalone: true,
  animations: [
    trigger('rotateAnimation', [
      state('inactive', style({
        transform: 'translateY(100%)',
        opacity: 0
      })),
      state('active', style({
        transform: 'translateY(0)',
        opacity: 1
      })),
      state('exiting', style({
        transform: 'translateY(-120%)',
        opacity: 0
      })),
      transition('inactive => active', animate('400ms cubic-bezier(0.4, 0, 0.2, 1)')),
      transition('active => exiting', animate('400ms cubic-bezier(0.4, 0, 0.2, 1)')),
    ])
  ]
})
export class ValidateIdeaComponent implements OnInit, OnDestroy {
  public validationResult: any = null;
  public tabs = ['Idea Basics', 'Market Analysis', 'Target Personas', 'MVP Features', 'Launch Plan'];
  public currentTab = 0;
  public loading = false;
  public saveError: string | null = null;
  public saving = false;
  public tokens: number = 0;

  public marketAnalysis: MarketAnalysis = {
    interestScore: 0,
    trend: '',
    marketSize: '',
    competitiveLandscape: '',
    marketGaps: '',
    keyRisks: [],
    growthPotential: '',
    summary: ''
  };

  public personas: Persona[] = [];
  public mvpFeatures: MvpFeatures = {
    core: [],
    secondary: [],
    future: [],
    technical: {
      stack: [],
      infrastructure: [],
      thirdPartyServices: []
    },
    timeline: ''
  };

  public launchPlan: LaunchPlan = {
    marketingStrategy: {
      channels: [],
      tactics: [],
      contentStrategy: '',
      partnerships: []
    },
    monetization: {
      model: '',
      pricing: {
        strategy: '',
        tiers: []
      },
      revenueStreams: []
    },
    timeline: {
      preLaunch: [],
      launch: [],
      postLaunch: []
    }
  };

  public rotatingWords = [
    "Startup Idea",
    "Business Plan",
    "Market Fit",
    "Innovation",
    "Next Big Thing",
    "Success Story"
  ];
  public currentWordIndex = 0;
  private rotationInterval: any;

  constructor(
    private ideaService: IdeaValidationService,
    private ideaDataService: IdeaService,
    private router: Router,
    private tokenService: TokenService,
    public auth: AuthService
  ) {}

  ngOnInit() {
    console.log('ValidateIdeaComponent initialized');
    this.startRotation();
    this.tokenService.getUserTokens().subscribe(tokens => {
      this.tokens = tokens;
    });
  }

  ngOnDestroy() {
    if (this.rotationInterval) {
      clearInterval(this.rotationInterval);
    }
  }

  private startRotation() {
    this.rotationInterval = setInterval(() => {
      this.currentWordIndex = (this.currentWordIndex + 1) % this.rotatingWords.length;
    }, 2000);
  }

  public form: any = {
    ideaTitle: '',
    description: '',
    why: '',
    targetAudience: ''
  };

  public selectTab(index: number) {
    if (this.isTabEnabled(index)) {
      this.currentTab = index;
    }
  }

  public next() {
    if (this.tokens === 0) {
      this.saveError = 'You need tokens to validate an idea.';
      return;
    }
    if (this.currentTab === 0) {
      this.tokenService.decrementToken().subscribe({
        next: (response) => {
          this.tokenService.getUserTokens().subscribe(tokens => {
            this.tokens = tokens;
          });
          this.submitIdea();
        },
        error: (err) => {
          this.saveError = 'Failed to deduct token. Please try again.';
        }
      });
    } else if (this.currentTab < this.tabs.length - 1) {
      this.currentTab++;
    }
  }

  public prev() {
    if (this.currentTab > 0) {
      this.currentTab--;
    }
  }

  public isTabEnabled(index: number): boolean {
    return index <= this.currentTab;
  }

  private submitIdea() {
    this.loading = true;
    this.ideaService.validateIdea(this.form).subscribe({
      next: (response) => {
        this.loading = false;
        this.validationResult = response;

        try {
          if (response.marketAnalysis) {
            this.marketAnalysis = response.marketAnalysis;
          }
          if (response.personas) {
            this.personas = response.personas;
          }
          if (response.mvpFeatures) {
            this.mvpFeatures = response.mvpFeatures;
          }
          if (response.launchPlan) {
            this.launchPlan = response.launchPlan;
          }

          this.currentTab++;
        } catch (error) {
          console.error('Error parsing validation response:', error);
        }
      },
      error: (error) => {
        this.loading = false;
        console.error('Error validating idea:', error);
      }
    });
  }

  navigateToHomePage() {
    this.router.navigate(['/']);
  }

  navigateToHome() {
    this.saveError = null;
    this.saving = true;

    const ideaData = {
      title: this.form.ideaTitle,
      description: this.form.description,
      result_json: {
        marketAnalysis: this.marketAnalysis,
        personas: this.personas,
        mvpFeatures: this.mvpFeatures,
        launchPlan: this.launchPlan
      }
    };

    this.ideaDataService.saveIdea(ideaData).subscribe({
      next: (response) => {
        console.log('Idea saved successfully:', response);
        this.saving = false;
        this.router.navigate(['/my-ideas'])
          .then(() => {
            window.scrollTo(0, 0);
          });
      },
      error: (error) => {
        console.error('Error saving idea:', error);
        this.saving = false;
        this.saveError = error.message || 'Failed to save idea. Please try again.';
        // Don't navigate on error, let the user try again
      }
    });
  }

}
