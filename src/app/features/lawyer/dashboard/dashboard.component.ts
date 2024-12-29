import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, Router } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { NgIconComponent, provideIcons } from '@ng-icons/core';
import { 
  heroUsers,
  heroCalendar,
  heroChatBubbleLeftRight,
  heroScale,
  heroClipboardDocument,
  heroCurrencyDollar,
  heroChartBar
} from '@ng-icons/heroicons/outline';
import { Store, StoreModule } from '@ngrx/store';
import { Observable } from 'rxjs';
import { loadDashboard } from '../../../store/actions';
import { DashboardState } from '../../../store/reducers';
import { selectDashboardStats, selectUpcomingAppointments, selectRecentCases, selectLoading, selectError } from '../../../store/selectors';
import { PageHeaderComponent } from '../../../shared/components/page-header/page-header.component';
import { Appointment, Case, DashboardStats } from './dashboard.service';

interface SetupStep {
  id: string;
  title: string;
  description: string;
  status: 'pending' | 'completed' | 'verified' | 'rejected';
  route: string;
  icon: string;
}

export interface ProfileCompletion {
  totalSteps: number;
  completedSteps: number;
  percentage: number;
}

@Component({
  selector: 'app-lawyer-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    StoreModule,
    RouterLink,
    TranslateModule,
    NgIconComponent,
    PageHeaderComponent
  ],
  providers: [
    provideIcons({
      heroUsers,
      heroCalendar,
      heroChatBubbleLeftRight,
      heroScale,
      heroClipboardDocument,
      heroCurrencyDollar,
      heroChartBar
    })
  ],
  templateUrl: './dashboard.component.html'
})
export class DashboardComponent implements OnInit {
  isLoading$!: Observable<boolean>;
  error$!: Observable<string | null>;
  stats$!: Observable<DashboardStats>;
  upcomingAppointments$!: Observable<Appointment[]>;
  recentCases$!: Observable<Case[]>;

  setupSteps: SetupStep[] = [
    // Example setup steps
    { id: 'step1', title: 'Step 1', description: 'Description for step 1', status: 'completed', route: '/step1', icon: 'heroClipboardDocument' },
    { id: 'step2', title: 'Step 2', description: 'Description for step 2', status: 'pending', route: '/step2', icon: 'heroChatBubbleLeftRight' },
    { id: 'step3', title: 'Step 3', description: 'Description for step 3', status: 'verified', route: '/step3', icon: 'heroUsers' },
    { id: 'step4', title: 'Step 4', description: 'Description for step 4', status: 'rejected', route: '/step4', icon: 'heroScale' },
  ];

  profileCompletion: ProfileCompletion = {
    totalSteps: 5,
    completedSteps: 2,
    percentage: 40
  };

  quickActions = [
    // Example quick actions
    { title: 'Create Appointment', description: 'Schedule a new appointment', route: '/appointments', icon: 'heroCalendar', variant: 'primary' },
    { title: 'Manage Cases', description: 'View and manage your cases', route: '/cases', icon: 'heroClipboardDocument', variant: 'warning' },
  ];

  constructor(
    private router: Router,
    private store: Store<{ dashboard: DashboardState }>
  ) {}

  ngOnInit() {
    this.loadDashboardData();
    this.isLoading$ = this.store.select(selectLoading);
    this.error$ = this.store.select(selectError);
    this.stats$ = this.store.select(selectDashboardStats);
    this.upcomingAppointments$ = this.store.select(selectUpcomingAppointments);
    this.recentCases$ = this.store.select(selectRecentCases);
  }

  private loadDashboardData() {
    this.store.dispatch(loadDashboard());
  }

  navigateToStep(route: string) {
    this.router.navigate([route]);
  }

  getStepStatusClass(status: string): string {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-700 dark:bg-green-900/20 dark:text-green-400';
      case 'verified':
        return 'bg-blue-100 text-blue-700 dark:bg-blue-900/20 dark:text-blue-400';
      case 'rejected':
        return 'bg-red-100 text-red-700 dark:bg-red-900/20 dark:text-red-400';
      default:
        return 'bg-amber-100 text-amber-700 dark:bg-amber-900/20 dark:text-amber-400';
    }
  }
}