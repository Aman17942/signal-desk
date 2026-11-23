import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-page-header-strip',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './page-header-strip.component.html',
  styleUrl: './page-header-strip.component.scss',
})
export class PageHeaderStripComponent {
  @Input() title = '';
  @Input() subtitle = '';
  @Input() showStatusDot = false;
  @Input() statusDotColor = '#10b981';
}