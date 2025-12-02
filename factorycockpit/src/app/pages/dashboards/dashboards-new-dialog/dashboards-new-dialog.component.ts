import { Component, inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { DashboardService } from '../../../services/dashboard.service';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule, MatLabel } from '@angular/material/form-field';
import { MatInput } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-dashboards-new-dialog',
  standalone: true,
  imports: [MatDialogModule, MatIconModule, MatLabel, MatFormFieldModule, MatInput, MatButtonModule, FormsModule],
  providers: [DashboardService],
  templateUrl: './dashboards-new-dialog.component.html',
  styleUrl: './dashboards-new-dialog.component.css'
})

export class DashboardsNewDialogComponent {
  store = inject(DashboardService);
  dashboardName = ''

  createDashboard() {
    if (this.dashboardName != '') {
      this.store.newDashboard(this.dashboardName);
      window.location.reload();
    }
  }
  
}
