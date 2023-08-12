import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Store } from '@ngrx/store';
import { AppState } from 'src/app/store/app.reducer';
import { deleteVacancy } from 'src/app/vacancies/store/vacancies.actions';

@Component({
  selector: 'app-confirmation-modal',
  templateUrl: './confirmation-modal.component.html',
  styleUrls: ['./confirmation-modal.component.scss'],
})
export class ConfirmationModalComponent {
  @Input() modalIsOpen: boolean;
  @Input() vacancyId: string;
  @Output() modalClosed = new EventEmitter<void>();

  constructor(private store: Store<AppState>) {}

  closeModal() {
    this.modalClosed.emit();
  }

  onDelete() {
    this.store.dispatch(deleteVacancy({ vacancyId: this.vacancyId }));
  }
}
