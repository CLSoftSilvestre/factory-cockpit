import {LiveAnnouncer} from '@angular/cdk/a11y';
import {COMMA, ENTER} from '@angular/cdk/keycodes';

import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { DashboardService } from '../../../services/dashboard.service';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule, MatLabel } from '@angular/material/form-field';
import { MatInput } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { FormsModule } from '@angular/forms';
import { MatChipEditedEvent, MatChipInputEvent, MatChipsModule } from '@angular/material/chips';
import { Keyword } from '../../../shared/interfaces/server-dashboards';

@Component({
  selector: 'app-dashboards-new-dialog',
  standalone: true,
  imports: [MatDialogModule, MatIconModule, MatLabel, MatFormFieldModule, MatInput, MatButtonModule, FormsModule, MatChipsModule],
  providers: [DashboardService],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './dashboards-new-dialog.component.html',
  styleUrl: './dashboards-new-dialog.component.css'
})

export class DashboardsNewDialogComponent {
  store = inject(DashboardService);
  dashboardName = ''
  dashboardDescription = ''

  /* Chips */
  readonly addOnBlur = true;
  readonly separatorKeysCodes = [ENTER, COMMA] as const;
  readonly keywords = signal<Keyword[]>([]);
  readonly announcer = inject(LiveAnnouncer);

  add(event: MatChipInputEvent): void {
    const value = (event.value || '').trim();

    // Add our keyword
    if (value) {
      this.keywords.update(keywords => [...keywords, {name: value}]);
    }

    // Clear the input value
    event.chipInput!.clear();
  }

  remove(keyword: Keyword): void {
    this.keywords.update(keywords => {
      const index = keywords.indexOf(keyword);
      if (index < 0) {
        return keywords;
      }

      keywords.splice(index, 1);
      this.announcer.announce(`Removed ${keyword.name}`);
      return [...keywords];
    });
  }

  edit(keyword: Keyword, event: MatChipEditedEvent) {
    const value = event.value.trim();

    // Remove fruit if it no longer has a name
    if (!value) {
      this.remove(keyword);
      return;
    }

    // Edit existing fruit
    this.keywords.update(keywords => {
      const index = keywords.indexOf(keyword);
      if (index >= 0) {
        keywords[index].name = value;
        return [...keywords];
      }
      return keywords;
    });
  }

  createDashboard() {
    if (this.dashboardName != '') {
      this.store.newDashboard(this.dashboardName, this.dashboardDescription, this.keywords());
      window.location.reload();
    }
  }
  
}
