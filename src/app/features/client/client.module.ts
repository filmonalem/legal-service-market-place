import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ClientRoutingModule } from './client-routing.module';
import { ClientLayoutComponent } from './layout/layout.component';
import { ChartComponent } from './line-chart/line-chart.component';


@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    ClientRoutingModule,
    ClientLayoutComponent,
    
  ]
})
export class ClientModule { }
