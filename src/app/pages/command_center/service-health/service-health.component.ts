import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReusableChartComponent, SignalChartSeries } from '../../../shared/reusable-chart/reusable-chart.component';

export type ServiceHealthStatus = 'healthy' | 'degraded' | 'at-risk';

export interface ServiceHealthItem {
  id: string;
  name: string;
  status: ServiceHealthStatus;
  statusLabel: string;
  latency: string;
  errorRate: string;
  deployedText: string;
  chartData: number[];
}

interface BuiltServiceHealthItem extends ServiceHealthItem {
  chartSeries: SignalChartSeries[];
}

@Component({
  selector: 'app-service-health',
  standalone: true,
  imports: [CommonModule, ReusableChartComponent],
  templateUrl: './service-health.component.html',
  styleUrl: './service-health.component.scss',
})
export class ServiceHealthComponent implements OnChanges {
  private readonly statusColorMap: Record<ServiceHealthStatus, string> = {
    healthy: '#22c55e',
    degraded: '#ef4444',
    'at-risk': '#f59e0b',
  };

  @Input() services: ServiceHealthItem[] = [
    {
      id: 'auth-api',
      name: 'Authentication API',
      status: 'healthy',
      statusLabel: 'Healthy',
      latency: '86 ms',
      errorRate: '0.08%',
      deployedText: 'Deployed 2h ago',
      chartData: [24, 38, 26, 52, 42, 46, 34, 62, 48, 44, 56, 46],
    },
    {
      id: 'payment-gateway',
      name: 'Payment Gateway',
      status: 'degraded',
      statusLabel: 'Degraded',
      latency: '842 ms',
      errorRate: '7.21%',
      deployedText: 'Deployed 3d ago',
      chartData: [14, 16, 18, 20, 24, 30, 34, 46, 50, 48, 58, 54],
    },
    {
      id: 'user-service',
      name: 'User Service',
      status: 'healthy',
      statusLabel: 'Healthy',
      latency: '112 ms',
      errorRate: '0.14%',
      deployedText: 'Deployed 5h ago',
      chartData: [20, 16, 30, 40, 26, 56, 44, 36, 42, 28, 38, 34],
    },
    {
      id: 'notification-engine',
      name: 'Notification Engine',
      status: 'at-risk',
      statusLabel: 'At risk',
      latency: '326 ms',
      errorRate: '2.88%',
      deployedText: 'Deployed 1d ago',
      chartData: [16, 20, 26, 24, 36, 32, 44, 40, 48, 52, 60, 54],
    },
    {
      id: 'search-api',
      name: 'Search API',
      status: 'healthy',
      statusLabel: 'Healthy',
      latency: '148 ms',
      errorRate: '0.31%',
      deployedText: 'Deployed 7h ago',
      chartData: [26, 16, 38, 28, 20, 36, 52, 42, 34, 46, 36, 28],
    },
    {
      id: 'order-processing',
      name: 'Order Processing',
      status: 'healthy',
      statusLabel: 'Healthy',
      latency: '203 ms',
      errorRate: '0.62%',
      deployedText: 'Deployed 4h ago',
      chartData: [16, 24, 34, 40, 32, 46, 42, 54, 48, 40, 36, 44],
    },
    {
      id: 'analytics-engine',
      name: 'Analytics Engine',
      status: 'at-risk',
      statusLabel: 'At risk',
      latency: '412 ms',
      errorRate: '1.72%',
      deployedText: 'Deployed 6d ago',
      chartData: [14, 18, 28, 24, 34, 30, 38, 46, 42, 48, 54, 48],
    },
    {
      id: 'file-storage',
      name: 'File Storage',
      status: 'healthy',
      statusLabel: 'Healthy',
      latency: '176 ms',
      errorRate: '0.24%',
      deployedText: 'Deployed 2d ago',
      chartData: [18, 34, 24, 42, 32, 54, 38, 48, 36, 46, 32, 42],
    },
  ];

  builtServices: BuiltServiceHealthItem[] = [];

  constructor() {
    this.rebuildServices();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['services']) {
      this.rebuildServices();
    }
  }

  trackByServiceId(_index: number, item: BuiltServiceHealthItem): string {
    return item.id;
  }

  onServiceAction(service: BuiltServiceHealthItem, event: Event): void {
    event.stopPropagation();
  }

  private rebuildServices(): void {
    this.builtServices = (this.services || []).map((service) => {
      const color = this.statusColorMap[service.status] || '#22c55e';
      return {
        ...service,
        chartSeries: [
          {
            name: service.name,
            data: service.chartData,
            color,
          },
        ],
      };
    });
  }
}