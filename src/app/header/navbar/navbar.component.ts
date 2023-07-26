import {
  Component,
  EventEmitter,
  OnDestroy,
  OnInit,
  Output,
} from '@angular/core';
import { Store } from '@ngrx/store';
import { Subscription } from 'rxjs';
import { logout } from 'src/app/auth/store/auth.actions';
import { user } from 'src/app/auth/store/auth.selectors';
import { User } from 'src/app/auth/user.model';
import { AppState } from 'src/app/store/app.reducer';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss'],
})
export class NavbarComponent implements OnInit, OnDestroy {
  @Output() showSidebar = new EventEmitter<void>();
  storeSub: Subscription;
  currentUser: User;

  constructor(private store: Store<AppState>) {}

  ngOnInit(): void {
    this.storeSub = this.store
      .select(user)
      .subscribe((user) => (this.currentUser = user));
  }

  setSidebarIsShown() {
    this.showSidebar.emit();
  }

  logOut() {
    this.store.dispatch(logout());
  }

  ngOnDestroy(): void {
    this.storeSub.unsubscribe();
  }
}
