import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup, FormGroupDirective } from '@angular/forms';
import { Store } from '@ngrx/store';
import { AppValidators } from 'src/app/shared/validators/app-validators';
import { AppState } from 'src/app/store/app.reducer';
import { startAddingVacancy } from '../store/vacancies.actions';
import { vacancies } from '../store/vacancies.selectors';
import { VacanciesFilterService } from '../vacancies-filter/vacancies-filter.service';
import { Options } from '../vacancies-filter/vacancies-filter.types';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-add-vacancy',
  templateUrl: './add-vacancy.component.html',
  styleUrls: ['./add-vacancy.component.scss'],
})
export class AddVacancyComponent implements OnInit, OnDestroy {
  @ViewChild('f') form: FormGroupDirective;
  options: Options;
  addVacancyForm: FormGroup;
  isLoading: boolean;
  errorMessage: string;
  successMessage: string;
  storeSub: Subscription;

  constructor(
    private vacanciesFiltersService: VacanciesFilterService,
    private store: Store<AppState>
  ) {}

  ngOnInit(): void {
    this.options = this.vacanciesFiltersService.options;
    this.addVacancyForm = this.initForm();
    this.storeSub = this.store.select(vacancies).subscribe((vacanciesState) => {
      this.isLoading = vacanciesState.addVacancyloading;
      this.errorMessage = vacanciesState.addVacancyError;
      this.successMessage = vacanciesState.addVacancySuccessMessage;
    });
  }

  initForm() {
    return new FormGroup({
      category: new FormControl(''),
      workingType: new FormControl(''),
      employementType: new FormControl(''),
      experience: new FormControl(''),
      jobTitle: new FormControl('', AppValidators.required),
      companyName: new FormControl('', AppValidators.required),
      jobDescription: new FormControl('', AppValidators.required),
      city: new FormControl(''),
      salary: new FormControl('', [
        AppValidators.required,
        AppValidators.min(0),
      ]),
    });
  }

  isInvalidAndTouched(formControlName: string) {
    return (
      this.addVacancyForm.get(formControlName).touched &&
      this.addVacancyForm.get(formControlName).invalid
    );
  }

  onSubmit() {
    this.store.dispatch(startAddingVacancy(this.addVacancyForm.value));
    this.form.resetForm();
  }

  ngOnDestroy(): void {
    this.storeSub.unsubscribe();
  }
}
