import { Component, computed, effect, inject, signal, Output, EventEmitter } from '@angular/core';
import { DatePipe } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { DashboardService } from '../../../services/dashboard.service';
import { WidgetsPanelComponent } from '../widgets-panel/widgets-panel.component';
import { CalendarPanelComponent } from '../calendar-panel/calendar-panel.component';
import { CdkDrag, CdkDragDrop, CdkDropList } from '@angular/cdk/drag-drop';
import { DataService } from '../../../shared/services/data.service';
import { ServerDasboard } from '../../../shared/interfaces/server-dashboards';
import { ActivatedRoute, Router } from '@angular/router';
import {MatDatepickerModule} from '@angular/material/datepicker';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatInputModule} from '@angular/material/input';
import {provideNativeDateAdapter} from '@angular/material/core';
import {MatTooltipModule} from '@angular/material/tooltip';
import { MatSnackBar } from '@angular/material/snack-bar';
import * as jsPDF from 'jspdf';
import html2canvas from 'html2canvas-pro';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-dashboard-header',
  standalone: true,
  providers: [provideNativeDateAdapter()],
  imports: [CommonModule, DatePipe, MatButtonModule, MatIcon, MatMenuModule, WidgetsPanelComponent, CalendarPanelComponent, CdkDropList, CdkDrag, MatDatepickerModule, MatFormFieldModule, MatInputModule, MatTooltipModule],
  templateUrl: './dashboard-header.component.html',
  styleUrl: './dashboard-header.component.css'
})

export class DashboardHeaderComponent {
  private activatedRoute = inject(ActivatedRoute)
  private router = inject(Router);
  private dataService = inject(DataService);
  private _snackBar = inject(MatSnackBar)
  store = inject(DashboardService);
  dashboardname = signal("");
  dashboardid = signal("");
  dashboardsList: ServerDasboard[] = []

  fileName = '';

  widgetsOpen = signal(false);
  calendarOpen = signal(false);
  calendarView = signal("hidden");
  selectedDate = signal(new Date());
  @Output() selectedViewDate = new EventEmitter<Date | null>();

  isOnline = true

  widgetPutBack(event: CdkDragDrop<number, any>) {
    const { previousContainer } = event;
    this.store.removeWidget(previousContainer.data);
  }

  exportDashboard() {
    this.store.exportDashboard();
  }

  exportPDF() {
    const data = document.getElementById('print-area');
    html2canvas(data!, {scale: 1.1}).then(canvas => {

      // Generate Image of DOM
      // Dimensions of Dom Element
      const printDim = data!.getBoundingClientRect();

      const imgWidth = printDim?.width;
      const imgHeight = printDim?.height;
      const contentDataURL = canvas.toDataURL('image/png');

      // Generated PDF
      //const pdf = new jsPDF.jsPDF('l', 'px', 'a4'); // A4 size page of PDF
      const pdf = new jsPDF.jsPDF('l','px',[imgWidth + 10, imgHeight + 10]); // The size of the image generated
      const position = 5;
      pdf.addImage(contentDataURL, 'PNG', 5, position, imgWidth, imgHeight);
      let pdf_name = "report.pdf"
      if (this.isOnline) {
        pdf_name = this.dashboardname() + ".pdf"
      } else {
        pdf_name = this.dashboardname() + "_" + this.selectedDate().getDay() + "-" + this.selectedDate().getMonth() + "-" + this.selectedDate().getFullYear() + ".pdf";
      }
      pdf.save(pdf_name); // Save the generated PDF
    });
  }

  navigateToDashboard(dashboardId: string) {
    this.router.navigate(['/dashboard', dashboardId]).then(() => {
      window.location.reload();
    });
  }

  saveDashboard() {
    if (this.dashboardid()) {
      // Generate image of dashboard to save into database
      const data = document.getElementById('print-area');
      html2canvas(data!, {scale: 1.1}).then(canvas => {

        // Generate Image of DOM
        // Dimensions of Dom Element
        const printDim = data!.getBoundingClientRect();

        const imgWidth = printDim?.width;
        const imgHeight = printDim?.height;
        const contentDataURL = canvas.toDataURL('image/png');
        console.log(contentDataURL);
        //const imageBlob = contentDataURL.toBlob()

        this.store.saveDashboardImage(this.dashboardid(), contentDataURL).subscribe((data) => {});

        this.store.saveDashboard(this.dashboardid()).subscribe((data) => {
            this._snackBar.open('Dashboard '+ data.title + ' saved successfully ', 'Reload page', {  duration: 5000,}).onAction().subscribe(() => {
              location.reload();
            });
        });
        
      });

    }  
  }

  changeDate(value: Date | null) {
    let yesterday = new Date(value?value:0)
    //yesterday.setDate(yesterday.getDate() - 1)
    this.selectedDate.set(yesterday);
    this.selectedViewDate.emit(value)

    // Check if data is today
    let today = new Date(Date.now())

    if(yesterday.toDateString() == today.toDateString()) {
      this.isOnline = true
    } else {
      this.isOnline = false
    }
  }

  constructor() {

    const dashboardId = this.activatedRoute.snapshot.paramMap.get('id');

    if (dashboardId) {
      const result = this.dataService.getDashboardsById(dashboardId).subscribe(data => {
        this.dashboardname.set(data.title);
        this.dashboardid.set(data.dashboard_id);
      });

    } else {
      this.dashboardname.set("Local dashboard");
    }

  }
  
}

