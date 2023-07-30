import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { AppValidators } from 'src/app/shared/validators/app-validators';
import { AppState } from 'src/app/store/app.reducer';
import { startFetchingVacancies } from 'src/app/vacancies/store/vacancies.actions';

@Component({
  selector: 'app-hero',
  templateUrl: './hero.component.html',
  styleUrls: ['./hero.component.scss'],
})
export class HeroComponent implements OnInit {
  searchForm: FormGroup;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private store: Store<AppState>
  ) {}

  ngOnInit(): void {
    this.searchForm = new FormGroup({
      jobTitle: new FormControl('', [
        AppValidators.required,
        AppValidators.noWhiteSpaces,
      ]),
    });
  }

  onSubmit() {
    const jobTitle = this.searchForm.value.jobTitle.trim();
    this.store.dispatch(
      startFetchingVacancies({
        queries: [
          {
            queryFieldPath: 'jobTitle',
            operator: 'array-contains',
            value: jobTitle,
          },
        ],
      })
    );
    this.router.navigate(['/vacancies'], { relativeTo: this.route });
  }
}
