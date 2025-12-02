import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule, MatLabel } from '@angular/material/form-field';
import { MatTabsModule } from '@angular/material/tabs';
import { MatInput } from '@angular/material/input';
import { DashboardService } from '../../../services/dashboard.service';
import { MatTooltipModule } from '@angular/material/tooltip';
import { NgComponentOutlet } from '@angular/common';
import { DataService } from '../../../shared/services/data.service';
import { MatListModule } from '@angular/material/list';
import { ActivatedRoute } from '@angular/router';


@Component({
  selector: 'app-widget-config-dialog',
  standalone: true,
  imports: [MatTabsModule, MatButtonModule, MatDialogModule, MatIconModule, MatFormFieldModule, MatLabel, MatInput, MatTooltipModule, NgComponentOutlet, MatListModule],
  templateUrl: './widget-config-dialog.component.html',
  styleUrl: './widget-config-dialog.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class WidgetConfigDialogComponent {
  data = inject(MAT_DIALOG_DATA);
  private dataService = inject(DataService);
  private activatedRoute = inject(ActivatedRoute)
  dashboardid = signal("");

  assets = <any>[];
  objAttr = signal<any>([]);
  selObj = signal<any>("");
  selAttr = signal<any>("");
  lock = signal(true);

  widgetLabelValueChanged(ev:any) {
    if(ev.srcElement.value) {
      this.store.updateWidget(
        this.data().uuid,
        {
          label: ev.srcElement.value
        }
      )
    } 
  }

  widgetAttributeChanged(ev:any) {
    if(ev.srcElement.value) {
      this.store.updateWidgetConfiguration(
        this.data().uuid,
        {
          attribute: ev.srcElement.value,
        }
      )
    } 
  }

  widgetChangeFontColor(ev:any) {
    if(ev.srcElement.value) {
      this.store.updateWidget(
        this.data().uuid,
        {
          color: ev.srcElement.value
        }
      )
    } 
  }

  widgetChangeBackgroundColor(ev:any) {
    if(ev.srcElement.value) {
      this.store.updateWidget(
        this.data().uuid,
        {
          backgroundColor: ev.srcElement.value
        }
      )
    } 
  }

  resetFontColor() {
    this.store.resetFontColor(this.data().uuid);
  }

  resetBackgroundColor() {
    this.store.resetBackgroundColor(this.data().uuid);
  }

  selectAsset(assetId: string) {
    this.selObj.set(assetId);
    this.dataService.getAssetAttributesList(assetId).subscribe((data) => {
      this.objAttr.set(data);
    });
  }

  selectAttribute(attributeId: string) {
    this.selAttr.set(attributeId);
  }

  saveData() {
    this.store.updateWidgetConfiguration(
        this.data().uuid,
        {
          attribute: this.selAttr()
        }
      );
    // Save dashboard
    this.store.saveDashboard(this.dashboardid());
    location.reload();
  }

  constructor(private store: DashboardService) {}

  ngOnInit() {
    this.dataService.getAssetsList().subscribe((res) => {
      this.assets = res;
    });

    this.selAttr.set(this.data().configuration?.attribute);

    const dashboardId = this.activatedRoute.snapshot.paramMap.get('id');

    if (dashboardId) {
      this.dataService.getDashboardsById(dashboardId).subscribe(data => {
        this.dashboardid.set(data.dashboard_id);
      });
    }

  }

}
