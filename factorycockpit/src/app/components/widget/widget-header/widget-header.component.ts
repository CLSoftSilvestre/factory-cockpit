import { Component, inject, input, model, ViewContainerRef } from '@angular/core';
import { Widget } from '../../../models/dashboard';
import { MatIcon } from "@angular/material/icon";
import { MatIconButton } from '@angular/material/button';
import {MatTooltipModule} from '@angular/material/tooltip';
import { MatDialog } from '@angular/material/dialog';
import { WidgetConfigDialogComponent } from '../widget-config-dialog/widget-config-dialog.component';
import { DashboardService } from '../../../services/dashboard.service';

@Component({
  selector: 'app-widget-header',
  standalone: true,
  imports: [MatIcon, MatIconButton, MatTooltipModule],
  templateUrl: './widget-header.component.html',
  styleUrl: './widget-header.component.css'
})
export class WidgetHeaderComponent {

  data = input.required<Widget>();
  showOptions = model<boolean>(false);
  store = inject(DashboardService);
  dialog = inject(MatDialog);

  openConfigDialog() {
    this.dialog.open(WidgetConfigDialogComponent, {
      viewContainerRef: this.viewContainerRef,
      data: this.data,
      maxWidth: '950px',
    });
  }

  constructor( private viewContainerRef: ViewContainerRef){}

}
