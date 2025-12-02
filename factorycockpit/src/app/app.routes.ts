import { Routes } from '@angular/router';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { LayoutComponent } from './shared/components/layout/layout.component';
import { LoginComponent } from './features/login/login.component';
import { redirectDashboardIfAuthenticated, redirectLoginIfNotAuthenticated } from './shared/guards/auth.guards';
import { SettingsComponent } from './pages/settings/settings.component';
import { DashboardsComponent } from './pages/dashboards/dashboards.component';

export const routes: Routes = [
    {
        path: '',
        pathMatch: 'full',
        redirectTo: 'dashboard'
    },
    {
        path: 'login',
        component: LoginComponent,
        canActivate: [redirectDashboardIfAuthenticated()],
    },
    {
        path: '',
        component: LayoutComponent, 
        canActivate: [redirectLoginIfNotAuthenticated()],
        children: [
            {
                path: 'dashboard/:id',
                component: DashboardComponent,
            },
            {
                path: 'dashboard',
                component: DashboardsComponent,
            },
            {
                path: 'settings',
                component: SettingsComponent,
            }
        ]

    },
  
];
