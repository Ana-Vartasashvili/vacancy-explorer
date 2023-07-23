import { Component } from '@angular/core';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent {
  sidebarIsShown = false;

  setSidebarIsShown(isShown: boolean) {
    this.sidebarIsShown = isShown;
  }
}
