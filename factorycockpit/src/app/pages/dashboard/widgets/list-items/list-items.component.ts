import { Component, inject, input, OnChanges, OnDestroy, OnInit, signal } from '@angular/core';
import { DataService } from '../../../../shared/services/data.service';
import { CdkFixedSizeVirtualScroll, CdkVirtualForOf } from "@angular/cdk/scrolling";
import { MatListModule } from '@angular/material/list';
import { RefreshTimerService } from '../../../../services/refresh-timer.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-list-items',
  standalone: true,
  imports: [MatListModule],
  templateUrl: './list-items.component.html',
  styleUrl: './list-items.component.css'
})
export class ListItemsComponent implements OnInit, OnDestroy, OnChanges {
  private refreshSub?: Subscription;

  items = [
    {
      qualitycode: 192,
      timestamp: new Date(Date.now() + 1000).toISOString(),
      value: ""
    }
  ];

  config = input("__config__");
  viewdate = input("__viewdate__");
  private dataService = inject(DataService);

  private configuration = null
  
  constructor(private refreshService: RefreshTimerService) {}

  ngOnInit() {
    const config = this.config()
    var config2 = JSON.stringify(config);
    this.configuration = JSON.parse(config2);

    this.refreshData();

    // Start the global refresh timer (you can control where to call this)
    this.refreshService.startRefresh(60000); // every 1 minute
    this.refreshSub = this.refreshService.refresh$.subscribe(() => {
      this.refreshData();
    });

  }

  ngOnDestroy(): void {
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

    // Setup times (default 10 minutes)
    //var endTime = new Date(Date.now()).toISOString()
    //var startTime = new Date(Date.now() - (this.configuration!['timespan']?this.configuration!['timespan']*60*60*1000:60 * 60 * 1000)).toISOString()

    let dayplusone = new Date(this.viewdate())
    dayplusone.setDate(dayplusone.getDate() + 1)
    var endDate = new Date(dayplusone);
    var now = new Date(Date.now())
    var difference = this.configuration?this.configuration['timespan']*60*60*1000:60 * 60 * 1000;
    
    let tomorrow = now.getDate() + 1

    if (this.viewdate() == "" || (endDate.getDate() == tomorrow)) {
      endDate = new Date(Date.now())
    } else {
      // Show one complete day
      difference = 24*60*60*1000
    }

    var endTime = endDate.toISOString()
    var startTime = new Date(endDate.valueOf() - difference).toISOString()

    this.items = [];

    // Get data
    this.dataService.getAttributeData(this.configuration!['attribute'], startTime, endTime, this.configuration!['interpolate']?this.configuration!['interpolate']:false, 10000).subscribe((data) => {
        const retval = JSON.parse(data);
        this.items = retval.data[0].values;

    });
  }

}
