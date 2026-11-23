import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { HeaderComponent } from '../../../layout/header/header.component';
import { SidebarComponent } from '../../../layout/sidebar/sidebar.component';
import { FooterComponent } from '../../../layout/footer/footer.component';
import { PageHeaderStripComponent } from '../../page-header-strip/page-header-strip.component';
import { ReusableChartComponent, SignalChartSeries } from '../../../shared/reusable-chart/reusable-chart.component';
import { EndpointTableComponent } from '../endpoint-table/endpoint-table.component';
import { SummaryCardItem, SummaryCardsComponent } from '../../command_center/summary-cards.component/summary-cards.component';

export interface LatencyBucketItem {
  label: string;
  percent: number;
}

export interface ErrorBreakdownItem {
  code: string;
  label: string;
  percentage: number;
  tone: 'danger' | 'warning' | 'amber' | 'indigo';
}

export interface ServiceDependencyNode {
  id: string;
  name: string;
  latency: string;
  position: 'top-left' | 'top-right' | 'center' | 'bottom-left' | 'bottom-right';
  status?: 'healthy' | 'critical';
}


@Component({
  selector: 'app-services',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    HeaderComponent,
    SidebarComponent,
    FooterComponent,
    PageHeaderStripComponent,
    SummaryCardsComponent,
    ReusableChartComponent,
    EndpointTableComponent
  ],
  templateUrl: './service-observability.component.html',
})
export class ServiceObservabilityComponent {
    readonly timeRanges = ['Last 15 min', '1 hour', '24 hours', '7 days'];
  selectedRange = '1 hour';
  incidentSummaryCardsnew: SummaryCardItem[] = [
    {
      id: 'open-incidents',
      label: 'Availability',
      value: '99.82%',
      delta: '-0.16% vs prior period',
      comparison: 'vs. yesterday',
      tone: 'lightdanger',
      sparklineData: [4, 5, 4, 6, 5, 6, 7, 7],
    },
    {
      id: 'mttr',
      label: 'Throughput',
      value: '4.82k req/s',
      delta: '+8.4% vs prior period',
      comparison: 'vs. last week',
      tone: 'success',
      sparklineData: [42, 39, 36, 35, 33, 31, 29, 28],
    },
    {
      id: 'acknowledged',
      label: 'P50 latency',
      value: '128 ms',
      delta: '+12 ms vs prior period',
      comparison: 'active responders',
      tone: 'lightdanger',
      sparklineData: [2, 2, 3, 3, 3, 4, 3, 4],
    },
    {
      id: 'sla-compliance',
      label: 'P95 latency',
      value: '842 ms',
      delta: '+381 ms vs prior period',
      comparison: 'monthly target',
      tone: 'lightdanger',
      sparklineData: [99.1, 99.2, 99.2, 99.3, 99.3, 99.4, 99.3, 99.4],
    },
        {
      id: 'sla-compliance',
      label: 'P99 latency',
      value: '1.82 s',
      delta: '+742 ms vs prior period',
      comparison: 'monthly target',
      tone: 'lightdanger',
      sparklineData: [99.1, 99.2, 99.2, 99.3, 99.3, 99.4, 99.3, 99.4],
    },
        {
      id: 'sla-compliance',
      label: 'Error rate',
      value: '2.43%',
      delta: '+1.62% vs prior period',
      comparison: 'monthly target',
      tone: 'lightdanger',
      sparklineData: [99.1, 99.2, 99.2, 99.3, 99.3, 99.4, 99.3, 99.4],
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

    latencyBuckets: LatencyBucketItem[] = [
    { label: '<50', percent: 48 },
    { label: '50–100', percent: 76 },
    { label: '100–250', percent: 90 },
    { label: '250–500', percent: 62 },
    { label: '500–1s', percent: 38 },
    { label: '1–2s', percent: 24 },
    { label: '>2s', percent: 14 },
  ];

  errorBreakdown: ErrorBreakdownItem[] = [
    { code: '500', label: 'Internal Server Error', percentage: 48.2, tone: 'danger' },
    { code: '504', label: 'Gateway Timeout', percentage: 31.6, tone: 'warning' },
    { code: '429', label: 'Too Many Requests', percentage: 12.8, tone: 'amber' },
    { code: '502', label: 'Bad Gateway', percentage: 7.4, tone: 'indigo' },
  ];

  serviceDependencies: ServiceDependencyNode[] = [
    { id: 'auth-api', name: 'Authentication API', latency: '86 ms', position: 'top-left' },
    { id: 'order-svc', name: 'Order Service', latency: '203 ms', position: 'top-right' },
    { id: 'payment-gw', name: 'Payment Gateway', latency: '842 ms', position: 'center', status: 'critical' },
    { id: 'postgres', name: 'PostgreSQL', latency: '1.2 s', position: 'bottom-left' },
    { id: 'redis', name: 'Redis Cluster', latency: '12 ms', position: 'bottom-right' },
  ];

  trackByBucket(_index: number, item: LatencyBucketItem): string {
    return item.label;
  }

  trackByStatus(_index: number, item: ErrorBreakdownItem): string {
    return item.code;
  }

  trackByNodeId(_index: number, item: ServiceDependencyNode): string {
    return item.id;
  }
}