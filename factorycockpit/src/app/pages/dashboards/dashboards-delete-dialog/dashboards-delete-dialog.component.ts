import { Component, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogActions, MatDialogContent, MatDialogRef, MatDialogTitle, MatDialogClose } from '@angular/material/dialog';
import { MatIcon } from '@angular/material/icon';

@Component({
  selector: 'app-dashboards-delete-dialog',
  standalone: true,
  imports: [MatButtonModule, MatDialogActions, MatDialogContent, MatDialogTitle, MatIcon, MatDialogClose],
  templateUrl: './dashboards-delete-dialog.component.html',
  styleUrl: './dashboards-delete-dialog.component.css'
})
export class DashboardsDeleteDialogComponent {
  readonly dialogRef = inject(MatDialogRef<DashboardsDeleteDialogComponent>);

}
