import { Component, effect, inject, input, OnDestroy, OnInit, signal } from '@angular/core';
import { DataService } from '../../../../shared/services/data.service';
import { RefreshTimerService } from '../../../../services/refresh-timer.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-card',
  standalone: true,
  imports: [],
  templateUrl: './card.component.html',
  styleUrl: './card.component.css'
})
export class CardComponent implements OnInit, OnDestroy {
  private refreshSub?: Subscription;
  config = input("__config__");
  private dataService = inject(DataService);
  value = signal("");
  units = signal(undefined);
  name = signal("");
  timestamp = signal("");

  constructor(private refreshService: RefreshTimerService) {}

  ngOnInit() {
    
    const config = this.config()
    var config2 = JSON.stringify(config);
    var config3 = JSON.parse(config2);

    this.units.set(config3['units']);
    this.timestamp.set(new Date(Date.now()).toLocaleTimeString())
    this.refreshData(config3);

    // Start the global refresh timer (you can control where to call this)
    this.refreshService.startRefresh(60000); // every 1 minute
    this.refreshSub = this.refreshService.refresh$.subscribe(() => {
      this.refreshData(config3);
    });
    
  }

  ngOnDestroy() {
    this.refreshSub?.unsubscribe();
  }

  refreshData(config3:any) {
    // Setup times (default 1 hour)
    var endTime = new Date(Date.now()).toISOString()
    var startTime = new Date(Date.now() - (config3['timespan']?config3['timespan']*60*60*1000:60 * 60 * 1000)).toISOString()

    if(config3['attribute']!="") {

      const calculation_method = config3['chart_aggregation_method']?config3['chart_aggregation_method']:"Average";
      const timespan = config3['timespan']?config3['timespan']*60*60*1000:60 * 60 * 1000;
      
      if (calculation_method != "None") {
        this.dataService.getAttributeTrend(config3['attribute'], startTime, endTime, timespan, calculation_method).subscribe((data) => {
        const retval = JSON.parse(data);

        // Check if value is number
          if (isNaN(retval[0].values[0].value)){
            this.value.set(retval[0].values[0].value);
          } else {
            var decimals = config3['decimals']?Number(config3['decimals']):2;
            let val = Number(retval[0].values[0].value).toFixed(decimals)
            this.value.set(String(val));
          }
          this.name.set(retval[0].dataSource.aggregation);

        });

        this.timestamp.set("from " + new Date(Date.parse(startTime)).toLocaleTimeString() + " to " + new Date(Date.parse(endTime)).toLocaleTimeString())

      } else {
        // Just get the last value
        this.dataService.getAttributeCurrentValue(config3['attribute']).subscribe((data) => {
          //const data2 = JSON.parse(data);
          // Check if value is number
          if (isNaN(data.$value)){
            this.value.set(data.$value);
          } else {
            var decimals = config3['decimals']?Number(config3['decimals']):2;
            let val = Number(data.$value).toFixed(decimals)
            this.value.set(String(val));
          }
          this.name.set(data.$name);
        });

        this.timestamp.set("@ " + new Date(Date.parse(endTime)).toLocaleTimeString())

      }

    }

  }

}
