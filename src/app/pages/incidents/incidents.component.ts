import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { SelectionModel } from '@angular/cdk/collections';
import { MatTableModule } from '@angular/material/table';
import { MatSortModule, Sort } from '@angular/material/sort';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatChipsModule } from '@angular/material/chips';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';

import { PageHeaderStripComponent } from '../page-header-strip/page-header-strip.component';
export interface IncidentItem {
  id: string;
  code: string;
  title: string;
  severity: string;
  service: string;
  environment: string;
  assignedTo: string;
  createdAt: string;
  duration: string;
  status: string;
}

export interface IncidentFilters {
  severities: string[];
  statuses: string[];
  services: string[];
  environments: string[];
}

const INCIDENTS_URL =
  'https://1dba0fb3-bb15-4d9a-a2a4-f256a9845b93.mock.pstmn.io/api/incidents';

const FILTERS_URL =
  'https://1dba0fb3-bb15-4d9a-a2a4-f256a9845b93.mock.pstmn.io/api/incidents/filter-options';

@Component({
  selector: 'app-incidents',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatTableModule,
    MatSortModule,
    MatCheckboxModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatChipsModule,
    MatProgressSpinnerModule,
    MatIconModule,
    MatCardModule,
    PageHeaderStripComponent,
  ],
  templateUrl: './incidents.component.html',
  styleUrl: './incidents.component.scss',
})
export class IncidentsComponent implements OnInit {
  private http = inject(HttpClient);
  columns: string[] = [
    'select',
    'code',
    'title',
    'severity',
    'service',
    'assignedTo',
    'createdAt',
    'duration',
    'status',
  ];

  allRows: IncidentItem[] = [];
  filteredRows: IncidentItem[] = [];
  pagedRows: IncidentItem[] = [];
  selection = new SelectionModel<IncidentItem>(true, []);
  filterOptions: IncidentFilters = {
    severities: [],
    statuses: [],
    services: [],
    environments: [],
  };

  search = '';
  severity = '';
  status = '';
  service = '';
  environment = '';
  dateWindow: 'all' | '7d' | '30d' = 'all';
  currentSort: Sort = {
    active: '',
    direction: '',
  };
  pageIndex = 0;
  pageSize = 10;
  loading = false;
  error = '';

  ngOnInit(): void {
    this.getFilterOptions();
    this.getIncidents();
  }

  getFilterOptions(): void {
    this.http.get<any>(FILTERS_URL).subscribe({
      next: (res) => {
        console.log('Filter Options API:', res);

        const data =
          res?.data?.filterOptions ??
          res?.filterOptions ??
          res?.data ??
          res ??
          {};

        this.filterOptions = {
          severities: data.severities ?? [],
          statuses: data.statuses ?? [],
          services: data.services ?? [],
          environments: data.environments ?? [],
        };
      },
      error: (err) => {
        console.error('Filter Options API failed:', err);
      },
    });
  }

  getIncidents(): void {
    this.loading = true;
    this.error = '';

    this.http.get<any>(INCIDENTS_URL).subscribe({
      next: (res) => {
        console.log('Incidents API Response:', res);

        const rawList: any[] = Array.isArray(res)
          ? res
          : [
              res?.incidents,
              res?.data?.incidents,
              res?.data?.items,
              res?.data,
              res?.items,
              res?.results,
            ].find(Array.isArray) ?? [];

        this.allRows = rawList.map((item: any, idx: number) => ({
          id: String(item.id ?? idx + 1),
          code: String(
            item.code ??
              item.incidentId ??
              item.incident_id ??
              `INC-${idx + 1}`
          ),
          title: String(
            item.title ??
              item.incidentTitle ??
              item.incident_title ??
              item.name ??
              ''
          ),
          severity: String(item.severity ?? 'Low'),
          service: String(
            item.service ??
              item.affectedService ??
              item.affected_service ??
              item.service_name ??
              ''
          ),
          environment: String(item.environment ?? item.env ?? 'Production'),
          assignedTo: this.extractAssigneeName(
            item.assignee ?? item.assignedTo ?? item.assigned_to
          ),
          createdAt: String(
            item.createdAt ?? item.created_at ?? item.timestamp ?? ''
          ),
          duration: String(item.duration ?? '—'),
          status: String(item.status ?? 'Open'),
        }));

        console.log('Mapped Incident Rows:', this.allRows);

        this.selection.clear();
        this.applyFilters();
        this.loading = false;
      },
      error: (err) => {
        console.error('Incidents API failed:', err);
        this.error = 'Unable to load incidents from API.';
        this.loading = false;
      },
    });
  }

  private extractAssigneeName(raw: any): string {
    if (!raw) return 'Unassigned';
    if (typeof raw === 'string') return raw.trim() || 'Unassigned';
    if (typeof raw === 'object') {
      return (
        raw.name ||
        raw.fullName ||
        raw.full_name ||
        raw.displayName ||
        raw.email ||
        'Unassigned'
      );
    }
    return String(raw);
  }

