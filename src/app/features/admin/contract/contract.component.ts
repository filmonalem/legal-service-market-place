import { ContractsService } from './../../../core/services/admin/contract.service';
import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { NgIconComponent, provideIcons } from '@ng-icons/core';
import {
  heroPlus,
  heroScale,
  heroFolder,
  heroCalendar,
  heroChatBubbleLeftRight,
  heroDocumentText,
  heroArrowTrendingUp,
  heroClipboardDocument,
  heroUserGroup
} from '@ng-icons/heroicons/outline';
import { TranslateModule } from '@ngx-translate/core';
import { DashboardStats, LawyersService } from '../../../core/services/admin/lawyers.service';
import { PageHeaderComponent } from '../../../shared/components/page-header/page-header.component';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ToasterService } from '../../../core/services/toaster.service';

interface Contract {
  index?: number;
  contractId?: string;
  lawyerId: string;
  fullName: string;
  phoneNumber: string;
  effectiveDate: string;
  agreementClause:boolean;
  termStart: Date;
  termEnd: Date;
  purpose: string;
  compensationRate: number;
  paymentTerms: string;
  confidentialityClause: boolean;
  additionalNotes: string;
}

@Component({
  selector: 'app-contract',
  standalone: true,
  imports: [
    CommonModule,
    TranslateModule,
    NgIconComponent,
    PageHeaderComponent,
    FormsModule,
    ReactiveFormsModule
  ],
  providers: [
    provideIcons({
      heroPlus,
      heroScale,
      heroFolder,
      heroCalendar,
      heroChatBubbleLeftRight,
      heroDocumentText,
      heroArrowTrendingUp,
      heroClipboardDocument,
      heroUserGroup
    })
  ],
  templateUrl: './contract.component.html',
  styleUrls: ['./contract.component.css']
})
export class ContractComponent implements OnInit {
  isLoading = false;
  isShowForm = true;
  isViewOpen = false;

  isBasicInfoOpen = true;
  isPaymentOpen = false;
  isReviewOpen = false;

  stats: DashboardStats = {
    activeLawyers: 0,
    requestLawyers: 0,
    upcomingLawyers: 0,
    unreadMessages: 0
  };
  activeButton: string = 'Fixed Rate';

  searchTerm = new FormControl('');
  paymentTermsOptions: string[] = [
    'Last Term of Contract',
    'Start Term of Contract',
    'Net 30 Days',
    'Net 60 Days',
    'Upon Completion',
    'Monthly Payment',
    'Quarterly Payment',
    'Half-Yearly Payment',
    'Yearly Payment'
  ];

  contractForm: Contract = {
    index: 0,
    contractId: "",
    lawyerId: "",
    fullName: "",
    phoneNumber: "",
    agreementClause:false,
    effectiveDate: "",
    termStart: new Date(),  // Consider setting to a meaningful default
    termEnd: new Date(),    // Consider setting to a meaningful default
    purpose: "",
    compensationRate: 0,
    paymentTerms: "",
    confidentialityClause: false,
    additionalNotes: ""
  };

  lawyers: any[] = [];
  contracts: any[] = [];

  constructor(
    private lawyerService: LawyersService,
    private contractsService: ContractsService,
    private toasterService: ToasterService
  ) { }

  ngOnInit(): void {
    this.fetchLawyers();
    this.fetchContractAgreement();
  }

  onLawyerChange(selectedLawyer: string): void {
    const lawyer = this.lawyers.find(l => l.fullName === selectedLawyer);
    if (lawyer) {
      this.contractForm.phoneNumber = lawyer.phoneNumber;
      this.contractForm.fullName = lawyer.fullName;
      this.contractForm.lawyerId = lawyer.lawyerId;
    }
  }

  fetchLawyers(): void {
    this.isLoading = true;
    this.lawyerService.getDataLawyer()
      .subscribe({
        next: (response: { data: any[]; pagination: any }) => {
          this.lawyers = response.data;
          this.isLoading = false;
        },
        error: (err) => {
          this.isLoading = false;
          this.toasterService.error('Failed to fetch lawyers data: ' + err.message);
        }
      });
  }

  createContract() {
    this.isLoading = true;

    this.contractForm.termStart = new Date(this.contractForm.termStart);
    this.contractForm.termEnd = new Date(this.contractForm.termEnd);

    if (!this.validateContractProfile()) {
      this.isLoading = false;
      this.toasterService.error('Please fill in all required fields in the profile section.');
      return;
    }

    this.contractsService.submitContract(this.contractForm)
      .subscribe({
        next: () => {
          this.isLoading = false;
          this.toasterService.success('Contract created successfully');
          this.resetForm();
        },
        error: (err) => {
          this.isLoading = false;
          this.toasterService.error('Failed to create contract: ' + err.message);
        }
      });
  }

