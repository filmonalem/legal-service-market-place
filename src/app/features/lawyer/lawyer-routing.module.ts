import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DashboardComponent } from './dashboard/dashboard.component';
import { LawyerLayoutComponent } from './layout/layout.component';
import { LawyerProfileComponent } from './profile/profile.component';
import { SettingsComponent } from './settings/settings.component';
import { CasesComponent } from './cases/cases.component';
import { AppointmentsComponent } from './appointments/appointments.component';
import { ContractComponent } from './contract/contract.component';
import { ViewProfileComponent } from './view-profile/view-profile.component';
import { HelpComponent } from './help/help.component';
const routes: Routes = [
  {
    path: '',
    component: LawyerLayoutComponent,
    children: [
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
      { path: 'dashboard', component: DashboardComponent },
      { path: 'profile', component: LawyerProfileComponent },
      { path: 'settings', component: SettingsComponent },
      { path:'cases', component:CasesComponent },
      { path:'appointments',component:AppointmentsComponent },
      { path:'contract',component:ContractComponent },      
      { path:'view-profile',component:ViewProfileComponent },
      { path:'help',component:HelpComponent },
      { path: '**', redirectTo: 'dashboard', pathMatch: 'full' },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class LawyerRoutingModule { }
