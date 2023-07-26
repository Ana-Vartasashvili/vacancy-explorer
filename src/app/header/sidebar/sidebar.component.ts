import { Component, EventEmitter, Output } from '@angular/core';
import { SidebarAnimation } from 'src/app/shared/animations/app-animations';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss'],
  animations: [SidebarAnimation],
})
export class SidebarComponent {
  @Output() hideSidebar = new EventEmitter<void>();

  setSidebarIsHidden() {
    this.hideSidebar.emit();
  }
}
