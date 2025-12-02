import { Component, inject, input } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { TimelineMode, Widget } from '../../../../../models/dashboard';
import { DashboardService } from '../../../../../services/dashboard.service';
import {MatListModule} from '@angular/material/list';
import { MatDividerModule } from '@angular/material/divider';
import { MatButton, MatButtonModule } from "@angular/material/button";
import { last } from 'rxjs';

@Component({
  selector: 'app-timeline-config',
  standalone: true,
  imports: [MatFormFieldModule, MatIconModule, MatInputModule, FormsModule, MatListModule, MatDividerModule, MatButtonModule],
  templateUrl: './timeline-config.component.html',
  styleUrl: './timeline-config.component.css'
})
export class TimelineConfigComponent {
  data = input.required<Widget>();
  store = inject(DashboardService);

  getRandomColor() {
    var length = 6;
    var chars = '0123456789ABCDEF';
    var hex = '#';
    while(length--) hex += chars[(Math.random() * 16) | 0];
    return hex;
  }

  widgetValueChartLableChanged(ev: any) {
    if(ev.srcElement.value) {
      this.store.updateWidgetConfiguration(
        this.data().uuid,
        {
          label: ev.srcElement.value,
        }
      )
    }
  }

  widgetValueTimespanChanged(ev: any) {
    if(ev.srcElement.value) {
      this.store.updateWidgetConfiguration(
        this.data().uuid,
        {
          timespan: Number(ev.srcElement.value),
        }
      )
    }
  }

  deleteMode(code: number, modes:TimelineMode[] | undefined) {
    const newModes = modes?.filter((item:TimelineMode, index: number, self: any) => index !== self.findIndex((t:TimelineMode) => (t.code === code)));

    this.store.updateWidgetConfiguration(
        this.data().uuid,
        {
          timeline_modes: newModes,
        }
      );
  }

  addMode(modes:TimelineMode[] | undefined) {

    const newMode: TimelineMode = {
      code: modes?modes[modes?.length - 1].code + 1:0,
      name: "new mode",
      color: this.getRandomColor()
    }

    modes?.push(newMode);

    this.store.updateWidgetConfiguration(
        this.data().uuid,
        {
          timeline_modes: modes,
        }
      );
  }

  editModeColor(code: number, ev:any, modes:TimelineMode[] | undefined) {
    const newColor = ev.srcElement.value;

    if (modes) {
      const index = modes?.findIndex((t:TimelineMode) => (t.code === code));
      modes[index].color = newColor;

      this.store.updateWidgetConfiguration(
        this.data().uuid,
        {
          timeline_modes: modes,
        }
      );
    }
    
  }

  editModeName(code: number, ev: any, modes:TimelineMode[] | undefined) {
    const newName = ev.srcElement.value;

    if (modes) {
      const index = modes?.findIndex((t:TimelineMode) => (t.code === code));
      modes[index].name = newName;

      this.store.updateWidgetConfiguration(
        this.data().uuid,
        {
          timeline_modes: modes,
        }
      );
    }

  }

  editModeCode(code: number, ev: any, modes:TimelineMode[] | undefined) {
    const newCode = ev.srcElement.value;

    if (modes) {
      const index = modes?.findIndex((t:TimelineMode) => (t.code === code));
      modes[index].code = newCode;

      const reorderModes = modes.sort((a, b) => a.code - b.code);

      this.store.updateWidgetConfiguration(
        this.data().uuid,
        {
          timeline_modes: reorderModes,
        }
      );
    }

  }

}

