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
import { auth as authState, user } from 'src/app/auth/store/auth.selectors';
import { User } from 'src/app/auth/user.model';
import { auth } from 'src/app/firebase/firebase-config';
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
  isLoading = true;

  constructor(private store: Store<AppState>) {}

  ngOnInit(): void {
    this.storeSub = this.store.select(authState).subscribe((auth) => {
      this.currentUser = auth.user;
      this.isLoading = auth.loading;
      console.log(auth.loading);
    });
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
