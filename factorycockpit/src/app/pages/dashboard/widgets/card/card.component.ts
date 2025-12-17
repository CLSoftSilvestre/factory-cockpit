import { Component, effect, inject, input, OnChanges, OnDestroy, OnInit, signal } from '@angular/core';
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
export class CardComponent implements OnInit, OnDestroy, OnChanges {
  private refreshSub?: Subscription;
  config = input("__config__");
  viewdate = input("__viewdate__");
  private dataService = inject(DataService);
  value = signal("");
  units = signal(undefined);
  name = signal("");
  timestamp = signal("");

  private configuration = null
  private isLiveData = true

  constructor(private refreshService: RefreshTimerService) {}

  ngOnInit() {
    
    const config = this.config()
    var config2 = JSON.stringify(config);
    this.configuration = JSON.parse(config2);

    if (!this.configuration) {
      return
    }

    this.units.set(this.configuration['units']);
    this.timestamp.set(new Date(Date.now()).toLocaleTimeString())
    this.refreshData();

    // Start the global refresh timer (you can control where to call this)
    this.refreshService.startRefresh(60000); // every 1 minute
    this.refreshSub = this.refreshService.refresh$.subscribe(() => {
      this.refreshData();
    });
    
  }

  ngOnDestroy() {
    this.refreshSub?.unsubscribe();
  }

  ngOnChanges(changes:any) {
    if (changes.viewdate) {
      if (changes.viewdate.previousValue) {
        if (changes.viewdate.currentValue != changes.viewdate.previousValue) {
          this.refreshData();
        }
      } 
    } 
  }

  refreshData() {
    if (!this.configuration) {
      return
    }

    // Setup times (default 1 hour)
    // var endTime = new Date(Date.now()).toISOString()
    // var startTime = new Date(Date.now() - (this.configuration['timespan']?this.configuration['timespan']*60*60*1000:60 * 60 * 1000)).toISOString()
    let dayplusone = new Date(this.viewdate())
    dayplusone.setDate(dayplusone.getDate() + 1)
    var endDate = new Date(dayplusone);
    var now = new Date(Date.now())
    var difference = this.configuration?this.configuration['timespan']*60*60*1000:60 * 60 * 1000;
    
    let tomorrow = now.getDate() + 1

    if (this.viewdate() == "" || (endDate.getDate() == tomorrow)) {
      this.isLiveData = true
      endDate = new Date(Date.now())
    } else {
      // Show one complete day
      this.isLiveData = false
      difference = 24*60*60*1000
    }

    console.log("viewDate: ", this.viewdate());
    console.log("dayplusone: ", dayplusone);
    console.log("endDate:", endDate);

    var endTime = endDate.toISOString()
    var startTime = new Date(endDate.valueOf() - difference).toISOString()

    if(this.configuration['attribute']!="") {

      const calculation_method = this.configuration['chart_aggregation_method']?this.configuration['chart_aggregation_method']:"None";
      const timespan = this.configuration['timespan']?this.configuration['timespan']*60*60*1000:60 * 60 * 1000;
      
      if (calculation_method != "None") {
        this.dataService.getAttributeTrend(this.configuration['attribute'], startTime, endTime, timespan, calculation_method).subscribe((data) => {
        const retval = JSON.parse(data);

        // Check if value is number
          if (isNaN(retval[0].values[0].value)){
            this.value.set(retval[0].values[0].value);
          } else {
            var decimals = this.configuration!['decimals']?Number(this.configuration!['decimals']):2;
            let val = Number(retval[0].values[0].value).toFixed(decimals)
            this.value.set(String(val));
          }
          this.name.set(retval[0].dataSource.aggregation);

        });

        this.timestamp.set("from " + new Date(Date.parse(startTime)).toLocaleTimeString() + " to " + new Date(Date.parse(endTime)).toLocaleTimeString())

      } else {

        if(this.isLiveData) {
          
          // Just get the last value
          this.dataService.getAttributeCurrentValue(this.configuration['attribute']).subscribe((data) => {

            // Check if value is number
            if (isNaN(data.$value)){
              this.value.set(data.$value);
            } else {
              var decimals = this.configuration!['decimals']?Number(this.configuration!['decimals']):2;
              let val = Number(data.$value).toFixed(decimals)
              this.value.set(String(val));
            }
            this.name.set(data.$name);
          });

          this.timestamp.set("@ " + new Date(Date.parse(endTime)).toLocaleTimeString())
        } else {
          this.value.set("-");
          this.timestamp.set("@ " + new Date(Date.parse(endTime)).toLocaleTimeString())
        }
        
      }

    }

  }

}

