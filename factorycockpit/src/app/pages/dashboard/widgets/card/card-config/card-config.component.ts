import { Component, inject, input } from '@angular/core';
import { Widget } from '../../../../../models/dashboard';
import { DashboardService } from '../../../../../services/dashboard.service';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import {MatInputModule} from '@angular/material/input';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import {MatSelectModule} from '@angular/material/select';

export enum ToggleEnum {
  Yes,
  No
}


@Component({
  selector: 'app-card-config',
  standalone: true,
  imports: [MatFormFieldModule, MatIconModule, MatInputModule, MatButtonToggleModule, FormsModule, ReactiveFormsModule, MatSelectModule],
  templateUrl: './card-config.component.html',
  styleUrl: './card-config.component.css'
})
export class CardConfigComponent {
  data = input.required<Widget>();
  store = inject(DashboardService);
  toggleEnum = ToggleEnum;
  selectedSumState = this.toggleEnum.No;

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

  widgetSumDataClick(state: boolean) {
    this.store.updateWidgetConfiguration(
      this.data().uuid,
      {
        sum_data: state,
      }
    );
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

  ngOnInit() {
    if(this.data().configuration.sum_data) {
      this.selectedSumState = this.toggleEnum.Yes;
    } else {
      this.selectedSumState = this.toggleEnum.No;
    }
  }

}
