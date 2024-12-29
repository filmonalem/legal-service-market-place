import { createAction, props } from '@ngrx/store';
import { Appointment, Case, DashboardStats } from '../features/lawyer/dashboard/dashboard.service';

export const loadDashboard = createAction('[Dashboard] Load Dashboard');
export const loadDashboardSuccess = createAction(
  '[Dashboard] Load Dashboard Success',
  props<{ stats: DashboardStats; appointments: Appointment[]; cases: Case[] }>()
);
export const loadDashboardFailure = createAction(
  '[Dashboard] Load Dashboard Failure',
  props<{ error: string }>()
);