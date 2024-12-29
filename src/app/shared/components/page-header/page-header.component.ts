import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { NgIconComponent } from '@ng-icons/core';

type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'ghost' | 'destructive';

export interface HeaderAction {
  label: string;
  icon?: string;
  variant?: ButtonVariant;
  route?: string | any[];
  onClick?: () => void;
}

@Component({
  selector: 'app-page-header',
  standalone: true,
  imports: [CommonModule, RouterLink, TranslateModule, NgIconComponent],
  templateUrl: './page-header.component.html'
})
export class PageHeaderComponent {
  @Input() title!: string;
  @Input() subtitle?: string;
  @Input() isTransparent = false;
  @Input() actions: {
    label: string;
    icon?: string;
    variant?: ButtonVariant;
    route?: any[];
    click?: () => void;
  }[] = [];

  getVariantClasses(variant: ButtonVariant = 'primary'): string {
    const variants: Record<ButtonVariant, string> = {
      primary: `bg-primary text-primary-foreground hover:bg-primary/90
                focus:ring-primary/20`,
                
      secondary: `bg-secondary text-secondary-foreground hover:bg-secondary/80
                  focus:ring-secondary/40`,
                  
      outline: `border border-border bg-background hover:bg-accent
                text-foreground focus:ring-accent`,
                
      ghost: `hover:bg-accent hover:text-accent-foreground
              text-foreground focus:ring-accent`,
              
      destructive: `bg-destructive text-destructive-foreground hover:bg-destructive/90
                    focus:ring-destructive/20`
    };

    return variants[variant];
  }
}
