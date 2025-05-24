import { Injectable } from '@angular/core';
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { Observable, from } from 'rxjs';
import { switchMap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class IdeaService {
  private supabase: SupabaseClient;

  constructor() {
    this.supabase = createClient('https://vjkardnbjlcgkpmrpudh.supabase.co', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZqa2FyZG5iamxjZ2twbXJwdWRoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDY4MTI4NDYsImV4cCI6MjA2MjM4ODg0Nn0.eyhk9MQ0WpEWZEccWlmvcYuAcKsjGqMASFIRHQPYgJ8');
  }

  saveIdea(idea: {
    title: string;
    description: string;
    result_json: any;
  }): Observable<any> {
    return from(this.supabase.auth.getUser()).pipe(
      switchMap(({ data: { user } }) => {
        if (!user) {
          throw new Error('User not authenticated');
        }

        return from(
          this.supabase
            .from('ideas')
            .insert([
              {
                user_id: user.id,
                title: idea.title,
                description: idea.description,
                result_json: idea.result_json
              }
            ])
            .select()
        );
      })
    );
  }

  getUserIdeas(): Observable<any> {
    return from(this.supabase.auth.getUser()).pipe(
      switchMap(({ data: { user } }) => {
        if (!user) {
          throw new Error('User not authenticated');
        }

        return from(
          this.supabase
            .from('ideas')
            .select('*')
            .eq('user_id', user.id)
            .order('created_at', { ascending: false })
        );
      })
    );
  }

  getIdeaById(ideaId: string): Observable<any> {
    return from(this.supabase.auth.getUser()).pipe(
      switchMap(({ data: { user } }) => {
        if (!user) {
          throw new Error('User not authenticated');
        }

        // First check if the idea exists
        return from(
          this.supabase
            .from('ideas')
            .select('*')
            .eq('id', ideaId)
            .maybeSingle()
        ).pipe(
          switchMap(({ data: idea, error }) => {
            if (error) {
              throw new Error('Error fetching idea');
            }
            if (!idea) {
              throw new Error('Idea not found');
            }
            // Then verify ownership
            if (idea.user_id !== user.id) {
              throw new Error('You do not have permission to view this idea');
            }
            return [{ data: [idea] }];
          })
        );
      })
    );
  }
}
