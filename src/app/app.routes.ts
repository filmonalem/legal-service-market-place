import { Routes } from '@angular/router';
import { AuthGuard } from './core/guards/auth.guard';
import { RoleGuard } from './core/guards/role.guard';
import { ForgotPasswordComponent } from './features/portal/components/forgot-password/forgot-password.component';
import { ChangePasswordComponent } from './features/portal/components/change-password/change-password.component';

export const routes: Routes = [
    {
        path: '',
        loadChildren: () => import('./features/portal/portal.module').then(m => m.PortalModule)
    },
    {
        path: 'client',
        loadChildren: () => import('./features/client/client.module').then(m => m.ClientModule),
        canActivate: [AuthGuard, RoleGuard],
        data: { role: 'client' }
    },
    {
        path: 'lawyer',
        loadChildren: () => import('./features/lawyer/lawyer.module').then(m => m.LawyerModule),
        canActivate: [AuthGuard, RoleGuard],
        data: { role: 'lawyer' }
    },
    {
        path: 'admin',
        loadChildren: () => import('./features/admin/admin.module').then(m => m.AdminModule),
        canActivate: [AuthGuard, RoleGuard],
        data: { role: 'super_admin' }     },
    {
        path: 'forgot-password',
        component: ForgotPasswordComponent
    },
    {
        path: 'reset-password',
        component: ChangePasswordComponent
    },
    { path: '**', redirectTo: '' }
];
