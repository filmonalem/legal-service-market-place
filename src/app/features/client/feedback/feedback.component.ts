import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, ActivatedRoute } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { NgIconComponent, provideIcons } from '@ng-icons/core';
import { heroHandThumbUp, heroHandThumbDown, heroArrowPath } from '@ng-icons/heroicons/outline';
import { PageHeaderComponent } from '../../../shared/components/page-header/page-header.component';
import { StarRatingComponent } from '../../../shared/components/star-rating/star-rating.component';

@Component({
  selector: 'app-feedback',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    TranslateModule,
    ReactiveFormsModule,
    NgIconComponent,
    PageHeaderComponent,
    StarRatingComponent
  ],
  providers: [
    provideIcons({
      heroHandThumbUp,
      heroHandThumbDown,
      heroArrowPath
    })
  ],
  templateUrl: './feedback.component.html'
})
export class FeedbackComponent implements OnInit {
  feedbackForm: FormGroup;
  lawyerId: string | null = null;
  rating = 0;
  isSubmitting = false;
  
  ratingCriteria = [
    { id: 'expertise', label: 'FEEDBACK.CRITERIA.EXPERTISE' },
    { id: 'communication', label: 'FEEDBACK.CRITERIA.COMMUNICATION' },
    { id: 'responsiveness', label: 'FEEDBACK.CRITERIA.RESPONSIVENESS' },
    { id: 'value', label: 'FEEDBACK.CRITERIA.VALUE' },
    { id: 'professionalism', label: 'FEEDBACK.CRITERIA.PROFESSIONALISM' }
  ];

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute
  ) {
    this.feedbackForm = this.fb.group({
      overallRating: [0, [Validators.required, Validators.min(1), Validators.max(5)]],
      expertise: [0, [Validators.required, Validators.min(1), Validators.max(5)]],
      communication: [0, [Validators.required, Validators.min(1), Validators.max(5)]],
      responsiveness: [0, [Validators.required, Validators.min(1), Validators.max(5)]],
      value: [0, [Validators.required, Validators.min(1), Validators.max(5)]],
      professionalism: [0, [Validators.required, Validators.min(1), Validators.max(5)]],
      review: ['', [Validators.required, Validators.minLength(10)]],
      recommendation: [null, Validators.required],
      improvements: [''],
      anonymous: [false]
    });
  }

  ngOnInit() {
    this.lawyerId = this.route.snapshot.paramMap.get('id');
  }

  setRating(criteria: string, value: number) {
    this.feedbackForm.get(criteria)?.setValue(value);
  }

  onSubmit() {
    if (this.feedbackForm.valid) {
      this.isSubmitting = true;
      console.log('Feedback submitted:', this.feedbackForm.value);
      // TODO: Submit feedback to service
    }
  }
}