  // fetchContractAgreement() {
  //   this.isLoading = true;
  //   this.contractsService.getAllDataContracts()
  //     .subscribe({
  //       next: (data) => {
  //         this.contracts = data; // Update your contracts array
  //         console.log(this.contracts); // Debugging line to check the fetched data
  //         this.isLoading = false;
  //         this.toasterService.success('Contract agreement data fetched successfully');
  //       },
  //       error: (err) => {
  //         this.isLoading = false;
  //         this.toasterService.error('Failed to fetch contract agreement: ' + err.message);
  //       }
  //     });
  // }
  fetchContractAgreement() {
    this.isLoading = true;
    this.contractsService.getAllDataContracts()
      .subscribe({
        next: (data: Contract[]) => { // Specify the type of data
          this.contracts = data.map((contract: Contract) => { // Specify the type of contract
            // Find the lawyer associated with this contract
            const lawyer = this.lawyers.find(l => l.lawyerId === contract.lawyerId);
            // Return a new object including the lawyer's full name
            return {
              ...contract,
              fullName: lawyer ? lawyer.fullName : 'Unknown Lawyer', // Set default if not found
              phoneNumber: lawyer ? lawyer.phoneNumber : 'N/A' // Similar for phone number
            };
          });
          console.log(this.contracts); // Debugging line to check the fetched data
          this.isLoading = false;
          this.toasterService.success('Contract agreement data fetched successfully');
        },
        error: (err) => {
          this.isLoading = false;
          this.toasterService.error('Failed to fetch contract agreement: ' + err.message);
        }
      });
  }
  confirmContractAgreement() {
    this.isLoading = true;
    const contractId = this.contractForm.contractId as string;

    if (!contractId) {
      this.isLoading = false;
      this.toasterService.error('Contract ID is missing');
      return;
    }

    this.contractsService.confirmContractAgreement(contractId)
      .subscribe({
        next: () => {
          this.isLoading = false;
          this.toasterService.success('Contract agreement confirmed successfully');
        },
        error: (error) => {
          this.isLoading = false;
          console.error('Error confirming contract agreement:', error);
          this.toasterService.error('Failed to confirm contract agreement: ' + error.message);
        }
      });
  }

  resetForm() {
    this.contractForm = {
      lawyerId: "",
      contractId: "",
      fullName: "",
      phoneNumber: "",
      agreementClause:false,
      effectiveDate: "",
      termStart: new Date(),
      termEnd: new Date(),
      purpose: "",
      compensationRate: 0,
      paymentTerms: "",
      confidentialityClause: false,
      additionalNotes: ""
    };
  }

  setActiveButton(button: string): void {
    this.activeButton = button;
  }

  toggleForm(): void {
    this.isShowForm = !this.isShowForm;
    this.isViewOpen = !this.isViewOpen;
  }

  showView() {
    this.isShowForm = false;
    this.isViewOpen = true;
  }

  showPayment() {
    this.isPaymentOpen = true;
    this.isReviewOpen = false;
  }

  showReview() {
    this.isPaymentOpen = false;
    this.isReviewOpen = true;
  }

  validateContractProfile(): boolean {
    return ['fullName', 'phoneNumber', 'effectiveDate', 'termStart', 'termEnd', 'purpose']
      .every(field => !!this.contractForm[field as keyof Contract]);
  }

  validateContractPayment(): boolean {
    return ['compensationRate', 'paymentTerms', 'confidentialityClause', 'additionalNotes']
      .every(field => !!this.contractForm[field as keyof Contract]);
  }

  showPaymentForm() {
    if (this.validateContractProfile()) {
      this.isBasicInfoOpen = false;
      this.isPaymentOpen = true;
      this.isReviewOpen = false;
    } else {
      this.toasterService.error('Please fill in all required fields in the profile section.');
    }
  }

  backPaymentForm() {
    this.isBasicInfoOpen = true;
    this.isPaymentOpen = false;
    this.isReviewOpen = false;
  }

  showReviewProfile() {
    if (this.validateContractPayment()) {
      this.isBasicInfoOpen = false;
      this.isPaymentOpen = false;
      this.isReviewOpen = true;
    } else {
      this.toasterService.error('Please fill in all required fields in the payment section.');
    }
  }

  backReviewProfile() {
    this.isBasicInfoOpen = false;
    this.isPaymentOpen = true;
    this.isReviewOpen = false;
  }
}