import { Component, inject, input } from '@angular/core';
import { Widget } from '../../../../../models/dashboard';
import { DashboardService } from '../../../../../services/dashboard.service';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import {MatInputModule} from '@angular/material/input';
import {MatSelectModule} from '@angular/material/select';

@Component({
  selector: 'app-indicator-config',
  standalone: true,
  imports: [MatFormFieldModule, MatIconModule, MatInputModule, MatSelectModule],
  templateUrl: './indicator-config.component.html',
  styleUrl: './indicator-config.component.css'
})
export class IndicatorConfigComponent {
  data = input.required<Widget>();
  store = inject(DashboardService);

  widgetValueUnitsChanged(ev: any) {
    if(ev.srcElement.value) {
      this.store.updateWidgetConfiguration(
        this.data().uuid,
        {
          units: ev.srcElement.value,
        }
      )
    }
  }

  widgetValueDecimalsChanged(ev: any) {
    if(ev.srcElement.value) {
      this.store.updateWidgetConfiguration(
        this.data().uuid,
        {
          decimals: ev.srcElement.value,
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
      );
    }
  }

  widgetMethodChanged(ev:any) {
    if(ev.value) {
      this.store.updateWidgetConfiguration(
        this.data().uuid,
        {
          chart_aggregation_method: ev.value,
        }
      )
    }
  }

}
