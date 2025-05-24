import { Injectable } from '@angular/core';
import { SupabaseClient } from '@supabase/supabase-js';
import { from, Observable, BehaviorSubject } from 'rxjs';
import { switchMap, map, tap } from 'rxjs/operators';
import { createClient } from '@supabase/supabase-js';

@Injectable({ providedIn: 'root' })
export class TokenService {
  private supabase: SupabaseClient;
  private tokenSubject = new BehaviorSubject<number>(0);

  constructor() {
    this.supabase = createClient('https://vjkardnbjlcgkpmrpudh.supabase.co', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZqa2FyZG5iamxjZ2twbXJwdWRoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDY4MTI4NDYsImV4cCI6MjA2MjM4ODg0Nn0.eyhk9MQ0WpEWZEccWlmvcYuAcKsjGqMASFIRHQPYgJ8');
    // Initialize token count
    this.refreshTokenCount();
  }

  private refreshTokenCount() {
    from(this.supabase.auth.getUser()).pipe(
      switchMap(({ data: { user } }) => {
        if (!user) return from(Promise.resolve({ data: { tokens: 0 } }));
        return from(this.supabase.from('user_tokens').select('tokens').eq('user_id', user.id).single());
      }),
      map((result: any) => result.data?.tokens ?? 0)
    ).subscribe(tokens => {
      this.tokenSubject.next(tokens);
    });
  }

  getUserTokens(): Observable<number> {
    return this.tokenSubject.asObservable();
  }

  decrementToken(): Observable<any> {
    return from(this.supabase.auth.getUser()).pipe(
      switchMap(({ data: { user } }) => {
        if (!user) throw new Error('Not authenticated');
        return from(
          this.supabase.from('user_tokens').select('tokens').eq('user_id', user.id).single()
        ).pipe(
          switchMap((result: any) => {
            const currentTokens = result.data?.tokens ?? 0;
            if (currentTokens <= 0) {
              throw new Error('No tokens available');
            }
            return from(
              this.supabase.from('user_tokens')
                .update({ tokens: currentTokens - 1 })
                .eq('user_id', user.id)
            ).pipe(
              tap(() => {
                this.tokenSubject.next(currentTokens - 1);
              })
            );
          })
        );
      })
    );
  }

  incrementTokens(amount: number): Observable<any> {
    return from(this.supabase.auth.getUser()).pipe(
      switchMap(({ data: { user } }) => {
        if (!user) throw new Error('Not authenticated');
        return from(
          this.supabase.from('user_tokens').select('tokens').eq('user_id', user.id).single()
        ).pipe(
          switchMap((result: any) => {
            const current = result.data?.tokens ?? 0;
            const newTokens = current + amount;
            const operation = result.data
              ? this.supabase.from('user_tokens').update({ tokens: newTokens }).eq('user_id', user.id)
              : this.supabase.from('user_tokens').insert({ user_id: user.id, tokens: newTokens });

            return from(operation).pipe(
              tap(() => {
                this.tokenSubject.next(newTokens);
              })
            );
          })
        );
      })
    );
  }
}
// Note: You should create a Postgres function 'decrement_token' to safely decrement tokens atomically.
