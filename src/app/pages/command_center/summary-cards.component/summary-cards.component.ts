import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReusableChartComponent, SignalChartSeries } from '../../../shared/reusable-chart/reusable-chart.component';


export type SummaryCardTone = 'success' | 'danger' | 'warning' | 'info' | 'lightdanger';

export interface SummaryCardItem {
  id: string;
  label: string;
  value: string;
  delta: string;
  comparison?: string;
  tone: SummaryCardTone;
  sparklineData?: number[];
  valueColor?: string;
}

interface BuiltSummaryCard extends Omit<SummaryCardItem, 'sparklineData'> {
  sparklineData: number[];
  sparklineSeries: SignalChartSeries[];
  sparklineColor: string;
}

@Component({
  selector: 'app-summary-cards',
  standalone: true,
  imports: [CommonModule, ReusableChartComponent],
  templateUrl: './summary-cards.component.html',
  styleUrl: './summary-cards.component.scss',
})
export class SummaryCardsComponent implements OnChanges {
  private readonly toneColorMap: Record<SummaryCardTone, string> = {
    success: '#22c55e',
    danger: '#ef4444',
    warning: '#f59e0b',
    info: '#6366f1',
    lightdanger:'#EF7E7E',
  };

  @Input() showComparison = true;
  @Input() showSparkline = true;

  @Input() cards: SummaryCardItem[] = [
    {
      id: 'uptime',
      label: 'System uptime',
      value: '99.97%',
      delta: '+0.02%',
      comparison: 'vs. previous period',
      tone: 'success',
      sparklineData: [99.88, 99.90, 99.89, 99.94, 99.93, 99.95, 99.94, 99.97],
    },
    {
      id: 'incidents',
      label: 'Active incidents',
      value: '12',
      delta: '+3',
      comparison: 'in the last hour',
      tone: 'danger',
      sparklineData: [6, 7, 7, 9, 8, 10, 11, 12],
    },
    {
      id: 'latency',
      label: 'Average API latency',
      value: '248 ms',
      delta: '+18.4%',
      comparison: 'vs. previous period',
      tone: 'warning',
      sparklineData: [204, 210, 208, 218, 224, 222, 236, 248],
    },
    {
      id: 'error-rate',
      label: 'Error rate',
      value: '2.43%',
      delta: '+0.61%',
      comparison: 'vs. previous period',
      tone: 'danger',
      sparklineData: [1.78, 1.84, 1.81, 1.98, 1.95, 2.12, 2.28, 2.43],
    },
    {
      id: 'services-healthy',
      label: 'Services healthy',
      value: '18/22',
      delta: '-2',
      comparison: 'since 10:30',
      tone: 'info',
      sparklineData: [20, 20, 21, 20, 19, 19, 18, 18],
    },
  ];

  builtCards: BuiltSummaryCard[] = [];

  constructor() {
    this.rebuildCards();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['cards']) {
      this.rebuildCards();
    }
  }

  trackByCardId(_index: number, item: BuiltSummaryCard): string {
    return item.id;
  }

  onCardOptions(card: BuiltSummaryCard, event: Event): void {
    event.stopPropagation();
  }

  private rebuildCards(): void {
    this.builtCards = (this.cards || []).map((card) => {
      const color = this.toneColorMap[card.tone] || '#6366f1';
      const points = card.sparklineData ?? [];
      return {
        ...card,
        sparklineData: points,
        sparklineColor: color,
        sparklineSeries: points.length
          ? [
              {
                name: card.label,
                data: points,
                color,
              },
            ]
          : [],
      };
    });
  }
}