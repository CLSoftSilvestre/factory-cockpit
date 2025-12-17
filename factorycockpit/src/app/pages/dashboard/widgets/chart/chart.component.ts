import { Component, computed, ElementRef, inject, input, OnChanges, OnDestroy, OnInit, Signal, signal, SimpleChange, viewChild } from '@angular/core';
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
export class ChartComponent implements OnInit, OnDestroy, OnChanges{
  private refreshSub?: Subscription;
  config = input("__config__");
  viewdate = input("__viewdate__");

  chart = viewChild.required<ElementRef>('chart');
  private dataService = inject(DataService);

  // Global data for chart generation
  private configuration = null
  private chartInstance:any

  // Chart configuration variable
  countEventsData: ChartDataset[] = [
    { data: [], label: "Default title", fill: true, borderColor: 'rgb(0, 106, 63)', backgroundColor: 'rgba(0, 106, 64, 0.25)' }
  ];

  constructor(private refreshService: RefreshTimerService) {}

  ngOnInit() {

    const config = this.config()
    var config2 = JSON.stringify(config);
    this.configuration = JSON.parse(config2);

    if (!this.configuration) {
      return
    }

    this.countEventsData[0].label = this.configuration['label'];

  
    const chart_type = this.configuration['chart_type']?this.configuration['chart_type']:'bar';

    if (chart_type == 'bar') {
      this.countEventsData[0].backgroundColor = 'rgb(0, 106, 63)';
    }

    // Setup chart
    this.chartInstance = new Chart(this.chart().nativeElement, {
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
            },
            ticks: {
              font: {
                size: 9
              }
            }
          },
          y: {
            title: {
              display: this.configuration['units']?true:false,
              align: 'center',
              text: this.configuration['units']?this.configuration['units']:"" 
            }
          }
        },
        maintainAspectRatio: false,
        elements: {
          line: {
            tension: this.configuration['chart_tension']?this.configuration['chart_tension']:0.4,
            stepped: this.configuration['chart_step']?this.configuration['chart_step']:false,
          },
        },
      },
    })

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

    this.countEventsData[0].data = [];

    // Setup times (default 10 minutes)
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

    this.dataService.getAttributeTrend(this.configuration['attribute'], startTime, endTime, this.configuration['chart_aggregation_timerange'], this.configuration['chart_aggregation_method']).subscribe((data) => {
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
        this.chartInstance.update();

    });

  }

}

