import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { RouterLink, RouterModule } from '@angular/router';
import { BookingService } from '../../client/booking/booking.service';
import { Booking } from '../models/booking.model';
import { PageHeaderComponent } from '../../../shared/components/page-header/page-header.component';
import { TranslateModule } from '@ngx-translate/core';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { provideIcons, NgIconComponent } from '@ng-icons/core';
import {
  heroCalendar,
  heroClock,
  heroCheckCircle,
  heroXCircle,
  heroArrowPath,
  heroUserCircle,
  heroMagnifyingGlass,
  heroEye,
  heroXMark
} from '@ng-icons/heroicons/outline';
import { DomSanitizer } from '@angular/platform-browser';
import { UsersService } from '../../../core/services/admin/users.service';
import { CapitalizePipe } from '../../../capitalize.pipe';

type FilterType = 'upcoming' | 'past' | 'all';

export interface User {
  userId: string;
  fullName: string;
  email: string;
  phoneNumber: string;
}

@Component({
  selector: 'app-appointments',
  standalone: true,
  providers: [
    provideIcons({
      heroCalendar,
      heroClock,
      heroCheckCircle,
      heroXCircle,
      heroArrowPath,
      heroUserCircle,
      heroMagnifyingGlass,
      heroEye,
      heroXMark
    })
  ],
  imports: [CommonModule, PageHeaderComponent, TranslateModule, NgIconComponent, ReactiveFormsModule,FormsModule ,RouterLink, RouterModule,CapitalizePipe],
  templateUrl: './appointments.component.html',
  styleUrls: ['./appointments.component.css']
})

export class AppointmentsComponent implements OnInit {
  bookings: Booking[] = [];
  filteredAppointments: Booking[] = [];
  error: string | null = null;
  isLoading = false;
  activeFilter: FilterType = 'upcoming';
  filters: FilterType[] = ['upcoming', 'past', 'all'];
  showCancelModal = false;
  selectedAppointment: Booking | null = null;
  searchControl = new FormControl('');
  currentPage = 1;
  itemsPerPage = 10;
  selectedBookingDetails: any;
  users: { [key: string]: User } = {};
  showRescheduleModal = false;
  date: string ='';
  timeSlot:any;
  
  availableSlots = [
    { id: '1', time: '9:00 AM', date: '2024-12-04', ethiopianTime: '3:00', available: true },
    { id: '2', time: '10:00 AM', date: '2024-12-04', ethiopianTime: '4:00', available: true },
    { id: '3', time: '11:00 AM', date: '2024-12-04', ethiopianTime: '5:00', available: true },
    { id: '4', time: '2:00 PM', date: '2024-12-04', ethiopianTime: '8:00', available: true },
    { id: '5', time: '3:00 PM', date: '2024-12-04', ethiopianTime: '9:00', available: true },
    { id: '6', time: '4:00 PM', date: '2024-12-04', ethiopianTime: '10:00', available: true }
  ];
  constructor(private bookingService: BookingService, private sanitizer: DomSanitizer, private usersService: UsersService) {}

  ngOnInit(): void {
    this.loadBookings();
  }

  private loadBookings(): void {
    this.isLoading = true;
    const userString = sessionStorage.getItem('user');

    if (!userString) {
      this.error = 'User data not found in session storage';
      this.isLoading = false;
      return;
    }

    let user: any;
    try {
      user = JSON.parse(userString);
    } catch (e) {
      this.error = 'Failed to parse user data from session storage';
      this.isLoading = false;
      return;
    }

    const lawyerId = user?.lawyerId;

    if (lawyerId) {
      this.bookingService.getOneBooking(lawyerId).subscribe(
        (data: Booking[]) => {
          this.bookings = data;
          this.fetchUserDetails(); 
          this.filterAppointments();
          this.isLoading = false;
        },
        (error) => {
          this.error = 'Error fetching bookings: ' + error.message;
          this.isLoading = false;
        }
      );
    } else {
      this.error = 'Lawyer ID not found in session storage';
      this.isLoading = false;
    }
  } 

  get sanitizedFilePath() {
    return this.selectedBookingDetails && this.selectedBookingDetails.document
      ? this.sanitizer.bypassSecurityTrustResourceUrl(`http://localhost:3000/files/${this.selectedBookingDetails.document.filePath}`)
      : '';
  }
  private fetchUserDetails(): void {
    const userIds = [...new Set(this.bookings.map(booking => booking.userId))];
    userIds.forEach(userId => {
      this.usersService.getOneUser(userId).subscribe(
        (user: User) => {
          this.users[userId] = user;
        },
        error => {
          console.error(`Failed to fetch user details for ID: ${userId}`, error);
        }
      );
    });
  }

