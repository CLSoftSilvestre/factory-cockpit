import { Component, inject, input } from '@angular/core';
import { Widget } from '../../../../../models/dashboard';
import { DashboardService } from '../../../../../services/dashboard.service';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';

@Component({
  selector: 'app-webview-config',
  standalone: true,
  imports: [MatFormFieldModule, MatIconModule, MatInputModule],
  templateUrl: './webview-config.component.html',
  styleUrl: './webview-config.component.css'
})
export class WebviewConfigComponent {
  data = input.required<Widget>();
  store = inject(DashboardService);

  widgetWebviewLinkChanged(ev: any) {
    if(ev.srcElement.value) {
      this.store.updateWidgetConfiguration(
        this.data().uuid,
        {
          webview_link: ev.srcElement.value,
        }
      )
    }
  }


}
