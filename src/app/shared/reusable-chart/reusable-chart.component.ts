
import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';

import {
  NgApexchartsModule,
  ApexAxisChartSeries,
  ApexChart,
  ApexStroke,
  ApexPlotOptions,
  ApexFill,
  ApexGrid,
  ApexXAxis,
  ApexYAxis,
  ApexLegend,
  ApexTooltip,
  ApexDataLabels,
} from 'ng-apexcharts';

export type SignalChartType = 'line' | 'area' | 'bar';

export interface SignalChartSeries {
  name: string;
  data: number[];
  color?: string;
}

export interface SignalChartOptions {
  series: ApexAxisChartSeries;
  chart: ApexChart;
  colors: string[];
  stroke: ApexStroke;
  plotOptions: ApexPlotOptions;
  fill: ApexFill;
  dataLabels: ApexDataLabels;
  grid: ApexGrid;
  xaxis: ApexXAxis;
  yaxis: ApexYAxis;
  legend: ApexLegend;
  tooltip: ApexTooltip;
}

@Component({
  selector: 'app-reusable-chart',
  standalone: true,
  imports: [CommonModule, NgApexchartsModule],
  templateUrl: './reusable-chart.component.html',
  styleUrl: './reusable-chart.component.scss',
})
export class ReusableChartComponent implements OnChanges {

  @Input() title = '';
  @Input() subtitle = '';
  @Input() type: SignalChartType = 'line';
  @Input() seriesItems: SignalChartSeries[] = [];
  @Input() categories: string[] = [];
  @Input() height = 260;
  @Input() showLegend = true;
  @Input() showCard = true;
  @Input() sparkline = false;
  @Input() curve: 'smooth' | 'straight' | 'stepline' = 'smooth';
  @Input() strokeWidth = 2;

  chartOptions!: SignalChartOptions;

  ngOnChanges(changes: SimpleChanges): void {
    if (
      changes['title'] ||
      changes['subtitle'] ||
      changes['type'] ||
      changes['seriesItems'] ||
      changes['categories'] ||
      changes['height'] ||
      changes['showLegend'] ||
      changes['sparkline'] ||
      changes['curve'] ||
      changes['strokeWidth']
    ) {
      this.buildChart();
    }
  }

  private buildChart(): void {

    const defaultPalette = [
      '#6366f1',
      '#ef4444',
      '#10b981',
      '#f59e0b',
      '#38bdf8',
    ];

    const colors = this.seriesItems.map(
      (item, index) =>
        item.color ||
        defaultPalette[index % defaultPalette.length]
    );

    const series: ApexAxisChartSeries = this.seriesItems.map(
      (item) => ({
        name: item.name,
        data: item.data,
      })
    );

    const isBar = this.type === 'bar';
    const isArea = this.type === 'area';

    this.chartOptions = {
      series,

      colors,

      chart: {
        type: this.type,
        height: this.height,
        width: '100%',
        background: 'transparent',

        toolbar: {
          show: false,
        },

        zoom: {
          enabled: false,
        },

        sparkline: {
          enabled: this.sparkline,
        },

        animations: {
          enabled: !this.sparkline,
        },

        fontFamily: 'Roboto, "Segoe UI", sans-serif',
      },

      stroke: {
        curve: this.curve,
        width: isBar ? 0 : this.strokeWidth,
      },

      plotOptions: {
        bar: {
          borderRadius: 4,
          columnWidth: '48%',
        },
      },

      fill: {
        type: isArea ? 'gradient' : 'solid',
        opacity: isArea ? 0.25 : isBar ? 0.9 : 1,

        gradient: {
          shadeIntensity: 1,
          opacityFrom: 0.35,
          opacityTo: 0.02,
          stops: [0, 95, 100],
        },
      },

      dataLabels: {
        enabled: false,
      },

      grid: {
        show: !this.sparkline,
        borderColor: 'rgba(148, 163, 184, 0.12)',
        strokeDashArray: 4,

        xaxis: {
          lines: {
            show: false,
          },
        },

        yaxis: {
          lines: {
            show: !isBar,
          },
        },
      },

      xaxis: {
        categories: this.categories,

        labels: {
          show: !this.sparkline,

          style: {
            colors: '#64748b',
            fontSize: '11px',
          },
        },

        axisBorder: {
          show: false,
        },

        axisTicks: {
          show: false,
        },
      },

      yaxis: {
        show: !this.sparkline,

        labels: {
          style: {
            colors: '#64748b',
            fontSize: '11px',
          },
        },
      },

      legend: {
        show: this.showLegend && !this.sparkline,
        position: 'top',
        horizontalAlign: 'left',

        labels: {
          colors: '#94a3b8',
        },

        markers: {
          shape: 'circle',
          strokeWidth: 1,
        },
      },

      tooltip: {
        enabled: true,
        theme: 'dark',

        x: {
          show: !this.sparkline,
        },
      },
    };
  }
}
