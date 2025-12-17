import { Component, computed, effect, inject, signal, Output, EventEmitter } from '@angular/core';
import { DatePipe } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { DashboardService } from '../../../services/dashboard.service';
import { WidgetsPanelComponent } from '../widgets-panel/widgets-panel.component';
import { CalendarPanelComponent } from '../calendar-panel/calendar-panel.component';
import { CdkDrag, CdkDragDrop, CdkDropList } from '@angular/cdk/drag-drop';
import { DataService } from '../../../shared/services/data.service';
import { ServerDasboard } from '../../../shared/interfaces/server-dashboards';
import { ActivatedRoute, Router } from '@angular/router';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatSnackBar } from '@angular/material/snack-bar';
import { provideNativeDateAdapter } from '@angular/material/core';

@Component({
  selector: 'app-dashboard-header',
  standalone: true,
  providers: [provideNativeDateAdapter()],
  imports: [DatePipe, MatButtonModule, MatIcon, MatMenuModule, WidgetsPanelComponent, CalendarPanelComponent, CdkDropList, CdkDrag, MatTooltipModule],
  templateUrl: './dashboard-header.component.html',
  styleUrl: './dashboard-header.component.css'
})

export class DashboardHeaderComponent {
  private activatedRoute = inject(ActivatedRoute)
  private router = inject(Router);
  private dataService = inject(DataService);
  private _snackBar = inject(MatSnackBar)
  store = inject(DashboardService);
  dashboardname = signal("");
  dashboardid = signal("");
  dashboardsList: ServerDasboard[] = []

  fileName = '';

  widgetsOpen = signal(false);
  calendarOpen = signal(false);
  calendarView = signal("hidden");
  selectedDate = signal(new Date());
  @Output() selectedViewDate = new EventEmitter<Date | null>();

  isOnline = true

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
      this.store.saveDashboard(this.dashboardid()).subscribe((data) => {
        this._snackBar.open('Dashboard '+ data.title + ' saved successfully ', 'Close', {  duration: 3000,});
      });
    }
    
  }

  changeDate(value: Date | null) {
    let yesterday = new Date(value?value:0)
    //yesterday.setDate(yesterday.getDate() - 1)
    this.selectedDate.set(yesterday);
    this.selectedViewDate.emit(value)

    // Check if data is today
    let today = new Date(Date.now())

    if(yesterday.toDateString() == today.toDateString()) {
      this.isOnline = true
    } else {
      this.isOnline = false
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
