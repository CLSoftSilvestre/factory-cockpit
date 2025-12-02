import { Component, inject, input, OnDestroy, OnInit, signal } from '@angular/core';
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
export class ListItemsComponent implements OnInit, OnDestroy {
  private refreshSub?: Subscription;

  items = [
    {
      qualitycode: 192,
      timestamp: new Date(Date.now() + 1000).toISOString(),
      value: ""
    }
  ];

  config = input("__config__");
  private dataService = inject(DataService);
  
  constructor(private refreshService: RefreshTimerService) {}

  ngOnInit() {
    const config = this.config()
    var config2 = JSON.stringify(config);
    var config3 = JSON.parse(config2);

    this.refreshData(config3);

    // Start the global refresh timer (you can control where to call this)
    this.refreshService.startRefresh(60000); // every 1 minute
    this.refreshSub = this.refreshService.refresh$.subscribe(() => {
      this.refreshData(config3);
    });

  }

  ngOnDestroy(): void {
    this.refreshSub?.unsubscribe();
  }

  refreshData(config3:any) {

    // Setup times (default 10 minutes)
    var endTime = new Date(Date.now()).toISOString()
    var startTime = new Date(Date.now() - (config3['timespan']?config3['timespan']*60*60*1000:60 * 60 * 1000)).toISOString()

    this.items = [];

    // Get data
    this.dataService.getAttributeData(config3['attribute'], startTime, endTime, config3['interpolate']?config3['interpolate']:false, 10000).subscribe((data) => {
        const retval = JSON.parse(data);
        this.items = retval.data[0].values;

    });
  }

}
