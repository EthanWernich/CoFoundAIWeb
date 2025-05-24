import { Injectable } from '@angular/core';
import { createClient, SupabaseClient, User } from '@supabase/supabase-js';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private supabase: SupabaseClient;
  private currentUser = new BehaviorSubject<User | null>(null);

  constructor() {
    this.supabase = createClient('https://vjkardnbjlcgkpmrpudh.supabase.co', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZqa2FyZG5iamxjZ2twbXJwdWRoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDY4MTI4NDYsImV4cCI6MjA2MjM4ODg0Nn0.eyhk9MQ0WpEWZEccWlmvcYuAcKsjGqMASFIRHQPYgJ8');

    // Set initial user state
    this.supabase.auth.getUser().then(({ data: { user } }) => {
      this.currentUser.next(user);
    });

    // Listen for auth state changes
    this.supabase.auth.onAuthStateChange((event, session) => {
      this.currentUser.next(session?.user ?? null);
    });
  }

  getCurrentUser(): Observable<User | null> {
    return this.currentUser.asObservable();
  }

  async signUp(email: string, password: string) {
    const { data, error } = await this.supabase.auth.signUp({
      email,
      password
    });
    if (error) throw error;
    return data;
  }

  async signIn(email: string, password: string) {
    const { data, error } = await this.supabase.auth.signInWithPassword({
      email,
      password
    });
    if (error) throw error;
    return data;
  }

  async signOut() {
    const { error } = await this.supabase.auth.signOut();
    if (error) throw error;
  }

  isAuthenticated(): boolean {
    return this.currentUser.value !== null;
  }
}

