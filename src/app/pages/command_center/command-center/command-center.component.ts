import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

import { PageHeaderStripComponent } from '../../page-header-strip/page-header-strip.component';
import { ReusableChartComponent, SignalChartSeries } from '../../../shared/reusable-chart/reusable-chart.component';
import { ServiceHealthComponent } from '../service-health/service-health.component';
import { IncidentListComponent } from '../live-incident/live-incident.component';
import { MatCardModule } from '@angular/material/card';
import { SummaryCardItem, SummaryCardsComponent } from '../summary-cards.component/summary-cards.component';

@Component({
  selector: 'app-command-center',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    PageHeaderStripComponent,
    SummaryCardsComponent,
    ReusableChartComponent,
    ServiceHealthComponent,
    IncidentListComponent,
    MatCardModule
  ],
  templateUrl: './command-center.component.html',
  styleUrl: './command-center.component.scss',
})
export class CommandCenterComponent {
  readonly timeRanges = ['Last 15 min', '1 hour', '24 hours', '7 days'];
  selectedRange = '1 hour';

  summaryCards: SummaryCardItem[] = [
    {
      id: 'uptime',
      label: 'System uptime',
      value: '99.97%',
      delta: '+0.02%',
      comparison: 'vs. previous period',
      tone: 'success',
      sparklineData: [99.88, 99.91, 99.89, 99.93, 99.92, 99.95, 99.94, 99.97],
    },
    {
      id: 'incidents',
      label: 'Active incidents',
      value: '12',
      delta: '+3',
      comparison: 'in the last hour',
      tone: 'danger',
      sparklineData: [5, 6, 6, 8, 8, 10, 11, 12],
    },
    {
      id: 'latency',
      label: 'Average API latency',
      value: '248 ms',
      delta: '+18.4%',
      comparison: 'vs. previous period',
      tone: 'warning',
      sparklineData: [202, 209, 206, 215, 221, 219, 234, 248],
    },
    {
      id: 'error-rate',
      label: 'Error rate',
      value: '2.43%',
      delta: '+0.61%',
      comparison: 'vs. previous period',
      tone: 'danger',
      sparklineData: [1.75, 1.82, 1.80, 1.94, 1.92, 2.08, 2.25, 2.43],
    },
    {
      id: 'services-healthy',
      label: 'Services healthy',
      value: '18/22',
      delta: '-2',
      comparison: 'since 10:30',
      tone: 'info',
      sparklineData: [21, 21, 20, 20, 19, 19, 18, 18],
    },
  ];

  performanceCategories: string[] = [
    '00:00', '', '', '',
    '04:00', '', '', '',
    '08:00', '', '', '',
    '12:00', '', '', '',
    '16:00', '', '', '',
    '20:00', '', '', 'Now',
  ];

  systemPerformanceSeries: SignalChartSeries[] = [
    {
      name: 'API latency',
      color: '#6366f1',
      data: [
        34, 48, 56, 60,
        58, 48, 34, 22,
        14, 9, 9, 15,
        24, 38, 49, 66,
        78, 84, 89, 94,
        102, 114, 126, 142,
      ],
    },
    {
      name: 'Error rate',
      color: '#ef4444',
      data: [
        42, 42, 39, 31,
        24, 21, 29, 36,
        40, 42, 41, 38,
        34, 26, 17, 25,
        32, 54, 72, 92,
        112, 128, 136, 142,
      ],
    },
    {
      name: 'Request volume',
      color: '#10b981',
      data: [
        18, 36, 54, 70,
        80, 84, 82, 74,
        60, 48, 37, 27,
        20, 19, 24, 35,
        52, 74, 94, 112,
        126, 136, 140, 142,
      ],
    },
  ];

  selectRange(range: string): void {
    this.selectedRange = range;
  }

}