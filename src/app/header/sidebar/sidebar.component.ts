import {
  Component,
  EventEmitter,
  OnDestroy,
  OnInit,
  Output,
} from '@angular/core';
import { Store } from '@ngrx/store';
import { Subscription } from 'rxjs';
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

  ngOnDestroy(): void {
    this.storeSub.unsubscribe();
  }
}
