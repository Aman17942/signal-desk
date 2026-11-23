import { Component, EventEmitter, Input, OnChanges, Output, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatListModule } from '@angular/material/list';
import { MatChipsModule } from '@angular/material/chips';

export type IncidentSeverity = 'Critical' | 'High' | 'Medium';
export type IncidentStatus = 'Investigating' | 'Acknowledged' | 'Monitoring';

export interface IncidentItem {
  id: string;
  code: string;
  title: string;
  severity: IncidentSeverity;
  service: string;
  timestamp: string;
  status: IncidentStatus;
}

interface BuiltIncidentItem extends IncidentItem {
  barColor: string;
  severityColor: string;
  statusColor: string;
}

const SEVERITY_COLORS: Record<IncidentSeverity, string> = {
  Critical: '#ef4444',
  High: '#f59e0b',
  Medium: '#6366f1',
};

const STATUS_COLORS: Record<IncidentStatus, string> = {
  Investigating: '#ef4444',
  Acknowledged: '#f59e0b',
  Monitoring: '#6366f1',
};

const DEFAULT_INCIDENTS: IncidentItem[] = [
  {
    id: '1',
    code: 'INC-2026-0842',
    title: 'Payment Gateway experiencing elevated latency',
    severity: 'Critical',
    service: 'Payment Gateway',
    timestamp: 'Today, 10:36',
    status: 'Investigating',
  },
  {
    id: '2',
    code: 'INC-2026-0841',
    title: 'Authentication token validation failures',
    severity: 'High',
    service: 'Authentication API',
    timestamp: 'Today, 09:48',
    status: 'Acknowledged',
  },
  {
    id: '3',
    code: 'INC-2026-0840',
    title: 'Search indexing queue processing delay',
    severity: 'Medium',
    service: 'Search API',
    timestamp: 'Today, 08:22',
    status: 'Monitoring',
  },
  {
    id: '4',
    code: 'INC-2026-0839',
    title: 'Notification delivery rate below threshold',
    severity: 'High',
    service: 'Notification Engine',
    timestamp: 'Today, 07:56',
    status: 'Investigating',
  },
  {
    id: '5',
    code: 'INC-2026-0838',
    title: 'Object storage upload timeout spike',
    severity: 'Medium',
    service: 'File Storage',
    timestamp: 'Yesterday, 23:41',
    status: 'Monitoring',
  },
];

@Component({
  selector: 'app-incident-list',
  standalone: true,
  imports: [CommonModule, MatCardModule, MatListModule, MatChipsModule],
  templateUrl: './live-incident.component.html',
  styleUrl: './live-incident.component.scss',
})
export class IncidentListComponent implements OnChanges {
  @Input() incidents: IncidentItem[] = DEFAULT_INCIDENTS;
  @Output() incidentSelected = new EventEmitter<IncidentItem>();

  builtIncidents: BuiltIncidentItem[] = [];

  constructor() {
    this.buildList();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['incidents']) {
      this.buildList();
    }
  }

  selectIncident(item: BuiltIncidentItem): void {
    this.incidentSelected.emit(item);
  }

  private buildList(): void {
    const source = this.incidents?.length ? this.incidents : DEFAULT_INCIDENTS;
    this.builtIncidents = source.map((item) => {
      const severityColor = SEVERITY_COLORS[item.severity] || '#6366f1';
      return {
        ...item,
        barColor: severityColor,
        severityColor,
        statusColor: STATUS_COLORS[item.status] || '#6366f1',
      };
    });
  }
}