import { Component, EventEmitter, Input, OnChanges, Output, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatChipsModule } from '@angular/material/chips';
import { MatTableModule } from '@angular/material/table';

export type HttpMethodType = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';

export interface EndpointMetricRow {
  id: string;
  endpoint: string;
  method: HttpMethodType;
  throughput: string;
  p95Latency: string;
  p99Latency: string;
  errorRate: string;
  isHighError?: boolean;
}

interface EndpointTableRow extends EndpointMetricRow {
  methodColor: string;
}

const METHOD_COLOR_MAP: Record<HttpMethodType, string> = {
  GET: '#22c55e',
  POST: '#6366f1',
  PUT: '#f59e0b',
  PATCH: '#f59e0b',
  DELETE: '#ef4444',
};

const DEFAULT_ENDPOINTS: EndpointMetricRow[] = [
  {
    id: 'auth',
    endpoint: '/v1/payments/authorize',
    method: 'POST',
    throughput: '1.42k/s',
    p95Latency: '842 ms',
    p99Latency: '1.82 s',
    errorRate: '7.21%',
    isHighError: true,
  },
  {
    id: 'capture',
    endpoint: '/v1/payments/capture',
    method: 'POST',
    throughput: '864/s',
    p95Latency: '312 ms',
    p99Latency: '740 ms',
    errorRate: '1.08%',
  },
  {
    id: 'get-payment',
    endpoint: '/v1/payments/:id',
    method: 'GET',
    throughput: '2.18k/s',
    p95Latency: '86 ms',
    p99Latency: '174 ms',
    errorRate: '0.12%',
  },
  {
    id: 'refunds',
    endpoint: '/v1/refunds',
    method: 'POST',
    throughput: '246/s',
    p95Latency: '428 ms',
    p99Latency: '892 ms',
    errorRate: '0.84%',
  },
  {
    id: 'payment-methods',
    endpoint: '/v1/payment-methods',
    method: 'GET',
    throughput: '1.76k/s',
    p95Latency: '72 ms',
    p99Latency: '136 ms',
    errorRate: '0.06%',
  },
];

@Component({
  selector: 'app-endpoint-table',
  standalone: true,
  imports: [CommonModule, MatCardModule, MatChipsModule, MatTableModule],
  templateUrl: './endpoint-table.component.html',
  styleUrl: './endpoint-table.component.scss',
})
export class EndpointTableComponent implements OnChanges {
  @Input() rows: EndpointMetricRow[] = DEFAULT_ENDPOINTS;
  @Output() rowSelect = new EventEmitter<EndpointMetricRow>();

  displayedColumns: string[] = [
    'endpoint',
    'method',
    'throughput',
    'p95Latency',
    'p99Latency',
    'errorRate',
  ];

  dataSource: EndpointTableRow[] = [];

  constructor() {
    this.syncRows();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['rows']) {
      this.syncRows();
    }
  }

  onRowClick(row: EndpointTableRow): void {
    this.rowSelect.emit(row);
  }

  private syncRows(): void {
    const source = this.rows?.length ? this.rows : DEFAULT_ENDPOINTS;
    this.dataSource = source.map((item) => ({
      ...item,
      methodColor: METHOD_COLOR_MAP[item.method] || '#6366f1',
    }));
  }
}