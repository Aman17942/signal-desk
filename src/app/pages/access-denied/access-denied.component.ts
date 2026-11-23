import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-access-denied',
  standalone: true,
  imports: [MatCardModule, MatButtonModule],
  templateUrl: './access-denied.component.html',
})
export class AccessDeniedComponent {
  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  goBack(): void {
    const role = this.authService.getRole();
    if (!role) {
      this.router.navigate(['/login']);
      return;
    }
    this.router.navigate([role === 'ADMIN' ? '/command-center' : '/incidents']);
  }
}