  filterAppointments() {
    const now = new Date();
    this.filteredAppointments = this.bookings.filter((booking) => {
        const appointmentDate = new Date(booking.date);
        
        const isValidDate = !isNaN(appointmentDate.getTime());
        
        const matchesFilter = this.getFilterMatch(appointmentDate);
        const matchesSearch = this.searchControl.value 
            ? booking.description.toLowerCase().includes(this.searchControl.value.toLowerCase())
            : true;

        return isValidDate && matchesFilter && matchesSearch;
    });

    if (this.filteredAppointments.length === 0) {
        this.error = 'No valid appointments available.';
    } else {
        this.error = null;
    }
    
    this.currentPage = 1; 
}

  private getFilterMatch(appointmentDate: Date): boolean {
    switch (this.activeFilter) {
      case 'upcoming':
        return appointmentDate >= new Date();
      case 'past':
        return appointmentDate < new Date();
      case 'all':
      default:
        return true;
    }
  }

  setFilter(filter: FilterType): void {
    this.activeFilter = filter;
    this.filterAppointments();
  }

  totalPages(): number {
    return Math.ceil(this.filteredAppointments.length / this.itemsPerPage);
  }

  previousPage(): void {
    if (this.currentPage > 1) {
      this.currentPage--;
    }
  }

  nextPage(): void {
    if (this.currentPage < this.totalPages()) {
      this.currentPage++;
    }
  }

  getStatusColor(status: string): string {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'confirmed':
        return 'bg-blue-100 text-blue-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      case 'completed':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-500 text-white';
    }
  }

  trackByBookingId(index: number, booking: Booking): string {
    return booking.bookingId; 
  }

  fetchAppointments(): void {
    this.loadBookings(); 
  }

  // viewDetails(bookingId: string): void {
  //   this.selectedBookingDetails = this.bookings.find(booking => booking.bookingId === bookingId) || null;
  //   if (this.selectedBookingDetails) {
  //     console.log(`Viewing details for booking ID: ${bookingId}`, this.selectedBookingDetails);
  //   } else {
  //     console.error('Booking not found for ID:', bookingId);
  //   }
  // }
  viewDetails(bookingId: string): void {
    this.selectedBookingDetails = this.bookings.find(booking => booking.bookingId === bookingId) || null;
    if (this.selectedBookingDetails) {
      console.log(`Viewing details for booking ID: ${bookingId}`, this.selectedBookingDetails);
    }
  }

  confirmBooking(bookingId: string): void {
    const selectedBooking = this.bookings.find(b => b.bookingId === bookingId);
    
    if (!selectedBooking?.date || !selectedBooking?.timeSlot) {
        this.error = 'Date and time slot must be provided to confirm the booking.';
        return;
    }

    const payload = {
        date: selectedBooking.date,
        timeSlot: selectedBooking.timeSlot
    };


    this.bookingService.confirmBooking(bookingId, payload).subscribe(
        (updatedBooking) => {
            const index = this.filteredAppointments.findIndex(b => b.bookingId === bookingId);
            if (index !== -1) {
                this.filteredAppointments[index] = updatedBooking;
            }
            this.showCancelModal = false; 
        },
        (error) => {
            this.error = 'Failed to confirm booking: ' + error.message;
        }
    );
}  
 
rescheduleBooking(bookingId: string, newDate: string, newTimeSlot: number): void {
  const payload = { date: newDate, timeSlot: newTimeSlot };
  
  this.bookingService.rescheduleBooking(bookingId, payload).subscribe(
      (updatedBooking) => {
          console.log('Booking successfully rescheduled', updatedBooking);
          this.fetchAppointments();
      },
      (error) => {
          this.error = 'Failed to reschedule booking: ' + error.message;
      }
  );
}
  openRescheduleModal(bookingId: string) {
    const selectedBooking = this.bookings.find(b => b.bookingId === bookingId);
    if (selectedBooking) {
      this.selectedAppointment = selectedBooking;
      this.date = '';
      this.timeSlot ;
      this.showRescheduleModal = true; 
    } else {
      this.error = 'Booking not found';
    }
  }
  cancelAppointment(bookingId: string): void {
    this.bookingService.cancelBooking(bookingId).subscribe(
      () => {
        this.filteredAppointments = this.filteredAppointments.filter(
          (booking) => booking.bookingId !== bookingId
        );
      },
      (error) => {
        this.error = 'Failed to cancel booking: ' + error.message;
      }
    );
  }
  
 
}