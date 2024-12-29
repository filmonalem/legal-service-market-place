import { createReducer, on } from '@ngrx/store';
import { loadDashboardSuccess, loadDashboardFailure } from './actions';

export interface DashboardState {
  cases: any[]; 
  stats: any; 
  upcomingAppointments: any[];
  recentCases: any[]; 
  error: string | null;
  loading: boolean;
}

export const initialState: DashboardState = {
  stats: null,
  upcomingAppointments: [],
  recentCases: [],
  cases: [],
  error: null,
  loading: false,
};

export const dashboardReducer = createReducer(
    initialState,
    on(loadDashboardSuccess, (state, { stats, appointments, cases }) => ({
      ...state,
      stats,
      upcomingAppointments: appointments,
      cases,
      loading: false,
      error: null,
    })),
    on(loadDashboardFailure, (state, { error }) => ({
      ...state,
      error,
      loading: false,
    }))
);