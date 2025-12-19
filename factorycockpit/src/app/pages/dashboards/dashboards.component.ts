import { Component, inject, OnInit } from '@angular/core';
import { ServerDasboard } from '../../shared/interfaces/server-dashboards';
import { DataService } from '../../shared/services/data.service';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { Router } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { DashboardsHeaderComponent } from "./dashboards-header/dashboards-header.component";
import { MatMenuModule } from '@angular/material/menu';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatChipsModule } from '@angular/material/chips';

@Component({
  selector: 'app-dashboards',
  standalone: true,
  imports: [MatChipsModule, MatGridListModule, MatCardModule, MatButtonModule, MatIconModule, DashboardsHeaderComponent, MatMenuModule, MatTooltipModule],
  templateUrl: './dashboards.component.html',
  styleUrl: './dashboards.component.css'
})
export class DashboardsComponent implements OnInit {
  dataService = inject(DataService);
  private router = inject(Router);
  dashboardsList: ServerDasboard[] = []
  breakpoint: number | undefined;

  navigateToDashboard(dashboardId: string) {
    this.router.navigate(['/dashboard', dashboardId]).then(() => {
    });
  }

  deleteDashboard(dashboardId: string) {
    this.dataService.deleteDashboard(dashboardId).subscribe(data => {
      this.dataService.getDashboardsList().subscribe(data => {
        this.dashboardsList = data;
      });
    }).add(window.location.reload());
  }

  onResize(event: any) {
    const width = event.target.innerWidth;

    if (width < 680) {
      this.breakpoint = 1
    } else if (width < 1000 ) {
      this.breakpoint = 2
    } else if (width < 1250 ) {
      this.breakpoint = 3
    } else if (width < 1500 ) {
      this.breakpoint = 4
    } else if (width > 1550 ) {
      this.breakpoint = 5
    }
  }

  ngOnInit() {
    const width = window.innerWidth;

    if (width < 680) {
      this.breakpoint = 1
    } else if (width < 1000 ) {
      this.breakpoint = 2
    } else if (width < 1250 ) {
      this.breakpoint = 3
    } else if (width < 1500 ) {
      this.breakpoint = 4
    } else if (width > 1550 ) {
      this.breakpoint = 5
    }
  }

  constructor() {
    this.dataService.getDashboardsList().subscribe(data => {
      this.dashboardsList = data;
    })
  }


}
