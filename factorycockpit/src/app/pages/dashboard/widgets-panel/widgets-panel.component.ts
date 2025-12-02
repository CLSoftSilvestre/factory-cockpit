import { Component, inject } from '@angular/core';
import { MatIcon } from "@angular/material/icon";
import { DashboardService } from '../../../services/dashboard.service';
import { CdkDrag, CdkDragPlaceholder } from '@angular/cdk/drag-drop';

@Component({
  selector: 'app-widgets-panel',
  standalone: true,
  imports: [MatIcon, CdkDrag, CdkDragPlaceholder],
  templateUrl: './widgets-panel.component.html',
  styleUrl: './widgets-panel.component.css'
})
export class WidgetsPanelComponent {

  store = inject(DashboardService);

}
