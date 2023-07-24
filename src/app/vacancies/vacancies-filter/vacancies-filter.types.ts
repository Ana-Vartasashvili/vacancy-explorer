import { FormControl, FormGroup } from '@angular/forms';

export interface FilterOption {
  optionName: string;
  optionIdentifier: string;
}

export interface Filter {
  filterName: string;
  options: FilterOption[];
}

export interface FormControls {
  [formControlName: string]: FormControl;
}

export interface FormGroups {
  [formGroupName: string]: FormGroup;
}
