import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { DashboardService } from '../features/lawyer/dashboard/dashboard.service';
import { loadDashboard, loadDashboardSuccess, loadDashboardFailure } from './actions';
import { catchError, map, switchMap } from 'rxjs/operators';
import { of } from 'rxjs';

@Injectable()
export class DashboardEffects {
  constructor(
    private actions$: Actions,
    private dashboardService: DashboardService
  ) {}

  loadDashboard$ = createEffect(() =>
    this.actions$.pipe(
      ofType(loadDashboard),
      switchMap(() =>
        this.dashboardService.getStats().pipe(
          map(stats => loadDashboardSuccess({ stats })),
          catchError(error => of(loadDashboardFailure({ error: 'Failed to load dashboard data' })))
        )
      )
    )
  );
}