import { Component, EventEmitter, Input, Output } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-alert',
  standalone: true,
  imports: [MatCardModule, MatButtonModule],
  templateUrl: './alert.component.html',
})
export class AlertComponent {
  @Input() message = '';
  @Output() closed = new EventEmitter<void>();

  onClose(): void {
    this.closed.emit();
  }
}