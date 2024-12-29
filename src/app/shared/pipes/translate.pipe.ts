import { Pipe, PipeTransform, inject } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

@Pipe({
  name: 'translate',
  standalone: true,
  pure: false
})
export class TranslatePipe implements PipeTransform {
  private translate = inject(TranslateService);

  transform(key: string): string {
    if (!key) return '';
    return this.translate.instant(key) || key;
  }
} 