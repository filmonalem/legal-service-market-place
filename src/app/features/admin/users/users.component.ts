import { ToasterService } from './../../../core/services/toaster.service';
import { Component, OnInit } from '@angular/core';
import { PageHeaderComponent } from '../../../shared/components/page-header/page-header.component';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgIconComponent, provideIcons } from '@ng-icons/core';
import { TranslateModule } from '@ngx-translate/core';
import { CommonModule } from '@angular/common';
import { UsersService } from '../../../core/services/admin/users.service';
import { Router } from '@angular/router';
import { heroUserGroup, heroXMark, heroUserMinus, heroArrowPath, heroCurrencyYen, heroLockOpen } from '@ng-icons/heroicons/outline';

interface Users {
  gender?: string,
  phoneNumber: string,
  email: string,
  fullName: string,
  role: string,
  isAdmin: boolean,
  isActive: boolean,
  isTransfer: boolean,
  userId: string,
  createdAt: Date,
}

@Component({
  selector: 'app-users',
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
      heroUserGroup,
      heroXMark,
      heroArrowPath,
      heroCurrencyYen,
      heroUserMinus,
      heroLockOpen
    })
  ],
  templateUrl: './users.component.html',
  styleUrl: './users.component.css'
})
export class UsersComponent implements OnInit {
  isLoading = false;
  users: Users[] = [];
  searchTerm = new FormControl('');

  userForm: Users = {
    gender: '',
    phoneNumber: '',
    email: '',
    fullName: '',
    role: '',
    isAdmin: false,
    isActive: false,
    isTransfer: false,
    userId: '',
    createdAt: new Date(),
  };

  constructor(
    private usersService: UsersService,
    private router: Router,
    private toasterService: ToasterService,
  ) { }

  ngOnInit(): void {
    this.fetchUsers();
  }

  navigateToUser(id: string): void {
    this.router.navigate(['/admin/users', id]);
  }

  fetchUsers() {
    this.isLoading = true;
    this.usersService.getUsers()
      .subscribe({
        next: (response: { data: Users[]; pagination: any }) => {
          this.users = response.data;
          this.isLoading = false;
        },
        error: () => {
          this.isLoading = false;
          this.toasterService.error('Failed to fetch users data');
        }
      });
  }

  confirmUser(userId: string) {
    this.isLoading = true;

  }

  terminateUser(userId: string): void {
    this.isLoading = true;

    if (this.userForm && this.userForm instanceof FormGroup) {
      this.userForm.patchValue({ userId });
    } else {
      this.toasterService.success('User Form is not properly defined or initialized.');
    }

    this.usersService.userActivateUser(userId).subscribe({
      next: () => {
        this.fetchUsers();
        this.isLoading = false;
        this.toasterService.success('User terminated successfully');
      },
      error: (err) => {
        console.error('Error terminating user:', err);
        this.isLoading = false;
        this.toasterService.error('Failed to terminate user');
      },
    });
  }

  transferUser(userId: string): void {
    this.isLoading = true;

    if (this.userForm && this.userForm instanceof FormGroup) {
      this.userForm.patchValue({ userId });
    } else {
      this.toasterService.success('User Form is not properly defined or initialized.');
    }

    this.usersService.transferUser(userId).subscribe({
      next: () => {
        this.fetchUsers();
        this.isLoading = false;
        this.toasterService.success('User is Transfer  successfully');
      },
      error: (err) => {
        console.error('Error terminating user:', err);
        this.isLoading = false;
        this.toasterService.error('Failed to transfer user');
      },
    });
  }




  searchUsers() {

  }

}
