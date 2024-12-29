import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, RouterLink, RouterModule } from '@angular/router';
import { Lawyer, LawyersService } from '../../../core/services/admin/lawyers.service';
import { ToasterService } from '../../../core/services/toaster.service';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { NgIconComponent } from '@ng-icons/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { PageHeaderComponent } from '../../../shared/components/page-header/page-header.component';

@Component({
  selector: 'app-lawyer-detail',
  templateUrl: './lawyer-detail.component.html',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    RouterModule,
    TranslateModule,
    NgIconComponent,
    PageHeaderComponent,
    ReactiveFormsModule,
    FormsModule
  ]
})
export class LawyerDetailComponent implements OnInit {
  lawyerId!: string;
  selectedLawyer: Lawyer | null = null; // Handle as a single object
  isLoading = false;

  constructor(
    private route: ActivatedRoute,
    private lawyerService: LawyersService,
    private toasterService: ToasterService
  ) {}

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      this.lawyerId = params.get('id')!;
      this.fetchLawyerDetails(this.lawyerId);
    });
  }

  fetchLawyerDetails(lawyerId: string): void {
    this.isLoading = true; // Set loading state
    this.lawyerService.getLawyerInfoById(lawyerId).subscribe(
      (data: Lawyer) => { // Expect a single Lawyer object
        this.selectedLawyer = data; // Set the selected lawyer
        this.isLoading = false; // Clear loading state
      },
      error => {
        this.isLoading = false; // Clear loading state
        console.error('Error fetching lawyer profile:', error);
        this.toasterService.error('Failed to fetch lawyer profile');
      }
    );
  }
}