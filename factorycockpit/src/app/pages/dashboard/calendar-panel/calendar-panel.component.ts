import { ChangeDetectionStrategy, Component, model, Output, EventEmitter } from '@angular/core';
import { MatIcon } from "@angular/material/icon";
import {provideNativeDateAdapter} from '@angular/material/core';
import {MatDatepickerModule} from '@angular/material/datepicker';

@Component({
  selector: 'app-calendar-panel',
  standalone: true,
  imports: [MatIcon, MatDatepickerModule],
  providers: [provideNativeDateAdapter()],
  templateUrl: './calendar-panel.component.html',
  styleUrl: './calendar-panel.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CalendarPanelComponent {
  selected = model<Date | null>(new Date());

  @Output() selectedDate = new EventEmitter<Date | null>();

  onDateChange(value: Date | null) {
    // Emit end of the day
    let endofday = new Date(value?value:0)

    if (endofday != null) {
      endofday.setDate(endofday.getDate() + 1)
    }
    
    this.selectedDate.emit(value);
  }

  dateFilter = (d: Date | null): boolean => {
    const today = new Date();
    if(d) {
      return d <= today;
    }
    return false;
  }

}
