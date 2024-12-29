import { createSelector } from '@ngrx/store';
import { DashboardState } from '../store/reducers';

export const selectDashboardState = (state: { dashboard: DashboardState }) => state.dashboard;

export const selectDashboardStats = createSelector(
  selectDashboardState,
  (state: DashboardState) => state.stats
);

export const selectUpcomingAppointments = createSelector(
  selectDashboardState,
  (state: DashboardState) => state.upcomingAppointments
);

export const selectRecentCases = createSelector(
  selectDashboardState,
  (state: DashboardState) => state.cases
);

export const selectLoading = createSelector(
  selectDashboardState,
  (state: DashboardState) => state.loading
);

export const selectError = createSelector(
  selectDashboardState,
  (state: DashboardState) => state.error
);