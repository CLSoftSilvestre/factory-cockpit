import { Component, input, signal } from '@angular/core';
import { MatIcon, MatIconModule } from '@angular/material/icon';
import { MatListItemIcon, MatListModule } from '@angular/material/list';
import { RouterModule } from '@angular/router';
import { MenuItem } from '../custom-sidenav/custom-sidenav.component';
import { animate, style, transition, trigger } from '@angular/animations';

@Component({
  selector: 'app-menu-item',
  standalone: true,
  animations: [
    trigger('expandContractMenu', [
      transition(':enter', [
        style({ opacity: 0, height: '0px'}),
        animate('500ms ease-in-out', style({ opacity: 1, height: '*'}))
      ]),
      transition(':leave', [
        animate('500ms ease-in-out', style({ opacity: 0, height: '0px'}))
      ])
    ])
  ],
  imports: [MatListModule, RouterModule, MatIconModule, MatListItemIcon],
  templateUrl: './menu-item.component.html',
  styleUrl: './menu-item.component.css'
})
export class MenuItemComponent {

  item = input.required<MenuItem>()

  collapsed = input(false);

  nestedMenuOpened = signal(false)

  toggleNested() {
    if (!this.item().subItems){
      return;
    }

    this.nestedMenuOpened.set(!this.nestedMenuOpened())

  }

}
