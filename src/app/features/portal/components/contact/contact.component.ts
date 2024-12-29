import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { MapComponent } from '../../../../shared/components/map/map.component';
import { TranslationService } from '../../../../core/services/translation.service';

@Component({
  selector: 'app-contact',
  standalone: true,
  imports: [CommonModule, RouterLink, TranslateModule, ReactiveFormsModule, MapComponent],
  templateUrl: './contact.component.html'
})
export class ContactComponent implements OnInit {
  contactForm: FormGroup;
  serviceTypes = [
    { value: 'corporate', label: 'CONTACT.FORM.SERVICES.CORPORATE' },
    { value: 'ip', label: 'CONTACT.FORM.SERVICES.IP' },
    { value: 'litigation', label: 'CONTACT.FORM.SERVICES.LITIGATION' },
    { value: 'family', label: 'CONTACT.FORM.SERVICES.FAMILY' },
    { value: 'real-estate', label: 'CONTACT.FORM.SERVICES.REAL_ESTATE' }
  ];

  constructor(
    private fb: FormBuilder,
    private translationService: TranslationService
  ) {
    this.contactForm = this.fb.group({
      firstName: ['', [Validators.required]],
      lastName: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      phone: ['', [Validators.required]],
      serviceType: ['', [Validators.required]],
      message: ['', [Validators.required]]
    });
  }

  ngOnInit() {
    this.translationService.currentLang$.subscribe(() => {
      this.serviceTypes = [...this.serviceTypes];
    });
  }

  onSubmit() {
    if (this.contactForm.valid) {
      console.log(this.contactForm.value);
    }
  }
}
