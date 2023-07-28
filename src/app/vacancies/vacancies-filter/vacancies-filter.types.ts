import { FormControl, FormGroup } from '@angular/forms';

export interface FilterOption {
  optionName: string;
  optionIdentifier: string;
}

export interface Options {
  [filterName: string]: string[];
}

export interface FormControls {
  [formControlName: string]: FormControl;
}

export interface FormGroups {
  [formGroupName: string]: FormGroup;
}
