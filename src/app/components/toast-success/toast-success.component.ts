import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-toast-success',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './toast-success.component.html',
  styleUrl: './toast-success.component.css'
})
export class ToastSuccessComponent implements OnChanges {
  @Input() message: string = '';
  @Input() duration: number = 5000; // Default 5 seconds

  isVisible: boolean = false;

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['message'] && this.message) {
      this.isVisible = true;
      setTimeout(() => {
        this.isVisible = false;
        setTimeout(() => {
          this.message = '';
        }, 500); // Wait for fade-out animation
      }, this.duration);
    }
  }
}
