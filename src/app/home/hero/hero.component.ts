import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { AppValidators } from 'src/app/shared/validators/app-validators';
import { AppState } from 'src/app/store/app.reducer';
import { vacancies } from 'src/app/vacancies/store/vacancies.selectors';
import { Vacancy } from 'src/app/vacancies/vacancies.types';
import { setVacanciesSearchInputValue } from '../../vacancies/store/vacancies.actions';

@Component({
  selector: 'app-hero',
  templateUrl: './hero.component.html',
  styleUrls: ['./hero.component.scss'],
})
export class HeroComponent implements OnInit {
  searchForm: FormGroup;
  vacancies: Vacancy[];

  constructor(private router: Router, private store: Store<AppState>) {}

  ngOnInit(): void {
    this.searchForm = new FormGroup({
      jobTitle: new FormControl('', [
        AppValidators.required,
        AppValidators.noWhiteSpaces,
      ]),
    });

    this.store.select(vacancies).subscribe((vacanciesState) => {
      this.vacancies = vacanciesState.vacancies;
    });
  }

  onSubmit() {
    const jobTitle = this.searchForm.value.jobTitle.trim();

    if (jobTitle) {
      this.store.dispatch(
        setVacanciesSearchInputValue({ inputValue: jobTitle })
      );
      this.router.navigate(['/vacancies']);
    }
  }
}
