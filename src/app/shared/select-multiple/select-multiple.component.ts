import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-select-multiple',
  templateUrl: './select-multiple.component.html',
  styleUrls: ['./select-multiple.component.scss'],
})
export class SelectMultipleComponent {
  @Input() selectorName: string;
  @Input() selectorOptions: string[];
}
