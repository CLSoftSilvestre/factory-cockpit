import { Component, Injector, input, signal } from '@angular/core';
import { Widget } from '../../models/dashboard';
import { NgComponentOutlet, NgTemplateOutlet } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { WidgetOptionsComponent } from "./widget-options/widget-options.component";
import { CdkDrag, CdkDragPlaceholder } from '@angular/cdk/drag-drop';
import { WidgetHeaderComponent } from "./widget-header/widget-header.component";

@Component({
  selector: 'app-widget',
  standalone: true,
  imports: [NgComponentOutlet, MatButtonModule, WidgetOptionsComponent, CdkDrag, CdkDragPlaceholder, WidgetHeaderComponent],
  templateUrl: './widget.component.html',
  styleUrl: './widget.component.css',
  host: {
    '[style.grid-area]':'"span " + (data().rows ?? 1) + "/ span " + (data().columns ?? 1)'
  },
})
export class WidgetComponent {

  data = input.required<Widget>();

  showOptions = signal(false);

}
