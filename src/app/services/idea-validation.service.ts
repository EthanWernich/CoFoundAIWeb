import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class IdeaValidationService {
  private apiUrl = 'https://cofoundai.onrender.com/validate';

  constructor(private http: HttpClient) {}

  validateIdea(formData: any): Observable<any> {
    // Format the idea data from the form
    const ideaDescription = `
      Title: ${formData.ideaTitle}
      Description: ${formData.description}
      Why This Idea: ${formData.why}
      Target Audience: ${formData.targetAudience}
    `;

    return this.http.post(this.apiUrl, { idea: ideaDescription });
  }
}
