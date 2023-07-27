import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { AppValidators } from 'src/app/shared/validators/app-validators';
import { VacanciesFilterService } from '../vacancies-filter/vacancies-filter.service';
import { Options } from '../vacancies-filter/vacancies-filter.types';

@Component({
  selector: 'app-add-vacancy',
  templateUrl: './add-vacancy.component.html',
  styleUrls: ['./add-vacancy.component.scss'],
})
export class AddVacancyComponent implements OnInit {
  options: Options;
  addVacancyForm: FormGroup;

  constructor(private vacanciesFiltersService: VacanciesFilterService) {}

  ngOnInit(): void {
    this.options = this.vacanciesFiltersService.options;
    this.addVacancyForm = this.initForm();
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
    console.log(this.addVacancyForm);
  }
}
