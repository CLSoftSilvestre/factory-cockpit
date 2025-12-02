import { Component, inject, input, signal } from '@angular/core';
import { Widget } from '../../../../../models/dashboard';
import { DashboardService } from '../../../../../services/dashboard.service';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import {MatInputModule} from '@angular/material/input';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import {MatSelectModule} from '@angular/material/select';

export enum ToggleEnum {
  Yes,
  No
}

@Component({
  selector: 'app-chart-config',
  standalone: true,
  imports: [MatFormFieldModule, MatIconModule, MatInputModule, MatButtonToggleModule, FormsModule, ReactiveFormsModule, MatSelectModule],
  templateUrl: './chart-config.component.html',
  styleUrl: './chart-config.component.css'
})
export class ChartConfigComponent {
  data = input.required<Widget>();
  store = inject(DashboardService);
  toggleEnum = ToggleEnum;

  selectedStepState = this.toggleEnum.No;
  selectedInterpolateState = this.toggleEnum.No;

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

  widgetValueChartInterpolateChanged(ev: any) {
    if(ev.srcElement.value) {
      this.store.updateWidgetConfiguration(
        this.data().uuid,
        {
          interpolate: Boolean(ev.srcElement.value),
        }
      )
    }
  }

  widgetValueChartTensionChanged(ev: any) {
    if(ev.srcElement.value) {
      this.store.updateWidgetConfiguration(
        this.data().uuid,
        {
          chart_tension: Number(ev.srcElement.value),
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

  widgetValueIntervalChanged(ev: any) {
    if(ev.srcElement.value) {
      this.store.updateWidgetConfiguration(
        this.data().uuid,
        {
          chart_aggregation_timerange: Number(ev.srcElement.value),
        }
      )
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

  widgetChartTypeChanged(ev:any) {
    if(ev.value) {
      this.store.updateWidgetConfiguration(
        this.data().uuid,
        {
          chart_type: ev.value,
        }
      )
    }
  }

  widgetStepDataClick(state: boolean) {

    this.store.updateWidgetConfiguration(
      this.data().uuid,
      {
        chart_step: state,
      }
    );
  }

  widgetInterpolateClick(state: boolean) {
      this.store.updateWidgetConfiguration(
        this.data().uuid,
        {
          interpolate: state,
        }
      );
  }

  ngOnInit() {
    if(this.data().configuration.chart_step) {
      this.selectedStepState = this.toggleEnum.Yes;
    } else {
      this.selectedStepState = this.toggleEnum.No;
    }

    if(this.data().configuration.interpolate) {
      this.selectedInterpolateState = this.toggleEnum.Yes;
    } else {
      this.selectedInterpolateState = this.toggleEnum.No;
    }

  }

}
