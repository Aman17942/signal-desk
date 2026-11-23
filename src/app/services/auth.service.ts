import { Injectable } from '@angular/core';

export type UserRole = 'ADMIN' | 'USER';

export interface AuthUser {
  email: string;
  role: UserRole;
}

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private readonly STORAGE_KEY = 'signaldesk_session';

  private readonly mockUsers = [
    { email: 'admin@signaldesk.com', password: 'Admin@123', role: 'ADMIN' as UserRole },
    { email: 'user@signaldesk.com', password: 'User@123', role: 'USER' as UserRole },
  ];

  login(email: string, password: string, rememberMe: boolean): AuthUser | null {
    const cleanEmail = email.trim().toLowerCase();
    const matched = this.mockUsers.find(
      (u) => u.email === cleanEmail && u.password === password
    );

    if (!matched) {
      return null;
    }

    const sessionUser: AuthUser = {
      email: matched.email,
      role: matched.role,
    };

    localStorage.removeItem(this.STORAGE_KEY);
    sessionStorage.removeItem(this.STORAGE_KEY);

    const storage = rememberMe ? localStorage : sessionStorage;
    storage.setItem(this.STORAGE_KEY, JSON.stringify(sessionUser));

    return sessionUser;
  }

  getCurrentUser(): AuthUser | null {
    const raw =
      localStorage.getItem(this.STORAGE_KEY) ||
      sessionStorage.getItem(this.STORAGE_KEY);

    if (!raw) {
      return null;
    }

    try {
      return JSON.parse(raw) as AuthUser;
    } catch {
      return null;
    }
  }

  isLoggedIn(): boolean {
    return this.getCurrentUser() !== null;
  }

  getRole(): UserRole | null {
    return this.getCurrentUser()?.role ?? null;
  }

  logout(): void {
    localStorage.removeItem(this.STORAGE_KEY);
    sessionStorage.removeItem(this.STORAGE_KEY);
  }
}