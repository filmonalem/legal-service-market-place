import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DashboardComponent } from './dashboard/dashboard.component';
import { ProfileComponent } from './profile/profile.component';
import { HomeComponent } from './home/home.component';
import { ClientLayoutComponent } from './layout/layout.component';
import { BookingComponent } from './booking/booking.component';
import { FeedbackComponent } from './feedback/feedback.component';
import { AppointmentComponent } from './appointment/appointment.component';
import { SettingsComponent } from './settings/settings.component';
import { HelpComponent } from './help/help.component';
import { PostDisplayComponent } from './posts/posts.component';

const routes: Routes = [
  {
    path: '', 
    component: ClientLayoutComponent,
    children: [
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
      { path: 'dashboard', component: DashboardComponent },
      { path: 'profile', component: ProfileComponent },
      { path: 'bookings', component: BookingComponent },
      { path: 'appointments', component: AppointmentComponent },
      { path: 'settings', component: SettingsComponent },
      { path:'help', component: HelpComponent},
      { path:'posts', component:PostDisplayComponent},
      

      { 
        path: 'lawyers', 
        loadComponent: () => import('./lawyers-profile/lawyers-profile.component')
          .then(m => m.LawyersProfileComponent)
      },
      { 
        path: 'lawyers/:id', 
        loadComponent: () => import('./lawyer-detail/lawyer-detail.component')
          .then(m => m.LawyerDetailComponent)
      },
      { 
        path: 'feedback', 
        loadComponent: () => import('./feedback/feedback.component')
          .then(m => m.FeedbackComponent)
      },
      { 
        path: 'feedback/:lawyerId', 
        loadComponent: () => import('./feedback/feedback.component')
          .then(m => m.FeedbackComponent)
      },
      {
        path: 'appointments/new',
        loadComponent: () => import('./booking/booking.component')
          .then(m => m.BookingComponent)
      },
      {
        path: 'lawyers/:id',
        loadComponent: () => import('./lawyer-detail/lawyer-detail.component')
          .then(m => m.LawyerDetailComponent)
      },
      { path: '**', redirectTo: 'dashboard', pathMatch: 'full' }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ClientRoutingModule { }
