import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PortalRoutingModule } from './portal-routing.module';
import { LayoutComponent } from './components/layout/layout.component';


@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    PortalRoutingModule,
    LayoutComponent
  ]
})
export class PortalModule { }
