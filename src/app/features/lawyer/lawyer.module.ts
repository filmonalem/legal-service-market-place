import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { LawyerRoutingModule } from './lawyer-routing.module';
import { LawyerLayoutComponent } from './layout/layout.component';
import { StoreModule } from '@ngrx/store';
import { dashboardReducer } from '../../store/reducers';


@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    LawyerRoutingModule,
    LawyerLayoutComponent,
    StoreModule.forRoot(dashboardReducer),
  ]
})
export class LawyerModule { }
