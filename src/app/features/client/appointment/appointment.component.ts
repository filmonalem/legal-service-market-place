import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, Router } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { NgIconComponent, provideIcons } from '@ng-icons/core';
import { 
  heroCalendar,
  heroClock,
  heroCheckCircle,
  heroXCircle,
  heroArrowPath,
  heroUserCircle,
  heroScale,
  heroMagnifyingGlass,
  heroEye,
  heroXMark
} from '@ng-icons/heroicons/outline';
import { AppointmentService } from '../../../core/services/appointment.service';
import { ToasterService } from '../../../core/services/toaster.service';
import { PageHeaderComponent } from '../../../shared/components/page-header/page-header.component';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { LawyersService } from '../../../core/services/admin/lawyers.service';
import { CapitalizePipe } from '../../../capitalize.pipe';
import { AvatarGenerator } from 'random-avatar-generator';

type FilterType = 'upcoming' | 'past' | 'all' | 'cancelled';

export interface Appointment {
  appointmentId: string;
  lawyerId: string;
  lawyerName: string;
  lawyerPhotoURL?: string;
  date: string;
  timeSlot: string;
  type: string;
  status: 'pending' | 'confirmed' | 'cancelled' | 'completed';
  description?: string;
}

@Component({
  selector: 'app-appointment',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    TranslateModule,
    NgIconComponent,
    PageHeaderComponent,
    ReactiveFormsModule,
    CapitalizePipe
  ],
  providers: [
    provideIcons({
      heroCalendar,
      heroClock,
      heroCheckCircle,
      heroXCircle,
      heroArrowPath,
      heroUserCircle,
      heroScale,
      heroMagnifyingGlass,
      heroEye,
      heroXMark
    })
  ],
  templateUrl: './appointment.component.html'
})
export class AppointmentComponent implements OnInit {
  avatarGenerator = new AvatarGenerator();

  appointments: Appointment[] = [];
  filteredAppointments: Appointment[] = [];
  isLoading = false;
  error: string | null = null;
  activeFilter: FilterType = 'upcoming';
  searchControl = new FormControl('');
  searchTerm = '';
  showCancelModal = false;
  lawyerDetails: Record<string, any> = {};
  selectedAppointment: any;
  filters: string[] = ['All', 'Upcoming', 'Past', 'Cancelled']; 

  constructor(
    private appointmentService: AppointmentService,
    private toaster: ToasterService,
    private router: Router,
    private lawyersService: LawyersService
  ) {
    this.searchControl.valueChanges.pipe(
      debounceTime(300),
      distinctUntilChanged()
    ).subscribe(value => {
      this.searchTerm = value?.toLowerCase() || '';
      this.filterAppointments();
    });
  }

  ngOnInit() {
    this.loadAppointments();
  }

  loadAppointments() {
    this.isLoading = true;

    const getId = sessionStorage.getItem('user');

    if (getId) {
      const user = JSON.parse(getId); 
      const userId = user?.userId;
      this.appointmentService.getAppointmentsByClient(userId).subscribe({
        next: (appointments: Appointment[]) => {
          this.appointments = appointments;
          this.filteredAppointments = appointments; // Initialize filtered appointments
          this.loadLawyerDetails();
          this.filterAppointments();
          this.isLoading = false;
        },
        error: (error: Error) => {
          this.error = 'Failed to load appointments';
          this.isLoading = false;
          this.toaster.error(this.error);
        }
      });
    } else {
      this.error = 'User ID not found in session storage';
      this.isLoading = false;
      this.toaster.error(this.error);
    }
  }
  
  loadLawyerDetails() {
    const lawyerIds = Array.from(new Set(this.appointments.map(app => app.lawyerId))); 
    lawyerIds.forEach(lawyerId => {
      this.lawyersService.getLawyerById(lawyerId).subscribe({
        next: (lawyer) => {
          this.lawyerDetails[lawyerId] = lawyer; 
        },
        error: (error) => {
          this.toaster.error(`Failed to load lawyer details for ID: ${lawyerId}`);
        }
      });
    });
  }

  filterAppointments() {
    const now = new Date();
    let filtered = this.appointments;

    switch (this.activeFilter) {
      case 'upcoming':
        filtered = filtered.filter(app => 
          new Date(`${app.date} ${app.timeSlot}`) >= now
        );
        break;
      case 'past':
        filtered = filtered.filter(app => 
          new Date(`${app.date} ${app.timeSlot}`) < now
        );
        break;
      case 'all':
        // No additional filtering needed for 'all'
        break;
      case 'cancelled':
        filtered = filtered.filter(app => app.status === 'cancelled');
        break;
    }

    // Apply search term filtering
    if (this.searchTerm) {
      filtered = filtered.filter(app =>
        app.lawyerName.toLowerCase().includes(this.searchTerm) ||
        app.type.toLowerCase().includes(this.searchTerm) ||
        app.status.toLowerCase().includes(this.searchTerm) ||
        app.date.toLowerCase().includes(this.searchTerm) ||
        app.timeSlot.toLowerCase().includes(this.searchTerm)
      );
    }

    this.filteredAppointments = filtered;
  }

  getRandomAvatar(): string {
    return this.avatarGenerator.generateRandomAvatar();
  }
 
  setFilter(filter: string) {
    this.activeFilter = filter as FilterType; 
    this.filterAppointments(); 
  }

  initiateCancel(appointment: Appointment) {
    this.selectedAppointment = appointment;
    this.showCancelModal = true;
  }

  closeCancelModal() {
    this.showCancelModal = false;
    this.selectedAppointment = null;
  }

  sendReminder(appointmentId: string) {
    this.appointmentService.sendReminder(appointmentId).subscribe({
      next: () => {
        this.toaster.success('Reminder sent successfully');
      },
      error: () => {
        this.toaster.error('Failed to send reminder');
      }
    });
  }

  getStatusColor(status: 'pending' | 'confirmed' | 'cancelled' | 'completed'): string {
    const statusColors: Record<'pending' | 'confirmed' | 'cancelled' | 'completed', string> = {
      pending: 'bg-yellow-100 text-yellow-800',
      confirmed: 'bg-blue-100 text-blue-800',
      cancelled: 'bg-red-100 text-red-800',
      completed: 'bg-green-100 text-green-800'
    };
    return statusColors[status];
  }

  getPaymentStatusColor(status: string): string {
    switch (status) {
      case 'paid':
        return 'text-emerald-600 bg-emerald-100';
      case 'pending':
        return 'text-amber-600 bg-amber-100';
      case 'refunded':
        return 'text-blue-600 bg-blue-100';
      default:
        return 'text-gray-600 bg-gray-100';
    }
  }

  viewDetails(appointmentId: string) {
    this.router.navigate(['/client/appointments', appointmentId]);
  }
}