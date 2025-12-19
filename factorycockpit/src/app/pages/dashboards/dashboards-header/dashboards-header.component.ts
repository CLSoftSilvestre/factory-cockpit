import { Component, inject, ViewContainerRef } from '@angular/core';
import { DataService } from '../../../shared/services/data.service';
import { DashboardService } from '../../../services/dashboard.service';
import { MatIcon } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { DashboardsNewDialogComponent } from '../dashboards-new-dialog/dashboards-new-dialog.component';
import { MatTooltipModule } from '@angular/material/tooltip';

@Component({
  selector: 'app-dashboards-header',
  standalone: true,
  imports: [MatTooltipModule, MatIcon, MatButtonModule, MatDialogModule],
  providers: [DashboardService],
  templateUrl: './dashboards-header.component.html',
  styleUrl: './dashboards-header.component.css'
})
export class DashboardsHeaderComponent {
  //private dataService = inject(DataService);
  store = inject(DashboardService);
  dialog = inject(MatDialog);

  onFileSelected(event: any) {

    const input = event.target as HTMLInputElement;
    if (!input.files?.length) return;

    const file = input.files[0];
    const reader = new FileReader();

    reader.onload = () => {
      try {
        const result = reader.result as string;
        this.store.importDashboard(result);
      } catch (err) {
        alert('Invalid Dashboard file');
      }
    }

    reader.readAsText(file);
  }

  createNewDashboard() {
    // Open dialog to create a new dashboard
    this.dialog.open(DashboardsNewDialogComponent, {
      viewContainerRef: this.viewContainerRef,
    })
  }

  constructor( private viewContainerRef: ViewContainerRef) {}

}
