import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { autoLoginStart } from './auth/store/auth.actions';
import { AppState } from './store/app.reducer';
import { startFetchingVacancies } from './vacancies/store/vacancies.actions';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
  constructor(private store: Store<AppState>) {}

  ngOnInit(): void {
    this.store.dispatch(autoLoginStart());
    this.store.dispatch(startFetchingVacancies());
  }
}
