import { Component, computed, effect, inject, signal } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { DashboardService } from '../../../services/dashboard.service';
import { WidgetsPanelComponent } from '../widgets-panel/widgets-panel.component';
import { CdkDrag, CdkDragDrop, CdkDropList } from '@angular/cdk/drag-drop';
import { DataService } from '../../../shared/services/data.service';
import { ServerDasboard } from '../../../shared/interfaces/server-dashboards';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-dashboard-header',
  standalone: true,
  imports: [MatButtonModule, MatIcon, MatMenuModule, WidgetsPanelComponent, CdkDropList, CdkDrag],
  templateUrl: './dashboard-header.component.html',
  styleUrl: './dashboard-header.component.css'
})

export class DashboardHeaderComponent {
  private activatedRoute = inject(ActivatedRoute)
  private router = inject(Router);
  private dataService = inject(DataService);
  store = inject(DashboardService);
  dashboardname = signal("");
  dashboardid = signal("");
  dashboardsList: ServerDasboard[] = []

  fileName = '';

  widgetsOpen = signal(false);

  widgetPutBack(event: CdkDragDrop<number, any>) {
    const { previousContainer } = event;
    this.store.removeWidget(previousContainer.data);
  }

  exportDashboard() {
    this.store.exportDashboard();
  }

  navigateToDashboard(dashboardId: string) {
    this.router.navigate(['/dashboard', dashboardId]).then(() => {
      window.location.reload();
    });
  }

  createNewDashboard() {
    // Open dialog to create a new dashboard
  }

  saveDashboard() {
    if (this.dashboardid()) {
      this.store.saveDashboard(this.dashboardid())
    }
    
  }

  constructor() {

    const dashboardId = this.activatedRoute.snapshot.paramMap.get('id');

    if (dashboardId) {
      const result = this.dataService.getDashboardsById(dashboardId).subscribe(data => {
        this.dashboardname.set(data.title);
        this.dashboardid.set(data.dashboard_id);
      });

    } else {
      this.dashboardname.set("Local dashboard");
    }

  }
  
}
