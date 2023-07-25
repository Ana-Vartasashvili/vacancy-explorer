import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-flash-message',
  templateUrl: './flash-message.component.html',
  styleUrls: ['./flash-message.component.scss'],
})
export class FlashMessageComponent {
  @Input() messageText: string;
  @Input() messageType: string;
}
