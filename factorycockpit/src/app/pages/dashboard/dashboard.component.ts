import { Component, ElementRef, inject, signal, viewChild } from '@angular/core';
import { WidgetComponent } from "../../components/widget/widget.component";
import { DashboardService } from '../../services/dashboard.service';
import { MatButtonModule } from '@angular/material/button';
import { MatMenuModule } from '@angular/material/menu';
import { wrapGrid } from 'animate-css-grid';
import { CdkDragDrop, CdkDropList, CdkDropListGroup } from '@angular/cdk/drag-drop';
import { DashboardHeaderComponent } from "./dashboard-header/dashboard-header.component";
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [WidgetComponent, MatButtonModule, MatMenuModule, CdkDropList, CdkDropListGroup, DashboardHeaderComponent],
  providers: [DashboardService],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})
export class DashboardComponent {
  private activatedRoute = inject(ActivatedRoute)

  store = inject(DashboardService);

  clearAnimations = () => {};

  dashboard = viewChild.required<ElementRef>('dashboard');

  viewDate = signal(new Date());

  ngOnInit() {   
    const { unwrapGrid } = wrapGrid(this.dashboard().nativeElement, { duration: 300 });
    this.clearAnimations = unwrapGrid;
  }

  ngOnDestroy() {
    this.clearAnimations();
  }

  changeDate(ev: any) {
    this.viewDate.set(ev);
  }

  drop(event: CdkDragDrop<string, any>) {
    const { previousContainer, container, item: { data } } = event;

    console.log(event);

    if (data) {
      this.store.insertWidgetAtPosition(data, container.data);
      
      return;
    }
    
    this.store.updateWidgetPosition(previousContainer.data, container.data);

  }

  constructor() {
    const dashboardId = this.activatedRoute.snapshot.paramMap.get('id');
    if (dashboardId) {
      this.store.showServerDashboard(dashboardId);
    } else {
      console.log("Loading local dashboard");
    }
  }

}
