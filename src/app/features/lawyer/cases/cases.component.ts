import { Component, OnInit } from '@angular/core';
import { CaseService } from '../../../core/services/case.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

export enum CaseStatus {
  IN_PROGRESS = 'in progress',
  COMPLETED = 'completed',
}

interface Case {
  caseId?: string;
  description: string;
  completed: boolean;
  status: CaseStatus;
  lawyerId: string; 
  caseName: string; 
}

@Component({
  selector: 'app-cases',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './cases.component.html',
  styleUrls: ['./cases.component.css'],
})
export class CasesComponent implements OnInit {
  caseList: Case[] = [];
  newCase: Omit<Case, 'caseId'> = { description: '', completed: false, lawyerId: '', caseName: '', status: CaseStatus.IN_PROGRESS };  
  editableCase: Case | null = null;
  isEditing = false;
  lawyerId: string;
  inputDescription: string = '';
  inputCaseName: string = '';

  constructor(private caseService: CaseService) {
    const lawyerIdFromStorage = sessionStorage.getItem('user');
    this.lawyerId = lawyerIdFromStorage ? JSON.parse(lawyerIdFromStorage).lawyerId : '';
  }

  ngOnInit() {
    if (this.lawyerId) {
      this.fetchCases();
    } else {
      console.error('Lawyer ID not found in session storage.');
    }
  }

  fetchCases() {
    this.caseService.getCases(this.lawyerId).subscribe(
      (cases: Case[]) => {
        this.caseList = cases.map(caseItem => ({
          ...caseItem,
          caseName: caseItem.caseName || ''
        }));
      },
      (error) => {
        console.error('Error fetching cases:', error);
      }
    );
  }

  addCase() {
    if (this.newCase.description.trim() && this.newCase.caseName.trim() && this.lawyerId) {
      const formData = {
        ...this.newCase,
        lawyerId: this.lawyerId,
      };

      this.caseService.createCase(formData).subscribe(
        (savedCase) => {
          this.caseList.push(savedCase);
          this.newCase = { description: '', completed: false, lawyerId: '', caseName: '', status: CaseStatus.IN_PROGRESS };
        },
        (error) => {
          console.error('Error adding case:', error);
        }
      );
    } else {
      console.error('Both description and case name are required, and lawyer ID must be valid.');
    }
  }

  deleteCase(caseId: string) {
    if (caseId) {
      this.caseService.deleteCase(caseId).subscribe(
        () => {
          this.caseList = this.caseList.filter(c => c.caseId !== caseId);
        },
        (error) => {
          console.error('Error deleting case:', error);
        }
      );
    }
  }

  editCase(index: number) {
    this.isEditing = true;
    this.editableCase = { ...this.caseList[index] };
    this.inputDescription = this.editableCase.description;
    this.inputCaseName = this.editableCase.caseName;
  }

  saveEdit() {
    if (this.editableCase && this.editableCase.caseId) { // Check if caseId is available
      const updatedData: Partial<Case> = {
        description: this.inputDescription,
        caseName: this.inputCaseName
      };
  
      this.caseService.updateCase(this.editableCase.caseId, updatedData).subscribe(
        (updatedCase) => {
          const index = this.caseList.findIndex(c => c.caseId === updatedCase.caseId);
          if (index !== -1) {
            this.caseList[index] = updatedCase; // Update case in the list
          }
          this.cancelEdit(); // Reset the editing state
        },
        (error) => {
          console.error('Error saving case:', error);
        }
      );
    } else {
      console.error('Editable case or caseId is not defined.');
    }
  }
  cancelEdit() {
    this.isEditing = false;
    this.editableCase = null;
    this.inputDescription = '';
    this.inputCaseName = '';
  }
}