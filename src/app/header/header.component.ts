import { Component } from '@angular/core';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent {
  sidebarIsShown = false;

  setSidebarIsShown() {
    this.sidebarIsShown = true;
  }

  setSidebarIsHidden() {
    this.sidebarIsShown = false;
  }
}
