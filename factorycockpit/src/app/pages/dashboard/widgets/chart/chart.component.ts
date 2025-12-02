import { Component, ElementRef, inject, input, OnDestroy, OnInit, signal, viewChild } from '@angular/core';
import Chart, { ChartDataset } from'chart.js/auto'
import { DataService } from '../../../../shared/services/data.service';
import 'chartjs-adapter-date-fns';
import { RefreshTimerService } from '../../../../services/refresh-timer.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-linechart',
  standalone: true,
  imports: [],
  templateUrl: './chart.component.html',
  styleUrl: './chart.component.css'
})
export class ChartComponent implements OnInit, OnDestroy{
  private refreshSub?: Subscription;
  config = input("__config__");
  chart = viewChild.required<ElementRef>('chart');
  private dataService = inject(DataService);

  // Chart configuration variable
  countEventsData: ChartDataset[] = [
    { data: [], label: "Default title", fill: true, borderColor: 'rgb(0, 106, 63)', backgroundColor: 'rgba(0, 106, 64, 0.25)' }
  ];

  constructor(private refreshService: RefreshTimerService) {}

  ngOnInit() {

    const config = this.config()
    var config2 = JSON.stringify(config);
    var config3 = JSON.parse(config2);
    this.countEventsData[0].label = config3['label'];

    const chart_type = config3['chart_type']?config3['chart_type']:'line';
    if (chart_type == 'bar') {
      this.countEventsData[0].backgroundColor = 'rgb(0, 106, 63)';
    }

    // Setup chart
    const chart = new Chart(this.chart().nativeElement, {
      type: chart_type,
      data: {
        datasets: this.countEventsData,
      },
      options: {
        scales: {
          x: {
            type: 'time',
            time: {
              unit: 'hour',
            }
          },
          y: {
            title: {
              display: config3['units']?true:false,
              align: 'center',
              text: config3['units']?config3['units']:"" 
            }
          }
        },
        maintainAspectRatio: false,
        elements: {
          line: {
            tension: config3['chart_tension']?config3['chart_tension']:0.4,
            stepped: config3['chart_step']?config3['chart_step']:false,
          },
        },
      },
    })

    this.refreshData(config3, chart);

    // Start the global refresh timer (you can control where to call this)
    this.refreshService.startRefresh(60000); // every 1 minute
    this.refreshSub = this.refreshService.refresh$.subscribe(() => {
      this.refreshData(config3, chart);
    });

  }

  ngOnDestroy() {
    this.refreshSub?.unsubscribe();
  }

  refreshData(config3:any, chart:any) {

    this.countEventsData[0].data = [];

    // Setup times (default 10 minutes)
    var endTime = new Date(Date.now()).toISOString()
    var startTime = new Date(Date.now() - (config3['timespan']?config3['timespan']*60*60*1000:60 * 60 * 1000)).toISOString() 

    this.dataService.getAttributeTrend(config3['attribute'], startTime, endTime, config3['chart_aggregation_timerange'], config3['chart_aggregation_method']).subscribe((data) => {
        const retval = JSON.parse(data);

        for (let index = 0; index < retval[0].values.length; index++) {
          let x = retval[0].values[index].timestamp;
          let y = retval[0].values[index].value;

          var point = {
            x:x,
            y:y,
          }

          this.countEventsData[0].data.push(point);
          
        }
        chart.update();

    });

  }

}
