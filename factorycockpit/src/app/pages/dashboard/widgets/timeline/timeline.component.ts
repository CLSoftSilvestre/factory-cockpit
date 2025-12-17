import {  Component, ElementRef, inject, input, OnChanges, OnDestroy, OnInit, viewChild } from '@angular/core';
import Chart, { ChartDataset } from'chart.js/auto'
import { DataService } from '../../../../shared/services/data.service';
import 'chartjs-adapter-date-fns';
import { TimelineMode } from '../../../../models/dashboard';
import { RefreshTimerService } from '../../../../services/refresh-timer.service';
import { Subscription } from 'rxjs';

export interface dataPoint {
  x: [number, number],
  y: string,
}

export interface timelineDataset {
  label: string
  data: [dataPoint],
  backgroundColor:[string]
}

export interface edgeData {
  qualitycode: number
  timestamp: string
  value: number
}

@Component({
  selector: 'app-timeline',
  standalone: true,
  imports: [],
  templateUrl: './timeline.component.html',
  styleUrl: './timeline.component.css'
})

export class TimelineComponent implements OnInit, OnDestroy, OnChanges{
  private refreshSub?: Subscription;
  config = input("__config__");
  viewdate = input("__viewdate__");
  chart = viewChild.required<ElementRef>('chart');
  private dataService = inject(DataService);

  // Global data for chart generation
  private configuration = null
  private chartInstance:any

  timelineData = {
      labels: ['Status'],
      datasets: [{
        label: 'Unknown',
        data: [
          {x: [0,1], y: 'Status'},
        ],
        backgroundColor: ['rgba(0, 0, 0, 1)'],
      }
    ]}

  constructor(private refreshService: RefreshTimerService) {}

  getRandomColor() {
    var length = 6;
    var chars = '0123456789ABCDEF';
    var hex = '#';
    while(length--) hex += chars[(Math.random() * 16) | 0];
    return hex;
  }

  ngOnInit() {
  
    const config = this.config()
    var config2 = JSON.stringify(config);
    this.configuration = JSON.parse(config2);

    // Setup times (default 10 minutes)
    var startTime = new Date(Date.now() - (this.configuration!['timespan']?this.configuration!['timespan']*60*60*1000:60 * 60 * 1000)).toISOString()
  
    // Setup chart
    this.chartInstance = new Chart(this.chart().nativeElement, {
      type: 'bar',
      data: this.timelineData,
      options: {
        animation: false,
        indexAxis: 'y',
        scales: {
          x: {
            type: 'time',
            time: {
              unit: 'hour',
            },
            min: startTime,
            ticks: {
              font: {
                size: 9
              }
            }
          },
          y: {
            beginAtZero: true,
            stacked: true,
          }
        },
        plugins: {
          tooltip: {
            displayColors: true,
            callbacks: {
              label: (ctx) => {
                const startDate = new Date(ctx.parsed._custom?.barStart?ctx.parsed._custom.barStart:0);
                const endDate = new Date(ctx.parsed._custom?.barEnd?ctx.parsed._custom.barEnd:0);

                const formatedStartDate = startDate.toLocaleTimeString();
                const formatedEndDate = endDate.toLocaleTimeString();

                const duration: number = endDate.getTime() - startDate.getTime();

                // Converting time into hh:mm:ss format

                // Total number of seconds in the difference
                const totalSeconds = Math.floor(duration / 1000);

                // Total number of minutes in the difference
                const totalMinutes = Math.floor(totalSeconds / 60);

                // Total number of hours in the difference
                let totalHours = String(Math.floor(totalMinutes / 60));
                if (Number(totalHours) < 10) {
                  totalHours = "0" + totalHours;
                }

                // Getting the number of seconds left in one minute
                let remSeconds = String(totalSeconds % 60);
                if (Number(remSeconds) < 10) {
                  remSeconds = "0" + remSeconds;
                }

                // Getting the number of minutes left in one hour
                let remMinutes = String(totalMinutes % 60);
                if (Number(remMinutes) < 10) {
                  remMinutes = "0" + remMinutes;
                }

                return `From: ${formatedStartDate} to ${formatedEndDate}. Duration: ${totalHours}:${remMinutes}:${remSeconds}`;
              }
            }
          },
          legend: {
            display: true,
            labels: {
              boxWidth: 10,
              boxHeight: 10,
              usePointStyle: true,
              pointStyle: 'rectRounded'
            }
          }
        },
        maintainAspectRatio: false,
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

    this.chartInstance.options.scales.x.min = startTime;

    this.timelineData.datasets = [];

    this.dataService.getAttributeData(this.configuration!['attribute'], startTime, endTime, this.configuration!['interpolate']?this.configuration!['interpolate']:false, 10000).subscribe((data) => {
      const retval = JSON.parse(data);

      // Array to ingest all the processed
      const listOfModes = [...new Map<edgeData,edgeData>(retval.data[0].values.map((item: edgeData) => [item.value, item])).values()]
      this.timelineData.datasets.pop();

      // LOOP of Modes
      for(let modeType = 0; modeType < listOfModes.length; modeType++) {
        const curMode = listOfModes[modeType].value;
        const DummyPoint: dataPoint = {x: [0, 0], y: 'Status'}

        // Get the mode configuration
        const modeConfig: TimelineMode[] = (this.configuration as any)['timeline_modes'].filter((item:TimelineMode) => item.code == curMode);

        if(modeConfig.length>0) {
          let dataset:timelineDataset = {
            label: modeConfig[0].name?modeConfig[0].name:String(listOfModes[modeType].value),
            data:[DummyPoint],
            backgroundColor: [modeConfig[0].color?modeConfig[0].color:this.getRandomColor()],
          }

          dataset.data.pop();

          // LOOP of data
          for (let index = 0; index < retval.data[0].values.length; index++) {
            let start = <number>retval.data[0].values[index].timestamp;
            //let end = new Date(this.viewdate()).valueOf();
            let end = new Date(endTime).valueOf();

            if (index < retval.data[0].values.length -1) {
              end = <number>retval.data[0].values[index+1].timestamp;
            }

            let mode = retval.data[0].values[index].value;

            if( mode == curMode) {
              var point: dataPoint = {
                x:[start, end],
                y: 'Status',
              }
              dataset.data.push(point)
            } 
          }

          this.timelineData.datasets.push(dataset);

        }
      
      }
        
      this.chartInstance.update();
    });

  }

}
