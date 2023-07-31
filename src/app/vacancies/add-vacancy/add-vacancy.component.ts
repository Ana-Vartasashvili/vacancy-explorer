import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import {
  FormControl,
  FormGroup,
  FormGroupDirective,
  NgForm,
} from '@angular/forms';
import { Store } from '@ngrx/store';
import { AppValidators } from 'src/app/shared/validators/app-validators';
import { AppState } from 'src/app/store/app.reducer';
import {
  startAddingVacancy,
  startFetchingVacancies,
} from '../store/vacancies.actions';
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
  options: Options;
  addVacancyForm: FormGroup;
  isLoading: boolean;
  errorMessage: string;
  successMessage: string;
  storeSub: Subscription;
  @ViewChild('formDirective') private formDirective: NgForm;

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
      jobTitle: new FormControl('', [
        AppValidators.required,
        AppValidators.noWhiteSpaces,
      ]),
      companyName: new FormControl('', [
        AppValidators.required,
        AppValidators.noWhiteSpaces,
      ]),
      jobDescription: new FormControl('', [
        AppValidators.required,
        AppValidators.noWhiteSpaces,
      ]),
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

  getErrorMessage(formControlName: string): { [error: string]: string } {
    return Object.values(this.addVacancyForm.get(formControlName).errors)[0];
  }

  onSubmit() {
    this.store.dispatch(startAddingVacancy(this.addVacancyForm.value));
    this.addVacancyForm.reset();
    this.formDirective.resetForm();
  }

  ngOnDestroy(): void {
    this.storeSub.unsubscribe();
  }
}
