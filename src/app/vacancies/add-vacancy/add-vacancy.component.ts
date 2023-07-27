import { Component, OnInit } from '@angular/core';
import { VacanciesFilterService } from '../vacancies-filter/vacancies-filter.service';
import { Options } from '../vacancies-filter/vacancies-filter.types';
import { FormControl, FormGroup } from '@angular/forms';

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
      jobTitle: new FormControl(''),
      companyName: new FormControl(''),
      jobDescription: new FormControl(''),
      salary: new FormControl(null),
      category: new FormControl(''),
      workingType: new FormControl(''),
      employementType: new FormControl(''),
      experience: new FormControl(''),
      city: new FormControl(''),
    });
  }

  onSubmit() {
    console.log(this.addVacancyForm);
  }
}
