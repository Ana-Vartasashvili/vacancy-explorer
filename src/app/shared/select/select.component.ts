import { ChangeDetectorRef, Component, Input, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-select',
  templateUrl: './select.component.html',
  styleUrls: ['./select.component.scss'],
})
export class SelectComponent implements OnInit {
  @Input() controlName: string;
  @Input() selectorName: string;
  @Input() selectorOptions: string[];
  @Input() form: FormGroup;
  control: FormControl;

  constructor(private cdRef: ChangeDetectorRef) {}

  get() {
    return this.form.get(this.controlName) as FormControl;
  }

  ngOnInit(): void {
    this.control = this.get();
    this.cdRef.detectChanges();
  }
}
