import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { PageHeaderComponent } from '../../../shared/components/page-header/page-header.component';

import {
  heroFolder,
  heroDocumentText,
  heroClipboardDocument,
  heroUserGroup,
} from '@ng-icons/heroicons/outline';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgIconComponent, provideIcons } from '@ng-icons/core';
import { ClientsService } from '../../../core/services/admin/clients.service';
import { Router } from '@angular/router';
import { ToasterService } from '../../../core/services/toaster.service';

interface Clients {
  gender?: string,
  phoneNumber: string,
  email: string,
  fullName: string,
  role: string,
  isAdmin: boolean,
  isActive: boolean,
  isTransfer: boolean,
  hasCase: boolean,
  userId: string,
  createdDate: Date,
}

@Component({
  selector: 'app-clients',
  standalone: true,
  imports: [
    CommonModule,
    TranslateModule,
    NgIconComponent,
    PageHeaderComponent,
    ReactiveFormsModule,
    FormsModule
  ],
  providers: [
    provideIcons({
      heroFolder,
      heroDocumentText,
      heroClipboardDocument,
      heroUserGroup
    })
  ],
  templateUrl: './clients.component.html',
  styleUrl: './clients.component.css'
})
export class ClientsComponent implements OnInit {
  isLoading: boolean = false;
  clients: Clients[] = [];

  constructor(
    private clientsService: ClientsService,
    private router: Router,
    private toasterService: ToasterService,
  ) { }

  ngOnInit() {
    this.fetchClients();
  }

  navigateToClient(id: string): void {
    this.router.navigate(['/admin/clients', id]);
  }

  fetchClients() {
    this.isLoading = true;
    this.clientsService.getClients()
      .subscribe({
        next: (response: { data: Clients[]; pagination: any }) => {
          this.clients = response.data;
          this.isLoading = false;
        },
        error: () => {
          this.isLoading = false;
          this.toasterService.error('Failed to fetch clients data');
        }
      });
  }
}
