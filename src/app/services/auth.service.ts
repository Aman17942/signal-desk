
import { Injectable } from '@angular/core';
export type UserRole = 'ADMIN' | 'USER';

export interface AuthUser {
  email: string;
  role: UserRole;
}

interface SignalDeskUser extends AuthUser {
  password: string;
  isActive: boolean;
}
@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private readonly KEY_STORE = 'signaldesk_login';

  private readonly signaldeskUser: SignalDeskUser[] = [
    {
      email: 'admin@signaldesk.com',
      password: 'Admin@123',
      role: 'ADMIN',
      isActive: true,
    },
    {
      email: 'user@signaldesk.com',
      password: 'User@123',
      role: 'USER',
      isActive: true,
    },
  ];

  login(
    email: string,
    password: string,
    rememberMe: boolean
  ): { user: AuthUser | null; error: 'INVALID_CREDENTIALS' | 'INACTIVE_ACCOUNT' | null } {

    const cleanEmail = email.trim().toLowerCase();

    const matched = this.signaldeskUser.find(
      (u) => u.email === cleanEmail
    );

    if (!matched || matched.password !== password) {
      return {
        user: null,
        error: 'INVALID_CREDENTIALS',
      };
    }

    if (!matched.isActive) {
      return {
        user: null,
        error: 'INACTIVE_ACCOUNT',
      };
    }

    const sessionUser: AuthUser = {
      email: matched.email,
      role: matched.role,
    };

    localStorage.removeItem(this.KEY_STORE);
    sessionStorage.removeItem(this.KEY_STORE);
    const storage = rememberMe ? localStorage : sessionStorage;

    storage.setItem(this.KEY_STORE, JSON.stringify(sessionUser));

    return {
      user: sessionUser,
      error: null,
    };
  }

  getCurrentUser(): AuthUser | null {
    const raw =
      localStorage.getItem(this.KEY_STORE) ||
      sessionStorage.getItem(this.KEY_STORE);

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
    localStorage.removeItem(this.KEY_STORE);
    sessionStorage.removeItem(this.KEY_STORE);
  }
}
