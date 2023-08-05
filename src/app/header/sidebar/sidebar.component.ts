import {
  Component,
  EventEmitter,
  Input,
  OnDestroy,
  OnInit,
  Output,
} from '@angular/core';
import { Store } from '@ngrx/store';
import { Subscription } from 'rxjs';
import { logout } from 'src/app/auth/store/auth.actions';
import { user } from 'src/app/auth/store/auth.selectors';
import { User } from 'src/app/auth/user.model';
import { SidebarAnimation } from 'src/app/shared/animations/app-animations';
import { AppState } from 'src/app/store/app.reducer';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss'],
  animations: [SidebarAnimation],
})
export class SidebarComponent implements OnInit, OnDestroy {
  @Output() hideSidebar = new EventEmitter<void>();
  @Input() sidebarIsOpen: boolean;
  storeSub: Subscription;
  currentUser: User;

  constructor(private store: Store<AppState>) {}

  ngOnInit(): void {
    this.storeSub = this.store.select(user).subscribe((user) => {
      this.currentUser = user;
    });
  }

  setSidebarIsHidden() {
    this.hideSidebar.emit();
  }

  onLogout() {
    this.store.dispatch(logout());
    this.setSidebarIsHidden();
  }

  ngOnDestroy(): void {
    this.storeSub.unsubscribe();
  }
}
