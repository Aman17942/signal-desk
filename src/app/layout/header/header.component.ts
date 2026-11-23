import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, NavigationEnd } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatMenuModule } from '@angular/material/menu';
import { filter } from 'rxjs/operators';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatToolbarModule,
    MatButtonModule,
    MatMenuModule,
  ],
  templateUrl: './header.component.html',
   styleUrl: './header.component.scss',
})
export class HeaderComponent {
  @Input() isAuthMode = false;

  searchQuery = '';
  currentPageTitle = 'Command Center';

  environments = ['Production', 'Production 2', 'Production 3'];
  selectedEnvironment = 'Production';

  timeWindows = ['Live · 1h', 'Live · 2h'];
  selectedWindow = 'Live · 1h';

  constructor(
    public authService: AuthService,
    private router: Router
  ) {
    this.updatePageTitle(this.router.url);
    this.router.events
      .pipe(filter((event): event is NavigationEnd => event instanceof NavigationEnd))
      .subscribe((event) => {
        this.updatePageTitle(event.urlAfterRedirects);
      });
  }

  private updatePageTitle(url: string): void {
    if (url.includes('/incidents')) {
      this.currentPageTitle = 'Incidents';
    } else if (url.includes('/services')) {
      this.currentPageTitle = 'Services';
    } else {
      this.currentPageTitle = 'Command Center';
    }
  }

  selectEnvironment(env: string): void {
    this.selectedEnvironment = env;
  }

  selectWindow(windowLabel: string): void {
    this.selectedWindow = windowLabel;
  }

  onSearchSubmit(): void {
    const trimmed = this.searchQuery.trim();
    if (!trimmed) return;
    this.router.navigate(['/incidents'], { queryParams: { q: trimmed } });
  }

  onLogout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}