import { Component, computed, effect, inject, signal } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatToolbarModule } from '@angular/material/toolbar';
import { RouterOutlet } from '@angular/router';
import { CustomSidenavComponent } from '../../../components/custom-sidenav/custom-sidenav.component';
import { MatMenuModule } from "@angular/material/menu";
import { UserPreferencesService } from '../../../services/user-preferences.service';

@Component({
  selector: 'app-layout',
  standalone: true,
  imports: [RouterOutlet, MatToolbarModule, MatButtonModule, MatIconModule, MatSidenavModule, CustomSidenavComponent, MatMenuModule],
  templateUrl: './layout.component.html',
  styleUrl: './layout.component.css'
})
export class LayoutComponent {
  collapsed = signal(true);
  preferences = inject(UserPreferencesService);

  sidenavWidth = computed(() => this.collapsed() ? '65px' : '250px');
  // darkMode = signal(false);
  darkMode = this.preferences.darkMode;

  setDarkMode = effect(() => {
    document.documentElement.classList.toggle('dark', this.darkMode());
  })

}
