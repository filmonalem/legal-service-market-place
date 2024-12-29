import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgIconComponent, provideIcons } from '@ng-icons/core';
import { heroStar } from '@ng-icons/heroicons/outline';
import { heroStarSolid } from '@ng-icons/heroicons/solid';

@Component({
  selector: 'app-star-rating',
  standalone: true,
  imports: [CommonModule, NgIconComponent],
  providers: [
    provideIcons({ 
      heroStar,
      heroStarSolid
    })
  ],
  template: `
    <div class="flex items-center space-x-1">
      <ng-container *ngFor="let star of stars; let i = index">
        <button type="button"
                (click)="onRatingChange(i + 1)"
                (mouseenter)="onHover(i + 1)"
                (mouseleave)="onHoverEnd()"
                class="focus:outline-none focus:ring-2 focus:ring-primary/20 rounded-full p-0.5
                       transition-transform hover:scale-110"
                [class.text-amber-400]="(hoverRating || rating) >= i + 1"
                [class.text-muted]="(hoverRating || rating) < i + 1">
          <ng-icon [name]="(hoverRating || rating) >= i + 1 ? 'heroStarSolid' : 'heroStar'"
                  [class]="size === 'lg' ? 'w-8 h-8 sm:w-10 sm:h-10' : 'w-5 h-5 sm:w-6 sm:h-6'">
          </ng-icon>
        </button>
      </ng-container>
    </div>
  `
})
export class StarRatingComponent {
  @Input() rating = 0;
  @Input() size: 'default' | 'lg' = 'default';
  @Output() ratingChange = new EventEmitter<number>();

  stars = new Array(5);
  hoverRating = 0;

  onRatingChange(rating: number): void {
    this.rating = rating;
    this.ratingChange.emit(rating);
  }

  onHover(rating: number): void {
    this.hoverRating = rating;
  }

  onHoverEnd(): void {
    this.hoverRating = 0;
  }
} 