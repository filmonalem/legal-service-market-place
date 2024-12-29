import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
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
import { PageHeaderComponent } from '../../../shared/components/page-header/page-header.component';
import { DashboardService, DashboardStats, Case, Appointment } from '../../../core/services/dashboard.service';
import { forkJoin } from 'rxjs';
import { ToasterService } from '../../../core/services/toaster.service';
import { ChartComponent } from '../line-chart/line-chart.component';
import { PieChartComponent } from '../line-chart/pie-chart.component';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    TranslateModule,
    NgIconComponent,
    PageHeaderComponent,
    ChartComponent,
    PieChartComponent
    
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
  templateUrl: './dashboard.component.html'
})
export class DashboardComponent implements OnInit {
  isLoading = true;
  stats: DashboardStats = {
    activeCases: 0,
    pendingTasks: 0,
    upcomingAppointments: 0,
    unreadMessages: 0
  };
  recentCases: Case[] = [];
  upcomingAppointments: Appointment[] = [];

  // Pie chart data
  pieChartData = [40, 30, 20, 10]; // Example data
  pieChartLabels = ['Active Cases', 'Pending Tasks', 'Upcoming Appointments', 'Unread Messages'];

  constructor(
    private dashboardService: DashboardService,
    private toaster: ToasterService
  ) {}

  ngOnInit() {
    this.loadDashboardData();
  }

  loadDashboardData() {
    this.isLoading = true;
    
    // Load all dashboard data in parallel
    forkJoin({
      stats: this.dashboardService.getStats(),
      cases: this.dashboardService.getRecentCases(),
      appointments: this.dashboardService.getUpcomingAppointments()
    }).subscribe({
      next: (data) => {
        this.stats = data.stats;
        this.recentCases = data.cases;
        this.upcomingAppointments = data.appointments;
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error loading dashboard data:', error);
        this.toaster.error('Failed to load dashboard data');
        this.isLoading = false;
      }
    });
  }

  getStatusClass(status: string): string {
    switch (status) {
      case 'in-progress':
        return 'bg-green-100 text-green-700 dark:bg-green-900/20 dark:text-green-400';
      case 'pending':
        return 'bg-amber-100 text-amber-700 dark:bg-amber-900/20 dark:text-amber-400';
      case 'completed':
        return 'bg-blue-100 text-blue-700 dark:bg-blue-900/20 dark:text-blue-400';
      default:
        return 'bg-gray-100 text-gray-700 dark:bg-gray-900/20 dark:text-gray-400';
    }
  }

  refreshChart() {
    console.log('Refreshing chart data...');
    this.loadDashboardData(); // Reload data
  }
}