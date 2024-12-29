import { Component, OnInit } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { Contract, ContractService } from './contract.service';
import { LawyersService } from '../../../core/services/admin/lawyers.service';
import { CommonModule } from '@angular/common';
import { PageHeaderComponent } from '../../../shared/components/page-header/page-header.component';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-contract',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    PageHeaderComponent,
    CommonModule,
    TranslateModule
  ],
  templateUrl: './contract.component.html',
  styleUrls: ['./contract.component.css']
})
export class ContractComponent implements OnInit {
  isLoading: boolean = true;
  error: string | null = null;
  searchControl = new FormControl();
  contracts: Contract[] = [];
  selectedContract: Contract | null = null;
  hasVisibleContracts: boolean = false;

  constructor(
    private contractService: ContractService,
    private lawyerService: LawyersService
  ) {}

  ngOnInit(): void {
    this.fetchContracts();
  }

  fetchContracts(): void {
    this.contractService.getContracts().subscribe(
      (contracts) => {
        this.contracts = contracts; 
        this.hasVisibleContracts = contracts.some(contract => !contract.agreementClause); 
        this.isLoading = false;
      },
      (err) => {
        this.error = 'Error fetching contracts';
        this.isLoading = false;
      }
    );
  }

  fetchOneContract(lawyerId: string): void {
    this.contractService.getContracts().subscribe(
      (contracts) => {
        this.contracts = contracts.filter(contract => contract.lawyerId === lawyerId);
        this.selectedContract = this.contracts.length > 0 ? this.contracts[0] : null; // Select the first match
      },
      (err) => {
        this.error = 'Error fetching contract';
      }
    );
  }
  confirmContract(contractId: string): void {
    // Retrieve the user object from sessionStorage
    const userString = sessionStorage.getItem('user'); // Get the user string from session storage
  
    if (!userString) {
      this.error = 'User data not found in session storage';
      return;
    }
  
    let user: any;
    try {
      user = JSON.parse(userString); 
    } catch (e) {
      this.error = 'Failed to parse user data from session storage';
      return;
    }
  
    const lawyerId = user?.lawyerId;
  
    if (!lawyerId) {
      this.error = 'Lawyer ID not found in user data';
      return;
    }
  
    this.contractService.confirmContract(contractId, lawyerId).subscribe(
      (updatedContract) => {
        const index = this.contracts.findIndex(c => c.contractId === contractId);
        if (index !== -1) {
          this.contracts[index] = updatedContract; 
        }
      },
      (err) => {
        this.error = 'Error confirming contract';
      }
    );
  }
  rejectContract(contractId: string): void {
    this.contractService.rejectContract(contractId).subscribe(
      (updatedContract) => {
        const index = this.contracts.findIndex(c => c.contractId === contractId);
        if (index !== -1) {
          this.contracts[index] = updatedContract;
        }
      },
      (err) => {
        this.error = 'Error rejecting contract';
      }
    );
  }

  getStatusColor(status: 'pending' | 'confirmed' | 'cancelled' | 'completed'): string {
    switch (status) {
      case 'pending':
        return 'bg-yellow-500 text-white';
      case 'confirmed':
        return 'bg-green-500 text-white'; 
      case 'cancelled':
        return 'bg-red-500 text-white'; 
      case 'completed':
        return 'bg-blue-500 text-white'; 
      default:
        return 'bg-gray-500 text-white';
    }
  }
  closeModal(  ) {
    this.selectedContract = null;
  }
}