  applyFilters(): void {
    const q = this.search.trim().toLowerCase();
    const now = Date.now();
    const maxAgeMs =
      this.dateWindow === '7d'
        ? 7 * 24 * 60 * 60 * 1000
        : this.dateWindow === '30d'
          ? 30 * 24 * 60 * 60 * 1000
          : Infinity;

    this.filteredRows = this.allRows.filter((element) => {
      const matchSearch =
        !q ||
        element.code.toLowerCase().includes(q) ||
        element.title.toLowerCase().includes(q);

      const matchSeverity = !this.severity || element.severity === this.severity;
      const matchStatus = !this.status || element.status === this.status;
      const matchService = !this.service || element.service === this.service;
      const matchEnvironment = !this.environment || element.environment === this.environment;

      let matchDate = true;
      if (this.dateWindow !== 'all') {
        const time = Date.parse(element.createdAt);
        matchDate =
          !Number.isNaN(time) &&
          now - time >= 0 &&
          now - time <= maxAgeMs;
      }

      return (
        matchSearch &&
        matchSeverity &&
        matchStatus &&
        matchService &&
        matchEnvironment &&
        matchDate
      );
    });

    this.applySorting();
    this.pageIndex = 0;
    this.updatePageRows();
  }

  sortData(sort: Sort): void {
    this.currentSort = sort;
    this.applySorting();
    this.updatePageRows();
  }

  applySorting(): void {
    const { active, direction } = this.currentSort;
    if (!active || !direction) {
      return;
    }

    const dir = direction === 'asc' ? 1 : -1;

    this.filteredRows.sort((a: any, b: any) => {
      const valA = a[active] ?? '';
      const valB = b[active] ?? '';
      let comparison = 0;

      if (active === 'createdAt') {
        const dateA = Date.parse(valA);
        const dateB = Date.parse(valB);
        comparison =
          (Number.isNaN(dateA) ? 0 : dateA) -
          (Number.isNaN(dateB) ? 0 : dateB);
      } else {
        comparison = String(valA).localeCompare(String(valB), undefined, {
          numeric: true,
          sensitivity: 'base',
        });
      }

      return comparison * dir;
    });
  }

  updatePageRows(): void {
    const start = this.pageIndex * this.pageSize;
    const end = start + this.pageSize;
    this.pagedRows = this.filteredRows.slice(start, end);
  }

  onPageSizeChange(): void {
    this.pageIndex = 0;
    this.updatePageRows();
  }

  goToPage(index: number): void {
    this.pageIndex = Math.max(0, Math.min(index, this.pageCount - 1));
    this.updatePageRows();
  }

  get totalCount(): number {
    return this.filteredRows.length;
  }

  get pageCount(): number {
    return Math.max(1, Math.ceil(this.totalCount / this.pageSize));
  }

  get rangeLabel(): string {
    if (!this.totalCount) {
      return 'Showing 0 of 0 incidents';
    }

    const start = this.pageIndex * this.pageSize + 1;
    const end = Math.min((this.pageIndex + 1) * this.pageSize, this.totalCount);
    return `Showing ${start}–${end} of ${this.totalCount} incidents`;
  }

  isAllSelected(): boolean {
    return (
      this.pagedRows.length > 0 &&
      this.pagedRows.every((element) => this.selection.isSelected(element))
    );
  }

  toggleAll(): void {
    if (this.isAllSelected()) {
      this.pagedRows.forEach((element) => {
        this.selection.deselect(element);
      });
    } else {
      this.pagedRows.forEach((element) => {
        this.selection.select(element);
      });
    }
  }
  getInitials(name = ''): string {
    return (
      name
        .split(' ')
        .filter(Boolean)
        .slice(0, 2)
        .map((part) => part[0]?.toUpperCase() ?? '')
        .join('') || 'NA'
    );
  }
  getSeverityColor(value = ''): string {
    switch (value.toLowerCase()) {
      case 'critical':
        return '#ef4444';
      case 'high':
        return '#f59e0b';
      case 'medium':
        return '#818cf8';
      case 'low':

        return '#64748b';
      default:
        return '#6366f1';
    }
  }

  getStatusColor(value = ''): string {
    const status = value.toLowerCase();

    if (status.includes('resolv') || status.includes('closed')) {
      return '#22c55e';
    }

    if (status.includes('progress')) {
      return '#3b82f6';
    }

    if (status.includes('open')) {
      return '#f59e0b';
    }

    return '#64748b';
  }
  getBadgeColor(value = ''): string {
    const v = value.toLowerCase();

    if (v.includes('crit')) return '#ef4444';
    if (v.includes('high')) return '#f59e0b';
    if (v.includes('resolv') || v.includes('ok') || v.includes('low')) {
      return '#22c55e';
    }

    return '#6366f1';
  }
}