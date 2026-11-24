import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { MatListModule } from '@angular/material/list';
import { MatMenuModule } from '@angular/material/menu';
import { AuthService } from '../../services/auth.service';

export interface WorkspaceOption {
  initials: string;
  name: string;
  plan: string;
}

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive, MatListModule, MatMenuModule],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.scss',
})
export class SidebarComponent {
  @Input() activeIncidentsCount: number | null = 12;
  @Input() usagePercent = 70;
  @Input() usageSummaryText = '8.4M of 12M';

  workspaces: WorkspaceOption[] = [
    { initials: 'NA', name: 'Northstar Labs', plan: 'Enterprise workspace' },
    { initials: 'NA1', name: 'Northstar Labs1', plan: 'Enterprise workspace1' },
    { initials: 'NA2', name: 'Northstar Labs2', plan: 'Enterprise workspace2' },
  ];

  selectedWorkspace: WorkspaceOption = this.workspaces[0];

  constructor(public authService: AuthService) {}

  get isAdmin(): boolean {
    return this.authService.getRole() === 'ADMIN';
  }

  selectWorkspace(workspace: WorkspaceOption): void {
    this.selectedWorkspace = workspace;
  }
}