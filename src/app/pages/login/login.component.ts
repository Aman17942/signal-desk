import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { HeaderComponent } from '../../layout/header/header.component';
import { FooterComponent } from '../../layout/footer/footer.component';
import { AlertComponent } from '../../shared/alert/alert.component';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatCheckboxModule,
    MatButtonModule,
    MatProgressSpinnerModule,
    HeaderComponent,
    FooterComponent,
    AlertComponent,
  ],
  templateUrl: './login.component.html',
})
export class LoginComponent {
  email = '';
  password = '';
  rememberMe = true;
  isSubmitting = false;
  alerts: string[] = [];

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  dismissAlert(index: number): void {
    this.alerts.splice(index, 1);
  }

onLogin(): void {
  this.alerts = [];
  if (!this.email.trim() || !this.password.trim()) {
    return;
  }
  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  if (!emailPattern.test(this.email.trim())) {
    this.alerts = ['Incorrect email or password. Try again.'];
    return;
  }

  this.isSubmitting = true;

  setTimeout(() => {
    const result = this.authService.login(
      this.email,
      this.password,
      this.rememberMe
    );

    this.isSubmitting = false;

    if (!result.user) {
      if (result.error === 'INACTIVE_ACCOUNT') {
        this.alerts = [
          'Account inactive or access restricted. Contact admin.',
        ];
      } else {
        this.alerts = [
          'Incorrect email or password. Try again.',
        ];
      }
      return;
    }
    const targetRoute =
      result.user.role === 'ADMIN'
        ? '/command-center'
        : '/incidents';

    this.router.navigate([targetRoute]);
  }, 500);
}

}